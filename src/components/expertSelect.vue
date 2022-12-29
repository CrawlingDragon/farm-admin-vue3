<template>
  <!-- 专家的select的选择 -->
  <el-select
    v-model="expertSelect"
    class="unit w300"
    placeholder="姓名/手机号"
    size="large"
    @change="changeFn"
  >
    <el-option v-for="item in trimData" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, ref, watch } from 'vue';
import { getTestExpert } from '../http';

const prop = defineProps({
  expert: {
    type: [Number, String],
    default: '',
  },
  options: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:expert']);
const expertSelect = ref<number | string>('');
let options = reactive({
  expertOptions: [
    // 作物select option
    {
      label: 'xx',
      value: 'xx',
      expertName: 'xx',
      mobile: 'xx',
      expertId: 'xx',
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
  if (prop.options.length != 0) {
    // console.log('prop');
    options.expertOptions = prop.options as any;
  } else {
    let { expertList } = await getTestExpert();
    // console.log('select', expertList);
    options.expertOptions = expertList;
  }
  expertSelect.value = prop.expert;
});

watch(
  () => prop.expert,
  () => {
    expertSelect.value = prop.expert;
  }
);
</script>
<style lang="scss" scoped>
// .unit {
//   width: 73px;
// }
</style>
