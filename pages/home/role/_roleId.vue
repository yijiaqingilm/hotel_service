<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/role/roleList' }">角色列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改角色</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="role" status-icon :rules="rules2" ref="role" label-width="100px"
                 class="from">
            <el-form-item label="角色名" prop="name">
                <el-input type="text" v-model="role.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单配置">
                <el-tree
                        ref="tree"
                        :data="menuByTree"
                        show-checkbox
                        node-key="value">
                </el-tree>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('role')">提交</el-button>
                <el-button @click="resetForm('role')">重置</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'
  import { getJsonTree } from 'lib/utils'

  export default {
    name: '',
    async asyncData ({store, error, params}) {
      console.log('params', params)
      await store.dispatch({
        type: native.doSysRuleList
      })
      await store.dispatch({
        type: native.doSysRoleInfo,
        roleId: params.roleId
      }).catch((err) => {
        error({message: err})
      })
      return {roleId: params.roleId}
    },
    data () {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入角色名'))
        } else {
          callback()
        }
      }
      return {
        role: {
          roleId: -1,
          name: '',
          menuIds: []
        },
        rules2: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
        },
      }
    },
    created () {
    },
    mounted () {
      this.$nextTick(() => {
        this.role = Object.assign({}, this.roleInfo)
        if (!this.role.ruleIds) {
          this.role.rulesIds = []
        } else {
          console.log(this.$refs, 'refs', this.role)
          this.$refs.tree.setCheckedKeys(this.role.ruleIds.split(','))
        }
      })
    },
    methods: {
      getCheckedKeys () {
        return this.$refs.tree.getCheckedKeys()
      },
      submitForm (formName) {
        console.log(this.getCheckedKeys())
        this.role.menuIds = this.getCheckedKeys()
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch({
              type: native.doSysRoleEdit,
              ...this.role
            }).then(() => {
              this.$alert('修改成功', '友情提示')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    computed: {
      ...mapState({
        menuList: ({users}) => users.menuList,
        roleTest: ({users}) => users.role,
      }),
      roleInfo () {
        return this.$store.state.users.role[this.roleId]
      },
      menuByTree () {
        return getJsonTree(this.menuList, -1)
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>