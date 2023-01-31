<template>
  <!--  添加观测点的日常观测 -->
  <!-- 新增日常观测dialog -->
  <el-dialog v-model="dayDialogFormVisible" title="新增日常观测" width="60%">
    <el-form
      :model="dayForm"
      class="form-box"
      label-width="90px"
      label-position="left"
      :rules="rules"
      ref="ruleFormRef"
    >
      <div class="left-bar">
        <el-form-item label="观察日期:" prop="leftTime" v-model="dayForm.leftTime" readonly>
          <el-date-picker
            v-model="dayForm.leftTime"
            type="date"
            placeholder="选择时间"
            size="default"
            class="date-wrap"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate" 
          />
        </el-form-item>
        <el-form-item label="图片:" prop="leftImgs">
          <UploadImageVue v-model:images="dayForm.leftImgs" :small="true"
        /></el-form-item>
        <el-form-item label="描述:" prop="leftDescribe">
          <el-input
            v-model="dayForm.leftDescribe"
            class="w300"
            type="textarea"
            rows="4"
            maxlength="2000"
            show-word-limit
            placeholder="输入用药描述"
          />
        </el-form-item>
      </div>
      <div class="right-bar">
        <el-form-item
          label="观察日期:"
          prop="rightTime"
          v-model="dayForm.rightTime"
          class="w300"
          readonly
        >
          <el-date-picker
            v-model="dayForm.rightTime"
            type="date"
            placeholder="选择时间"
            size="large"
            class="w300 date-wrap"
            style="width: 300px"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate" 
          />
        </el-form-item>
        <el-form-item label="图片:" prop="rightImgs">
          <UploadImageVue v-model:images="dayForm.rightImgs" :small="true" />
        </el-form-item>
        <el-form-item label="描述:" prop="rightDescribe">
          <el-input
            v-model="dayForm.rightDescribe"
            class="w300"
            type="textarea"
            rows="4"
            maxlength="2000"
            show-word-limit
            placeholder="输入用药描述"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="submitForm(ruleFormRef)" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import UploadImageVue from '@/components/uploadImage.vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addDayObservePoint } from '@/http';
import { transformImageParams } from '@/common/js/util';
import { ElMessage, ElMessageBox } from 'element-plus';
// const dayDialogFormVisible = ref(true);
const props = defineProps({
  dayDialogFormVisible: {
    type: Boolean,
    default: false,
  },
  viewId: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['update:dayDialogFormVisible', 'save']);

const ruleFormRef = ref();
const dayForm = reactive({
  leftTime: '',
  leftImgs: [],
  leftDescribe: '',
  rightTime: '',
  rightImgs: [],
  rightDescribe: '',
});

const rules = reactive<FormRules>({
  leftTime: [{ required: true, message: '时间不能为空', trigger: 'change' }],
  leftImgs: [{ required: true, message: '图片不能为空', trigger: 'change' }],
  leftDescribe: [{ required: true, message: '描述不能为空', trigger: 'change' }],
  rightTime: [{ required: true, message: '时间不能为空', trigger: 'change' }],
  rightImgs: [{ required: true, message: '图片不能为空', trigger: 'change' }],
  rightDescribe: [{ required: true, message: '描述不能为空', trigger: 'change' }],
});

//保存按钮
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setAddDayObservePoint();
    } else {
      console.log('error submit!', fields);
    }
  });
};
const fetchParams = computed(() => {
  let params = {
    viewId: props.viewId,
    observetime: dayForm.leftTime,
    images: transformImageParams(dayForm.leftImgs),
    describe: dayForm.leftDescribe,
    contrastObservetime: dayForm.rightTime,
    contrastImages: transformImageParams(dayForm.rightImgs),
    contrastDescribe: dayForm.rightDescribe,
  };
  return params;
});
//发送请求
async function setAddDayObservePoint() {
  let r = await addDayObservePoint(fetchParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('保存成功');
    resetForm(ruleFormRef.value);
    emits('save', true);
    emits('update:dayDialogFormVisible', false);
  }
}

//成功之后，清空数据

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

//取消按钮
const cancel = () => {
  emits('update:dayDialogFormVisible', false);
};
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
}
</script>
<style lang="scss" scoped>
.form-box {
  display: flex;
  text-align: left;
  .left-bar {
    width: 50%;
    border-right: 1px solid #e5e5e5;
    padding-right: 20px;
  }
  .right-bar {
    width: 50%;
    padding-left: 20px;
  }
  :deep().date-wrap .el-input__wrapper {
    width: 200px !important;
  }
}
</style>
