<template>
    <section>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="菜单名">
                <el-input v-model="formInline.name" placeholder="菜单名"></el-input>
            </el-form-item>
            <el-form-item label="父节点名称">
                <el-input v-model="formInline.parentNodeName" placeholder="父节点"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="menuAdd">新增菜单</el-button>
            </el-form-item>
        </el-form>
        <el-table class="c-table"
                  ref="multipleTable"
                  :data="menuList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  border
                  stripe
                  highlight-current-row
                  @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="rulesId"
                    label="菜单节点">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="菜单">
            </el-table-column>
            <el-table-column
                    prop="parentNode"
                    label="父节点">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="菜单url">
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
  import { globalConst as native } from 'lib/const'
  import { mapState } from 'vuex'

  export default {
    name: 'menuList',
    data () {
      return {
        formInline: {
          name: '',
          parentNodeName: ''
        },
        multipleSelection: []
      }
    },
    created () {
      this.$store.dispatch({
        type: native.doSysRuleList
      })
    },
    methods: {
      onSubmit () {
        this.$store.dispatch({
          type: native.doSysRuleSeach,
          ...this.formInline
        })
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
      handleEdit (index, row) {
        this.$router.push(`/home/menu/${row.rulesId}`)
      },
      handleDelete (index, row) {
        this.$confirm('删除此菜单 将会级联删除此菜单下面的所有子菜单, 是否继续?', '友情提示').then(() => {
          this.$store.dispatch({
            type: native.doSysRuleDel,
            rulesIds: [row.rulesId]
          })
        }).catch((error) => {
          console.log(error, 'error')
        })
        console.log(index, row)
      },
      menuAdd () {
        this.$router.push('/home/menu/menuAdd')
      }
    },
    computed: {
      ...mapState({
        menuList: ({users}) => users.menuList
      })
    }
  }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>