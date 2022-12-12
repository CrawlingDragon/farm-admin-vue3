<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-people' }">人才培训</el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-form">
        <el-form
          :rules="rules"
          ref="ruleFormRef"
          label-width="150px"
          size="large"
          :model="ruleForm"
        >
          <el-form-item label="培训主题:" prop="title">
            <el-input
              v-model="ruleForm.title"
              size="large"
              maxlength="40"
              show-word-limit
              class="w300 m-2 mr20"
              placeholder="请输入培训主题"
            ></el-input>
          </el-form-item>
          <el-form-item label="培训图:" prop="image">
            <UploadImageVue :limit="1" v-model:images="ruleForm.image" />
            <div class="tips">尺寸建议:685px*300px</div>
          </el-form-item>
          <el-form-item label="培训时间:" prop="dateVal">
            <el-date-picker
              style="width: 400px; flex-grow: 0"
              v-model="ruleForm.dateVal"
              type="datetimerange"
              start-placeholder="选择起始时间"
              end-placeholder="选择结束时间"
              size="large"
              class="mr10"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="主讲师:" prop="trainTeacher">
            <el-input
              v-model="ruleForm.trainTeacher"
              maxlength="20"
              show-word-limit
              size="large"
              class="w300 m-2 mr20"
              placeholder="请输入讲师姓名"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <el-input
              style="width: 600px"
              v-model="ruleForm.content"
              maxlength="2000"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 50 }"
              type="textarea"
              placeholder="请输入描述内容"
            />
          </el-form-item>
          <el-form-item label="培训方式:" prop="trainType">
            <el-radio-group
              v-model="ruleForm.trainType"
              class="m-2"
              placeholder="请选择模板"
              size="large"
              @change="trainTypeChabge"
            >
              <el-radio size="large" label="2">线下培训</el-radio>
              <el-radio size="large" label="1">线上直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="labelAddress + ':'" prop="trainAddress">
            <el-input
              v-model="ruleForm.trainAddress"
              maxlength="40"
              show-word-limit
              size="large"
              class="w300 m-2 mr20"
              :placeholder="'请输入' + labelAddress"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" size="large" class="mr20" @click="saveMessage(ruleFormRef)"
            >保存</el-button
          >
          <el-button size="large" @click="goLink('/serve-people')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getTrainDetail, getTrainAddEdit } from '@/http';
import UploadImageVue from '@/components/uploadImage.vue';
import { ElMessage } from 'element-plus';

const labelAddress = ref('培训地点');
const router = useRouter();
const route = useRoute();
const id = computed(() => {
  if (route.query.id) {
    return route.query.id;
  } else {
    return '';
  }
});
const title = ref('新增培训');
const emit = defineEmits(['update:hideAside']);
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入培训主题', trigger: 'blur' }],
  image: [{ required: true, message: '请添加培训图', trigger: 'blur' }],
  dateVal: [{ required: true, message: '请选择时间', trigger: 'blur' }],
  trainType: [{ required: true, message: '请选择培训方式', trigger: 'blur' }],
  trainTeacher: [{ required: true, message: '请输入讲师姓名', trigger: 'blur' }],
  trainAddress: [{ required: true, message: '请输入培训地址或直播链接', trigger: 'blur' }],
  content: [{ required: false }],
});
const ruleFormRef = ref<FormInstance>();
let ruleForm: any = reactive({
  trainId: id.value, //培训ID, 为空则表示新增培训
  title: '', //培训主题
  image: [], //培训主图地址
  trainTeacher: '',
  content: '', //描述
  dateVal: [], //培训时间
  trainType: '2', //培训方式[1:线上直播 2:线下培训]
  trainAddress: '', //直播链接 或者线下培训地址
});
const params = computed(() => {
  let startTime = !ruleForm.dateVal ? '' : ruleForm.dateVal[0];
  let endTime = !ruleForm.dateVal ? '' : ruleForm.dateVal[1];
  let params = {
    trainId: ruleForm.trainId, //培训ID, 为空则表示新增培训
    title: ruleForm.title, //培训主题
    image: ruleForm.image[0].url, //培训主图地址
    startTime, //培训开始时间 , 格式: 2022-10-22 10:20:50
    endTime, //培训结束时间 , 格式: 2022-10-22 10:20:50
    trainTeacher: ruleForm.trainTeacher, //讲师姓名
    content: ruleForm.content, //描述
    trainType: ruleForm.trainType, //培训方式[1:线上直播 2:线下培训]
    trainAddress: ruleForm.trainAddress, //直播链接 或者线下培训地址
  };
  return params;
});

onMounted(async () => {
  emit('update:hideAside', false);
  setTrainDetail();
});
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});

// 跳转页面
function goLink(params: string) {
  router.push({
    path: params,
  });
}

// 保存
async function saveMessage(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log(params.value)
      setTrainAddEdit();
    } else {
      console.log('error submit!', fields);
    }
  });
}
// 保存提交方法
async function setTrainAddEdit() {
  let r = await getTrainAddEdit(params.value);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('保存成功');
    setTimeout(() => {
      router.push({
        path: '/serve-people',
      });
    }, 1000);
  }
}
// 培训方式改变
function trainTypeChabge(val: any) {
  if (val == 1) {
    labelAddress.value = '直播链接';
  } else {
    labelAddress.value = '培训地点';
  }
}
// 获取详情信息
async function setTrainDetail() {
  if (id.value) {
    let r = await getTrainDetail({ trainId: id.value });
    let arr = [];
    arr.push({
      name: new Date(),
      url: r.image,
    });
    ruleForm.trainId = id.value; //培训ID, 为空则表示新增培训
    ruleForm.title = r.title; //培训主题
    ruleForm.image = arr; //培训主图地址
    ruleForm.trainTeacher = r.trainTeacher;
    ruleForm.content = r.description; //描述
    ruleForm.dateVal.push(r.startTime); //培训时间
    ruleForm.dateVal.push(r.endTime); //培训时间
    ruleForm.trainType = String(r.trainType); //培训方式[1:线上直播 2:线下培训]
    ruleForm.trainAddress = r.trainAddress; //直播链接 或者线下培训地址
    title.value = '培训详情';
  } else {
    title.value = '新增培训';
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid $border-color;
}

.content-box {
  background: #fff;
  padding-top: 20px;
  padding-bottom: 20px;

  .content-form {
    min-height: 69vh;

    .tips {
      font-size: 12px;
      color: $f-color-three;
      padding-left: 10px;
    }
  }
}
</style>
