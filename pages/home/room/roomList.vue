<template>
    <section>
        {{roomList}}
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="房间状态">
                <el-input v-model="formInline.status" placeholder="房间状态"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="roomAdd">新增房间</el-button>
                <el-button type="primary" @click="handleDelete">删除房间</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="roomList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  @row-click="handleEdit"
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="rid"
                    width="80"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="房间号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="房间状态"
                    width="120">
                <template slot-scope="scope">
                    {{roomStatusInfo[scope.row.status].name}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="desc"
                    label="desc"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    label="操作" width="250">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.status===room_status.clearing"
                            size="mini"
                            type="danger"
                            @click.stop="handleClear(scope.$index, scope.row)">清理房间
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.disable"
                            size="mini"
                            type="danger"
                            @click.stop="handleEnable(scope.$index, scope.row)">启用房间
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.usable"
                            size="mini"
                            type="danger"
                            @click.stop="handleDisable(scope.$index, scope.row)">禁用房间
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.checkIn"
                            size="mini"
                            type="danger"
                            @click.stop="handleChange(scope.$index, scope.row)">换房
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.usable"
                            size="mini"
                            type="danger"
                            @click.stop="showCheckInfo(scope.$index, scope.row)">入住
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.checkIn"
                            size="mini"
                            type="danger"
                            @click.stop="handleCheckOut(scope.$index, scope.row)">退房
                    </el-button>
                    <el-button
                            v-if="scope.row.status===room_status.checkIn"
                            size="mini"
                            type="danger"
                            @click.stop="checkInInfo(scope.$index, scope.row)">查看入住信息
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
                       :total="roomTotal">
        </el-pagination>

        <el-dialog :close-on-click-modal="false" title="请填写入住信息" :visible.sync="checkInInfoVisible">
            <el-dialog append-to-body title="等待支付" :close-on-click-modal="false" :visible.sync="payInfoVisible">
                <el-form v-if="payInfoVisible && payInfo.order &&payInfo.user">
                    <el-form-item label="订单号">
                        {{payInfo.order.orderNo}}
                    </el-form-item>
                    <el-form-item label="金额">
                        {{payInfo.order.total}}
                    </el-form-item>
                    <el-form-item label="押金">
                        {{payInfo.order.deposit}}
                    </el-form-item>
                    <el-form-item label="入住天数">
                        {{payInfo.order.days}}
                    </el-form-item>
                    <el-form-item label="合计">
                        {{payInfo.order.total+payInfo.order.deposit}}
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="checkInInfoVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handlePay">确定支付</el-button>
                </div>
            </el-dialog>
            <check-in-info ref="checkIn" :room="currentRoom" @submit:checkIn="handleCheckIn"></check-in-info>
            <div slot="footer" class="dialog-footer">
                <el-button @click="checkInInfoVisible = false">取 消</el-button>
                <el-button type="primary" @click="locked">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="入住用户信息" :visible.sync="userInfoVisible">
            <el-form>
                <el-form-item label="身份证号">
                    {{userInfo.cardId}}
                </el-form-item>
                <el-form-item label="姓名">
                    {{userInfo.name}}
                </el-form-item>
                <el-form-item label="手机号">
                    {{userInfo.mobile}}
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="userInfoVisible = false">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import { globalConst as native, roomStatusInfo, room_status } from 'lib/const'
  import { mapState } from 'vuex'
  import CheckInInfo from 'components/checkinInfo/CheckInInfo'

  export default {
    name: 'roomList',
    async asyncData ({error, store}) {
      let page = 1
      let pageSize = 10
      await store.dispatch({
        type: native.doSysRoomList,
        page,
        size: pageSize
      }).catch((err) => {
        error({message: err})
      })
      return {page, pageSize}
    },
    data () {
      return {
        currentRoom: null,
        payInfoVisible: false,
        userInfoVisible: false,
        payInfo: {},
        checkInInfoVisible: false,
        formInline: {
          name: '',
        },
        multipleSelection: [],
        roomStatusInfo,
        room_status,
        key: 1,
        userInfo: {},
      }
    },
    created () {},
    methods: {
      loadData () {
        this.$store.dispatch({
          type: native.doSysRoomList,
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
      handleEdit (row) {
        this.$router.push(`/home/room/${row.rid}`)
      },
      handleDelete () {
        let roomIds = this.multipleSelection.map((row) => row.rid)
        this.$confirm('删除房源信息, 是否继续?', '友情提示').then(() => {
          this.$store.dispatch({
            type: native.doSysRoomDel,
            roomIds
          }).then(() => {
            this.loadData()
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
      },
      handleClear (index, row) {
        this.$store.dispatch({
          type: native.doSysRoomClear,
          roomIds: [row.rid]
        }).then(() => {
          row.status = room_status.usable
        })
      },
      handleEnable (index, row) {
        this.$store.dispatch({
          type: native.doSysRoomEnabled,
          roomIds: [row.rid]
        }).then(() => {
          row.status = room_status.usable
        })
      },
      handleDisable (index, row) {
        this.$store.dispatch({
          type: native.doSysRoomDisable,
          roomIds: [row.rid]
        }).then(() => {
          row.status = room_status.disable
        })
      },
      handleChange (index, row) {
        console.log('room change')
      },
      locked () {
        this.$refs.checkIn.locked()
      },
      showCheckInfo (index, row) {
        this.checkInInfoVisible = true
        this.currentRoom = row
      },
      handleCheckIn (info) {
        this.$store.dispatch({
          type: native.doSysRoomLocked,
          roomIds: [info.rId],
          user: {cardId: info.cardId},
          dates: [info.checkInTime, info.checkOutTime]
        }).then((data) => {
          this.payInfoVisible = true
          this.payInfo = data.data
        }).catch((err) => {
          console.log('err', err)
        })
      },
      handlePay () {
        this.$store.dispatch({
          type: native.doSysRoomCheckIn,
          roomIds: this.payInfo.roomIds,
          orderNo: this.payInfo.order.orderNo
        }).then((data) => {
          console.log('成功', data)
          this.payInfoVisible = false
          this.checkInInfoVisible = false
          this.currentRoom.status = room_status.checkIn
          this.currentRoom.orderNo = data.data.orderNo
        }).catch((err) => {
          console.log('失败', err)
        })
      },
      handleCheckOut (index, row) {
        this.$store.dispatch({
          type: native.doSysRoomCheckOut,
          orderNo: row.orderNo
        }).then(() => {
          row.status = room_status.clearing
          row.orderNo = null
        })
      },
      roomAdd () {
        this.$router.push('/home/room/roomAdd')
      },
      checkInInfo (index, row) {
        this.$store.dispatch({
          type: native.doSysCheckInInfo,
          orderNo: row.orderNo
        }).then((data) => {
          this.userInfo = data.data
          this.userInfoVisible = true
        })
      },
    },
    computed: {
      ...mapState({
        roomList: ({rooms}) => rooms.roomList.data,
        roomTotal: ({rooms}) => rooms.roomList.total,
      })
    },
    components: {CheckInInfo}
  }
</script>

<style>
    .pagination {
        margin-top: 20px;
    }

    .el-message-box {
        width: 500px;
    }
</style>