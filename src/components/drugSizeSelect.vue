<template>
  <el-select v-model="drugSpecIds" class="unit" @change="changeFn">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
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
});
const emits = defineEmits(['update:drugSpecIds']);
const options = computed(() => props.sizeSelectOption as any);
const changeFn = (el: any) => {
  // console.log('el', el);
  emits('update:drugSpecIds', el);
};
watch(
  () => props.sizeSelectOption,
  () => {
    emits('update:drugSpecIds', '');
  }
);
</script>
<style lang="scss" scoped></style>
