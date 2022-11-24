<template>
  <div>
    <!-- 给action一个# 就不报错了 -->
    <!-- file-list 是上传的文件列表 可以绑定到上传组件上 让上传组件来显示 -->
    <!-- upload组件显示的fileList的内容 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="预览图片">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包

const cos = new COS({
  SecretId: 'AKIDfAbDlHdnjbNTOBqINHzVpwqVv66wcAXj', // 身份识别ID
  SecretKey: '1qTuADAvT2OXQ5au1xhGfrrdDakjbLuv'// 身份密钥
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid
      percent: 0,
      showPercent: false
    }
  },
  computed: {
    // 如果为true 表示不应该显示 + 号 ，上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },

  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file要删除的文件  fileList删过之后的文件
    handleRemove(file, fileList) {
      // 将当前的删除文件排除在外
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // this.fileList = fileList
    },
    // 不能用push 这里的钩子函数会执行多次
    handleChange(file, fileList) {
      // if (this.fileList.some(item => item.uid === file.uid)) {
      //   this.fileList.push(file.url)
      // }
      // console.log(fileList)
      this.fileList = fileList.map(item => item)
      // 这里为何暂时不成功呢？ 因为现在还没有上传 所以第二次进来的数据 一定是空的
      // 如果完成上传动作 第一次进入和第二次进入fileList的长度应该都是1 都有数据
      // 上传成功 =>  数据才能进来 =>  腾讯云cos
    },
    beforeUpload(file) {
      // 先检查文件类型

      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        // 如果不存在
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查文件大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        // 超过了限制的大小
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确定当前上传的就是当前这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    // 进行上传操作
    upload(params) {
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'arthur-001-1315216605', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: params.file, /* 必须，上传文件对象 */
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // console.log(err || data)
          // data中有一个statusCode === 200 的时候 说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功 获取返回的地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url变成现在上传成功返回的地址
            // 目前虽然是一张图片 我们的是fileList是一个数组
            // 需要知道当前上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                return { url: `http://${data.Location}`, upload: true }
                // upload 为true  表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 2000)
            // 将上传成功的地址 回写到了 fileList中 fileList变化 => upload组件 就会根据fileList的变化而去渲染试图
            // 保存  => 图片有大有小 => 上传速度有快又慢 => 要根据有没有upload这个标记来决定是否去保存
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

