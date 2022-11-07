<template>
  <!-- 用药的select选择 -->
  <el-select-v2
    v-model="drugName"
    :options="options.medicineOptions"
    class="unit"
    @change="changeFn"
  />
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { getMedicineProduct } from '../http';

const prop = defineProps({
  drugName: {
    type: [Number, String],
    default: '',
  },
  drugId: {
    type: [Number, String],
    default: '',
  },
  size: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:drugName', 'update:size', 'update:drugId']);

let options = reactive({
  medicineOptions: [
    // 用药名select option
    {
      label: '药品1',
      value: {
        drugName: '药品1',
        drugId: '2',
      },
      specLists: [],
    },
  ],
});

const selected = computed(() => (el: string) => {
  let arr: any = [];
  options.medicineOptions.forEach((item: any) => {
    if (item.drugName == el) {
      arr = item.specLists;
    }
  });
  return arr;
});

const changeFn = (el: any) => {
  const { drugName, drugId } = el;
  emit('update:drugName', drugName);
  emit('update:drugId', drugId);
  emit('update:size', selected);
};

onMounted(async () => {
  let r = await getMedicineProduct();
  // console.log('getMedicineProduct', r);
  options.medicineOptions = r;
});
</script>
<style lang="scss" scoped></style>
