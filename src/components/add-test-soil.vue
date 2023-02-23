<template>
  <!--  添加观测点的日常观测 -->
  <!-- 新增日常观测dialog -->
  <el-dialog v-model="testSoilDialogFormVisible" title="新增测土" width="60%">
    <el-form
      :model="testSoilForm"
      class="form-box"
      label-width="90px"
      label-position="left"
      :rules="rules"
      ref="testSoilFormRef"
    >
      <div class="left-bar">
        <div class="tip">观测点</div>
        <el-form-item label="测土单号:" prop="leftTestOrder">
          <LatestTestSoilSelectVue
            v-if="selectOptions.cetuOrderList.length != 0"
            v-model:soilTestRecord="testSoilForm.leftTestOrder"
            :soilSelectOption="selectOptions.cetuOrderList"
          ></LatestTestSoilSelectVue>
        </el-form-item>
      </div>
      <div class="right-bar">
        <div class="tip">对照组</div>
        <el-form-item label="测土单号:" prop="rightTestOrder">
          <LatestTestSoilSelectVue
            v-if="selectOptions.cetuOrderList.length != 0"
            v-model:soilTestRecord="testSoilForm.rightTestOrder"
            :soilSelectOption="selectOptions.cetuOrderList"
          ></LatestTestSoilSelectVue>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="submitForm(testSoilFormRef)" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addObservePointHistory, getTestExpert } from '@/http';
import { ElMessage } from 'element-plus';
import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';
// const dayDialogFormVisible = ref(true);
const props = defineProps({
  testSoilDialogFormVisible: {
    type: Boolean,
    default: false,
  },
  viewId: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['update:testSoilDialogFormVisible', 'save']);

const testSoilFormRef = ref();
const testSoilForm = reactive({
  leftTestOrder: '',
  rightTestOrder: '',
});

const selectOptions = reactive({
  cetuOrderList: [],
});
const rules = reactive<FormRules>({
  leftTestOrder: [{ required: true, message: '测土单号不能为空', trigger: 'change' }],
  rightTestOrder: [{ required: true, message: '测土单号不能为空', trigger: 'change' }],
});

//保存按钮
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setAddTestSoilObservePoint();
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });

      console.log('error submit!', fields);
    }
  });
};
const fetchParams = computed(() => {
  let params = {
    viewId: props.viewId,
    cetuNumber: testSoilForm.leftTestOrder,
    contrastCetuNumber: testSoilForm.rightTestOrder,
  };
  return params;
});
//发送请求
async function setAddTestSoilObservePoint() {
  let r = await addObservePointHistory(fetchParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
  } else {
    ElMessage.success({ message: '已保存', duration: 1500 });
    resetForm(testSoilFormRef.value);
    emits('save', true);
    emits('update:testSoilDialogFormVisible', false);
  }
}

//成功之后，清空数据

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

//取消按钮
const cancel = () => {
  emits('update:testSoilDialogFormVisible', false);
};

onMounted(async () => {
  let r = await getTestExpert();
  selectOptions.cetuOrderList = r.cetuOrderList;
});
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
