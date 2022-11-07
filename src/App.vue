<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: auto"><Header /></el-header>
      <Nav />
      <el-container class="main-content">
        <el-aside width="140px" class="aside" v-if="hideAside"><Aside /></el-aside>
        <el-main class="el-main">
          <router-view v-model:hideAside="hideAside"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Nav from '@/components/nav.vue';
import Header from '@/components/head.vue';
import { getUserInfo } from '@/http';
import { onMounted, ref } from 'vue';
import Aside from '@/components/aside.vue';
import { userInfoDefineStore } from './store/index';
import storage from 'good-storage';

const userInfoStore = userInfoDefineStore();

// 个别页面是否需要隐藏左边栏
const hideAside = ref(true);

async function getUseInfo() {
  let token = storage.get('token');
  if (token == '') return;
  let result = await getUserInfo();
  userInfoStore.setUserInfo(result);
}

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
