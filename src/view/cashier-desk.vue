<template>
  <div class="content">
    <div class="border search">
      <div class="icon"></div>
      <!-- <el-input v-model="commodityCode" class="w300 m-2 mr20" size="large" placeholder="扫描/输入编码或输入商品名称" /> -->
      <el-select class="w300 m-2 mr20" size="large" v-model="commodityCode" @change="searchChange" filterable remote
        placeholder="扫描/输入编码或输入商品名称" :remote-method="setProductLists" :loading="searchLoading" no-data-text="暂无商品">
        <el-option v-for="item in tableDataOption" :key="item.specSn" :label="item.productName" :value="item">
        </el-option>
      </el-select>
      <el-button size="large" @click="search">确定</el-button>
      <div class="money">
        <span class="label">应付金额:</span>
        <span class="value">￥{{ totalPrice }}</span>
      </div>
    </div>
    <div class="central border">
      <div class="vip">
        <span class="label">请输入会员手机号码</span>
        <UserSelectVue ref="myUser" v-model:user="vipUid" :labelStr="'mobile'" />
      </div>
      <div class="vip-detail">
        <div class="card">会员卡号:{{ vipUser.vipNumber }}</div>
        <div class="name">会员姓名:{{ vipUser.userName }}</div>
        <div class="tell">手机号码:{{ vipUser.mobile }}</div>
      </div>
    </div>
    <div class="table-box border">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column header-align="center" align="center" prop="specSn" width="100" label="编码" />
        <el-table-column header-align="center" align="center" prop="productName" label="商品名称" />
        <el-table-column header-align="center" align="center" prop="unitPrice" width="100" label="单价" />
        <el-table-column header-align="center" align="center" prop="buyNum" width="200" label="数量">
          <template #default="scope">
            <div>
              <el-input-number v-model="scope.row.buyNum" :min="1" />
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="totalPrice" width="100" label="金额">
          <template #default="scope">
            <div>
              {{ calc(scope.row.buyNum, scope.row.unitPrice, '*') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" prop="productName" width="100" label="操作">
          <template #default="scope">
            <div>
              <span class="cursor color del" @click="deleteComm(scope.row.specSn)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="border settlement">
      <div class="left">
        <div class="money">
          <span class="label">应付金额:</span>
          <span class="value">￥{{ totalPrice }}</span>
        </div>
        <div class="input">
          <span class="label">实收金额:￥</span>
          <span><el-input class="w100" v-model="factMoney" @blur="watchMoney"></el-input></span>
        </div>
        <div class="give-change">
          <span class="label">找零:￥</span>
          <span class="value">{{ zoonMoney }}</span>
        </div>
        <div class="number">
          <span class="label">购买件数:</span>
          <span class="value">{{ totalNumber }}</span>
        </div>
      </div>
      <div class="right" @click="settlement">结算</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue';
import { getProductLists, getCashierOrder } from '@/http';
import UserSelectVue from '@/components/userSelect.vue';
import { calc, debounce } from '@/common/js/util';
import { ElMessage, ElMessageBox } from 'element-plus';

const emit = defineEmits(['update:hideAside']);
// 商品输入框关键字
const commodityCode = ref();
// 选中的会员的uid
const vipUid = ref();
const myUser = ref();
// 会员详细信息
let vipUser = ref({
  vipNumber: '',
  userName: '',
  mobile: '',
});
const tableData = ref([]) as any; // 列表信息
const tableDataOption = ref([]) as any; // 列表信息
const totalPrice = ref(0.0); // 总金额
const totalNumber = ref(0); // 总件数
let paramsJson = ref(); //结算参数
const factMoney = ref(); //实收金额
const zoonMoney = ref<any>(0.0); //找零
const searchLoading = ref<boolean>(false);

// 确定搜索
const search = () => {
  // setProductLists();
};
// 监听会员选择展示信息
watch(vipUid, (newVal) => {
  vipUser.value =
    myUser.value.options.userOptions.filter((item: any) => item.uid == newVal)[0] || {};
});
// 监听列表信息计算金额
watch(
  tableData,
  (newVal) => {
    // if (newVal.length == 0) return;
    let price: any = 0;
    let number = 0;
    let params: any = [];
    newVal.map((item: any) => {
      price = calc(price, calc(item.unitPrice, item.buyNum, '*'), '+');
      number = number + item.buyNum;
      params.push({ productId: item.productId, specSn: item.specSn, buyNum: item.buyNum });
    });
    totalPrice.value = price;
    totalNumber.value = number;
    paramsJson.value = JSON.stringify(params);
    watchMoney();
    // console.log('totalPrice', totalPrice.value)
    // console.log('totalNumber', totalNumber.value)
    // console.log('paramsJson', paramsJson.value)
  },
  { deep: true }
);
// 实收金额
const watchMoney = () => {
  if (factMoney.value >= totalPrice.value) {
    zoonMoney.value = calc(factMoney.value, totalPrice.value, '-');
  } else {
    zoonMoney.value = 0;
  }
};
// 结算
const settlement = debounce(() => {
  if (tableData.value.length != 0) {
    if (vipUid.value) {
      let params = {
        goodsJson: paramsJson.value,
        uid: vipUid.value,
      };
      setCashierOrder(params);
    } else {
      ElMessageBox.confirm('你还没有输入会员，请添加会员后再提交', '提示', {
        cancelButtonText: '继续提交',
        confirmButtonText: '添加会员',
        type: 'warning',
      })
        .then(() => {
          myUser.value.mySelect.focus();
        })
        .catch(() => {
          let params = {
            goodsJson: paramsJson.value,
            uid: vipUid.value,
          };
          setCashierOrder(params);
        });
    }
  } else {
    ElMessage({
      message: '请选择商品',
      type: 'warning',
      offset: 200,
      duration: 2000,
    });
  }
}, 1500);
// 结算方法
const setCashierOrder = async (params: any) => {
  let r = await getCashierOrder(params);
  // console.log('r', r)
  if (r.length == 0) {
    ElMessage({
      message: '已结算',
      type: 'success',
      duration: 1500,
    });
    cleanOut();
  } else {
    ElMessage.error({ message: r.msg, duration: 1500 });
  }
};
// 获取商品列表
async function setProductLists(query: string) {
  if (query) {
    searchLoading.value = true;
    tableDataOption.value = await getProductLists({ keyword: query });
    searchLoading.value = false;
  }
}
// 删除
const deleteComm = (value: any) => {
  tableData.value.forEach((item: any, index: any) => {
    if (item.specSn == value) {
      tableData.value.splice(index, 1);
    }
  });
};
// 选中
const searchChange = () => {
  // tableData.value.push(commodityCode.value)
  tableData.value = duplicateRemoval([].concat(...tableData.value, commodityCode.value), 'specSn');
  commodityCode.value = '';
};
// 数组根据元素某个属性查重
function duplicateRemoval(tempArr: any, key: string) {
  let newArr = [];
  for (let i = 0; i < tempArr.length; i++) {
    if (newArr.indexOf(tempArr[i][key]) == -1) {
      newArr.push(tempArr[i][key]);
    } else {
      tempArr[newArr.indexOf(tempArr[i][key])].buyNum++;
      tempArr.splice(i, 1);
      i--;
    }
  }
  return tempArr;
}
// 清空函数
const cleanOut = () => {
  vipUid.value = null;
  vipUser.value = {
    vipNumber: '',
    userName: '',
    mobile: '',
  };
  tableData.value = [];
  tableDataOption.value = [];
  totalPrice.value = 0.0;
  zoonMoney.value = 0.0;
  totalNumber.value = 0;
  paramsJson.value = null;
  factMoney.value = '';
  searchLoading.value = false;
};
onMounted(async () => {
  emit('update:hideAside', false);
});
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  min-height: 100%;
  position: relative;

  .search {
    height: 76px;
    line-height: 76px;
    position: relative;

    .icon {
      display: inline-block;
      width: 25px;
      height: 25px;
      margin: 0 20px 0 30px;
      background: url(@/assets/code.png) no-repeat center 100%;
      cursor: pointer;
      vertical-align: middle;
    }

    .money {
      position: absolute;
      display: inline-block;
      right: 20px;

      .value {
        color: #ff6600;
        font-size: 20px;
        font-weight: 700;
        vertical-align: middle;
      }
    }
  }

  .central {
    height: 76px;
    line-height: 76px;
    border-bottom: none;
    border-top: none;
    display: flex;

    .vip {
      padding-right: 50px;

      .label {
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin: 0 10px 0 20px;
        color: #333333;
      }
    }

    .vip-detail {
      width: calc(100% - 510px);
      display: flex;
      justify-content: space-between;

      div {
        width: 33%;
        overflow: hidden;
      }
    }
  }

  .table-box {
    border-bottom: none;
  }

  .settlement {
    width: 100%;
    height: 76px;
    line-height: 76px;
    position: absolute;
    bottom: 0px;

    .left {
      display: flex;
      width: calc(100% - 450px);
      justify-content: space-between;
      padding-left: 20px;

      div {
        width: 25%;
        font-size: 14px;
        vertical-align: middle;
      }

      .el-input {
        width: 60px;
      }

      .money {
        .value {
          color: #ff6600;
          font-size: 20px;
          font-weight: 700;
          vertical-align: middle;
        }
      }
    }

    .right {
      position: absolute;
      right: 20px;
      bottom: 17px;
      width: 160px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background: #599524;
      color: #ffffff;
      border-radius: 4px 4px 4px 4px;
      margin-right: 0;
      cursor: pointer;
    }
  }
}
</style>
