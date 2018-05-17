<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/roomType/roomTypeList' }">房间类型列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改房间类型</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="roomType" status-icon :rules="rules2" ref="roomType" label-width="100px"
                 class="from">
            <el-form-item label="设备名" prop="name">
                <el-input type="text" v-model="roomType.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('roomType')">提交</el-button>
                <el-button @click="resetForm('roomType')">重置</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: '',
    async asyncData ({store, error, params}) {
      await store.dispatch({
        type: native.doSysRoomTypeInfo,
        roomTypeId: params.roomTypeId
      }).catch((err, code) => {
        error({message: err, errorCode: code})
      })
      return {roomTypeId: params.roomTypeId}
    },
    data () {
      return {
        roomType: {
          name: '',
        },
        rules2: {
          name: [
            {required: true, message: '请输入房间类型名称', trigger: 'blur'}
          ],
        }
      }
    },
    created () {
      this.roomType = Object.assign({}, this.roomTypeInfo)
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('roomType', this.roomType)
            this.$store.dispatch({
              type: native.doSysRoomTypeEdit,
              ...this.roomType
            }).then(() => {
              this.$alert('修改成功', '友情提示')
            }).catch(() => {
              this.$alert('修改失败', '友情提示')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    computed: {
      roomTypeInfo () {
        return this.$store.state.rooms.roomType[this.roomTypeId]
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>