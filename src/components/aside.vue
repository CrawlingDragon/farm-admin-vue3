<template>
  <div class="aside">
    <div class="item">
      <h5 class="title">会员中心</h5>
      <template v-for="item in aside?.member">
        <router-link :to="getCustomRouterLink(item.label, asideRouter)" class="p" v-if="item.state === 1">
          {{ item.words }}
        </router-link>
      </template>
    </div>
    <div class="item">
      <h5 class="title">诊疗中心</h5>
      <template v-for="item in aside?.examine">
        <router-link :to="getCustomRouterLink(item.label, asideRouter)" class="p" v-if="item.state === 1">
          {{ item.words }}
        </router-link>
      </template>
    </div>
    <div class="item">
      <h5 class="title">商品中心</h5>
      <template v-for="item in aside?.commodity">
        <router-link :to="getCustomRouterLink(item.label, asideRouter)" class="p"
          v-if="(item.state === 1 && item.label != 'saleLists' && item.label != 'storeLists')">
          {{ item.words }}
        </router-link>
        <a href="https://vip.114nz.com/Member/Product/goodsOnSale.html" target="_blank" class="p" v-if="(item.state === 1 && item.label ==
        'saleLists')">
          {{ item.words }}
        </a>
        <a href="https://vip.114nz.com/Member/Product/goodsInStock.html" target="_blank" class="p"
          v-if="(item.state === 1 && item.label == 'storeLists')">
          {{ item.words }}
        </a>
      </template>
    </div>
    <div class="item">
      <h5 class="title">特色业务</h5>
      <template v-for="item in aside?.peculiarity">
        <router-link :to="getCustomRouterLink(item.label, asideRouter)" class="p" v-if="item.state === 1">
          {{ item.words }}
        </router-link>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getLeftAside } from '@/http';
import { AsideTS } from '@/http/getLeftAside';
import { ref, onMounted, watch } from 'vue';
import { asideRouter, getCustomRouterLink } from '@/router/router-list';
import storage from 'good-storage';
import { userInfoDefineStore } from '@/store/index';
const userInfoStore = userInfoDefineStore();
const aside = ref<AsideTS>();
async function getLeftAsideData() {
  aside.value = await getLeftAside();
  storage.session.set('soil', getTestingsoilListsState(aside.value));
}

function getTestingsoilListsState(aside: any) {
  let state;
  state = aside.examine.filter((item: any) => item.label === 'testingsoilLists')[0].state;
  return state;
}

onMounted(() => {
  let token = storage.get('token');
  if (token) {
    getLeftAsideData();
  }
});

// watch 用户信息，有用户信息，则请求左边栏数据
watch(
  () => userInfoStore.userInfo,
  () => {
    getLeftAsideData();
  }
);
</script>
<style lang="scss" scoped>
.aside {
  height: 100%;
  padding-top: 20px;

  .item {
    margin-bottom: 40px;
  }

  .title {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }

  .p {
    line-height: 30px;
    color: #333333;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      color: $theme-color;
    }
  }

  .router-link-active {
    color: $theme-color;
  }
}
</style>
