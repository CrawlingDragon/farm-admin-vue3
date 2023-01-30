<template>
  <div class="add-second-bar border">
    <div class="name">{{ title }}</div>
    <template v-if="onlyShowTitle">
      <slot>
        <div class="del" @click="del">删除</div>
      </slot>

      <div class="user-mobile">{{ mobile }}</div>
      <div class="time">{{ time }}</div>
      <div class="text">录入</div>
    </template>
    <slot name="states"></slot>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String,
  mobile: {
    type: [String, Number],
  },
  time: {
    type: [String, Number],
  },
  onlyShowTitle: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['del']);
const del = () => {
  emit('del');
};
</script>
<style lang="scss" scoped>
.add-second-bar {
  border-bottom: none;
  height: 50px;
  padding-left: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  position: relative;
  .name {
    margin-right: 20px;
    font-weight: bold;
  }
  .del {
    margin-right: 30px;
    color: $theme-color;
    cursor: pointer;
  }
  .user-mobile,
  .time,
  .text {
    color: #999;
    margin-right: 10px;
    font-size: 12px;
  }
}
</style>
