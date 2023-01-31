<template>
  <div class="vip-admin border bg-w pd40" v-loading="loading" element-loading-text="加载中...">
    <div class="head right-head soil-right-head">
      巡诊记录
      <el-tooltip
        class="box-item tab"
        effect="dark"
        content=""
        placement="right-start"
        v-if="!isVipPage"
      >
        <template #content
          >记录专家田间巡诊数据，包含种类基本情况，<br />巡诊地点和开处方信息。</template
        >
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class="export" @click="exportPDFFn" v-if="!isVipPage">导出PDF</div>
      <el-button type="primary" class="add" @click="goAddZuoPageFn">新增巡诊</el-button>
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr20"
        size="large"
        placeholder="巡诊单号/会员姓名"
      />
      <div class="date-box">
        <label class="mr10">巡诊日期</label>
        <el-date-picker
          v-model="dateVal"
          style="width: 280px"
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

      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table :data="zuoListData.tableData" style="width: 100%">
        <el-table-column prop="wenzhenNumber" label="巡诊单号" width="120px" />
        <el-table-column prop="userName" label="会员" />
        <el-table-column prop="zuowuName" label="巡诊种类" />
        <el-table-column prop="plantTypeTips" label="种养模式" />
        <el-table-column prop="degreeTips" label="病发程度" />
        <el-table-column prop="isFristTips" label="初复诊" />
        <!-- 检查项目，接口暂时没提供数据 -->
        <el-table-column prop="checkItem" label="检查项目" />
        <el-table-column prop="yongyao" label="用药记录" />
        <el-table-column prop="expertName" label="巡诊专家" />
        <el-table-column prop="wenzhenTime" label="巡诊日期" width="120px" />
        <el-table-column prop="status" label="操作">
          <template #default="scope">
            <div class="color cursor" @click="goPintPage(scope.row.zxId)">详情</div>
            <!-- <div v-else class="color cursor" @click="goAddPointPageFn(scope.row.viewId)">编辑</div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="zuoListData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getZuoXunList, getExportZuoXunPDF } from '@/http';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const active = ref(0);
const keyword = ref('');
const dateVal = ref();

const page = ref(1);

const zuoListData = reactive({
  totalData: 0,
  tableData: [],
});
//是否在vip的列表页面
const isVipPage = computed(() => {
  return route.meta.pageAddress === 'vip' ? true : false;
});
//页面参数uId，是用户的uId
const uId = computed<any>(() => route.query.uId);
const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];

  let params = {
    uid: uId.value,
    getType: '2',
    keyword: keyword.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
  };
  return params;
});

// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getZuoListData();
  }
}

const loading = ref(true);
//获取列表数据
async function getZuoListData() {
  // console.log('params.value', params.value);
  loading.value = true;
  let r = await getZuoXunList(params.value);
  // console.log('r', r);
  setTimeout(() => {
    loading.value = false;
    zuoListData.tableData = r.lists.data;
    zuoListData.totalData = r.lists.totalData;
  }, 500);
}

watch(page, () => {
  getZuoListData();
});

watch(active, () => {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getZuoListData();
  }
});
onMounted(() => {
  getZuoListData();
});

//路由到新增观测点
function goAddZuoPageFn() {
  router.push({
    path: `/examine-xunzhen-add`,
    query: { uId: uId.value },
  });
}
//路由到观测点详情 or 编辑观测点
function goPintPage(pointId: number) {
  router.push({
    path: `/examine-xunzhen-detail/${pointId}`,
    query: { uId: uId.value },
  });
}

//导出pdf
const exportPDFFn = async () => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    getType: '2',
    keyword: keyword.value,
    startTime,
    endTime,
  };
  let r = await getExportZuoXunPDF(params);
  // console.log('r', r.downLink);
  window.open(r.downLink, '_target');
};
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
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
    cursor: pointer;
    font-size: 20px;
  }
  .add {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.export {
  font-size: 16px;
  color: $theme-color;
  margin-left: 20px;
  cursor: pointer;
}
</style>
