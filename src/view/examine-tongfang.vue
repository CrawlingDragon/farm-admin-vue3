<template>
  <div class="vip-admin border bg-w pd40" v-loading="loading" element-loading-text="加载中...">
    <div class="head right-head soil-right-head">
      统防统治
      <el-tooltip class="box-item tab" effect="dark" content="" placement="right-start">
        <template #content>记录庄稼医院的统防统治数据。</template>
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <el-button type="primary" class="add" @click="goAddZuoPageFn">新增统防统治</el-button>
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr20"
        size="large"
        placeholder="统防统治ID/名称"
      />
      <div class="date-box mr50">
        <label class="mr10">开始防治日期</label>
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

      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table :data="zuoListData.tableData" style="width: 100%">
        <el-table-column prop="tongfangNumber" label="统防统治ID" />
        <el-table-column prop="title" label="名称" />
        <el-table-column prop="zuowuName" label="种类" />
        <el-table-column prop="yongyao" label="用药" />
        <el-table-column prop="fangzhiTime" label="开始防治日期" />
        <el-table-column prop="mushu" label="防治亩数" />
        <el-table-column prop="farmersNum" label="农户数" />
        <el-table-column prop="status" label="操作">
          <template #default="scope">
            <div class="color cursor" @click="goPintPage(scope.row.tfId)">详情</div>
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
import { getTongFangList } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();
const keyword = ref('');
const dateVal = ref();

const page = ref(1);

const zuoListData = reactive({
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
//获取列表内容
async function getZuoListData() {
  loading.value = true;
  let r = await getTongFangList(params.value);
  // console.log('r', r);
  setTimeout(() => {
    loading.value = false;
    zuoListData.tableData = r.data;
    zuoListData.totalData = r.totalData;
  }, 500);
}

watch(page, () => {
  getZuoListData();
});

onMounted(() => {
  getZuoListData();
});

//路由到新增观测点
function goAddZuoPageFn() {
  router.push({
    path: `/examine-tongfang-add`,
  });
}
//路由到观测点详情 or 编辑观测点
function goPintPage(tfId: number) {
  router.push({
    path: `/examine-tongfang-detail/${tfId}`,
  });
}
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
</style>
