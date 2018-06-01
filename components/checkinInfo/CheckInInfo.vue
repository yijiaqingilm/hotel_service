<template>
    <div>
        {{user.checkTime}}
        <el-form ref="user" :model="user" :rules="ruleUser" label-width="80px">
            <el-form-item label="证件类型">
                <el-select v-model="user.model" @change="changeModel" placeholder="请选择证件类型">
                    <!-- <el-option label="身份证" :value="0"></el-option>
                    <el-option label="vip卡号" :value="1"></el-option>
                    <el-option label="vip绑定的手机号" :value="2"></el-option>-->
                    <el-option v-for="(value,key) in idModelInfo" :key="key" :label="value" :value="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="证件信息" prop="info">
                <el-input v-model="user.info" placeholder="请输入选择的证件类型信息"></el-input>
                <el-button @click="checkVip">查询</el-button>
            </el-form-item>
            <el-form-item v-if="hasCheckVip && vipUserInfo" label="用户名">
                {{vipUserInfo.name}}({{vipUserInfo.cardId}})
            </el-form-item>
            <el-form-item v-if="hasCheckVip && !vipUserInfo">
                <span class="text-danger">没有找到该vip用户</span>
            </el-form-item>
            <el-form-item label="入离时间">
                <el-date-picker type="daterange"
                                start-placeholder="入住时间"
                                end-placeholder="离店时间"
                                range-separator="至"
                                :picker-options="pickerOption"
                                v-model="user.checkTime"></el-date-picker>
            </el-form-item>
            <el-form-item :label="days">
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  import { idModel, idModelInfo, globalConst as native } from 'lib/const'
  import { formatDate } from 'lib/utils'

  export default {
    props: {
      test: null,
      room: null
    },
    data () {
      return {
        idModelInfo,
        idModel,
        user: {
          model: idModel.cardId,
          info: '',
          checkTime: [],
        },
        vipUserInfo: null,
        hasCheckVip: false,
        ruleUser: {
          info: [{
            required: true, message: '证件信息必填', trigger: 'blur'
          }]
        },
        pickerOption: {
          disabledDate (time) {
            let now = new Date()

            if (time.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
              return true
            } else {
              /* let test = new Date(2018, 4, 25)
              if (time.getTime() === test.getTime()) {
                return true
              }*/
              return false
            }
          }
        },
      }
    },
    // 用于弹出开房信息
    name: 'checkInInfo',
    created () {
      let now = formatDate(new Date())
      let tomorrow = formatDate(new Date())
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.user.checkTime = [now, tomorrow]
    },
    methods: {
      checkVip () {
        if (this.user.info.length > 0) {
          this.$store.dispatch({
            type: native.doSysCheckVip,
            model: this.user.model,
            info: this.user.info
          }).then((user) => {
            this.hasCheckVip = true
            this.vipUserInfo = user.data
          })
        }
      },
      locked () {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            if (!this.vipUserInfo && this.user.model !== this.idModel.cardId) {
              this.$alert('非vip用户必须使用身份证登记', '友情提示')
              return
            }
            let [checkInTime, checkOutTime] = this.user.checkTime
            let info = {
              rId: this.room.rid,
              checkInTime: checkInTime.getTime(),
              checkOutTime: checkOutTime.getTime(),
              userId: this.vipUserInfo ? this.vipUserInfo.userId : -1,
              cardId: this.vipUserInfo ? this.vipUserInfo.cardId : this.user.info
            }
            this.$emit('submit:checkIn', info)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeModel () {
        this.user.info = ''
        this.hasCheckVip = false
        this.vipUserInfo = null
      },
    },
    computed: {
      days () {
        let [startTime, endTime] = this.user.checkTime
        let days = (endTime.getTime() - startTime.getTime()) / 1000 / 60 / 60 / 24
        return `共${days}天`
      }
    }
  }
</script>

<style>
    .el-input {
        width: 220px;
    }

    .text-danger {
        color: #f56c6c;
    }
</style>