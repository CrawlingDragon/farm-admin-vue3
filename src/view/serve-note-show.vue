<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-note' }">短信管理</el-breadcrumb-item>
        <el-breadcrumb-item>短信详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">


    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getNoteSmsSendInfo } from "@/http";

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['update:hideAside']);
let id = computed(() => route.query.id);

onMounted(async () => {
  emit('update:hideAside', false);
  let r = await getNoteSmsSendInfo({ smsId: id.value })
  console.log('r', r)
})
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
})
// 去特定的路由
function goPage(path: string) {
  router.push({
    path,
  });
}

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

