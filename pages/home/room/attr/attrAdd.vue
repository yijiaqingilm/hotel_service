<template>
    <section>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home/room/attr/attrList' }">房间属性列表</el-breadcrumb-item>
            <el-breadcrumb-item>新增房间属性</el-breadcrumb-item>
        </el-breadcrumb>
        {{faceList}}
        {{attr.faces}}
        <el-form :model="attr" status-icon :rules="rules2" ref="attr" label-width="150px"
                 class="from">
            <el-form-item label="名称" prop="name">
                <el-input type="text" v-model="attr.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="最小入住人数" prop="minbooking">
                <el-input type="number" v-model="attr.minbooking" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="最多入住人数" prop="maxbooking">
                <el-input type="number" v-model="attr.maxbooking" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="房子大小（平方米）" prop="size">
                <el-input type="number" v-model="attr.size" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="地板范围" prop="floorRange">
                <el-input type="text" v-model="attr.floorRange" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="房间设施" prop="type">
                <el-checkbox-group v-model="attr.faces">
                    <el-checkbox v-for="(face,index) in faceList"
                                 :key="index"
                                 :label="face.faceId"
                                 name="face">
                        {{face.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-card class="box-card">
                <div slot='header' class="layout-header">
                    <div>格局（例：3房2厅 ,则增加2个格局，填入3 房，and 2 厅）</div>
                    <el-button @click="addLayout" class="add-layout" type="text">新增</el-button>
                </div>
                <div>
                    <el-form-item
                            v-for="(layout, index) in attr.layouts"
                            :label="'格局' + (index+1)"
                            required
                            :key="index">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item :prop="'layouts.' + index + '.quantity'">
                                    <el-input-number v-model="layout.quantity" :min="1"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item :prop="'layouts.' + index + '.name'"
                                              :rules="{ required: true, message: '格局名称不能为空', trigger: 'blur'}">
                                    <el-input type="text" v-model="layout.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click.prevent="removeLayout(layout)">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
            </el-card>

            <el-card class="box-card">
                <div slot='header' class="layout-header">
                    <div>床位</div>
                    <el-button @click="addBed" class="add-layout" type="text">新增</el-button>
                </div>
                <div>
                    <el-form-item
                            v-for="(bed, index) in attr.beds"
                            :label="'床' + (index+1)"
                            required
                            :key="index">
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <el-form-item :prop="'beds.' + index + '.quantity'">
                                    <el-input-number v-model="bed.quantity" :min="1"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :prop="'beds.' + index + '.name'" label="名称"
                                              :rules="{ required: true, message: '床名称不能为空', trigger: 'blur'}">
                                    <el-input type="text" v-model="bed.name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :prop="'beds.' + index + '.width'" label="宽"
                                              :rules="{ required: true, message: '床宽不能为空', trigger: 'blur'}">
                                    <el-input type="text" v-model="bed.width"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :prop="'beds.' + index + '.height'" label="长"
                                              :rules="{ required: true, message: '床长不能为空', trigger: 'blur'}">
                                    <el-input type="text" v-model="bed.height"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">
                                <el-button @click.prevent="removeBed(bed)">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
            </el-card>

            <el-form-item>
                <el-button type="primary" @click="submitForm('attr')">提交</el-button>
                <el-button @click="resetForm('attr')">重置</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'
  import attrMixins from './attrMixins'
  import { Layout, Bed } from 'lib/base'

  export default {
    name: '',
    async asyncData ({store, error}) {
      store.dispatch({
        type: native.doSysRoomFaceList,
        page: -1
      }).catch((err, code) => {
        error({message: err, statusCode: code})
      })
    },
    data () {
      return {
        attr: {
          name: '',
          minbooking: 1,
          maxbooking: 2,
          size: '',
          floorRange: '',
          // 默认填充数据
          layouts: [
            new Layout('房'),
            new Layout('厅')
          ],
          beds: [
            new Bed('大床', 1, 1.5, 1)
          ],
          faces: []
        },
        rules2: {
          name: [
            {required: true, message: '请输入房间属性名称', trigger: 'blur'},
            {required: true, message: '请输入房间大小（平方米）', trigger: 'blur'}
          ],
        }
      }
    },
    mixins: [attrMixins],
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('attr', this.attr)
            this.$store.dispatch({
              type: native.doSysRoomAttrAdd,
              ...this.attr
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
    },
    computed: {
      ...mapState({
        faceList: ({rooms}) => rooms.faceList.data
      })

    }
  }
</script>

<style scoped>
    .from {
        margin-top: 100px;
    }

    .layout-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>