<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: auto"><Header /></el-header>
      <div v-if="loginStates == 'agree'">
        <Nav />
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
      </div>
      <div class="login-refuse" v-if="loginStates == 'refuse'">
        <div class="top">
          <el-icon :size="50" color="#FF6600"><WarningFilled /></el-icon>
          <span class="tips">访问失败</span>
        </div>
        <p>新院管理平台仅支持新型庄稼医院运营账号登录</p>
        <p>请选择其他产品和服务进行登录</p>
        <div class="button" @click="loginOut">知道了</div>
      </div>
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
import { userInfoDefineStore, loginState } from './store/index';
import storage from 'good-storage';
import { useRoute } from 'vue-router';
import { loginOut } from '@/common/js/getToken';
import { storeToRefs } from "pinia"
const route = useRoute();
const userInfoStore = userInfoDefineStore();
// 响应式登录状态
const loginStateStore = loginState()
const { loginStates } = storeToRefs(loginStateStore);

// 个别页面是否需要隐藏左边栏
const hideAside = ref(true);

async function getUseInfo() {
  let token = storage.get('token');
  if (!token) return;
  let result = await getUserInfo();
  userInfoStore.setUserInfo(result);
  if (result) {
    loginStateStore.setLoginStates('agree')//医院账户登录
  }
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
  .login-refuse{
    text-align: center;
    margin-top: 200px;
    .top{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      .tips{
        display: inline-block;
        width: 150px;
        font-size: 28px;
        font-weight: bold;
        color: #FF6600;
      }
    }
    p{
      height: 30px;
      font-size: 16px;
      color: #333333;
    }
    .button{
      text-align: center;
      margin: 10px auto;
      line-height: 34px;
      width: 150px;
      height: 34px;
      background: #FFFFFF;
      border: 1px solid #599524;
      border-radius: 5px 5px 5px 5px;
      &:hover{
        cursor: pointer;
      }
    }
  }
}
</style>
