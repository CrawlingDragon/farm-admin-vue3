<template>
  <el-image :src="imgSrc" :preview-src-list="srcList" :initial-index="index" hide-on-click-modal :infinite="false"
    fit="scale-down" />
</template>
<script setup lang="ts">
import { computed } from 'vue';

const prop = defineProps({
  index: {
    type: Number,
    default: 0
  },
  lists: {
    type: Array,
    default: []
  },
  strKey: {
    type: String,
    default: ''
  },
  imgSrc: {
    type: String,
    default: ''
  }
})
const srcList = computed(() => {
  let params = [] as any
  prop.lists.map((item: any) => {
    params.push(item[prop.strKey])
  })
  return params
})


</script>
<style lang="scss" scoped>

</style>