<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/roomList' }">房间列表</el-breadcrumb-item>
            <el-breadcrumb-item>修改房间</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="room" status-icon :rules="rules2" ref="room" label-width="100px"
                 class="from">
            <el-form-item label="房间类型" prop="roomAttrId">
                <el-select v-model="room.roomAttrId">
                    <el-option v-for="(roomAttr,index) in roomAttrList"
                               :key="index"
                               :label="roomAttr.name"
                               :value="roomAttr.rmattrId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="房间号" prop="name">
                <el-input type="text" v-model="room.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-checkbox-group v-model='room.tags'>
                    <el-checkbox v-for="(tag,index) in tagList"
                                 :key="index"
                                 :label="tag.tagId">
                        {{tag.tagName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input type="text" v-model="room.desc" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('room')">提交</el-button>
                <el-button @click="resetForm('room')">重置</el-button>
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
      store.dispatch({
        type: native.doSysRoomAttrList,
        page: -1
      }).catch((err) => {
        error({message: err})
      })
      store.dispatch({
        type: native.doSysRoomTagList,
        page: -1
      }).catch((err) => {
        error({message: err})
      })
      await store.dispatch({
        type: native.doSysRoomInfo,
        roomId: params.roomId
      }).catch((err) => {
        error({message: err})
      })
      return {roomId: params.roomId}
    },
    data () {
      return {
        room: {
          name: '',
          desc: '',
          roomAttrId: '',
          tags: []
        },
        rules2: {
          name: [
            {required: true, message: '请输入房间号', trigger: 'blur'}
          ],
          roomAttrId: [
            {required: true, message: '房间类型必选', trigger: 'change'}
          ]
        }
      }
    },
    created () {
      this.room = Object.assign({}, this.roomInfo)
      this.room.tags = this.room.tags.map((tag) => tag.tagId)
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('room', this.room)
            this.$store.dispatch({
              type: native.doSysRoomEdit,
              ...this.room
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
      ...mapState({
        roomAttrList: ({rooms}) => rooms.attrList,
        tagList: ({rooms}) => rooms.tagList
      }),
      roomInfo () {
        return this.$store.state.rooms.room[this.roomId]
      }
    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }
</style>