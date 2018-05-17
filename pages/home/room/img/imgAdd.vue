<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/img/imgList' }">图片列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增图片</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="img" status-icon :rules="rules2" ref="img" label-width="100px"
                 class="from">
            <el-form-item label="标题名" prop="title">
                <el-input type="text" v-model="img.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片url" prop="url">
                <el-input type="text" v-model="img.url" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('img')">提交</el-button>
                <el-button @click="resetForm('img')">重置</el-button>
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
        img: {
          title: '',
          url: ''
        },
        rules2: {
          title: [
            {required: true, message: '请输入图片标题', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请输入图片url', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch({
              type: native.doSysRoomImgAdd,
              ...this.img
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