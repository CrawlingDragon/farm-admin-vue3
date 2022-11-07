<template>
  <!-- 专家的select的选择 -->
  <el-select-v2 v-model="expert" :options="trimData" class="unit" @change="changeFn" />
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { getTestExpert } from '../http';

const prop = defineProps({
  expert: {
    type: [Number, String],
    default: '',
  },
});

const emit = defineEmits(['update:expert']);

let options = reactive({
  expertOptions: [
    // 作物select option
    {
      label: '',
      value: '',
      expertName: '',
      mobile: '',
      expertId: '',
    },
  ],
});
const changeFn = (el: any) => {
  emit('update:expert', el);
};

const trimData = computed(() => {
  let option: any = [].concat(...(options.expertOptions as any));
  option.map((item: any) => {
    item.label = `${item.expertName}(${item.mobile})`;
    item.value = item.expertId;
  });
  return option;
});
onMounted(async () => {
  let { expertList } = await getTestExpert();
  // console.log('expertList', expertList);
  options.expertOptions = expertList;
});
</script>
<style lang="scss" scoped>
// .unit {
//   width: 73px;
// }
</style>
