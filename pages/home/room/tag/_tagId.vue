<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/tag/tagList' }">房间标签列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改标签</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="tag" status-icon :rules="rules2" ref="tag" label-width="100px"
                 class="from">
            <el-form-item label="标签名" prop="tagName">
                <el-input type="text" v-model="tag.tagName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input type="text" v-model="tag.desc" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('tag')">提交</el-button>
                <el-button @click="resetForm('tag')">重置</el-button>
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
        type: native.doSysRoomTagInfo,
        tagId: params.tagId
      })
      return {tagId: params.tagId}
    },
    data () {
      return {
        tag: {
          tagName: '',
          desc: ''
        },
        rules2: {
          tagName: [
            {required: true, message: '请输入标签名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入标签描述', trigger: 'blur'}
          ],
        }
      }
    },
    created () {
      this.tag = Object.assign({}, this.tagInfo)
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('tag', this.tag)
            this.$store.dispatch({
              type: native.doSysRoomTagEdit,
              ...this.tag
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
      tagInfo () {
        return this.$store.state.rooms.tag[this.tagId]
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>