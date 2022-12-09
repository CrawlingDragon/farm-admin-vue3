<template>
  <div>
    <div class="medicine" v-show="medicine.length !== 0">
      <div class="bar title border">
        <div class="item">商品名称</div>
        <div class="item">商品规格</div>
        <div class="item">数量</div>
        <div class="del"></div>
      </div>
      <div class="bar" v-for="(item, index) in medicine">
        <div class="item">
          <medicineSelectVue
            v-model:drugName="item.drugName"
            v-model:drugId="item.drugId"
            v-model:size="item.sizeSelectOption"
            v-model:drugSpecIds="item.drugSpecIds"
            v-model:drugSpec="item.drugSpec"
            v-model:selectMyself="item.selectMyself"
          />
        </div>
        <div class="item">
          <DrugSizeSelect
            :sizeSelectOption="item.sizeSelectOption"
            v-model:drugSpecIds="item.drugSpecIds"
            v-model:selectMyself="item.selectMyself"
          />
        </div>
        <div class="item">
          <el-input v-model="item.drugQuantity" placeholder=""></el-input>
        </div>
        <div class="del" @click="delMedicine(index)">x</div>
      </div>
    </div>
    <el-button class="add-medicine-btn" @click="addMedicine">添加用药</el-button>
  </div>
</template>
<script setup lang="ts">
import medicineSelectVue from '@/components/medicineSelect.vue';
import DrugSizeSelect from '@/components/drugSizeSelect.vue';
import { ref, watch } from 'vue';

const props = defineProps({
  medicineProp: {
    type: Array,
    default: function () {
      return [
        // {
        //   drugName: '', //药品名字
        //   drugId: '', //药品id
        //   drugSpecIds: '', //药品规格
        //   sizeSelectOption: [] as any,
        //   drugQuantity: 1, // 药品数量
        // },
      ];
    },
  },
});

interface Medicine {
  drugName: string; //药品名字
  drugId: string; //药品id
  drugSpecIds: string; //药品规格id
  drugSpec: string; //药品规格
  sizeSelectOption: any[];
  drugQuantity: string; // 药品数量
  selectMyself: boolean; //是否手动选择
}
const medicine = ref<Medicine[]>([]);
const emits = defineEmits(['update:medicineProp']);
// 删除用药
function delMedicine(index: number) {
  medicine.value.splice(index, 1);
}
// 添加用药
function addMedicine() {
  medicine.value.push({
    drugName: '', //药品名字
    drugId: '', //药品id
    drugSpecIds: '', //药品规格id
    drugSpec: '', //药品规格
    sizeSelectOption: [],
    drugQuantity: '1', // 药品数量
    selectMyself: false,
  });
}
watch(
  medicine,
  (newVal) => {
    // console.log('newVal', newVal);
    emits('update:medicineProp', newVal);
  },
  {
    deep: true,
  }
);

watch(
  () => props.medicineProp,
  (newVal) => {
    // console.log('props', newVal);
    medicine.value = newVal as any;
  },
  {
    deep: true,
  }
);
</script>
<style lang="scss" scoped>
.medicine {
  .bar {
    width: 80%;
    height: 40px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    margin-top: 5px;
    .item {
      flex: 1;
      font-size: 14px;
      padding: 5px;
    }
    .del {
      width: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
  .title {
    margin-top: 0;
  }
}
.add-medicine-btn {
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 30px;
}
</style>
