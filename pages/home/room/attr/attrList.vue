<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="房间属性名称">
                <el-input v-model="formInline.name" placeholder="属性名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="attrAdd">新增房间属性</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="attrList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="rmattrId"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="类型名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="size"
                    label="房间大小"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="maxbooking"
                    label="可住人数"
                    width="120">
            </el-table-column>
            <el-table-column
                    width="200"
                    show-overflow-tooltip
                    label="设备信息">
                <template slot-scope="scope">
                    {{faceText(scope.row.faces)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="房间布局">
                <template slot-scope="scope">
                    {{layoutText(scope.row.layouts)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="房间床位">
                <template slot-scope="scope">
                    {{bedText(scope.row.beds)}}
                </template>
            </el-table-column>
            <el-table-column
                    label="状态"
                    width="120">
                <template slot-scope="scope">
                    {{roomAttrStatusInfo[scope.row.status].name}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.status===roomAttrCode.usable"
                            size="mini"
                            @click="handleChangeStatus(scope.row,roomAttrCode.disable)">禁用
                    </el-button>
                    <el-button
                            v-else-if="scope.row.status===roomAttrCode.disable"
                            size="mini"
                            type="danger"
                            @click="handleChangeStatus(scope.row,roomAttrCode.usable)">启用
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
                       :total="attrTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native, room_attr_status_info, room_attr_status as roomAttrCode } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'attrList',
    async asyncData ({error, store}) {
      let page = 1
      let pageSize = 10
      await store.dispatch({
        type: native.doSysRoomAttrList,
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
        multipleSelection: [],
        data: [],
        roomAttrStatusInfo: room_attr_status_info,
        roomAttrCode: roomAttrCode
      }
    },
    created () {
      console.log(this.data)
      let attrArr = []
      let bedArr = []
      let faceArr = []
      let layoutArr = []
      this.data.forEach((row) => {
        let {attr, bed, face, layout} = row
        if (attrArr.indexOf(attr) !== -1) {
          attrArr.push(attr)
        }
        if (bedArr.indexOf(bed) !== -1) {
          bedArr.push(bed)
        }
        if (faceArr.indexOf(face) !== -1) {
          faceArr.push(face)
        }
        if (layoutArr.indexOf(layout) !== -1) {
          layoutArr.push(layout)
        }
      })
    },
    methods: {
      faceText (faceList) {
        return faceList.map((face) => face.name).join(',')
      },
      layoutText (layoutList) {
        return layoutList.map((layout) => layout.quantity + layout.name).join(',')
      },
      bedText (bedList) {
        return bedList.map((bed) => bed.quantity + bed.name).join(',')
      },
      loadData () {
        this.$store.dispatch({
          type: native.doSysRoomAttrList,
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
        this.$router.push(`/home/room/attr/${row.rmattrId}`)
      },
      handleDelete (index, row) {
        this.$confirm('删除此房间属性信息 若此房间类型被使用将会删除失败, 是否继续?', '友情提示').then(() => {
          this.$store.dispatch({
            type: native.doSysattrDel,
            attrIds: [row.rmattrId]
          }).then(() => {
            this.loadData()
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
      },
      attrAdd () {
        this.$router.push('/home/room/attr/attrAdd')
      }
    },
    computed: {
      ...mapState({
        attrList: ({rooms}) => rooms.attrList.data,
        attrTotal: ({rooms}) => rooms.attrList.total,
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>