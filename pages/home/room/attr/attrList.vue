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
                    prop="faces"
                    label="设备信息">
            </el-table-column>
            <el-table-column
                    prop="layouts"
                    label="房间布局">
            </el-table-column>
            <el-table-column
                    prop="beds"
                    label="房间床位">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
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
                       :total="attrTotal">
        </el-pagination>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
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
        data: [{
          'attr': {
            'rmattrId': 2,
            'maxck': null,
            'size': 123.123,
            'name': 'test456',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '',
            'status': 1
          },
          'layout': {'id': 1, 'name': '房', 'quantity': 1, 'attrId': 2},
          'bed': {'bedId': 1, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 2},
          'f_r_fk': {'f_r_id': 1, 'faceId': 2, 'roomattrId': 2},
          'face': {'faceId': 2, 'name': '电吹风', 'value': 'dcf', 'icon': 'facility-icon24'}
        }, {
          'attr': {
            'rmattrId': 2,
            'maxck': null,
            'size': 123.123,
            'name': 'test456',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '',
            'status': 1
          },
          'layout': {'id': 2, 'name': '厅', 'quantity': 1, 'attrId': 2},
          'bed': {'bedId': 1, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 2},
          'f_r_fk': {'f_r_id': 1, 'faceId': 2, 'roomattrId': 2},
          'face': {'faceId': 2, 'name': '电吹风', 'value': 'dcf', 'icon': 'facility-icon24'}
        }, {
          'attr': {
            'rmattrId': 2,
            'maxck': null,
            'size': 123.123,
            'name': 'test456',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '',
            'status': 1
          },
          'layout': {'id': 1, 'name': '房', 'quantity': 1, 'attrId': 2},
          'bed': {'bedId': 1, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 2},
          'f_r_fk': {'f_r_id': 2, 'faceId': 7, 'roomattrId': 2},
          'face': {'faceId': 7, 'name': '冰箱', 'value': 'bx', 'icon': 'facility-icon14'}
        }, {
          'attr': {
            'rmattrId': 2,
            'maxck': null,
            'size': 123.123,
            'name': 'test456',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '',
            'status': 1
          },
          'layout': {'id': 2, 'name': '厅', 'quantity': 1, 'attrId': 2},
          'bed': {'bedId': 1, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 2},
          'f_r_fk': {'f_r_id': 2, 'faceId': 7, 'roomattrId': 2},
          'face': {'faceId': 7, 'name': '冰箱', 'value': 'bx', 'icon': 'facility-icon14'}
        }, {
          'attr': {
            'rmattrId': 3,
            'maxck': null,
            'size': 123.123,
            'name': 'test123',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '12',
            'status': 1
          },
          'layout': {'id': 3, 'name': '房', 'quantity': 1, 'attrId': 3},
          'bed': {'bedId': 2, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 3},
          'f_r_fk': {'f_r_id': 3, 'faceId': 2, 'roomattrId': 3},
          'face': {'faceId': 2, 'name': '电吹风', 'value': 'dcf', 'icon': 'facility-icon24'}
        }, {
          'attr': {
            'rmattrId': 3,
            'maxck': null,
            'size': 123.123,
            'name': 'test123',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '12',
            'status': 1
          },
          'layout': {'id': 4, 'name': '厅', 'quantity': 1, 'attrId': 3},
          'bed': {'bedId': 2, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 3},
          'f_r_fk': {'f_r_id': 3, 'faceId': 2, 'roomattrId': 3},
          'face': {'faceId': 2, 'name': '电吹风', 'value': 'dcf', 'icon': 'facility-icon24'}
        }, {
          'attr': {
            'rmattrId': 3,
            'maxck': null,
            'size': 123.123,
            'name': 'test123',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '12',
            'status': 1
          },
          'layout': {'id': 3, 'name': '房', 'quantity': 1, 'attrId': 3},
          'bed': {'bedId': 2, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 3},
          'f_r_fk': {'f_r_id': 4, 'faceId': 7, 'roomattrId': 3},
          'face': {'faceId': 7, 'name': '冰箱', 'value': 'bx', 'icon': 'facility-icon14'}
        }, {
          'attr': {
            'rmattrId': 3,
            'maxck': null,
            'size': 123.123,
            'name': 'test123',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '12',
            'status': 1
          },
          'layout': {'id': 4, 'name': '厅', 'quantity': 1, 'attrId': 3},
          'bed': {'bedId': 2, 'name': '大床', 'width': 11.5, 'height': 1, 'quantity': 1, 'attrId': 3},
          'f_r_fk': {'f_r_id': 4, 'faceId': 7, 'roomattrId': 3},
          'face': {'faceId': 7, 'name': '冰箱', 'value': 'bx', 'icon': 'facility-icon14'}
        }, {
          'attr': {
            'rmattrId': 5,
            'maxck': null,
            'size': 100,
            'name': '用于测试的数据',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '56',
            'status': 1
          },
          'layout': {'id': 5, 'name': '房', 'quantity': 1, 'attrId': 5},
          'bed': {'bedId': 3, 'name': '大床', 'width': 1.5, 'height': 1, 'quantity': 1, 'attrId': 5},
          'f_r_fk': {'f_r_id': 5, 'faceId': 8, 'roomattrId': 5},
          'face': {'faceId': 8, 'name': '暖气', 'value': 'heat', 'icon': 'facility-icon8'}
        }, {
          'attr': {
            'rmattrId': 5,
            'maxck': null,
            'size': 100,
            'name': '用于测试的数据',
            'minbooking': 1,
            'maxbooking': 2,
            'floorRange': '56',
            'status': 1
          },
          'layout': {'id': 6, 'name': '厅', 'quantity': 1, 'attrId': 5},
          'bed': {'bedId': 3, 'name': '大床', 'width': 1.5, 'height': 1, 'quantity': 1, 'attrId': 5},
          'f_r_fk': {'f_r_id': 5, 'faceId': 8, 'roomattrId': 5},
          'face': {'faceId': 8, 'name': '暖气', 'value': 'heat', 'icon': 'facility-icon8'}
        }]
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