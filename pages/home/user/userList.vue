<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="用户名">
                <el-input v-model="formInline.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="formInline.roleId" clearable placeholder="角色">
                    <el-option
                            v-for="item in roleList"
                            :key="item.rolesId"
                            :label="item.name"
                            :value="item.rolesId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="userAdd">新增用户</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="userList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="userId"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="nickName"
                    label="昵称"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名">
            </el-table-column>
            <el-table-column
                    label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleResetPwd(scope.$index, scope.row)">重置密码
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--<div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
        </div>-->
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       @current-change="currentPage"
                       @prev-click="prevPage"
                       @next-click="nextPage"
                       :page-size="pageSize"
                       :total="userTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'userList',
    async asyncData ({error, store}) {
      await store.dispatch({
        type: native.doSysRoleList,
        page: -1
      }).catch((err, code) => {
        error({message: err, statusCode: code})
      })
      let page = 1
      let pageSize = 2
      await store.dispatch({
        type: native.doSysUserList,
        page,
        size: pageSize
      }).catch((err) => {
        error({message: err})
      })
      return {page, pageSize}
    },
    data () {
      return {
        formInline: {
          name: '',
          roleId: ''
        },
        multipleSelection: []
      }
    },
    created () {},
    methods: {
      prevPage () {
        this.page -= 1
        this.$store.dispatch({
          type: native.doSysUserList,
          page: this.page,
          size: this.pageSize
        })
      },
      nextPage () {
        this.page += 1
        this.$store.dispatch({
          type: native.doSysUserList,
          page: this.page,
          size: this.pageSize
        })
      },
      currentPage (page) {
        this.page = page
        this.$store.dispatch({
          type: native.doSysUserList,
          page: this.page,
          size: this.pageSize
        })
      },
      onSubmit () {
        this.page = 1
        this.$store.dispatch({
          type: native.doSysUserSeach,
          page: this.page,
          size: this.pageSize,
          ...this.formInline
        })
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleEdit (index, row) {
        console.log(index, row)
        this.$router.push(`/home/user/${row.userId}`)
      },
      handleDelete (index, row) {
        console.log(index, row)
      },
      handleResetPwd (index, row) {
        this.$confirm('重置密码，是否继续', '提示').then(() => {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
        })
      },
      userAdd () {
        this.$router.push('/home/user/userAdd')
      }
    },
    computed: {
      ...mapState({
        userList: ({users}) => users.userList.data,
        userTotal: ({users}) => users.userList.total,
        roleList: ({users}) => users.roleListAll
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>