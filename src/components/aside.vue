<template>
  <div class="aside">
    <div class="item">
      <h5 class="title">会员中心</h5>
      <template v-for="item in aside?.member">
        <router-link
          :to="getCustomRouterLink(item.label, asideRouter)"
          class="p"
          v-if="item.state === 1"
        >
          {{ item.words }}
        </router-link>
      </template>
    </div>
    <div class="item">
      <h5 class="title">诊疗中心</h5>
      <template v-for="item in aside?.examine">
        <router-link
          :to="getCustomRouterLink(item.label, asideRouter)"
          class="p"
          v-if="item.state === 1"
        >
          {{ item.words }}
        </router-link>
      </template>
    </div>
    <div class="item" v-if="switchSetting.switchInfo?.order?.state == 1">
      <h5 class="title">商品中心</h5>
      <template v-for="item in aside?.commodity">
        <router-link
          :to="getCustomRouterLink(item.label, asideRouter)"
          class="p"
          v-if="item.state === 1 && item.label != 'saleLists' && item.label != 'storeLists'"
        >
          {{ item.words }}
        </router-link>
        <a
          :href="item.linkurl"
          target="_blank"
          class="p"
          v-if="item.state === 1 && item.label == 'saleLists'"
        >
          {{ item.words }}
        </a>
        <a
          :href="item.linkurl"
          target="_blank"
          class="p"
          v-if="item.state === 1 && item.label == 'storeLists'"
        >
          {{ item.words }}
        </a>
      </template>
    </div>
    <div class="item">
      <h5 class="title">特色业务</h5>
      <template v-for="item in aside?.peculiarity">
        <router-link
          :to="getCustomRouterLink(item.label, asideRouter)"
          class="p"
          v-if="item.state === 1"
        >
          {{ item.words }}
        </router-link>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getLeftAside, getSwitchInfo } from '@/http';
import { AsideTS } from '@/http/getLeftAside';
import { ref, onMounted, watch } from 'vue';
import { asideRouter, getCustomRouterLink } from '@/router/router-list';
import storage from 'good-storage';
import { userInfoDefineStore, switchStore } from '@/store/index';
import { ElMessage } from 'element-plus';

const userInfoStore = userInfoDefineStore();
const switchSetting = switchStore(); //是否显示测土诊疗等配置项
const aside = ref<AsideTS>();

//获取左边栏的栏目数据
async function getLeftAsideData() {
  aside.value = await getLeftAside();
  storage.session.set('soil', getTestingsoilListsState(aside.value));
}

function getTestingsoilListsState(aside: any) {
  // let state;
  // state = aside.examine.filter((item: any) => item.label === 'testingsoilLists')[0].state;
  let arr = {} as any;
  aside.examine.forEach((item: any) => {
    if (item.label === 'testingsoilLists') {
      arr['testingsoilLists'] = item.state == 1 ? true : false
    }
    if (item.label === 'observepointLists') {
      arr['observepointLists'] = item.state == 1 ? true : false
    }
    if (item.label === 'zuozhenLists') {
      arr['zuozhenLists'] = item.state == 1 ? true : false
    }
    if (item.label === 'xunzhenLists') {
      arr['xunzhenLists'] = item.state == 1 ? true : false
    }
    if (item.label === 'questionLists') {
      arr['questionLists'] = item.state == 1 ? true : false
    }
  })
  // console.log('arr', arr)
  return arr;
}

onMounted(() => {
  let token = storage.get('token');
  if (token) {
    getLeftAsideData();
    getSwitchSetting();
  }
});

// watch 用户信息，有用户信息，则请求左边栏数据
watch(
  () => userInfoStore.userInfo,
  () => {
    getLeftAsideData();
    getSwitchSetting();
  }
);

async function getSwitchSetting() {
  let r = await getSwitchInfo();
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    switchSetting.setSwitchInfo(r); //用pinia 保存switch开关信息
  }

  // console.log('switchSeting', switchSetting.switchInfo);
}
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
    font-weight: bold;
  }
}
</style>
