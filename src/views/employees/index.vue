<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template #before>
          <span>共{{ page.total }}条数据</span>
        </template>
        <!-- 右侧显示按钮 excel导入 新增员工 -->
        <template #after>
          <el-button
            size="small"
            type="success"
            @click="importExcel"
          >excel导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >excel导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showD"
          >新增员工</el-button>
        </template>
      </page-tools>
      <el-table v-loading="loading" border :data="emplyess">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像" sortable="">
          <template slot-scope="{ row }">
            <img
              v-imagerror="require('@/assets/common/head.jpg')"
              :src="row.staffPhoto"
              alt=""
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
              "
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="手机号" sortable="" prop="mobile" />
        <el-table-column
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
          :formatter="formatEmployment"
        />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template v-slot="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template v-slot="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`employees/detail/${row.id}`)"
            >查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="showRoleD(row.id)">角色</el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteEmployee(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :total="page.total"
          :page-size="page.size"
          :current-page="page.page"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置组件弹出层 -->
    <AddEmployee
      :show-dialog.sync="showDialog"
      @getEmployees="getEmployees"
    />
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />

  </div>
</template>

<script>
import { getEmployees, removeEmployees } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      emplyess: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      userId: '',
      showDialog: false,
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false
    }
  },
  created() {
    this.getEmployees()
  },
  methods: {
    async getEmployees() {
      this.loading = true
      const { total, rows } = await getEmployees(this.page)
      this.page.total = total
      this.emplyess = rows
      this.loading = false
      // console.log(rows)
    },
    changePage(newValue) {
      this.page.page = newValue
      this.getEmployees()
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定要删除吗？')
        await removeEmployees(id)
        this.$message.success('删除成功')
        this.getEmployees()
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async(excel) => {
        // excel是引入文件的导出对象
        // 导出的 header从哪儿来
        // data从哪来
        // 现在没有一个接口获取所有的数据
        // 获取员工的接口 页码 每页条数
        const { rows } = await getEmployees({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data 就是导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工工资表',
          multiHeader, // 复杂表头
          merges // 合并
        })
        // 要转化数据结构 还要和表头的顺序对上
        // 要求转出的标题是中文
      })
    },
    showD() {
      this.showDialog = true
    },
    importExcel() {
      this.$router.push('/import')
    },
    showQrCode(staffPhoto) {
      if (staffPhoto) {
        this.showCodeDialog = true // 数据更新了 但是弹层会立刻出现吗 页面的渲染是异步的
        // 有一个方法 可以在上一次数据更新完毕 页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, staffPhoto)
        })
      } else {
        this.$message.warning('该用户未上传头像')
      }
    },
    async showRoleD(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 将表头数据进行对应
    // [{}]  [[]]
    formatJson(headers, rows) {
      return rows.map((item) => {
        // item是一个对象 {mobile:13131,username:'张三'}
        // ['手机号', '姓名', '入职日期']
        return Object.keys(headers).map((key) => {
          // 需要判断时间字段格式
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            //
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
        // ["13131",'张三']
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]])
    }
  }
}
</script>

<style>
</style>
