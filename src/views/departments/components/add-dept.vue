<template>
  <!-- 放置弹出层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置所有标题的宽度  -->
    <el-form ref="form" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择" @focus="getEmployees">
          <el-option v-for="item in employess" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="10" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartments, getDepartDetail, updatetDepartDetail } from '@/api/department'
import { getEmployeesSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    },
    deptType: {
      type: String,
      default: null
    }
  },
  data() {
    // 检查部门名称是否相同
    const checkNameRepeat = async(rule, value, callback) => {
      // value部门名称 要去同级部门下的部门去比较有没有相同的
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库都有！同级部门下 我的名字和其他名字重复
        // 首先要找到我的同级部门 this.form.id 就是我当前的id 我的pid是 this.form.pid
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 去统计部门下 有没有和value相同的数据
        // 找到所有的子部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }
    const checkIdRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.form.id) {
        // 不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 部门编码在整个模块中都不允许重复,由于历史数据可能没有code 所以这里加一个强制性条件 就是calue不为空
      isRepeat ? callback(new Error(`组织架构下已经存在${value}编码了`)) : callback()
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      employess: [],
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '名称在1-50个字符之间', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编号不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '编号在1-50个字符之间', trigger: 'blur' },
          { validator: checkIdRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '内容在1-300个字符之间', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    showTitle() {
      // this.$refs.form.resetFields()
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployees() {
      const res = await getEmployeesSimple()
      this.employess = res
      // console.log(this.employess)
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.form = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法 先设置了node 数据 直接调用方法
      // props传值是异步的
    },
    btnOK() {
      // 手动校验表单
      this.$refs.form.validate(async isOK => {
        // console.log({ ...this.form, pid: this.treeNode.id })
        // 表示校验通过
        if (isOK) {
          if (this.deptType === 'edit') {
            await updatetDepartDetail(this.form)
          } else {
            await addDepartments({ ...this.form, pid: this.treeNode.id }) // // 调用新增接口 添加父部门的id
          }
          // 告诉父组件更新数据
          // 触发自动更新事件
          this.$emit('addDepts') // 告诉父组件 新增数据成功 重新拉取数据
          //  关闭弹出层
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候，会触发el-dialog的close事件，所以这里不需要单独的重置数据
        }
      })
    },
    btnCancel() {
      // 重置数据 因为resetFields只能重置表单上的数据
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.form.resetFields()
      this.$emit('update:showDialog', false)
    }

  }
}
</script>

<style>

</style>
