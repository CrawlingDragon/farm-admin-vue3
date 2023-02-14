<template>
  <div class="common-layout">
    <el-container v-if="loginStates == 'agree'">
      <el-header style="height: auto">
        <Header />
      </el-header>
        <Nav />
        <!-- <Nav v-if="navShow" /> -->
        <el-container class="main-content">
          <el-aside width="140px" class="aside" v-if="hideAside" v-show="aside !== 'aside-setting'">
            <Aside />
          </el-aside>
          <el-aside width="140px" class="aside" v-show="aside === 'aside-setting'">
            <AsideSetting />
          </el-aside>
          <el-main class="el-main">
            <router-view v-model:hideAside="hideAside"></router-view>
          </el-main>
        </el-container>
    </el-container>
    <el-container v-if="loginStates == 'refuse'">
      <RefuseIndex></RefuseIndex>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Nav from '@/components/nav.vue';
import Header from '@/components/head.vue';
import RefuseIndex from '@/components/login-refuse/index.vue'
// import { getUserInfo } from '@/http';
import leansAxios from '@/http/http';
import { onMounted, ref, watch } from 'vue';
import Aside from '@/components/aside.vue';
import AsideSetting from '@/components/aside-setting.vue';
import { userInfoDefineStore, loginState, refuseUserDefineInfoStore } from './store/index';
import storage from 'good-storage';
import { useRoute } from 'vue-router';
import { storeToRefs } from "pinia"
const route = useRoute();
const userInfoStore = userInfoDefineStore();
const refuseUserInfoStore = refuseUserDefineInfoStore()
// 响应式登录状态
const loginStateStore = loginState()
const { loginStates } = storeToRefs(loginStateStore);

// 个别页面是否需要隐藏左边栏
const hideAside = ref(true);

async function getUseInfo() {
  let token = storage.get('token');
  if (!token) return;
  // let result = await getUserInfo();
  // 请求接口，获取对应token的用户信息，并保存
  leansAxios
    .fetchPost('/api/auth/userInfo', {
      token: token,
    })
    .then((res: any) => {
      let data = res.data;
      const loginStateStore = loginState();
      if (data.code == 200) {
        userInfoStore.setUserInfo(data.data); // 保存医院账户的用户信息
        loginStateStore.setLoginStates('agree'); //医院账户登录
      }
      if (data.code == 405) {
        loginStateStore.setLoginStates('refuse'); //非医院账户登录
        refuseUserInfoStore.setUserInfo(data.data); // 保存非医院账户的用户信息
      }
    });
}

const aside = ref<string | undefined | unknown>('');
// const navShow = ref<Boolean>(true)

watch(route, (newVal) => {
  aside.value = newVal.meta.aside;
  // if (newVal.path == '/change-password') {
  //   navShow.value = false
  // }
  // else{
  //   navShow.value = true
  // }
  // console.log('newVal.meta', newVal.meta);
});

onMounted(async () => {
  getUseInfo();
});
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  display: flex;

  .main-content {
    width: 1200px;
    margin: 0 auto;
  }
  .el-main {
    padding-left: 0;
    padding-right: 0;
  }

}
</style>
