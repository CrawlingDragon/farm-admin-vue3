<template>
  <div class="common-layout">
    <el-container v-if="loginFailed">
      <el-header style="height: auto"><Header /></el-header>
      <Nav />
      <el-container class="main-content">
        <el-aside width="140px" class="aside" v-if="hideAside" v-show="aside !== 'aside-setting'"
          ><Aside
        /></el-aside>
        <el-aside width="140px" class="aside" v-show="aside === 'aside-setting'"
          ><AsideSetting
        /></el-aside>
        <el-main class="el-main">
          <router-view v-model:hideAside="hideAside"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-container v-if="!loginFailed">
      <el-dialog :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" align-center
        v-model="dialogVisible" title="提示" width="30%">
        <span>仅支持医院运营账号登录！</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="loginOut">知道了</el-button>
          </span>
        </template>
      </el-dialog>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Nav from '@/components/nav.vue';
import Header from '@/components/head.vue';
import { getUserInfo } from '@/http';
import { onMounted, ref, watch } from 'vue';
import Aside from '@/components/aside.vue';
import AsideSetting from '@/components/aside-setting.vue';
import { userInfoDefineStore } from './store/index';
import storage from 'good-storage';
import { useRoute } from 'vue-router';
import { loginOut } from '@/common/js/getToken';
const route = useRoute();
const userInfoStore = userInfoDefineStore();

// 个别页面是否需要隐藏左边栏
const hideAside = ref(true);
const dialogVisible = ref(true);
let loginFailed = storage.get('loginFailed')

async function getUseInfo() {
  let token = storage.get('token');
  if (!token) return;
  let result = await getUserInfo();
  userInfoStore.setUserInfo(result);
}

const aside = ref<string | undefined | unknown>('');

watch(route, (newVal) => {
  aside.value = newVal.meta.aside;
  // console.log('newVal', newVal);
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
