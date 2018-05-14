<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/roomType/roomTypeList' }">房间类型列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增房间类型</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="roomType" status-icon :rules="rules2" ref="roomType" label-width="100px"
                 class="from">
            <el-form-item label="房间类型名" prop="name">
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
    async asyncData ({store, error}) {
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
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('roomType', this.roomType)
            this.$store.dispatch({
              type: native.doSysRoomTypeAdd,
              ...this.roomType
            }).then(() => {
              this.$alert('新增成功', '友情提示')
            }).catch(() => {
              this.$alert('新增失败', '友情提示')
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
      ...mapState({})
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>