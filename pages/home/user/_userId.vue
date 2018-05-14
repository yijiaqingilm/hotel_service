<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/user/userList' }">用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>编辑用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="user" status-icon :rules="rules2" ref="user" label-width="100px"
                 class="from">
            <el-form-item label="角色" prop="roles_id">
                <el-select v-model="user.roles_id" clearable placeholder="请选择">
                    <el-option
                            v-for="item in roleList"
                            :key="item.rolesId"
                            :label="item.name"
                            :value="item.rolesId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
                <el-input type="text" v-model="user.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
                <el-input type="text" v-model="user.nickName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('user')">提交</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: '',
    async asyncData ({store, error, params}) {
      await store.dispatch({
        type: native.doSysRoleList,
        page: -1
      }).catch((err, code) => {
        error({message: err, statusCode: code})
      })
      await store.dispatch({
        type: native.doSysUserInfo,
        userId: params.userId
      }).catch((err, code) => {
        error({message: err, statusCode: code})
      })
      return {
        user: {
          userId: params.userId,
          name: '',
          roles_id: '',
          nickName: ''
        }
      }
    },
    data () {
      return {
        rules2: {
          name: [
            {required: true, message: '请输入用户名', grigger: 'blur'}
          ],
          nickName: [{
            required: true, message: '请输入昵称', grigger: 'blur'
          }],
          roles_id: [{
            required: true, message: '请选择角色', trigger: 'change'
          }]
        }
      }
    },
    created () {
      this.user = Object.assign({}, this.userInfo)
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('user', this.user)
            this.$store.dispatch({
              type: native.doSysUserEdit,
              ...this.user
            }).then((data) => {
              this.$alert('修改成功', '友情提示')
            }).catch(() => {
              this.$alert('修改失败', '友情提示')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
    },
    computed: {
      ...mapState({
        roleList: ({users}) => users.roleListAll,
      }),
      userInfo () {
        return this.$store.state.users.user[this.user.userId]
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>