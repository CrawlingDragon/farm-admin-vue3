<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      观测点
      <el-tooltip class="box-item tab" effect="dark" content="" placement="right-start">
        <template #content>
          观测点即试验示范地，同时设立对照组和观测点，并将作物信息，<br />测土信息、农资商品使用信息、日常观测信息全部公开，通过控<br />制变量法，直观的给农户展示放心农资的使用情况。
        </template>
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <el-button type="primary" class="add" @click="goAddPointPageFn('add')">新增观测点</el-button>
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr20"
        size="large"
        placeholder="观测点ID/会员姓名"
      />
      <div class="date-box">
        <label class="mr10">开始时间</label>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          range-separator="-"
          start-placeholder="选择起始时间"
          end-placeholder="选择结束时间"
          size="large"
          class="mr10"
          value-format="YYYY-MM-DD"
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
      <el-table :data="pointListData.tableData" style="width: 100%">
        <el-table-column prop="observepointNumber" label="观测点ID" />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="zuowu" label="种类" />
        <el-table-column prop="address" label="试验地点" />
        <el-table-column prop="tester" label="会员" />
        <el-table-column prop="observeTime" label="开始日期" />
        <el-table-column prop="updateTime" label="最近更新" />
        <el-table-column prop="statusTips" label="状态">
          <!-- <template #default="scope"
            >{{
              scope.row.status == 1 ? '检测中' : scope.row.status == 2 ? '检测完成' : '已给处方'
            }}
          </template> -->
        </el-table-column>
        <el-table-column prop="status" label="操作">
          <template #default="scope">
            <div class="color cursor" @click="goPintPage(scope.row.viewId)">详情</div>
            <!-- <div v-else class="color cursor" @click="goAddPointPageFn(scope.row.viewId)">编辑</div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="pointListData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getObservePointList } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();
const active = ref(0);
const keyword = ref('');
const dateVal = ref();

const page = ref(1);

const status = ref(0);
const options = ref([
  { label: '全部', value: 0 },
  { label: '观测中', value: 1 },
  { label: '观测结束', value: 2 },
]);
const pointListData = reactive({
  totalData: 0,
  tableData: [],
});

const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];

  let params = {
    keyword: keyword.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
    status: status.value,
  };
  return params;
});

// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getPointData();
  }
}
async function getPointData() {
  let r = await getObservePointList(params.value);
  console.log('r', r);
  pointListData.tableData = r.lists.data;
  pointListData.totalData = r.lists.totalData;
}

watch(page, () => {
  getPointData();
});

watch(active, () => {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getPointData();
  }
});
onMounted(() => {
  getPointData();
});

//路由到新增观测点
function goAddPointPageFn(pointId: number | string) {
  if (pointId == 'add') {
    router.push({
      path: '/examine-point-add',
    });
  } else {
    router.push({
      path: `/examine-point-add/${pointId}`,
    });
  }
}
//路由到观测点详情 or 编辑观测点
function goPintPage(pointId: number) {
  router.push({
    path: `/examine-point-detail/${pointId}`,
  });
}
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
    margin-left: 5px;
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
