<template>
  <div>
    <div class="boxImg" :class="{ upload: small }">
      <el-upload :class="{ hide: hideUploadEdit }" action="aaa" v-model:file-list="imgList" list-type="picture-card"
        :show-file-list="true" :on-exceed="imgexceed" :auto-upload="false" :on-change="addchange"
        :before-upload="addbeforeupload" :limit="limit" multiple :before-remove="beforeRemove"
        :on-preview="handlePictureCardPreview" accept="image/*">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
    </div>
    <el-dialog v-model="dialogVisible">
      <el-image :src="dialogImageUrl" fit="cover" />
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import OSS from 'ali-oss';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAliossCount } from '@/http';
import type { UploadProps, UploadUserFile } from 'element-plus';
import goodStorage from 'good-storage';

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
const hideUploadEdit = ref<boolean>(false)
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
function addchange(res: any, fileList: any) {
  addbeforeupload(res.raw);
  hideUploadEdit.value = fileList.length == props.limit
}
// 上传的方法
async function addbeforeupload(result: any) {
  let date = new Date().getTime();
  let filepath = 'nft/' + date + '/' + result.name;
  let r = await client.value.put(filepath, result);
  // console.log('r', r);
  if (!r.coder) {
    addInfos.value.push({ url: r.url });
  }

  // emit('update:images', props.images);
}

onMounted(async () => {
  // let alioss;
  // let sessionAlioss = goodStorage.session.get('alioss', '');

  // //第一次请求ali-oss账号相关，且session缓存
  // if (sessionAlioss === '') {
  //   let r = await getAliossCount();
  //   console.log('getAliossCount----', r);
  //   alioss = r.alioss;
  //   goodStorage.session.set('alioss', alioss);
  // } else {
  //   //如果已经缓存，则取缓存赋值 ali-oss
  //   alioss = sessionAlioss;
  // }

  // 防止过期重新获取
  let r = await getAliossCount();
  let { accessKeyId, accessKeySecret, bucket, region, stsToken } = r.alioss;
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
  // console.log('uploadFile', uploadFile);
  // console.log('uploadFiles', uploadFiles);
  let index = uploadFiles.findIndex((item: any) => {
    return item.url == uploadFile.url;
  });
  //编辑页的话，可能没有图片名字， uploadFile
  let imgName = uploadFile.name ? uploadFile.name : '';
  return ElMessageBox.confirm(`确定要删除这张${imgName}照片吗?`).then(
    () => {
      addInfos.value.splice(index, 1);
      hideUploadEdit.value = addInfos.length == props.limit
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
  hideUploadEdit.value = newVal.length == props.limit
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
    hideUploadEdit.value = imgList.value.length == props.limit
  }
);
</script>
<style lang="scss" scoped>
.upload {

  :deep().el-upload--picture-card,
  :deep().el-upload-list--picture-card .el-upload-list__item {
    --el-upload-list-picture-card-size: 50px;
    width: 100px;
    height: 100px;
  }
}

.boxImg {
  :deep() .hide .el-upload--picture-card {
    display: none;
  }
}
</style>
