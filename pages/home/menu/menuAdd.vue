<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/menu/menuList' }">菜单列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增菜单</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="menu" status-icon :rules="rules2" ref="menu" label-width="100px"
                 class="from">
            <el-form-item label="菜单名" prop="name">
                <el-input type="text" v-model="menu.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="父节点">
                <el-cascader
                        :options="menuByTree"
                        :props="menuProps"
                        change-on-select
                        clearable
                        @change="changeParent"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="菜单地址" prop="url">
                <el-input type="text" v-model="menu.url" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="api地址" prop="apiUrl">
                <el-input type="text" v-model="menu.apiUrl" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('menu')">提交</el-button>
                <el-button @click="resetForm('menu')">重置</el-button>
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
    data () {
      var validate = (error) => (rule, value, callback) => {
        if (value === '') {
          callback(new Error(error))
        } else {
          callback()
        }
      }
      return {
        menu: {
          name: '',
          url: '',
          parentNode: -1
        },
        rules2: {
          name: [
            {validator: validate('菜单名不能为空'), trigger: 'blur'}
          ],
          url: [
            {validator: validate('菜单地址不能为空'), trigger: 'blur'}
          ],
          apiUrl: [
            {validator: validate('api地址不能为空'), trigger: 'blur'}
          ]
        },
        menuProps: {
          value: 'value',
          label: 'label'
        }
      }
    },
    async created () {
      await this.$store.dispatch({
        type: native.doSysRuleList
      })
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch({
              type: native.doSysRuleAdd,
              ...this.menu
            }).then((data) => {
              this.$alert('新增菜单成功', '友情提示')
            }).catch((error) => {
              this.$alert(error, '友情提示')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      changeParent (value) {
        let checkedValue = value.slice(value.length - 1)
        this.menu.parentNode = checkedValue.length > 0 ? checkedValue[0] : -1
      }
    },
    computed: {
      ...mapState({
        menuList: ({users}) => users.menuList
      }),
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