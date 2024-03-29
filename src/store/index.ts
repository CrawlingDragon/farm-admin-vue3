import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

interface userInfo {
  name?: string;
  avatar?: string;
  mobile?: number;
  isUserAccount?: number; //1是个人，2是商户
  isShaoXingTop?: number | string;//0普通医院，1是绍兴市医院
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

// 全局switch 开关，比如测土，坐诊巡诊
export const switchStore = defineStore('switchStore', () => {
  let switchInfo = ref<any>([]);
  const setSwitchInfo = (switchObj: any) => {
    switchInfo.value = switchObj;
  };
  return {
    switchInfo,
    setSwitchInfo,
  };
});
// 登录状态
export const loginState = defineStore('loginState', () => {
  let loginStates = ref<any>();
  const setLoginStates = (states: any) => {
    loginStates.value = states;
  };
  return {
    loginStates,
    setLoginStates,
  };
});
// 禁止登录的用户信息
export const refuseUserDefineInfoStore = defineStore('refuseUserInfoStore', () => {
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
