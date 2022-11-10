<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-note' }">短信管理</el-breadcrumb-item>
        <el-breadcrumb-item>发短信</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">

      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" size="large" class="mr20">保存</el-button>
          <el-button size="large">取消</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['update:hideAside']);

onMounted(async () => {
  emit('update:hideAside', false);
})
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
})

</script>

<style lang="scss" scoped>
.nav-bar {
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid $border-color;
}

.content-box {
  background: #fff;

  .content-detail {
    min-height: 50vh;
    color: #333;
    font-size: 14px;

    .detil-title {
      font-weight: bold;
      padding: 30px 0;

      .line {
        width: 5px;
        height: 20px;
        display: inline-block;
        margin-right: 15px;
        background: $theme-color;
        vertical-align: bottom;
      }
    }

    .detail-box {
      margin-bottom: 20px;

      .label {
        display: inline-block;
        width: 150px;
        margin-right: 10px;
        text-align: right;
      }

      .content-status {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>

