<template>
  <div>
    <UploadExcel :on-success="success" />

  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // header中的数据是中文 res中的数据是中文
      // 新增员工的属性是一致的
      //  form: {
      //   username: '',姓名
      //   mobile: '',
      //   formOfEmployment: '',
      //   workNumber: '',工号
      //   departmentName: '',
      //   timeOfEntry: '',入职日期
      //   correctionTime: ''转正日期
    // }
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr = []
      // result.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key]
      //   })
      //   arr.push(userInfo)
      // })
      var newArr = results.map(item => {
        var userInfo = {}
        Object.keys(item).forEach(key => {
          // 后端接口限制了 不能是字符串  要求转化为时间类型
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      await importEmployees(newArr)
      this.$message.success('文件导入成功')
      this.$router.back()// 回到上一个页面
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}

</script>

<style>

</style>
