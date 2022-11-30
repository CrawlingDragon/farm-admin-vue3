<template>
  <!-- 用药的select选择 -->
  <el-select v-model="drugId" placeholder="请选择" class="unit" @change="changeFn">
    <el-option
      v-for="item in optionsComputed"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
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
      value: '',
      specLists: [],
    },
  ],
});

const selected = computed(() => (el: string) => {
  let arr: any = [{ label: '1', value: '1' }];
  options.medicineOptions.forEach((item: any) => {
    if (item.drugId == el) {
      arr = item.specLists;
    }
  });
  arr.map((item: any) => {
    item.value = item.drugSpecIds;
    item.label = item.spec;
  });
  return arr;
});

const selectDrugName = computed((el: string) => {
  let id = '';
  options.medicineOptions.forEach((item: any) => {
    if (item.drugId == el) {
      id = item.specLists;
    }
  });
  return id;
});

const optionsComputed = computed(() => {
  let arr: any = [];
  options.medicineOptions.forEach((item: any) => {
    if (item.drugName) {
      arr.push({
        label: item.drugName,
        value: item.drugId,
        specLists: item.specLists,
      });
    }
  });
  return arr;
});

const changeFn = (el: any) => {
  // console.log('el', el);
  // const { drugName, drugId } = el;
  // emit('update:drugName', drugName);
  console.log('selected.value', selected.value(el));
  emit('update:drugId', el);
  emit('update:size', selected.value(el));
};

onMounted(async () => {
  let r = await getMedicineProduct();
  // console.log('getMedicineProduct', r);
  options.medicineOptions = r;
});
</script>
<style lang="scss" scoped></style>
