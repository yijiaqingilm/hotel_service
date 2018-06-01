<template>
    <section class='login'>
        <!-- Top content -->
        <div class="top-content">

            <div class="inner-bg">
                <div class="container">
                    <div class="row">
                        <div class="col-sm-8 col-sm-offset-2 text">
                            <h1><strong>hotel管理后台</strong>登录</h1>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 book">
                            <img src="assets/img/ebook.png" alt="">
                        </div>
                        <div class="col-sm-5 form-box">
                            <div class="form-top">
                                <div class="form-top-left">
                                    <h3>请输入用户名和密码</h3>
                                </div>
                                <div class="form-top-right">
                                    <i class="fa fa-pencil"></i>
                                </div>
                            </div>
                            <div class="form-bottom">
                                <form role="form" class="registration-form">
                                    <div class="form-group">
                                        <label class="sr-only" for="form-first-name">用户名</label>
                                        <input type="text" v-model="user.name"
                                               placeholder="用户名..."
                                               class="form-first-name form-control" id="form-first-name">
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="form-last-name">密码</label>
                                        <input type="password" v-model="user.pwd"
                                               placeholder="密码..."
                                               class="form-last-name form-control" id="form-last-name">
                                    </div>
                                    <button type="button" @click="submit" class="btn">登录</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>
<script>
  import { globalConst as native } from '../lib/const'
  import jwt from 'jsonwebtoken'
  import md5 from 'js-md5'

  let client_secret = 'secret'
  export default {
    name: 'login',
    data () {
      return {
        user: {
          name: '',
          pwd: '',
          code: '123456'
        }
      }
    },
    created () {
      this.$store.dispatch({
        type: native.doSysGetCode
      })
      console.log('mde', md5('yijiaqing'))
    },
    methods: {
      submit () {
        this.$store.dispatch({
          type: native.doSysLogin,
          info: jwt.sign(this.user, client_secret)
        }).then((data) => {
          this.$router.push('home')
        })
        return false
      }
    }
  }
</script>
<style scoped>
    @import "../assets/login/bootstrap/css/bootstrap.min.css";
    @import "../assets/login/font-awesome/css/font-awesome.min.css";
    @import "../assets/login/css/form-elements.css";
    @import "../assets/login/css/style.css";

    .login {
        background-image: url("../assets/login/img/backgrounds/1.jpg");
    }
</style>