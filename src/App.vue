<template>
  <div class="common-layout">
    <el-container>
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
const route = useRoute();
const userInfoStore = userInfoDefineStore();

// 个别页面是否需要隐藏左边栏
const hideAside = ref(true);

async function getUseInfo() {
  let token = storage.get('token');
  if (token == '') return;
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
