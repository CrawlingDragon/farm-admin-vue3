<template>
  <div class="serve-registration border bg-w pd40">
    <div class="head right-head soil-right-head">
      <div class="tab" :class="{ active: active == 1 }" @click="choose(1)">销售额统计</div>
      <div class="tab" :class="{ active: active == 2 }" @click="choose(2)">商品销售统计</div>
      <div class="tab" :class="{ active: active == 3 }" @click="choose(3)">会员购买力统计</div>
    </div>
    <div class="input-bar">
      <div class="date-box">
        <label class="mr10">{{ dateValLabel }}</label>
        <el-date-picker style="width: 250px" v-model="dateVal" :type="typePicker" range-separator="-"
        start-placeholder="选择起始时间" end-placeholder="选择结束时间" size="large" class="mr10" :value-format="pickerFormat" :disabled-date="disabledDate" />
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box" v-if="tableShow">
      <tableTwo :columns="columns" :tableData="soilData.tableData"></tableTwo>
    </div>
    <Pages :total="soilData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, } from 'vue';
import { getCountList } from '@/http'
import Pages from '@/components/pages.vue'
import tableTwo from '@/components/table-two.vue'

const active = ref(1);
const dateVal = ref();
const page = ref(1);
const soilData = reactive({
  totalData: 0,
  tableData: []
})
const dateValLabel = ref("销售额统计")
const typePicker = ref<any>("monthrange")
const pickerFormat = ref("YYYY-MM")
let columns = ref<any>([
  {
    prop: 'date',
    label: '时间'
  },
  {
    prop: 'countCategory',
    label: '销售商品种类(种)'
  },
  {
    prop: 'countSum',
    label: '销售数量(件)'
  },
  {
    prop: 'countAmount',
    label: '销售额(元)'
  },
])
const tableShow = ref(false)

// 点击tab切换
function choose(activeVal: number) {
  tableShow.value = false
  active.value = activeVal;
  dateVal.value = null
  page.value = 1;
  if (activeVal == 1) {
    dateValLabel.value = '月份'
    typePicker.value = 'monthrange'
    pickerFormat.value = 'YYYY-MM'
    columns.value = [
      {
        prop: 'date',
        label: '时间'
      },
      {
        prop: 'countCategory',
        label: '销售商品种类(种)',
      },
      {
        prop: 'countSum',
        label: '销售数量(件)'
      },
      {
        prop: 'countAmount',
        label: '销售额(元)'
      },
    ]
  } else if (activeVal == 2) {
    dateValLabel.value = '购买日期'
    typePicker.value = 'daterange'
    pickerFormat.value = 'YYYY-MM-DD'
    columns.value = [
      {
        prop: 'contentSplicing',
        label: '商品',
        content: ['productName', 'spec']
      },
      {
        prop: 'countSum',
        label: '销售数量(件)'
      },
      {
        prop: 'countAmount',
        label: '销售额(元)'
      },
    ]
  } else if (activeVal == 3) {
    dateValLabel.value = '订单日期'
    typePicker.value = 'daterange'
    pickerFormat.value = 'YYYY-MM-DD'
    columns.value = [
      {
        prop: 'contentSplicing',//
        label: '会员',
        content: ['realname', 'mobile']
      },
      {
        prop: 'countCategory',
        label: '购买商品种类(种)'
      },
      {
        prop: 'countSum',
        label: '购买数量(件)'
      },
      {
        prop: 'countAmount',
        label: '消费金额(元)'
      },
    ]
  }
  setCountList()
}

const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    getType: active.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
  };
  return params;
});
// 获取列表信息
async function setCountList() {
  let r = await getCountList(params.value);
  soilData.tableData = r.data;
  soilData.totalData = r.totalData;
  tableShow.value = true
}
// 点击搜索按钮
function search() {
  page.value = 1;
  setCountList();
}
onMounted(() => {
  setCountList();
});
watch(page, () => {
  setCountList();
});
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
};
</script>
<style lang="scss" scoped>
.soil-right-head {
  display: flex;
  align-items: center;
  position: relative;

  .tab {
    font-weight: 100;
    margin: 0 20px;
    cursor: pointer;

    &.active {
      border-bottom: 2px solid $theme-color;
    }
  }

}

.input-bar {
  display: flex;
  justify-content: flex-start;
}
</style>

