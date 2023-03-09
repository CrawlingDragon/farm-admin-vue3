<template>
  <!--  添加观测点的日常观测 -->
  <!-- 新增日常观测dialog -->
  <el-dialog v-model="conclusionDialogFormVisible" title="新增观测点结论" width="600px">
    <el-form
      :model="conclusionForm"
      class="form-box"
      label-width="90px"
      label-position="right"
      :rules="rules"
      ref="conclusionFormRef"
    >
      <div class="left-bar">
        <div class="tip">观测点</div>
        <el-form-item label="日期:" prop="time" v-model="conclusionForm.time" readonly class="date">
          <el-date-picker
            v-model="conclusionForm.time"
            type="date"
            placeholder="选择时间"
            size="default"
            class="date-wrap"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="用药效果:" prop="radio">
          <el-radio-group v-model="conclusionForm.effect">
            <el-radio label="1">没效果</el-radio>
            <el-radio label="2">待跟进</el-radio>
            <el-radio label="3">已调理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="观测结论:" prop="describe">
          <el-input
            v-model="conclusionForm.describe"
            class="w300"
            type="textarea"
            rows="4"
            maxlength="2000"
            show-word-limit
            placeholder="输入具体描述"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="submitForm(conclusionFormRef)" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addObserveConclusion } from '@/http';
import { ElMessage } from 'element-plus';

// const dayDialogFormVisible = ref(true);
const props = defineProps({
  conclusionDialogFormVisible: {
    type: Boolean,
    default: false,
  },
  viewId: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['update:conclusionDialogFormVisible', 'save']);

const conclusionFormRef = ref();
const conclusionForm = reactive({
  time: '',
  effect: '1',
  describe: '',
});

const rules = reactive<FormRules>({
  time: [{ required: true, message: '测土单号不能为空', trigger: 'change' }],
  effect: [{ required: true, message: '请选择用药效果', trigger: 'change' }],
  describe: [{ required: true, message: '测土单号不能为空', trigger: 'change' }],
});

//保存按钮
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setAddTestSoilObservePoint();
    } else {
      ElMessage.warning({
        message: '提交失败,请修改后再提交',
        duration: 1500,
      });
      console.log('error submit!', fields);
    }
  });
};
const fetchParams = computed(() => {
  let params = {
    viewId: props.viewId,
    conclusionTime: conclusionForm.time,
    effect: conclusionForm.effect,
    observeconclusion: conclusionForm.describe,
  };
  return params;
});
//发送请求
async function setAddTestSoilObservePoint() {
  let r = await addObserveConclusion(fetchParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error({
      message: r.msg,
      duration: 1500,
    });
  } else {
    ElMessage.success({
      message: '保存成功',
      duration: 1500,
    });
    resetForm(conclusionFormRef.value);
    emits('save', true);
    emits('update:conclusionDialogFormVisible', false);
  }
}

//成功之后，清空数据

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

//取消按钮
const cancel = () => {
  emits('update:conclusionDialogFormVisible', false);
};
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
};
</script>
<style lang="scss" scoped>
.form-box {
  display: flex;
  text-align: left;
  .left-bar {
    width: 100%;
    padding-right: 20px;
  }

  :deep().date-wrap .el-input__wrapper {
    width: 200px !important;
  }
  .tip {
    padding-top: 0;
  }
}
</style>
