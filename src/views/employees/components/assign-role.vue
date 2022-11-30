<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancle">
    <!-- 复选框组 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 要循环的选项 -->
      <!-- 要显示 角色名称 存储 角色id  label 表示要存储的值 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancle">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      roleList: [], // 存储当前所有的角色id
      roleIds: [] // 存储当前用户拥有的角色id
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 30 })
      this.roleList = rows
      console.log(rows)
    },
    // 这个方法什么时候调用 prop传值是异步的 所以这里不能用this.userId
    // 这个方法是给父组件调用的
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds // 将当前用户的角色赋值给当前用户
    },
    btnCancle() {
      this.roleList = []
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    async btnOk() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('分配用户角色成功')
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style>

</style>
