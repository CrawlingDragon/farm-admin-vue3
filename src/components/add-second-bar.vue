<template>
  <div class="add-second-bar border">
    <div class="name">{{ title }}</div>
    <div class="del" @click="del">删除</div>
    <div class="user-mobile">{{ mobile }}</div>
    <div class="time">{{ time }}</div>
    <div class="text">录入</div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String,
  mobile: Number,
  time: Number,
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
  }
}
</style>
