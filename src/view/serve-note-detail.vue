<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-note' }">短信管理</el-breadcrumb-item>
        <el-breadcrumb-item>发短信</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-form">
        <el-form
          :rules="rules"
          ref="ruleFormRef"
          label-width="118px"
          size="large"
          :model="ruleForm"
        >
          <el-form-item label="选择模板:" prop="smsTempId">
            <el-select
              v-model="ruleForm.smsTempId"
              class="m-2"
              placeholder="请选择模板"
              size="default"
              @change="changeTemplate"
            >
              <el-option
                v-for="item in templateLists"
                :key="item.smsTempId"
                :label="item.name"
                :value="item.smsTempId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="短信内容:" prop="content">
            <div class="content-text">
              {{ ruleForm.content }}
            </div>
          </el-form-item>
          <el-form-item label="收件人:" prop="userMobiles">
            <el-transfer
              class="transfer"
              size="large"
              v-model="ruleForm.userMobiles"
              :data="userVips"
              filterable
              :titles="['请选择收件人(会员)', '请勾选左侧的收件人']"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" size="large" class="mr20" @click="sendOut(ruleFormRef)"
            >发送</el-button
          >
          <el-button size="large" @click="goLink('/serve-note')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getNoteSmsTemplate, getHospitalUser, getNoteSmsSend } from '@/http';
import { ElMessage } from 'element-plus';

const router = useRouter();
const emit = defineEmits(['update:hideAside']);
const rules = reactive<FormRules>({
  smsTempId: [{ required: true, message: '请选择模板', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  userMobiles: [{ required: true, message: '请选择收件人', trigger: 'blur' }],
});
const ruleFormRef = ref<FormInstance>();
let ruleForm = reactive({
  smsTempId: '', //模板id
  userMobiles: [], //收件人手机号
  content: '', //信息内容
});
const templateLists = ref<any>([]);
const userVips = ref([]);

onMounted(async () => {
  emit('update:hideAside', false);
  setNoteSmsTemplate();
  setHospitalUser();
});
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 获取短信模板
const setNoteSmsTemplate = async () => {
  let r = await getNoteSmsTemplate();
  templateLists.value = r;
};
// 获取会员列表
async function setHospitalUser() {
  let r = await getHospitalUser();
  let arr: any = [];
  r.forEach((item: any) => {
    arr.push({
      key: item.mobile,
      label: `${item.userName} ${item.mobile}`,
      disabled: false,
    });
  });
  userVips.value = arr;
}

// 跳转页面
function goLink(params: string) {
  router.push({
    path: params,
  });
}
// 选择模板
function changeTemplate(val: any) {
  templateLists.value.map((item: any) => {
    if (item.smsTempId == val) {
      ruleForm.content = item.content;
    }
  });
}
// 发送
async function sendOut(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let str: string = '';
      ruleForm.userMobiles.map((item) => {
        str = str + item + ',';
      });
      let params = {
        smsTempId: ruleForm.smsTempId,
        userMobiles: str,
      };
      // console.log(params, '66')
      setNoteSmsSend(params);
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
}
// 发送方法
async function setNoteSmsSend(params: any) {
  let r = await getNoteSmsSend(params);
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
  } else {
    ElMessage.success('已发送');
    goLink('/serve-note');
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

  .content-form {
    min-height: 65vh;

    .content-text {
      width: 800px;
      min-height: 15vh;
      border: 1px solid $f-color-three;
      border-radius: 5px;
    }

    :deep(.el-transfer-panel) {
      width: 300px !important;
    }
  }
}
.transfer {
  :deep(.el-button.is-disabled) {
    background-color: #cddfbd;
    border-color: #fff;
  }

  :deep(.el-transfer-panel__header) {
    .el-checkbox__label {
      span {
        display: none;
      }
    }
  }
}
</style>
