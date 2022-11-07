<template>
  <el-upload
    action="aaa"
    v-model:file-list="imgList"
    list-type="picture-card"
    :show-file-list="true"
    :on-exceed="imgexceed"
    :auto-upload="false"
    :on-change="addchange"
    :before-upload="addbeforeupload"
    :limit="limit"
    multiple
    :before-remove="beforeRemove"
    :on-preview="handlePictureCardPreview"
    accept="image/*"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <el-image :src="dialogImageUrl" fit="cover" />
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import OSS from 'ali-oss';
import { ElMessage, ElMessageBox, UploadProps } from 'element-plus';
import { getAliossCount } from '@/http';

const props = defineProps({
  limit: {
    type: Number,
    default: 4,
  },
  images: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:images']);
let imgList = ref([]);
let addInfos = ref<any>([]);
let client = ref<any>({});

const dialogImageUrl = ref('');
const dialogVisible = ref(false);

// 上传文件的方法超出限制的钩子
const imgexceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(`最多上传${props.limit}张图片`);
};
// 判断文件的类型
function addchange(res: any) {
  addbeforeupload(res.raw);
  // if (res.raw.type == 'image/png') {
  //   fileType.value = '.png';
  //   addbeforeupload(res.raw);
  // } else if (res.raw.type == 'image/gif') {
  //   fileType.value = '.gif';
  //   addbeforeupload(res.raw);
  // } else if (res.raw.type == 'video/mp4') {
  //   fileType.value = '.mp4';
  //   addbeforeupload(res.raw);
  // } else {
  //   alert('x');
  //   return false;
  // }
}
// 上传的方法
async function addbeforeupload(result: any) {
  let date = new Date().getTime();
  let filepath = 'nft/' + date + '/' + result.name;
  let r = await client.value.put(filepath, result);
  addInfos.value.push(r.url);
}

onMounted(async () => {
  let { alioss } = await getAliossCount();
  console.log('alioss', alioss);
  let { accessKeyId, accessKeySecret, bucket, region, stsToken } = alioss;
  client.value = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region,
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId,
    accessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken,
    // 填写Bucket名称。
    bucket,
  });
});

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  console.log('beforeRemove-uploadFile', uploadFile);
  console.log('uploadFiles', uploadFiles);
  let index = uploadFiles.findIndex((item: any) => {
    console.log('item.url', item.url);
    console.log('beforeRemove-uploadFile', uploadFile.url);
    return item.url == uploadFile.url;
  });
  console.log('index', index);
  return ElMessageBox.confirm(`Cancel the transfert of ${uploadFile.name} ?`).then(
    () => {
      console.log('beforeRemove-ruleForm.image', 1);
      console.log('beforeRemove-uploadFile', uploadFile);
      console.log(uploadFiles);
      addInfos.value.splice(index, 1);
      return true;
    },
    () => false
  );
};
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log('index', uploadFile);
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
watch(imgList, (newVal) => {
  console.log('newVal', newVal);
  emit('update:images', addInfos);
});
</script>
<style lang="scss" scoped></style>
