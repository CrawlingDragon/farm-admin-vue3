<template>
  <el-transfer v-model="kind" :data="transferData" :titles="['选择擅长种类', '选择左侧的种类']" />
</template>
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { getSelectInfo } from '../http/getSelectInfo';

const props = defineProps({
  kind: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emits = defineEmits(['update:kind']);
// 穿梭框的默认值
const transfer = ref<any>([]);
// 请求的穿梭框的数据重新组织
const transferData = computed(() => {
  let arr: any = [];
  transfer.value.forEach((item: any) => {
    arr.push(...item.options);
  });
  arr.map((item: any) => {
    item.key = item.value;
  });
  return arr;
});
onMounted(async () => {
  let r = await getSelectInfo();
  transfer.value = r.categoryArr;
});
</script>
<style lang="scss" scoped></style>
