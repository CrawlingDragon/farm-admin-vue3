<template>
  <div class="aside">
    <div class="item">
      <h5 class="title">医院设置</h5>
      <template v-for="item in asideSettingRouter.hospital">
        <router-link :to="'/set' + item.path" class="p">
          {{ item.words }}
        </router-link>
      </template>
    </div>
    <!-- <div class="item">
      <h5 class="title">服务</h5>
      <template v-for="item in asideSettingRouter.service">
        <router-link :to="'/set' + item.path" class="p">
          {{ item.words }}
        </router-link>
      </template>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import { asideSettingRouter, getCustomRouterLink } from '@/router/router-list';
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
