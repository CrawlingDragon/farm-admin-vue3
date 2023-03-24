<template>
  <div class="wang-answer-box">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      size="default"
    >
      <div class="answer-box">
        <div class="icon-bar">
          <div class="icon-item" @click="showUploadBtn = true">
            <el-icon><Picture /></el-icon>
          </div>
          <!-- <div class="icon-item" @click="addMedicineFn">💊</div> -->
          <div class="icon-item icon-yao" @click="addMedicineFn" v-if="!isReplyAnswer"></div>
          <div class="icon-item" v-if="!isReplyAnswer">
            <el-popover placement="right" :width="400" trigger="hover">
              <template #reference>
                <el-icon><EditPen /></el-icon>
              </template>
              <PrescribingTemplate
                v-if="recipeTemListArr.length !== 0"
                :recipeTemList="recipeTemListArr"
                @selectTemplate="selectTemplate"
              />
            </el-popover>
          </div>
        </div>
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          class="textarea"
          placeholder="请输入回复内容"
          :rows="5"
        />
      </div>
      <UploadImage
        v-model:images="ruleForm.images"
        v-if="showUploadBtn"
        style="margin-bottom: 10px"
      />
      <Medicine
        v-if="showMedicineBtn && !isReplyAnswer"
        v-model:medicine-prop="ruleForm.medicine"
      />
      <el-button type="primary" @click="submitForm(ruleFormRef)">回复</el-button>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import UploadImage from '@/components/uploadImage.vue';
import Medicine from '@/components/medicine.vue';
import PrescribingTemplate from '@/components/prescribingTemplate.vue';
import { integrationMedicine, transformImageParams } from '@/common/js/util';
import { getWangToAnswer, getWangReplyAnswer } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  recipeTemListArr: {
    type: Array,
    default: function () {
      return [];
    },
  },
  questionId: {
    type: Number,
    default: 0,
  },
  isReplyAnswer: {
    //是否是追问的回复
    type: Boolean,
    default: false,
  },
});
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  content: '',
  images: [],
  medicine: [] as any,
});
const showUploadBtn = ref(false);
const showMedicineBtn = ref(false);
const rules = reactive<FormRules>({
  content: [{ required: true, message: '回复内容不能为空', trigger: 'blur' }],
});
const addMedicineFn = () => {
  showMedicineBtn.value = true;
  setTimeout(() => {
    ruleForm.medicine.push({
      drugName: '', //药品名字
      drugId: '', //药品id
      drugSpecIds: '', //药品规格id
      drugSpec: '', //药品规格
      sizeSelectOption: [],
      drugQuantity: '1', // 药品数量
      selectMyself: false,
    });
  }, 100);
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (ruleForm.content == '') {
    ElMessage.error({ message: '回复内容不能为空', duration: 1500 });
    return;
  }
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitAnswerFn();
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
};

const ToAnswerParamsComputed = computed(() => {
  let yongyaoInfoJson = JSON.stringify(ruleForm.medicine);
  let params = {
    questionId: props.questionId,
    message: ruleForm.content,
    images: transformImageParams(ruleForm.images),
    yongyaoInfoJson,
  };
  let replyParams = {
    addWenId: props.questionId,
    message: ruleForm.content,
    images: transformImageParams(ruleForm.images),
  };
  return props.isReplyAnswer ? replyParams : params;
});
//提交回复 fetch
const submitAnswerFn = async () => {
  let r: any = '';
  if (props.isReplyAnswer) {
    r = await getWangReplyAnswer(ToAnswerParamsComputed.value as any);
  } else {
    r = await getWangToAnswer(ToAnswerParamsComputed.value as any);
  }
  console.log('submit-r', r);
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
  } else {
    ElMessage.success({ message: '回复成功', duration: 1500 });
    router.go(0);
  }
};
//选择了模板后的 用药赋值函数
const selectTemplate = (val: any) => {
  console.log('val', val);
  showMedicineBtn.value = true;
  ruleForm.content = val.content;
  setTimeout(() => {
    ruleForm.medicine = integrationMedicine(val.drugInfo);
  }, 100);
};
</script>
<style lang="scss" scoped>
.wang-answer-box {
  font-size: 14px;
  .answer-box {
    border: 1px solid $theme-color;
    margin-bottom: 10px;
    margin-top: 10px;
    .icon-bar {
      display: flex;
      height: 40px;
      border-bottom: 1px solid $theme-color;
      & > .icon-item {
        width: 50px;
        height: 100%;
        border-right: 1px solid #e5e5e5;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-size: 23px;
      }
      .icon-yao {
        background: url(@/assets/answer-icon.png) no-repeat;
        background-position: -139px -16px;
      }
    }

    :deep().el-textarea__inner {
      box-shadow: none;
      min-height: 90px;
    }
  }
}
</style>
