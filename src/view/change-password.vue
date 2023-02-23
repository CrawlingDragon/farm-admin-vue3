<template>
  <div class="wrap">
    <el-form
      :model="formState"
      label-width="118px"
      ref="ruleFormRef"
      :rules="rules"
      class="context"
    >
      <div class="title">修改密码</div>
      <el-form-item label="账号：" class="item">
        <div class="text">
          {{ useUserInfoStore.userInfo?.mobile || refuseUserInfoStore.userInfo?.mobile }}
        </div>
      </el-form-item>
      <el-form-item label="原密码：" prop="oldPwd" class="item">
        <el-input
          v-model.trim="formState.oldPwd"
          size="large"
          placeholder="请输入原密码"
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码：" class="item" prop="newPwd">
        <el-input
          v-model.trim="formState.newPwd"
          size="large"
          placeholder="6-20位字母或数字组合"
          type="password"
        />
      </el-form-item>
      <el-form-item label="重复密码：" class="item" prop="repeatPwd">
        <el-input
          v-model.trim="formState.repeatPwd"
          size="large"
          placeholder="再次输入新密码"
          type="password"
        />
      </el-form-item>
      <el-button type="success" @click="onFinish(ruleFormRef)" class="btn">确定修改</el-button>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import { getPassword } from '@/http';
import { userInfoDefineStore, refuseUserDefineInfoStore } from '../store/index';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { loginOut } from '@/common/js/getToken';
import { storeToRefs } from 'pinia';
interface FormState {
  oldPwd: string;
  newPwd: string;
  repeatPwd: string;
}
// let userInfo = ref<any>()
const useUserInfoStore = userInfoDefineStore();
const refuseUserInfoStore = refuseUserDefineInfoStore();
// let { userInfo } = storeToRefs(useUserInfoStore);

const formState = reactive<FormState>({
  oldPwd: '',
  newPwd: '',
  repeatPwd: '',
});
const ruleFormRef = ref<FormInstance>();
watch(
  // 强制去处密码空格
  () => formState.repeatPwd,
  (newVal) => {
    formState.repeatPwd = newVal.trim();
  }
);

// 新密码验证
const ValidateFn1 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('密码不能为空！'));
  } else if (!/^[0-9A-Za-z~!@#$%^&*]{6,20}$/.test(value)) {
    callback(new Error('密码长度应该在6-20位字符之间!'));
  } else {
    callback();
  }
};

// 重复密码验证
const ValidateFn2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('密码不能为空！'));
  } else if (value !== formState.newPwd) {
    callback(new Error('两次输入的密码不一致！'));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  oldPwd: [{ required: true, message: '请输入原密码!', trigger: 'blur' }],
  newPwd: [{ required: true, validator: ValidateFn1, trigger: 'blur' }],
  repeatPwd: [{ required: true, validator: ValidateFn2, trigger: 'blur' }],
});

// 验证通过以后
const onFinish = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      setPassword();
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
};

// 修改密码的函数
const setPassword = async () => {
  let r = await getPassword(formState);
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
    resetFormState();
    return;
  }
  ElMessage.success('密码修改成功，请重新登录');
  loginOut();
};

// 重置输入框
function resetFormState() {
  formState.newPwd = '';
  formState.oldPwd = '';
  formState.repeatPwd = '';
}

// 隐藏侧边栏
const emit = defineEmits(['update:hideAside']);
onMounted(async () => {
  emit('update:hideAside', false);
});
// watch(() => useUserInfoStore.userInfo, (newVal: any) => {
//   userInfo.value = newVal
// }, { deep: true })
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
</script>

<style lang="scss" scoped>
.wrap {
  background: #fff;
  padding: 70px 80px;
}

.context {
  /* width: 1200px; */
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 26px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  margin-bottom: 45px;
}

.ant-form-item {
  width: 460px;
}

.item {
  width: 500px;
  display: flex;
  margin: 0 auto 25px;
  /* align-items: center; */
}

.item label {
  width: 150px;
  text-align: right;
  font-size: 14px;
  font-family: SimSun;
  font-weight: 400;
  color: #333;
  margin-top: 10px;
}

:deep(.ant-form-item-label > label) {
  top: 4px;
}

.item label > span {
  color: #ff0000;
}

.item .text {
  font-size: 14px;
  font-family: SimSun;
  font-weight: 400;
  color: #333333;
}

.item input {
  font-size: 14px;
}

.btn {
  margin: 0 auto;
  width: 170px;
  height: 44px;
  /* background: #599524; */
  /* border-radius: 22px; */
  outline: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}
</style>
