<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <PageTools>
        <el-button slot="after" type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
      </PageTools>
      <!-- 表格 -->
      <!-- 指定id为唯一的标识 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="权限表示" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <!-- 添加按钮只在访问权的层级显示 当type===1时 才显示添加按钮 -->
            <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="removePermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="showDialog" @close="btnCancle">
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1 激活
               当值为0 不激活
           -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancle">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addPermission, getPermissionDetail, getPermissionList, removePermission, updatePermission } from '@/api/permission'
import { tranListToTreeDate } from '@/utils/'
export default {
  data() {
    return {
      list: [],
      formData: {
        enVisible: 0,
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      type: '',
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      },
      showDialog: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑权限' : '添加权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const data = await getPermissionList()
      // 将数据转化成了树形解结构
      this.list = tranListToTreeDate(data, '0')
    },
    async removePermission(id) {
      try {
        await this.$confirm('确认删除此权限点吗？')
        await removePermission(id)
        this.$message.success('权限删除成功')
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    addPermission(type, pid) {
      // 访问权 type===1  按钮操作权type===2
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async editPermission(id, type) {
      this.type = type
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async btnOk() {
      await this.$refs.perForm.validate()
      if (this.formData.id) {
        await updatePermission(this.formData)
        this.$message.success('更新权限成功')
      } else {
        await addPermission(this.formData)
        this.$message.success('添加权限成功')
      }
      this.getPermissionList()
      this.showDialog = false
    },
    btnCancle() {
      // 重置数据
      this.formData = {
        enVisible: '',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
