<template>
  <!-- trigger="click"点击的时候才显示下拉 -->
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale==='en'">en</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(lang) {
      Cookie.set('language', lang)
      this.$i18n.locale = lang
      if (lang === 'en') {
        this.$message.success('Language switching succeeded')
        return
      }
      this.$message.success('切换语言成功')
      console.log(this.$i18n.locale)
    }
  }
}
</script>
