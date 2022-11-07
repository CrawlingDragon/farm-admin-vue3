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
    default: '',
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
  let { unitArr } = await getSelectInfo();
  options.unitOptions = unitArr;
});
</script>
<style lang="scss" scoped>
.unit {
  width: 73px;
}
</style>
