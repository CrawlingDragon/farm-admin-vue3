import { onMounted, onUnmounted } from 'vue';
<template>
  <div class="pages-box">
    <div class="left">
      共<span class="page-total">{{ total }} </span>条数据
    </div>
    <div class="right">
      <!-- <slot></slot> -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        class="mt-4"
        v-model:current-page="page"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
const prop = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  page: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['update:page']);

function handleCurrentChange(page: number) {
  // console.log('page', page);
  emit('update:page', page);
}

// onMounted(() => {
//   window.addEventListener('scroll', scrollToTop);
// });

// onUnmounted(() => {
//   window.removeEventListener('scroll', scrollToTop);
// });
watch(
  () => prop.page,
  () => {
    // console.log('prop.page', prop.page);
    document.documentElement.scrollTop = 0;
  }
);
</script>
<style lang="scss" scoped>
.pages-box {
  display: flex;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  .left {
    font-size: 12px;
  }
  .page-total {
    font-size: 14px;
    font-weight: bold;
    margin: 0 10px;
    color: #333333;
  }
}
</style>
