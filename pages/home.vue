<template>
    <section class="wrap">
        <el-container class="wrap">
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
                            active-text-color="#ffd04b">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>权限管理</span>
                            </template>
                            <el-menu-item index="1-1" @click="changeMain('role')">角色管理</el-menu-item>
                            <el-menu-item index="1-2" @click="changeMain()">用户管理</el-menu-item>
                            <el-menu-item index="1-3" @click="changeMain('menu')">菜单管理</el-menu-item>
                        </el-submenu>
                        <el-submenu index="2">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>订单管理</span>
                            </template>
                            <el-menu-item index="2-1">订单列表</el-menu-item>
                        </el-submenu>
                        <el-submenu index="3">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>房源管理</span>
                            </template>
                            <el-menu-item index="3-1" @click="$router.push('/home/room/room/roomList')">房间列表管理(room)
                            </el-menu-item>
                            <el-menu-item index="3-2" @click="$router.push('/home/room/roomType/roomTypeList')">
                                房间类型管理(roomType)
                            </el-menu-item>
                            <el-menu-item index="3-3" @click="$router.push('/home/room/tag/tagList')">房间标签管理(tags)
                            </el-menu-item>
                            <el-menu-item index="3-4" @click="$router.push('/home/room/attr/attrList')">房间属性管理(attrs)
                            </el-menu-item>
                            <el-menu-item index="3-5" @click="$router.push('/home/room/img/imgList')">房间图片管理(img)
                            </el-menu-item>
                            <el-menu-item index="3-6" @click="$router.push('/home/room/face/faceList')">设备信息管理(face)
                            </el-menu-item>
                            <el-menu-item index="3-7" @click="$router.push('/home/room/attr/attrAdd')">添加房间属性(add attrs)
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

  export default {
    name: 'home',
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      }
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
    components: {MyFooter}
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