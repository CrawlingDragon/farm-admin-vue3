<template>
  <!-- 最近测土记录 select -->
  <el-select-v2 v-model="soilTestRecord" :options="testOptions" class="unit" @change="changeFn" />
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { getMedicineProduct } from '../http';

const prop = defineProps({
  soilTestRecord: {
    type: String,
    default: '',
  },
  soilSelectOption: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:soilTestRecord']);

let options = reactive({
  testOptions: [
    // 测土记录 option
    {
      label: '',
      value: '',
    },
  ],
});

const changeFn = (el: any) => {
  emit('update:soilTestRecord', el);
};

const testOptions = computed<any>(() => {
  if (prop.soilSelectOption.length == 0) {
    return options.testOptions;
  } else {
    prop.soilSelectOption.map((item: any) => {
      item.label = item.cetuNumber;
      item.value = item.cetuNumber;
    });
    return prop.soilSelectOption;
  }
});

onMounted(async () => {
  if (prop.soilSelectOption.length == 0) {
    let r = await getMedicineProduct();
    // console.log('getMedicineProduct', r);
    options.testOptions = r;
  }
});
</script>
<style lang="scss" scoped></style>
