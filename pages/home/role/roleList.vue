<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="角色名">
                <el-input v-model="formInline.user" placeholder="角色名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="roleAdd">新增角色</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="roleList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名">

            </el-table-column>
            <el-table-column
                    prop="ruleNames"
                    width="200"
                    label="权限列表">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       @prev-click="prevPage"
                       @next-click="nextPage"
                       @current-change="currentPage"
                       :page-size="pageSize"
                       :total="roleTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'userList',
    asyncData ({store, error}) {
      let page = 1
      let pageSize = 2
      store.dispatch({
        type: native.doSysRoleList,
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
          user: '',
          region: ''
        },
        multipleSelection: []
      }
    },
    created () {

    },
    methods: {
      prevPage () {
        this.page -= 1
        this.$store.dispatch({
          type: native.doSysRoleList,
          page: this.page,
          size: this.pageSize
        })
      },
      nextPage () {
        this.page += 1
        this.$store.dispatch({
          type: native.doSysRoleList,
          page: this.page,
          size: this.pageSize
        })
      },
      currentPage (page) {
        this.page = page
        this.$store.dispatch({
          type: native.doSysRoleList,
          page: this.page,
          size: this.pageSize
        })
      },
      onSubmit () {
        console.log('submit!')
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
        this.$router.push(`/home/role/${row.rolesId}`)
      },
      handleDelete (index, row) {
        console.log(index, row)
      },
      roleAdd () {
        this.$router.push('/home/role/roleAdd')
      }
    },
    computed: {
      ...mapState({
        roleList: ({users}) => users.roleList.data,
        roleTotal: ({users}) => users.roleList.total
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>