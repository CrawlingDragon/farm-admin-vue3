import { defineStore } from 'pinia';
import { ref } from 'vue';

interface userInfo {
  name?: string;
  avatar?: string;
  mobile?: number;
  isUserAccount?: number; //1是个人，2是商户
}

export const userInfoDefineStore = defineStore('userInfoDefineStore', () => {
  //用户信息
  const userInfo = ref<userInfo>({});

  const setUserInfo = (info: userInfo) => {
    userInfo.value = info;
  };

  return {
    userInfo,
    setUserInfo,
  };
});
