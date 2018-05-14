<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/user/userList' }">用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增用户</el-breadcrumb-item>
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
            <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="user.pwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('user')">提交</el-button>
                <el-button @click="resetForm('user')">重置</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'
  import md5 from 'js-md5'

  export default {
    name: '',
    async asyncData ({store, error}) {
      await store.dispatch({
        type: native.doSysRoleList,
        page: -1
      }).catch((err, code) => {
        error({message: err, statusCode: code})
      })
      await store.dispatch({
        type: native.doSysRoleList,
        page: -1
      })
    },
    data () {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      var validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }
      return {
        user: {
          name: '',
          pwd: '',
          roles_id: '',
          nickName: ''
        },
        rules2: {
          name: [
            {validator: validateName, trigger: 'blur'}
          ],
          pwd: [
            {validator: validatePwd, trigger: 'blur'}
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
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('user', this.user)
            let submitUser = Object.assign({}, this.user)
            submitUser.password = md5(submitUser.pwd)
            delete submitUser.pwd
            this.$store.dispatch({
              type: native.doSysUserAdd,
              ...submitUser

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
        roleList: ({users}) => users.roleListAll
      })
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>