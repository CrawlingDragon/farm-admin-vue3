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
        v-model:current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
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
const currentPage = ref(1);
const emit = defineEmits(['update:page']);

function handleCurrentChange(page: number) {
  // console.log('page', page);
  emit('update:page', page);
}

onMounted(() => {
  currentPage.value = prop.page;
});

// onUnmounted(() => {
//   window.removeEventListener('scroll', scrollToTop);
// });
watch(
  () => prop.page,
  () => {
    // console.log('prop.page', prop.page);
    currentPage.value = prop.page;
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
