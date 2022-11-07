<template>
  <div class="wrap">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ style: { width: '150px' } }"
      :wrapper-col="{ style: { width: '310px' } }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      class="context"
    >
      <div class="title">修改密码</div>
      <div class="item">
        <label for="" style="margin-top: 0">账号：</label>
        <div class="text">{{ userInfo.mobile }}</div>
      </div>
      <a-form-item
        label="原密码："
        name="oldPassword"
        :rules="[{ required: true, message: '请输入原密码!' }]"
        class="item"
      >
        <a-input-password
          v-model:value.trim="formState.oldPassword"
          size="large"
          placeholder="请输入原密码"
          type="password"
        />
      </a-form-item>
      <a-form-item
        label="新密码："
        name="newPassword"
        class="item"
        :rules="[{ validator: ValidateFn1 }]"
      >
        <a-input-password
          v-model:value.trim="formState.newPassword"
          size="large"
          placeholder="6-20位字母或数字组合"
          type="password"
        />
      </a-form-item>
      <a-form-item
        label="重复密码："
        name="repeatPassword"
        class="item"
        :rules="[{ validator: ValidateFn2 }]"
      >
        <a-input-password
          v-model:value.trim="formState.repeatPassword"
          size="large"
          placeholder="再次输入新密码"
          type="password"
        />
      </a-form-item>
      <a-button html-type="submit" class="btn">确定修改</a-button>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
// import { FormInstance, message } from 'ant-design-vue';
import { post } from '@/http/http';
import { userInfoDefineStore } from '../store/index';
import { storeToRefs } from 'pinia';
interface FormState {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}
export default defineComponent({
  setup() {
    const useUserInfoStore = userInfoDefineStore();
    let userInfo = useUserInfoStore.userInfo;

    const formState = reactive<FormState>({
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    });
    // watch(
    //   // 强制去处密码空格
    //   () => formState.newPassword,
    //   (newVal) => {
    //     formState.newPassword = newVal.trim();
    //   }
    // );
    watch(
      // 强制去处密码空格
      () => formState.repeatPassword,
      (newVal) => {
        formState.repeatPassword = newVal.trim();
      }
    );

    // 新密码验证
    const ValidateFn1 = async (rule: any, value: any) => {
      if (!value) {
        return Promise.reject('密码不能为空！');
      } else if (!/^[0-9A-Za-z~!@#$%^&*]{6,20}$/.test(value)) {
        return Promise.reject('密码长度应该在6-20位字符之间!');
      } else {
        return Promise.resolve();
      }
    };

    // 重复密码验证
    const ValidateFn2 = async (rule: any, value: any) => {
      if (!value) {
        return Promise.reject('密码不能为空！');
      } else if (value !== formState.newPassword) {
        return Promise.reject('两次输入的密码不一致！');
      } else {
        return Promise.resolve();
      }
    };

    // 防止重复发送请求 flag
    let fetched = ref(false);
    // 验证通过以后
    const onFinish = (values: any) => {
      if (!fetched.value) {
        changePasswordAjax();
      }
    };

    // 修改密码的 ajax 函数
    // let useTokenStore = useToken();
    const changePasswordAjax = async () => {
      fetched.value = true;
      let result = await post('/api/auth/resetPwd', {
        oldPwd: formState.oldPassword,
        newPwd: formState.newPassword,
        repeatPwd: formState.repeatPassword,
      });
      setTimeout(() => {
        fetched.value = false;
      }, 1000);

      if (result.code === 500) {
        alert(result.msg);
        return;
      }
      alert(result.msg);
      resetFormState();
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };

    // 重置输入框
    function resetFormState() {
      formState.newPassword = '';
      formState.oldPassword = '';
      formState.repeatPassword = '';
    }

    return {
      formState,
      onFinish,
      onFinishFailed,
      ValidateFn1,
      ValidateFn2,
      userInfo,
    };
  },
});
</script>

<style scoped>
.wrap {
  background: #fff;
  padding: 70px 80px;
}
.context {
  width: 1200px;
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
  background: #599524;
  border-radius: 22px;
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
