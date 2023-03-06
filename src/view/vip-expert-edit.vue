<template>
  <div class="border bg-w" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vip-admin' }">专家管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员:{{ ruleForm.name }} {{ ruleForm.tel }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tip">编辑专家信息</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="158px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="专家:" prop="address" class="address">
        <p>{{ ruleForm.name }} {{ ruleForm.tel }}</p>
      </el-form-item>
      <el-form-item label="单位:" prop="address" class="address">
        <el-input
          v-model="ruleForm.company"
          label="right"
          placeholder="请填写单位名称"
          maxlength="30"
          :show-word-limit="true"
          class="w300"
        />
      </el-form-item>
      <el-form-item label="职称:" prop="address" class="address">
        <el-input
          v-model="ruleForm.job"
          label="right"
          placeholder="请填写职称"
          maxlength="30"
          :show-word-limit="true"
          class="w300"
        />
      </el-form-item>
      <el-form-item label="个人简介:" prop="address" class="address">
        <el-input
          v-model="ruleForm.info"
          label="right"
          placeholder="请填写个人简介"
          type="textarea"
          maxlength="2000"
          :show-word-limit="true"
          class="w300"
          rows="10"
        />
      </el-form-item>
      <el-form-item label="擅长种类:" prop="address" class="address">
        <el-transfer
          class="transfer"
          filterable
          v-model="ruleForm.kind"
          :data="transferData"
          :titles="['未选的擅长种类', '已选的擅长种类']"
        />
      </el-form-item>
      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" class="mr20" @click="submitEdit">保存</el-button>
          <el-button @click="goBackExpertList">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, reactive, ref, onMounted } from 'vue';
import { getSelectInfo } from '../http/getSelectInfo';
import { getExpertInfo, getExportEdit } from '@/http';
import { initTransferData } from '@/common/js/util';
import { ElMessage } from 'element-plus';
const route = useRoute();
const router = useRouter();
//url的专家id 传值
const expertId = computed<any>(() => route.params.expertId);

const formSize = ref<any>('large');

const ruleForm = reactive({
  company: '',
  job: '',
  name: '',
  tel: '',
  info: '',
  kind: [],
});
const rules = reactive({});

// 穿梭框的默认值
const transfer = ref<any>([]);

// 请求的穿梭框的数据重新组织
const transferData = computed(() => {
  let arr: any = [];
  transfer.value.forEach((item: any) => {
    arr.push(...item.options);
  });
  arr.map((item: any) => {
    item.key = item.value;
  });
  return arr;
});

//设置专家详情数据
async function setExpertInfo() {
  let expert = await getExpertInfo({ expertId: expertId.value });
  ruleForm.name = expert.realname;
  ruleForm.company = expert.company;
  ruleForm.tel = expert.mobile;
  ruleForm.job = expert.position;
  ruleForm.kind = initTransferData(expert.zuowu) as any;
  ruleForm.info = expert.bio;
}

onMounted(async () => {
  let r = await getSelectInfo();
  transfer.value = r.categoryArr;
  setExpertInfo();
});
//提交修改专家的编辑
async function submitEdit() {
  let r = await getExportEdit({
    expertId: expertId.value,
    company: ruleForm.company,
    position: ruleForm.job, // [string]		职称
    bio: ruleForm.info, // [string]		简介
    zuowuIds: ruleForm.kind.join(','),
  });
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
  } else {
    ElMessage.success({ message: '已保存', duration: 1500 });
  }
  setTimeout(() => {
    goBackExpertList();
  }, 500);
}
// 路由返回专家列表
function goBackExpertList() {
  router.push({
    path: '/vip-expert',
  });
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
:deep().el-checkbox__label {
  font-size: 12px !important;
  color: $f-color-second;
}
.transfer{
  :deep(.el-button.is-disabled){
    background-color: #cddfbd;
    border-color:#fff;
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
