<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="房间标签名称">
                <el-input v-model="formInline.tagName" placeholder="标签名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="tagAdd">新增标签</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="tagList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="tagId"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="tagName"
                    label="标签名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="desc"
                    label="标签描述"
                    width="120">
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
                       :total="tagTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'tagList',
    async asyncData ({error, store}) {
      let page = 1
      let pageSize = 10
      await store.dispatch({
        type: native.doSysRoomTagList,
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
          tagName: '',
        },
        multipleSelection: []
      }
    },
    created () {},
    methods: {
      loadData () {
        this.$store.dispatch({
          type: native.doSysRoomTagList,
          page: this.page,
          size: this.pageSize,
          ...this.formInline
        })
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
        this.$router.push(`/home/room/tag/${row.tagId}`)
      },
      handleDelete (index, row) {
        this.$confirm('删除此标签信息 若此标签信息被使用将会删除失败, 是否继续?', '友情提示').then(() => {
          this.$store.dispatch({
            type: native.doSysRoomTagDel,
            tagIds: [row.tagId]
          }).then(() => {
            this.loadData()
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
      },
      tagAdd () {
        this.$router.push('/home/room/tag/tagAdd')
      }
    },
    computed: {
      ...mapState({
        tagList: ({rooms}) => rooms.tagList.data,
        tagTotal: ({rooms}) => rooms.tagList.total,
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>