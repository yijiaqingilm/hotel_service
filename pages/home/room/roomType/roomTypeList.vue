<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="房间类型名称">
                <el-input v-model="formInline.name" placeholder="类型名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="roomTypeAdd">新增房间类型</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="roomTypeList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="roomTypeId"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="类型名"
                    width="120">
            </el-table-column>
            <el-table-column
                    label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.status===0"
                            size="mini"
                            @click="handleChangeStatus(scope.row,0)">禁用
                    </el-button>
                    <el-button
                            v-else
                            size="mini"
                            type="danger"
                            @click="handleChangeStatus(scope.row,1)">启用
                    </el-button>
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
                       @current-change="currentPage"
                       @prev-click="prevPage"
                       @next-click="nextPage"
                       :page-size="pageSize"
                       :total="roomTypeTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'roomTypeList',
    async asyncData ({error, store}) {
      let page = 1
      let pageSize = 10
      await store.dispatch({
        type: native.doSysRoomTypeList,
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
        },
        multipleSelection: []
      }
    },
    created () {},
    methods: {
      loadData () {
        this.$store.dispatch({
          type: native.doSysRoomTypeList,
          page: this.page,
          size: this.pageSize,
          ...this.formInline
        })
      },
      handleChangeStatus (row, status) {
        console.log('change status', status)
      },
      prevPage () {
        this.page -= 1
        this.loadData()
      },
      nextPage () {
        this.page += 1
        this.loadData()
      },
      currentPage (page) {
        this.page = page
        this.loadData()
      },
      onSubmit () {
        this.page = 1
        this.loadData()
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
        this.$router.push(`/home/room/roomType/${row.roomTypeId}`)
      },
      handleDelete (index, row) {
        this.$confirm('删除此房间类型信息 若此房间类型被使用将会删除失败, 是否继续?', '友情提示').then(() => {
          this.$store.dispatch({
            type: native.doSysRoomTypeDel,
            roomTypeIds: [row.roomTypeId]
          }).then(() => {
            this.loadData()
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
      },
      roomTypeAdd () {
        this.$router.push('/home/room/roomType/roomTypeAdd')
      }
    },
    computed: {
      ...mapState({
        roomTypeList: ({rooms}) => rooms.roomTypeList.data,
        roomTypeTotal: ({rooms}) => rooms.roomTypeList.total,
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>