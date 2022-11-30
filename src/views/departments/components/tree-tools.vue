<template>
  <div>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; width: 100%"
    >
      <!-- 行 -->
      <el-col>
        <!-- 左侧内容 -->
        <span>{{ treeNode.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <el-col>{{ treeNode.manager }}</el-col>
          <el-col>
            <!-- 下拉菜单 -->
            <el-dropdown @command="handleCommand">
              <!-- 内容 -->
              <span>操作
                <i class="el-icon-arrow-down" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- 下拉选项 -->
                <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="edit" :disabled="!checkPermission('edit-dept')">编辑部门</el-dropdown-item>
                <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col></el-row>
  </div>
</template>

<script>
import { delDepartments } from '@/api/department'

export default {
  props: {
    // 定义传入的数据
    treeNode: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleCommand(type) {
      // console.log(this.treeNode.id)
      // 点击 编辑 删除 新增时触发
      if (type === 'add') {
        // 添加子部门
        // 添加子部门 在当前点击的部门下添加子部门 = this.treeNode = 当前点击的部门
        this.$emit('addDepts', this.treeNode)// 触发自定义事件 告诉父组件
      }
      if (type === 'edit') {
        // 修改部门
        this.$emit('editDepts', this.treeNode, type)
      }
      if (type === 'del') {
        // 删除部门
        this.$confirm('确定要删除该部门吗？').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 只需要等到成功的时候  后端数据变了 但是前端没变
          this.$emit('delDepts') // 触发一个自定义事件
          this.$message.success('删除部门成功！')
        })
      }
    }
  }
}
</script>

<style>

</style>
