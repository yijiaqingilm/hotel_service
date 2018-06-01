<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="房间状态">
                <el-input v-model="formInline.status" placeholder="房间状态"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        {{test}}
        <room-item-group v-model="test">
            <room-item label="501">501</room-item>
            <room-item label="502" :checked="true">502</room-item>
            <room-item label="503">503</room-item>
            <room-item label="504">504</room-item>
            <room-item label="505">505</room-item>
            <room-item label="506">506</room-item>
        </room-item-group>
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
  import RoomItemGroup from 'components/roomItem/RoomItemGroup'
  import RoomItem from 'components/roomItem/RoomItem'

  export default {
    name: 'checkIn',
    async asyncData ({error, store}) {
      await store.dispatch({
        type: native.doSysRoomListAll,
      }).catch((err) => {
        error({message: err})
      })
    },
    data () {
      return {
        test: [],
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
          ...this.formInline
        })
      },
      onSubmit () {
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
        roomListAll: ({rooms}) => rooms.roomListAll,
      })
    },
    components: {CheckInInfo, RoomItemGroup, RoomItem}
  }
</script>

<style>
    .room-item {
        border: 1px solid red;
        padding: 20px 30px;
        border-radius: 14px;
    }
</style>