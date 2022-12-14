<template>
  <!-- 会员模块的测土，观测点，坐诊，巡诊左侧的会员的信息 -->
  <div class="wrap">
    <el-avatar style="width: 100px; height: 100px" :src="userInfo.face" class="avatar"></el-avatar>
    <div class="name">{{ userInfo.userName }}</div>
    <div class="mobile">{{ userInfo.tel }}</div>
    <div class="num">{{ userInfo.listText }}({{ userInfo.listNum }})</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ userInfo: any }>();
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .avatar {
    margin: 20px 0 10px;
  }
  .name {
    margin: 5px 0 2px;
    color: #333;
    font-size: 18px;
  }
  .mobile {
    margin: 2px 0;
    color: #999;
    font-size: 12px;
  }
  .num {
    margin: 15px 0;
    font-size: 12px;
    color: #333;
  }
}
</style>
