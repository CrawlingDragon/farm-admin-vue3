<template>
  <!-- 医院下面--会员的select选择 -->

  <el-select v-model="user" placeholder="请选择会员" class="w300 select" @change="changeFn">
    <el-option :label="item.label" :value="item.value" v-for="item in trimData"></el-option>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue';
import { getHospitalUser } from '../http';

const prop = defineProps({
  user: {
    type: [Number, String],
    default: '',
  },
});

const emit = defineEmits(['update:user']);

let options = reactive({
  userOptions: [
    // 作物select option
    {
      label: '',
      value: '',
      uid: 0,
      vipNumber: '',
      userName: '',
      mobile: '',
      sindex: '',
    },
  ],
});
const changeFn = (el: any) => {
  emit('update:user', el);
};

const trimData = computed(() => {
  let option: any = [].concat(...(options.userOptions as any));
  option.map((item: any) => {
    item.label = `${item.userName}(${item.mobile})`;
    item.value = item.uid;
  });
  return option;
});
onMounted(async () => {
  let r = await getHospitalUser();
  // console.log('expertList', expertList);
  // console.log('r', r);
  options.userOptions = r;
});
</script>
<style lang="scss" scoped>
.select {
  color: #333;
}
</style>
