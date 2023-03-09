<template>
  <el-select v-model="drugSpecIdsSelect" class="unit" @change="changeFn">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    ></el-option>
  </el-select>
</template>
<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue';
const props = defineProps({
  drugSpecIds: {
    type: String,
    default: '',
  },
  sizeSelectOption: {
    type: Array,
    default: function () {
      return [
        {
          label: 'x',
          value: 'xx',
        },
      ];
    },
  },
  selectMyself: {
    type: Boolean,
    default: false,
  },
});
const drugSpecIdsSelect = ref<string>('');
const emits = defineEmits(['update:drugSpecIds']);
const options = computed(() => props.sizeSelectOption as any);
const changeFn = (el: any) => {
  // console.log('el', el);
  emits('update:drugSpecIds', el);
};
watch(
  () => props.sizeSelectOption,
  () => {
    // if (props.selectMyself) {
    //   // console.log('1', 1);
    //   emits('update:drugSpecIds', '');
    // }
    drugSpecIdsSelect.value = props.drugSpecIds;
    //  drugSpecIdsSelect.value = newVal
  }
);
watch(
  // watch 规格id
  () => props.drugSpecIds,
  (newVal, oldVal) => {
    // console.log('newVal=====', newVal);
    // console.log('oldVal=====', oldVal);
    drugSpecIdsSelect.value = newVal;
  }
);
onMounted(() => {
  drugSpecIdsSelect.value = props.drugSpecIds;
});
</script>
<style lang="scss" scoped></style>
