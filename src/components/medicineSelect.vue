<template>
  <!-- 用药的select选择 -->
  <el-select v-model="drugIdSelect" placeholder="请选择" class="unit" @change="changeFn">
    <el-option
      v-for="item in optionsComputed"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    >
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, watch, ref, onUpdated } from 'vue';
import { getMedicineProduct } from '../http';

const prop = defineProps({
  drugName: {
    type: [Number, String],
    default: '',
  },
  drugId: {
    type: [Number, String],
    default: '',
  },
  size: {
    type: Array,
    default: function () {
      return [];
    },
  },
  drugSpecIds: {
    type: String,
    default: '',
  },
  drugSpec: {
    type: String,
    default: '',
  },
  selectMyself: {
    type: Boolean,
    default: false,
  },
  showWarning: {
    type: Number,
    default: 0,
  },
});
const drugIdSelect = ref<number | string>('');
const emit = defineEmits([
  'update:drugName',
  'update:size',
  'update:drugId',
  'update:drugSpecIds',
  'update:selectMyself',
  'update:showWarning',
]);

let options = reactive({
  medicineOptions: [
    // 用药名select option
    {
      label: '药品1',
      value: '',
      drugId: '',
      specLists: [],
      drugSpecIds: '',
    },
  ] as any,
});

const selected = (el: string | number) => {
  let arr: any = [{ label: '1', value: '1' }];
  options.medicineOptions.forEach((item: any) => {
    if (item.drugId == el) {
      arr = item.specLists;
    }
  });
  if (arr[0].value === '1') {
    return [];
  }
  arr.map((item: any) => {
    item.value = item.drugSpecIds;
    item.label = item.drugSpec;
    item.disabled = item.disabled;
  });
  return arr;
};

//更新新选择的药品的showWaring值
const updateShowWaring = (el: string | number) => {
  let result = options.medicineOptions.filter((item: any) => {
    return item.drugId == el;
  });
  console.log('result', result);
  let selectedShowWaring = result[0].showWarning;
  return selectedShowWaring;
  // emit('update:showWarning', selectedShowWaring);
};

const updateDrugSpecIds = (el: string | number) => {
  let result = options.medicineOptions.filter((item: any) => {
    return item.drugId == el;
  });
  let specLists = result[0].specLists;
  return specLists[0].drugSpecIds;
  // emit('update:drugSpecIds', specLists[0].drugSpecIds);
  console.log('specLists[0].drugSpecIds', specLists[0].drugSpecIds);
};
//计算属性 option
const optionsComputed = computed(() => {
  let arr: any = [];
  options.medicineOptions.forEach((item: any) => {
    if (item.drugId != '') {
      arr.push({
        label: item.drugName,
        value: item.drugId,
        specLists: item.specLists,
        disabled: item.disabled,
      });
    }
  });
  return arr;
});

//区分是否当前商品id 是否在可选项中
const HasDrugFilter = (drugId: string | number) => {
  let boolean = false;
  options.medicineOptions.forEach((item: any) => {
    if (item.drugId == drugId) {
      boolean = true;
    }
  });
  return boolean;
};
const changeFn = (el: any) => {
  // console.log('el', el);

  emit('update:size', selected(el));
  emit('update:selectMyself', true);

  emit('update:showWarning', updateShowWaring(el));
  emit('update:drugId', el);
  emit('update:drugSpecIds', updateDrugSpecIds(el));
};

// 如果是不在可选中的商品，就添加到option，且添加disabled属性
function addNoSelectToOption() {
  if (prop.drugId != '' && !HasDrugFilter(prop.drugId)) {
    // console.log('drugName', prop.drugName);
    options.medicineOptions.push({
      drugName: prop.drugName,
      drugId: prop.drugId,
      drugSpecIds: prop.drugSpecIds,
      specLists: [{ drugSpecIds: prop.drugSpecIds, drugSpec: prop.drugSpec, disabled: true }],
      disabled: true,
    });
  }
  emit('update:size', selected(prop.drugId));
}
onMounted(async () => {
  let r = await getMedicineProduct();
  // console.log('getMedicineProduct', r);
  options.medicineOptions = r;
  console.log('r', r);
  addNoSelectToOption();
  drugIdSelect.value = prop.drugId;
  // console.log('onMounted');
});

watch(
  () => prop.drugId,
  (newVal) => {
    // console.log('watch=======');
    addNoSelectToOption();
    drugIdSelect.value = newVal;
    // console.log('nedicineSelect.specid', prop.drugSpecIds);
  }
);
// watch(
//   () => prop.drugSpecIds,
//   (newVal) => {
//     console.log('nedicineSelect.specid', newVal);
//   }
// );
</script>
<style lang="scss" scoped></style>
