<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 - 头部 -->
      <el-card class="tree-card">
        <!-- 放置解构内容 -->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接受传递给插槽的数据 data每个节点的数据对象-->
          <TreeTools
            slot-scope="{ data }"
            :tree-node="data"
            style="width: 100%"
            @delDepts="getDepartment"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <AddDept ref="addDept" :dept-type="type" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartment" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/department'
import { tranListToTreeDate } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { name: '', manager: '' },
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
        // label: 'label'
      },
      showDialog: false,
      node: null, // 记录当前点击的子节点
      type: ''

    }
  },
  async created() {
    this.getDepartment()
  },
  methods: {
    async  getDepartment() {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeDate(res.depts, '')// 需要将其转化成树形结构
    },
    // 监听tree-tools中触发的点击添加子部门的事件
    addDepts(node) {
      this.showDialog = true // 显示弹出层
      this.node = node
      // console.log(this.node.pid)
    },
    editDepts(node, type) {
      this.showDialog = true
      this.node = node
      // 应该在这里调用获取部门详情的方法
      this.type = type
      this.$refs.addDept.getDepartDetail(node.id)
      // console.log(type)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
