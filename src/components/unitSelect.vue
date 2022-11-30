<template>
  <el-select-v2
    v-model="unit"
    :options="options.unitOptions"
    class="unit"
    @change="changeFn"
    placeholder=""
  />
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { getSelectInfo } from '../http/getSelectInfo';

const prop = defineProps({
  unit: {
    type: [Number, String],
    default: '亩',
  },
  options: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:unit']);

let options = reactive({
  unitOptions: [
    // 作物select option
    {
      value: '亩',
      label: '亩',
    },
  ],
});
const changeFn = (el: any) => {
  emit('update:unit', el);
};

onMounted(async () => {
  if (prop.options.length === 0) {
    let { unitArr } = await getSelectInfo();
    // console.log('await--unitArr', unitArr);
    options.unitOptions = unitArr;
  } else {
    // console.log('prop');
    options.unitOptions = prop.options as any;
  }
  // 加载数据之后，使用第一个数据，作为默认数据
  emit('update:unit', options.unitOptions[0].value);
});
</script>
<style lang="scss" scoped>
.unit {
  width: 73px;
}
</style>
