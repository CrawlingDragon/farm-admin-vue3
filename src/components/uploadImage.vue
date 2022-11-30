<template>
  <div :class="{ upload: small }">
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
  </div>
  <el-dialog v-model="dialogVisible">
    <el-image :src="dialogImageUrl" fit="cover" />
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import OSS from 'ali-oss';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAliossCount } from '@/http';
import type { UploadProps, UploadUserFile } from 'element-plus';

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
  small: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:images']);
let imgList = ref<UploadUserFile[]>([]);
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
  addInfos.value.push({ url: r.url });
  // emit('update:images', props.images);
}

onMounted(async () => {
  let { alioss } = await getAliossCount();
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
  let index = uploadFiles.findIndex((item: any) => {
    return item.url == uploadFile.url;
  });
  return ElMessageBox.confirm(`确定要删除这张${uploadFile.name}照片吗?`).then(
    () => {
      addInfos.value.splice(index, 1);
      return true;
    },
    () => false
  );
};
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  // console.log('index', uploadFile);
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

watch(imgList, (newVal, oldVal) => {
  // console.log('imgList-newVal', newVal);
  // console.log('imgList-oldVal', oldVal);
  emit('update:images', addInfos);
});

//watch props，当有默认图片数据的时候，赋值给upload插件
watch(
  () => props.images,
  (newVal) => {
    // console.log('oldVal', oldValue);
    // console.log('newVal---prosps.img', newVal);
    // if (newVal.length == 0) return;
    addInfos.value = newVal;
    imgList.value = newVal as any;
  }
);
</script>
<style lang="scss" scoped>
// .upload {
//   width: 100px;
//   height: 100px;
// }
.upload {
  :deep().el-upload--picture-card,
  :deep().el-upload-list--picture-card .el-upload-list__item {
    --el-upload-list-picture-card-size: 50px;
    width: 100px;
    height: 100px;
  }
}
</style>
