<template>
  <div class="nav">
    <div class="content flex align-center" v-if="active">
      <div class="name">{{ title }}</div>
      <router-link to="/index" class="nav-item">首页</router-link>
      <router-link to="/set" class="nav-item">设置</router-link>
      <router-link
        to="/cashier-desk"
        class="nav-item"
        v-if="switchSetting.switchInfo?.order?.state == 1"
        >收银台</router-link
      >
      <div class="search-box">
        <el-input
          v-model.trim="search"
          placeholder="会员手机号/姓名/身份证/会员ID"
          size="large"
          class="search"
          @keydown.enter="searchFn"
        >
          <template #append>
            <div class="search-but" @click="searchFn">搜索会员</div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="content flex align-center" v-if="!active">
      <div class="name">{{ hospitalName }}收银台</div>
      <div class="back">
        <router-link class="back-link" to="/index">
          <el-icon> <ArrowLeft /> </el-icon>{{ title }}</router-link
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getGlobalTitle } from '@/http';
import { userInfoDefineStore, switchStore } from '@/store/index';
import storage from 'good-storage';

const switchSetting = switchStore(); //是否显示测土诊疗等配置项
const router = useRouter();
const active = ref(true);
router.beforeEach(async (to, from) => {
  if (to.path == '/cashier-desk') {
    active.value = false;
  } else {
    active.value = true;
  }
});

const search = ref('');
// const beforeSearchVal = ref(''); // 用于保存上一次搜索内容

// 搜索函数
const searchFn = () => {
  if (search.value == '') return;
  // if (beforeSearchVal.value === search.value) {
  //   // 上一次搜索内容和 这一次一样，则不跳转
  //   return;
  // }
  // beforeSearchVal.value = search.value;
  router.push({
    path: '/vip-admin',
    query: {
      keyword: search.value,
    },
  });
};

watch(() => router, (newVal) => {
  search.value = ''
}, { deep: true })
const title = ref('');
const hospitalName = ref('');
onMounted(() => {
  setNavTitle();
});

async function setNavTitle() {
  let token = storage.get('token');
  if (!token) return
  let r = await getGlobalTitle();
  title.value = r.manageName;
  hospitalName.value = r.cashierName;
}

const userInfoStore = userInfoDefineStore();
watch(
  () => userInfoStore.userInfo,
  () => {
    setNavTitle();
  }
);
</script>
<style lang="scss" scoped>
.nav {
  height: 80px;
  background: $theme-color;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    height: inherit;
    position: relative;

    .name {
      margin-right: 50px;
      font-size: 28px;
      font-weight: 400;
      color: #fffefe;
      // cursor: pointer;
      user-select: none;
    }

    .nav-item {
      padding: 0 30px;
      font-size: 20px;
      font-weight: 400;
      color: #fffefe;
      height: inherit;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 5px;

      &:hover {
        font-weight: bold;
        background: $theme-second-color;
      }
    }

    .search-box {
      position: absolute;
      right: 0;
      top: 50%;
      width: 380px;
      transform: translateY(-50%);
      .search-but {
          color: $theme-second-color;
        }
    }

    .back {
      position: absolute;
      right: 0;
      top: 50%;
      // width: 380px;
      transform: translateY(-50%);

      .back-link {
        color: #fff;
        font-size: 16px;
        font-family: Microsoft YaHei;
        line-height: 80px;
        display: flex;
        align-items: center;
      }
    }

    :deep().el-input__wrapper.is-focus {
      box-shadow: none;
    }

    :deep().el-input-group__append {
      cursor: pointer;
    }

    .router-link-active {
      font-weight: bold;
      background: $theme-second-color;
    }
  }
}
</style>
