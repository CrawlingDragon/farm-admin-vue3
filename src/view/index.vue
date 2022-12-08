<template>
  <div class="index-container">
    <div class="top-bar">
      <div class="left">
        <div class="img-box">
          <el-image :src="info.logo" fit="cover" class="hospital-img" round> </el-image>
          <el-icon class="icon"><SuccessFilled /></el-icon>
        </div>
        <p class="name">{{ info.hospitalName }}</p>
        <router-link to="/hospital-info" class="detail">
          详细信息 <el-icon><ArrowRight /></el-icon>
        </router-link>
      </div>
      <div class="right-data">
        <p class="title">数据概况</p>
        <ul class="data-ul">
          <template v-for="item in dataTotal" :key="item.name">
            <li v-if="item.state === 1" @click="GoPage(item.label)">
              <div class="number">{{ item.value }}</div>
              <div class="small-title">{{ item.words }}</div>
              <div class="answer" v-if="item.label === 'expert'">待审核 {{ item.checkNum }}</div>
              <div class="answer" v-if="item.label === 'ask'">未回复 {{ item.noreply }}</div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="data-content">
      <div class="title">
        整体趋势
        <el-tooltip class="box-item" effect="dark" content="导出历史所有数据" placement="top">
          <div class="export" @click="exportData('all')"></div>
        </el-tooltip>
      </div>
      <div class="choose-bar">
        <div class="time-bar">
          <el-select
            v-model="selectValue"
            class="m-2"
            placeholder="Select"
            size="large"
            style="width: 130px"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="`导出${selectValue.label}`"
            placement="top"
          >
            <div class="export" @click="exportData(selectValue.value)"></div>
          </el-tooltip>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
            <template v-for="item in switchVal">
              <el-tab-pane
                :label="item.words"
                :name="item.label"
                v-if="item.state === 1"
              ></el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </div>
      <div class="line-echarts">
        <!-- line 折线 echarts -->
        <EchartLine :echartData="echartData" :kind="activeName" />
      </div>
      <div class="title2">数据明细</div>
      <div class="tables">
        <!-- table表格 ：数据明细 -->
        <el-table :data="tableData.tableData" border>
          <template v-for="(item, index) in tableData.title">
            <el-table-column :prop="keys[index]" :label="item" :width="index === 0 ? '120' : ''" />
          </template>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, computed, watch } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { getIndex, IndexParams, IndexData } from '../http/getIndex';
import { getExport } from '@/http';
import { getCustomRouterLink, indexRightBarRouter } from '@/router/router-list';
import { useRouter } from 'vue-router';
import EchartLine from '@/components/echart-line.vue';

const router = useRouter();

// 首页接口 请求的参数
const params: IndexParams = reactive({ token: '', dataType: 'newuser', timeType: 'week' });

//tables prop 的key数组
const keys = computed<any[]>(() => {
  let key: any[] = [];
  let arr = fetchData.tableData?.tableData[0] || [];
  for (let k in arr) {
    key.push(k);
  }
  return key;
});
const fetchData: IndexData = reactive({
  info: {},
  dataTotal: {},
  switchVal: {},
  dataType: '', //获取数据类型[newuser:新增会员 user:会员 cetu:测土配方 answer:网诊与回复 order:销售记录]
  timeType: '', //时间长度切换[week:近一周数据 month:近一个月数据 ]
  echartData: {},
  tableData: [], //数据明细，表格
  tempArray: {}, //暂时无用
  charArrayStr: '', //暂时无用
  replyArrayStr: '', //暂时无用
});

// 请求数据，且set data
const setIndexData = async () => {
  let result = await getIndex(params);
  // console.log('result', result);
  fetchData.info = result.info;
  fetchData.dataTotal = result.dataTotal;
  fetchData.switchVal = result.switch;
  fetchData.dataType = result.dataType;
  fetchData.timeType = result.timeType;
  fetchData.echartData = result.echartData;
  fetchData.tableData = result.tableData;
  fetchData.charArrayStr = result.charArrayStr;
  fetchData.replyArrayStr = result.replyArrayStr;
  fetchData.tempArray = result.tempArray;
  // console.log('result', fetchData.switchVal);
};

onMounted(async () => {
  setIndexData();
});

// 整体趋势 => 时间的 select 值
let selectValue = ref({
  value: 'week',
  label: '近一周数据',
});

// 整体趋势 => 时间的select 选择项
const selectOptions = [
  {
    value: 'week',
    label: '近一周数据',
  },
  {
    value: 'month',
    label: '近一月数据',
  },
];

watch(selectValue, (newVal: any) => {
  params.timeType = newVal;
  setIndexData();
});

const {
  info,
  dataTotal,
  switchVal,
  tempArray,
  dataType,
  echartData,
  tableData,
  charArrayStr,
  replyArrayStr,
} = toRefs(fetchData);

// 数据概况 栏目的导航
const GoPage = (label: string) => {
  let path = getCustomRouterLink(label, indexRightBarRouter);
  router.push({
    path,
  });
};

const activeName = ref('newuser');

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

// 导出数据
//时间长度切换[week:近一周数据 month:近一个月数据  all:全部数据]
async function exportData(timeType: string) {
  let url = await getExport({ timeType });
  // console.log('url', url);
  window.open(url.downLink, '_blank');
}
</script>
<style lang="scss" scoped>
.top-bar {
  height: 200px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  display: flex;
  .left {
    width: 306px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img-box {
      position: relative;
      width: 80px;
      height: 80px;

      .hospital-img {
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
        border-radius: 100%;
        border: 1px solid $border-color;
      }
      .icon {
        position: absolute;
        right: 3px;
        bottom: 0;
        font-size: 20px;
        color: $theme-color;
      }
    }

    .name {
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      margin: 20px 0 15px;
    }
    .detail {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      display: flex;
      align-items: center;
    }
  }
  .right-data {
    flex: 1;
    border-left: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    .title {
      height: 36px;
      line-height: 36px;
      padding-left: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .data-ul {
      border-top: 1px solid #e5e5e5;
      display: block;
      flex: 1;
      display: flex;
      li {
        flex: 1;
        max-width: 109px;
        padding: 0 5px;
        line-height: 1.1;
        height: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        padding-top: 25px;
        align-items: center;
        position: relative;
        border-right: 1px solid #e5e5e5;
        cursor: pointer;
        &:last-child {
          border: none;
        }
        &:hover {
          background: $theme-color;
          outline: 1px solid #e5e5e5;
          & > div {
            color: #fff;
          }
        }
        .number {
          color: $theme-color;
          font-size: 24px;
          margin-bottom: 25px;
        }
        .answer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 20px;
          text-align: center;
          font-size: 14px;
          font-weight: 400;
          color: $theme-color;
        }
      }
    }
  }
}
.data-content {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  width: 100%;
  margin-top: 20px;
  .title {
    height: 36px;
    padding-left: 20px;
    line-height: 36px;
    border-bottom: 1px solid #e5e5e5;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    position: relative;
    .export {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
      border-left: 1px solid #e5e5e5;
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: url('@/assets/log-out.png') no-repeat;
      background-position: 18px center;
      background-size: auto;
      cursor: pointer;
    }
  }
  .choose-bar {
    padding: 20px 20px 30px;
    display: flex;
    justify-content: space-between;
    .time-bar {
      display: flex;
      align-items: center;
      .export {
        background: url('@/assets/log-out.png') no-repeat;
        background-position: center;
        background-size: auto;
        cursor: pointer;
        width: 22px;
        height: 22px;
        margin-left: 15px;
      }
    }
    .tabs {
      :deep().el-tabs__header {
        overflow: hidden;
        border-radius: 4px;
      }
    }
  }
  .line-echarts {
    margin: 0 20px;
    height: 230px;
    border: 1px solid #e5e5e5;
    margin-bottom: 30px;
  }
  .title2 {
    border-top: 1px solid $border-color;
    padding: 0 20px;
    padding-top: 15px;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    width: 100%;
    overflow: hidden;
    clear: both;
  }
  .tables {
    width: 100%;
    overflow: hidden;
    padding: 20px;
    // display: none;
  }
}
</style>
