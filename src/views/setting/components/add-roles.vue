<template>
  <!-- 弹出层组件 -->
  <!-- colse 在点击确定的时候回触发 -->
  <el-dialog :visible="showDialog" title="编辑弹层" @close="btnCancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width:80%" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" style="width:80%" />
      </el-form-item>
    </el-form>
    <!-- footer -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleDetail, addRoles, updateRoleDetail } from '@/api/setting'
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
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleDetail(id) {
      this.form = await getRoleDetail(id)
    },
    async btnOK() {
      try {
        await this.$refs.form.validate()
        // 只有校验通过的情况下 才会执行await下面的内容
        // form这个对象有id  就是编辑，没有id就是新增
        if (this.form.id) {
        // 编辑
          await updateRoleDetail(this.form)
        } else {
          await addRoles(this.form)
        }
        // this.getRoleDetail()
        this.$message.success('修改角色信息成功')
        this.$emit('addRoles')
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.form = {
        name: '',
        description: ''
      }
      // 移除校验规则
      this.$refs.form.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
