<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: auto"><Header /></el-header>
      <el-container>
        <el-aside width="200px" class="aside">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/head.vue';
</script>
<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  .aside {
    background: $theme-color;
    height: 100%;
  }
}
</style>
