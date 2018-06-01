<template>
    <section class="wrap">
        <el-container class="wrap">
            <ul>
                <li is="i-menu"></li>
            </ul>
            <el-header>
                <el-menu
                        :default-active="activeIndex2"
                        class="el-menu-demo"
                        mode="horizontal"
                        @select="handleSelect"
                >
                    <el-menu-item index="1">处理中心</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">我的工作台</template>
                        <el-menu-item index="2-1">选项1</el-menu-item>
                        <el-menu-item index="2-2">选项2</el-menu-item>
                        <el-menu-item index="2-3">选项3</el-menu-item>
                        <el-submenu index="2-4">
                            <template slot="title">选项4</template>
                            <el-menu-item index="2-4-1">选项1</el-menu-item>
                            <el-menu-item index="2-4-2">选项2</el-menu-item>
                            <el-menu-item index="2-4-3">选项3</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-menu-item index="3" disabled>消息中心</el-menu-item>
                    <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--:unique-opened="true"-->
                    <el-menu
                            default-active="2"
                            class="el-menu-vertical-demo"
                            @open="handleOpen"
                            @close="handleClose"
                            background-color="#545c64"
                            text-color="#fff"
                            :unique-opened="false"
                            active-text-color="#ffd04b">
                        <el-submenu v-for="(menu,index) in menuListByNode" :key='index' :index="index+''">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span slot="title">{{menu.label}}</span>
                            </template>
                            <el-menu-item v-if='menu.children' v-for="(children,childrenIndex) in menu.children"
                                          :key="childrenIndex"
                                          :index="index+'-'+childrenIndex"
                                          @click="handleMenu(children.data)">
                                {{children.label}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <nuxt-child/>
                </el-main>
            </el-container>
            <el-footer>
                <my-footer/>
            </el-footer>
        </el-container>
    </section>
</template>

<script>
  import MyFooter from '~/components/Footer'
  import jwt from 'jsonwebtoken'
  import { mapState } from 'vuex'
  import { globalConst as native } from 'lib/const'
  import { getJsonTree } from 'lib/utils'
  import IMenu from '~/components/i-menu/IMenu'

  export default {
    name: 'home',
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1',
        menuListByNode: [],
      }
    },
    async created () {
      await this.$store.dispatch({
        type: native.doSysRuleList
      })
      this.menuListByNode = getJsonTree(this.menuList, -1)
      // 测试jwt
      /* let u = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzNywib3BlbklkIjoid2lsbGlhbXN1aW1hYyIsInNob3BJZCI6MCwic2t1SWQiOjAsImltYkNvZGUiOiIwMDAwMjI1MTg4OSIsImlhdCI6MTUyNjAwMzI3OSwiZXhwIjoxNTI2MDg5Njc5fQ.OLR8XPnLNYbaf2iMW-vdCNiXXix_jd1UrMRzq2SDw60')
      let {exp, iat, ...rest} = u
      console.log(JSON.stringify(rest))

      let t = jwt.sign(rest, 'fc-GYq@(tzl_59)', {expiresIn: '1 days'})
      console.log(t)*/

      // 测试价格区间
      let rules = [
        {min: 100, max: 200, value: 10},
        {min: 201, max: 300, value: 20},
        {min: 301, max: 400, value: 50},
        {min: 401, max: 500, value: 100},
        {min: 501, max: 1000, value: 300},
      ]
      let total = 300
      let findRule = function (total) {
        let rule = null
        let low = 0
        let high = rules.length - 1
        let mind
        while (low <= high) {
          mind = Math.floor((low + high) / 2)
          rule = rules[mind]
          let {min, max} = rule
          if (total < min) {
            high = mind - 1
          } else if (total > max) {
            low = mind + 1
          } else if (total <= max && total >= min) {
            console.log('跳出循环')
            rule = rules[mind]
            break
          }
        }
        return rule
      }
      console.log('findRule', findRule(total))
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      },
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      handleMenu (menu) {
        this.$router.push(`/home/${menu.url}`)
      },
      changeMain (menu) {
        if (menu === 'role') {
          this.$router.push('/home/role/roleList')
        } else if (menu === 'menu') {
          this.$router.push('/home/menu/menuList')
        } else {
          this.$router.push('/home/user/userList')
        }

      }
    },
    computed: {
      ...mapState({
        menuList: ({users}) => users.menuList
      })
    },
    components: {MyFooter, IMenu}
  }
</script>

<style scoped>
    .el-header {
        padding: 0;
        border-bottom: 1px solid #eeeeee;
    }

    .el-aside {
        background-color: #545c64;
    }

    .el-menu {
        border: 0;
    }
</style>