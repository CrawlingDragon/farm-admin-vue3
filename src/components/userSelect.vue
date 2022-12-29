<template>
  <!-- 医院下面--会员的select选择 -->

  <el-select
    ref="mySelect"
    remote
    :filter-method="filterMethed"
    filterable
    v-model="selectUser"
    placeholder="请选择会员"
    class="w300 select"
    @change="changeFn"
    :disabled="disabled"
  >
    <template #prefix>
      <el-icon>
        <Search />
      </el-icon>
    </template>
    <el-option :label="item.label1" :value="item.value" v-for="item in trimDatas" :key="item.value">
      <div slot>{{ item.label }}</div>
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, ref, watch } from 'vue';
import { getHospitalUser } from '../http';

const prop = defineProps({
  user: {
    type: [Number, String],
    default: '',
  },
  labelStr: {
    type: String,
    default: 'label',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:user']);
const selectUser = ref<string | number>('');
let trimDatas = ref([
  {
    label: '',
    label1: '',
    value: '',
  },
]);
const mySelect = ref();
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
const filterMethed = (values: any) => {
  if (!values) {
    trimDatas.value = trimData.value;
  } else {
    trimDatas.value = trimData.value.filter((item: any) => ~item.label.indexOf(values));
  }
};

let trimData: any = computed(() => {
  let option: any = [].concat(...(options.userOptions as any));
  option.map((item: any) => {
    item.label = `${item.userName}(${item.mobile})`;
    item.value = item.uid;
    item.label1 = item[prop.labelStr];
  });
  return option;
});
onMounted(async () => {
  let r = await getHospitalUser();
  // console.log('expertList', expertList);
  // console.log('r', r);
  options.userOptions = r;
  trimDatas.value = trimData.value;
  selectUser.value = prop.user;
  emit('update:user', prop.user);
});

watch(
  () => prop.user,
  () => {
    // console.log('prop.user', prop.user);
    selectUser.value = prop.user;
    emit('update:user', prop.user);
  }
);
defineExpose({
  options,
  mySelect,
});
</script>
<style lang="scss" scoped>
.select {
  color: #333;
}
</style>
