<template>
  <div class="vip-admin border bg-w pd40" v-loading="loading" element-loading-text="加载中...">
    <div class="head right-head soil-right-head">
      <div class="tab" :class="{ active: active == 0 }" @click="choose(0)">全部测土</div>
      <div class="tab" :class="{ active: active == 1 }" @click="choose(1)">检测中</div>
      <div class="tab" :class="{ active: active == 2 }" @click="choose(2)">检测完成</div>
      <div class="tab" :class="{ active: active == 3 }" @click="choose(3)">已给处方</div>
      <el-tooltip
        class="box-item tab"
        effect="customized"
        content=""
        placement="right-start"
        v-if="!isVipPage"
      >
        <template #content>
          测土配方模块记录农户的土壤养分检测结果和处方<br />数据。土壤检测结果数据包含：氮磷钾PH和盐分；
          <br />处方数据：针对检测结果医院专家开处方，对土壤<br />进行调理。
        </template>
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>

      <el-button type="primary" class="add" @click="goAddSoilPage">新增测土</el-button>
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr20"
        size="large"
        placeholder="测土单号/会员姓名"
      />
      <div class="date-box mr50">
        <label class="mr10">申请时间</label>
        <el-date-picker
          style="width: 280px"
          v-model="dateVal"
          type="daterange"
          range-separator="-"
          start-placeholder="选择起始时间"
          end-placeholder="选择结束时间"
          size="large"
          class="mr10"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
        />
      </div>
      <div class="select-box mr10">
        <label class="mr10">状态</label>
        <el-select v-model="status" style="width: 130px" placeholder="Select" size="large">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table :data="soilData.tableData" style="width: 100%">
        <el-table-column prop="cetuNumber" label="测土单号" width="150px" />
        <el-table-column prop="category" label="现种种类" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="userName" label="会员" />
        <el-table-column prop="isFrist" label="初复诊" />
        <el-table-column prop="dateCollected" label="取样日期" />
        <el-table-column prop="expertName" label="测试专家" />
        <el-table-column prop="yongyao" label="用药" />
        <el-table-column prop="statusTips" label="测土状态">
          <!-- <template #default="scope"
            >{{
              scope.row.status == 1 ? '检测中' : scope.row.status == 2 ? '检测完成' : '已给处方'
            }}
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="操作">
          <template #default="scope">
            <div
              v-if="scope.row.status == 3"
              class="color cursor"
              @click="goSoilPage('detail', scope.row.cetuId)"
            >
              详情
            </div>
            <div v-else class="color cursor" @click="goSoilPage('edit', scope.row.cetuId)">
              编辑
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="soilData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getSoilList } from '@/http';
import { useRouter, useRoute } from 'vue-router';
import { useIfNeedUidRouteQuery } from '@/hooks/useAddRoute';
const route = useRoute();
const active = ref(0);
const keyword = ref('');
const dateVal = ref();
const status = ref(0);
const page = ref(1);
const options = ref([
  { label: '全部', value: 0 },
  { label: '检测中', value: 1 },
  { label: '检测完成', value: 2 },
  { label: '已给处方', value: 3 },
]);
const soilData = reactive({
  totalData: 0,
  tableData: [],
});

//是否在vip的列表页面
const isVipPage = computed(() => {
  return route.meta.pageAddress === 'vip' ? true : false;
});
const uId = computed(() => route.query.uId);
const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let uid = uId.value as any;
  let params = {
    uid,
    keyword: keyword.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
    status: status.value,
  };
  return params;
});
// 点击tab切换
function choose(activeVal: number) {
  active.value = activeVal;
  status.value = options.value.filter((item) => item.value == activeVal)[0].value;
}
// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    setSoilData();
  }
}

const loading = ref(true);
//获取列表数据
async function setSoilData() {
  loading.value = true;
  let r = await getSoilList(params.value);
  setTimeout(() => {
    loading.value = false;
    soilData.tableData = r.lists.data;
    soilData.totalData = r.lists.totalData;
  }, 500);
}

watch(page, () => {
  setSoilData();
});

watch(active, () => {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    setSoilData();
  }
});
onMounted(() => {
  setSoilData();
});

const router = useRouter();
// const ifNeedUidRouteQuery = computed(() => {
//   if (route.meta.pageAddress === 'vip') {
//     return { uId: uId.value };
//   } else {
//     return {};
//   }
// });
let ifNeedUidRouteQuery = useIfNeedUidRouteQuery();
// console.log('ifNeedUidRouteQuery', ifNeedUidRouteQuery.value);
function goAddSoilPage() {
  router.push({
    path: `/examine-soil-add`,
    query: ifNeedUidRouteQuery.value,
  });
}
function goSoilPage(page: string, cetuId?: number | string) {
  switch (page) {
    case 'edit':
      router.push({
        path: `/examine-soil-${page}/${cetuId}`,
        query: ifNeedUidRouteQuery.value,
      });
    case 'detail':
      router.push({
        path: `/examine-soil-${page}/${cetuId}`,
        query: ifNeedUidRouteQuery.value,
      });
  }
}
// 新增日期限制
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
  .icon {
    margin-left: 0;
    font-size: 20px;
    cursor: pointer;
  }
  .add {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
