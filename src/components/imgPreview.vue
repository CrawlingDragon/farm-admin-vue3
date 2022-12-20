<template>
  <el-image-viewer v-if="showView" :url-list="srcList" :initial-index="index" hide-on-click-modal :infinite="false"
    @close="close" teleported />
</template>
<script setup lang="ts">
import { computed, watch, ref } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    default: null
  },
  lists: {
    type: Array,
    default: []
  },
})
const showView = ref(false)
const emit = defineEmits(['update:index'])
const srcList = computed(() => {
  let params = [] as any
  props.lists.map((item: any) => {
    params.push(item.url)
  })
  return params
})
watch(() => props.index, (newVal) => {
  if (newVal !== null) {
    showView.value = true
  }
})
const close = () => {
  showView.value = false
  emit('update:index', null)
}


</script>
<style lang="scss" scoped>

</style>