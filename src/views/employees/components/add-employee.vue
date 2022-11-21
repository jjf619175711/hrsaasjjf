<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancle">
    <!-- 表单 -->
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="form.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="form.departmentName" style="width:50%" placeholder="请选择" @focus="getDepartments" />
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" default-expand-all="" :props="{label:'name'}" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="form.correctionTime" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
    </el-form>
    <!-- footer -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancle">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/department'
import { tranListToTreeDate } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import { addEmployees } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''

      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ]

      },
      treeData: [],
      EmployeeEnum,
      showTree: false,
      loading: false
    }
  },
  methods: {
    async btnOk() {
      try {
        await this.$refs.form.validate()
        await addEmployees(this.form)
        this.$message.success('添加成功')
        // 通知父组件更新数据
        // this.$parent 父组件的实例
        this.$parent.getEmployees && this.$parent.getEmployees()// 直接调用父组件的更新方法
        this.$emit('update:showDialog', false)
        // 这里不用重置数据，因为关闭弹出触发了close事件，close事件绑定了btncancle事件 已经重置了表单
      } catch (error) {
        console.log(error)
      }
    },
    btnCancle() {
      this.form = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.form.resetFields()
      // update:props名称  可以在父组件 直接用sync修饰符处理
      this.$emit('update:showDialog', false)
    },
    async getDepartments() {
      this.loading = true
      this.showTree = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeDate(depts, '')
      this.loading = false
      console.log(this.treeData)
    },
    selectNode(node) {
      this.form.departmentName = node.name
      this.showTree = false
    }

  }
}
</script>

<style>

</style>
