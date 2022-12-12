<template>
  <div class="serve-registration border bg-w pd40">
    <div class="head right-head soil-right-head">
      已卖出的商品
    </div>
    <div class="input-bar">
      <el-input v-model="keyword" class="w300 m-2 mr20" size="large" placeholder='会员手机号/订单号/商品名/商品编码' />
      <div class="date-box">
        <label class="mr10">购买日期</label>
        <el-date-picker style="width: 300px" v-model="dateVal" type="daterange" range-separator="-"
          start-placeholder="选择起始时间" end-placeholder="选择结束时间" size="large" class="mr10" value-format="YYYY-MM-DD" />
      </div>
      <div class="select-box mr10">
        <label class="mr10">备注</label>
        <el-select v-model="statuStatus" style="width: 100px" placeholder="Select" size="large">
          <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <el-button size="large" @click="search">搜索</el-button>
      <el-tooltip class="box-item" effect="dark" content="导出购买数据" placement="top">
        <div class="export" @click="expertBuyData"></div>
      </el-tooltip>
    </div>
    <div class="table-box md20">
      <el-row class="table-header-row">
        <el-col :span="8">
          <div class="header-table">商品</div>
        </el-col>
        <el-col :span="2">
          <div class="header-table">单价</div>
        </el-col>
        <el-col :span="2">
          <div class="header-table">数量</div>
        </el-col>
        <el-col :span="3">
          <div class="header-table">买家</div>
        </el-col>
        <el-col :span="3">
          <div class="header-table">总价</div>
        </el-col>
        <el-col :span="3">
          <div class="header-table">支付方式</div>
        </el-col>
        <el-col :span="3">
          <div class="header-table">操作</div>
        </el-col>
      </el-row>
      <div class="commodityList" v-for="item in soldData.tableData" :key="item.orderId">
        <el-row>
          <el-col :span="24">
            <div class="table-cell-title">
              <span class="date">{{ item.orderTime }}</span>
              <span class="order">订单号：{{ item.orderSn }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="commodity-item table-item" v-for="list in item.productLists" :key="list.productCode">
              <el-row>
                <el-col :span="16">
                  <div class="commodity-list">
                    <div class="logo">
                      <img :src="list.productImg" alt="">
                    </div>
                    <div class="tips">
                      <div class="title-tips">{{ list.productName }}</div>
                      <div class="code-tips">商品编码：{{ list.productCode }}</div>
                      <div class="shop-tips">商品规格：{{ list.productSpec }}</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="price-item">{{ list.unitPrice }}</div>
                </el-col>
                <el-col :span="4">
                  <div class="number-item">{{ list.buyNum }}</div>
                </el-col>
              </el-row>
            </div>
            <div class="commodity-item table-item remark-item" v-if="item.remark">备注：{{ item.remark }}</div>
          </el-col>
          <el-col :span="3">
            <div class="buyer-item table-item">{{ item.username }}<br>{{ item.mobile }}</div>
          </el-col>
          <el-col :span="3">
            <div class="total-item table-item">{{ item.totalPrice }}</div>
          </el-col>
          <el-col :span="3">
            <div class="payment-item table-item">{{ item.payTypeTips }}</div>
          </el-col>
          <el-col :span="3">
            <div class="operation-item table-item" @click="goDetail(item.orderId)">详情</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <Pages :total="soldData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import {
  getOutCommodityList,
  getExportList,
} from '@/http';
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');//关键词
const dateVal = ref();//时间
const statuStatus = ref(0);//备注
const statuOptions = reactive([
  { label: '全部', value: 0 },
  { label: '无备注', value: 1 },
  { label: '有备注', value: 2 }
])
const page = ref(1);//当前页
const soldData = reactive({
  totalData: 0,
  tableData: [] as any
})
const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    keyword: keyword.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
    status: statuStatus.value,
  };
  return params;
});

// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    setOutCommodityList();
  }

}
// 获取商品列表
const setOutCommodityList = async () => {
  let r = await getOutCommodityList(params.value)
  soldData.tableData = r.data
  soldData.totalData = r.totalData
  // console.log(soldData.tableData)
}
// 导出数据接口参数
const expertParams = computed(() => {
  let starttime = !dateVal.value ? '' : dateVal.value[0];
  let endtime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    keyword: keyword.value,
    starttime,
    endtime,
    status: statuStatus.value,
  };
  return params;
});
// 导出购买数据
const expertBuyData = async () => {
  let r = await getExportList(expertParams.value)
  // console.log('r', r)
  window.open(r.downLink, '_blank');
}
// 跳转详情页
const goDetail = (id: string | number) => {
  router.push({
    path: '/goods-sold-detail',
    query: { id: id }
  })
}

watch(page, () => {
  setOutCommodityList()
})

onMounted(() => {
  setOutCommodityList();
});


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
  justify-content: space-between;

  .export {
    width: 60px;
    height: 30px;
    background: url('@/assets/log-out.png') no-repeat;
    background-position: 18px center;
    background-size: auto;
    cursor: pointer;
  }
}

.table-box {
  margin: 0 20px;

  .table-header-row {
    border: 1px solid $border-color;
    margin-bottom: 10px;
    height: 32px;
    line-height: 30px;

    .header-table {
      text-align: center;
      font-size: 12px;
      font-family: SimSun;
      font-weight: bold;
    }
  }

  .commodityList {
    width: 100%;
    border: 1px solid $border-color;
    margin-bottom: 10px;

    .table-cell-title {
      width: 100%;
      padding-left: 20px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      font-family: SimSun;
      font-weight: bold;
      background-color: rgba(89, 149, 36, 0.1);

      .order {
        font-weight: 400;
        margin-left: 25px;
      }
    }

    .table-item {
      text-align: center;
      font-weight: 400;
      font-family: Microsoft YaHe;
      font-size: 14px;
      line-height: 25px;
      padding: 30px 15px;
    }

    .total-item {
      font-weight: bold;
    }

    .operation-item {
      color: $theme-color;
      cursor: pointer;
    }

    .buyer-item {
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
      height: 100%;
    }

    .payment-item {
      border-left: 1px solid $border-color;
      border-right: 1px solid $border-color;
      height: 100%;
    }

    .commodity-item {
      width: 100%;
      border-bottom: 1px solid $border-color;
      padding-right: 0px;
      padding-left: 0px;

      .commodity-list {
        text-align: left;
        width: 100%;
        height: 70px;
        padding-left: 20px;

        .logo {
          display: inline-block;
          border: 1px solid $border-color;
          width: 70px;
          height: 70px;
          margin-right: 20px;
          vertical-align: top;

          img {
            object-fit: cover;
            width: 100%;
            height: 100%;
          }
        }

        .tips {
          display: inline-block;
          height: 70px;
          vertical-align: top;
          width: calc(100% - 90px);

          .title-tips {
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 25px;
            margin-bottom: 5px;
          }

          .code-tips {
            font-family: SimSun;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 20px;
          }

          .shop-tips {
            font-family: SimSun;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 20px;
          }
        }
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .remark-item {
      line-height: 35px;
      padding: 0;
      text-align: left;
      padding-left: 20px;
      font-size: 12px;
      font-family: SimSun;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }
  }

}
</style>



