<template>
  <!-- 最近测土记录 select -->
  <!-- <el-select-v2 v-model="soilTestRecord" :options="testOptions" class="unit" @change="changeFn" /> -->
  <el-select v-model="soilTestRecord" placeholder="请选择测土记录" class="unit" @change="changeFn">
    <el-option :label="item.label" :value="item.value" v-for="item in testOptions"> </el-option>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { getTestExpert } from '../http';

const prop = defineProps({
  soilTestRecord: {
    type: String,
    default: '',
  },
  soilSelectOption: {
    type: Array,
    default: function () {
      return [
       
      ];
    },
  },
});

const emit = defineEmits(['update:soilTestRecord']);

let options = reactive({
  testOptions: [
    // 测土记录 option
    {
      label: 'xx',
      value: 'xx',
    },
  ],
});

const changeFn = (el: any) => {
  emit('update:soilTestRecord', el);
};

const testOptions = computed<any>(() => {
  // if (prop.soilSelectOption.length == 0) {
  //   return options.testOptions;
  // } else {
  options.testOptions.map((item: any) => {
    if (item?.dateCollected) {
      item.label = `${item?.dateCollected} ${item?.cetuNumber}--${item?.address}`;
      item.value = item?.cetuNumber;
    }
  });
  return options.testOptions;
  // }
});

onMounted(async () => {
  if (prop.soilSelectOption.length == 0) {
    // console.log('await');
    let r = await getTestExpert();
    console.log('getMedicineProduct', r);
    options.testOptions = r.cetuOrderList;
  } else {
    // console.log('prop');
    options.testOptions = prop.soilSelectOption as any;
  }
});
</script>
<style lang="scss" scoped></style>
