<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/face/faceList' }">设施列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改设施</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="face" status-icon :rules="rules2" ref="face" label-width="100px"
                 class="from">
            <el-form-item label="设备名" prop="name">
                <el-input type="text" v-model="face.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="value" prop="value">
                <el-input type="text" v-model="face.value" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="icon" prop="icon">
                <el-input type="text" v-model="face.icon" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('face')">提交</el-button>
                <el-button @click="resetForm('face')">重置</el-button>
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
        type: native.doSysRoomFaceInfo,
        faceId: params.faceId
      })
      return {faceId: params.faceId}
    },
    data () {
      return {
        face: {
          name: '',
          value: '',
          icon: ''
        },
        rules2: {
          name: [
            {required: true, message: '请输入设施名称', trigger: 'blur'}
          ],
          value: [{
            required: true, message: '请输入value', trigger: 'blur'
          }],
          icon: [{
            required: true, message: '请输入Icon', trigger: 'blur'
          }],
        }
      }
    },
    created () {
      this.face = Object.assign({}, this.faceInfo)
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('face', this.face)
            this.$store.dispatch({
              type: native.doSysRoomFaceEdit,
              ...this.face
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
      faceInfo () {
        return this.$store.state.rooms.face[this.faceId]
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>