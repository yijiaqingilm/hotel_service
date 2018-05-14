<template>
    <section class="container">
        <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo"/>
        <h1 class="title">
            USERS
            {{user.name}}
        </h1>
        <ul class="users">
            <li v-for="(user, index) in users" :key="index" class="user">
                <nuxt-link :to="{ name: 'id', params: { id: index }}">
                    {{ user.name }}
                </nuxt-link>
            </li>
        </ul>
        <input type="text">
        <nuxt-link :to="{ name: 'test'}">
            我的天 ?
        </nuxt-link>
        <div @click='submitUser'>提交user对象</div>
        <div @click='getUserInfo'>获取用户信息</div>
        <el-button type="danger">危险按钮</el-button>
        <nuxt-link :to="{ name: 'login'}">
            login
        </nuxt-link>
    </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    async asyncData () {
      let {data} = await axios.get('/api/users')
      return {users: data}
    },
    data () {
      return {
        user: {
          id: 1,
          name: 'yi',
          sex: '男'
        }
      }
    },
    head () {
      return {
        title: 'Users',
      }
    },
    methods: {
      submitUser () {
        console.log('push', this.user)
        axios.post('/api/users/add', this.user)
      },
      getUserInfo () {
        axios.post('api/users/info', {userId: 1}).then(({data}) => {
          console.log('data', data)
          this.user = data.data
        })
      }
    }
  }
</script>

<style scoped>
    .title {
        margin: 30px 0;
    }

    .users {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .user {
        margin: 10px 0;
    }
</style>
