<template>
  <el-dialog v-model="showDialog" title="新增处方模板" @close="closeHandle" width="600px">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="large"
      status-icon
    >
      <div class="tip">基本信息</div>
      <el-form-item label="处方名" prop="name">
        <el-input
          v-model="ruleForm.name"
          class="w300"
          maxlength="30"
          show-word-limit
          placeholder="请输入处方名"
        />
      </el-form-item>
      <el-form-item label="看诊结果" prop="content">
        <el-input
          v-model="ruleForm.content"
          class="w300"
          type="textarea"
          maxlength="2000"
          show-word-limit
          :rows="3"
          placeholder="请输入看诊结果"
        />
      </el-form-item>
      <div class="tip">基本信息</div>
      <Medicine v-model:medicine-prop="ruleForm.medicine" />
      <div class="bottom-bar">
        <el-button type="primary" class="btn mr20" @click="submitForm(ruleFormRef)">保存</el-button>
        <el-button class="btn" @click="closeHandle">取消</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { getTemplateExamineDetail, getTemplateAddEdit } from '@/http';
import { watch, computed } from 'vue';
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import Medicine from '@/components/medicine.vue';
import { ElMessage } from 'element-plus';

const AddTemplateId = 0;
const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  templateId: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(['update:showDialog', 'addEditSuccess']);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: '',
  content: '',
  medicine: [] as any,
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: '看诊结果不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '处方名不能为空', trigger: 'blur' }],
});

// WATCH  模版id，如果不等于AddTemplateId，也就是0，如果不是，就请求详情
watch(
  () => props.templateId,
  () => {
    if (props.templateId !== AddTemplateId) {
      getDetailFetch();
      // let r = await getTemplateExamineDetail(props.templateId);
      // console.log('r1111', r);
    }
  }
);

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      addEditFetch();
    } else {
      console.log('error submit!', fields);
    }
  });
};

//添加编辑模版的参数
const paramsComputed = computed(() => {
  let templateId = props.templateId;
  let title = ruleForm.name;
  let content = ruleForm.content;
  let yongyaoInfoJson = JSON.stringify(ruleForm.medicine);
  let params = { templateId, title, content, yongyaoInfoJson };
  return params;
});
//添加，编辑模版函数
const addEditFetch = async () => {
  let r = await getTemplateAddEdit(paramsComputed.value as any);
  console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('保存成功');
    emits('update:showDialog', false);
    emits('addEditSuccess', true);
    let ruleRef = ruleFormRef.value as any;
    ruleRef.resetFields();
  }
};

//获得处方模版详情
const getDetailFetch = async () => {
  let r = await getTemplateExamineDetail(props.templateId);
  ruleForm.name = r.title;
  ruleForm.content = r.content;
  ruleForm.medicine = r.drugInfo;
  // console.log('r1111', r);
};
const closeHandle = () => {
  emits('update:showDialog', false);
};
</script>
<style lang="scss" scoped>
.bottom-bar {
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: end;
  padding-top: 30px;
}
</style>
