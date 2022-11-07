import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

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

  const clearUserInfo = () => {
    userInfo.value = {};
  };

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  };
});

// 暂时没用上，使用了storage.set 功能
export const tokenDefineStore = defineStore('tokenDefineStore', () => {
  let token = useStorage('token', '');

  const setToken = (tokenData: string) => {
    token.value = tokenData;
  };

  const cleanToken = () => {
    token.value = '';
  };
  return {
    token,
    setToken,
    cleanToken,
  };
});
