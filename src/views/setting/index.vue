<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="showD"
              >新增角色</el-button>
            </el-row>
            <el-table v-loading="loading" border="" :data="list">
              <el-table-column
                type="index"
                prop="id"
                label="序号"
                width="120"
                align="center"
              />
              <el-table-column
                prop="name"
                label="角色名"
                width="240"
                align="center"
              />
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >修改</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="removeRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              type="info"
              :closable="false"
              :show-icon="true"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            />
            <!-- 不是所有的表单都需要进行校验 model rules -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input
                  v-model="companyInfo.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyInfo.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyInfo.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyInfo.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <AddRoles
      ref="addRole"
      :show-dialog.sync="showDialog"
      @addRoles="getRoleList"
    />
    <!-- 放置弹层 -->
    <el-dialog :visible="showPerDialog" title="分配权限" @close="btnCancle">
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 纳表示父子勾选时不互相关联 反之则互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        node-key="id"
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="permIds"
      />
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <!-- 确定 取消 -->
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
          <el-button size="small" @click="btnCancle">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleDetail, getRoleList, getCompanyInfo, removeRoleList, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import AddRoles from './components/add-roles.vue'
import { tranListToTreeDate } from '@/utils'
export default {
  components: {
    AddRoles
  },
  data() {
    return {
      loading: false,
      list: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      },
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name'
      }, // 定义显示字段的名称 和 子属性的字段名称
      companyInfo: {},
      showDialog: false,
      showPerDialog: false,
      userId: null, // 用来记录当前分配权限的id
      permIds: []
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    async getCompanyInfo() {
      const data = await getCompanyInfo()
      this.companyInfo = data
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async editRole(id) {
      await this.$refs.addRole.getRoleDetail(id)
      this.showDialog = true
    },
    async removeRole(id) {
      try {
        await this.$confirm('确定要删除吗')
        await removeRoleList(id)
        this.$message.success('删除成功！')
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
      // await removeRoleList(id)
      // this.$confirm('确定要删除吗').then(() => {
      //   console.log(id)
      //   return removeRoleList(id)
      // }).then(() => {
      //   console.log(id)
      //   this.$message.success('删除成功！')
      //   this.getRoleList()
      // })
    },
    showD() {
      this.showDialog = true
    },
    async assignPerm(id) {
      this.permData = tranListToTreeDate(await getPermissionList(), '0') // 转化list到树形数据
      this.userId = id
      // 获取这个id的权限点
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      console.log(permIds)
      this.showPerDialog = true
    },
    async btnOk() {
      await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.userId })
      this.$message.success('权限分配成功')
      this.showPerDialog = false
    },
    btnCancle() {
      this.showPerDialog = false
    }
  }
}
</script>

<style>
</style>
