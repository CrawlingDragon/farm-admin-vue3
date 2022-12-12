<template>
  <div class="border">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods-sold' }">已卖出的商品</el-breadcrumb-item>
        <el-breadcrumb-item>订单号：{{ detailData.orderSn }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="detail-title">
        <div class="title">订单详情</div>
        <div class="del" @click="setorderDelete">删除</div>
      </div>
      <div class="content-detail">
        <div class="top-title">
          <div class="buyTypeTips">
            <span class="label">购买方式：</span>
            <span class="value">{{ detailData.buyTypeTips }}</span>
          </div>
          <div class="orderSn">
            <span class="label">订单号：</span>
            <span class="value">{{ detailData.orderSn }}</span>
          </div>
          <div class="orderTime">
            <span class="label">购买时间：</span>
            <span class="value">{{ detailData.orderTime }}</span>
          </div>
        </div>
        <div class="table-box">
          <el-table
            :data="detailData.productLists"
            style="width: 100%"
            :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center', color: '#333' }"
          >
            <el-table-column width="400" label="商品">
              <template #default="scope">
                <div class="content">
                  <div class="logo">
                    <img :src="scope.row.productImg" alt="" />
                  </div>
                  <div class="tips">
                    <div class="title-tips">{{ scope.row.productName }}</div>
                    <div class="code-tips">商品编码：{{ scope.row.productCode }}</div>
                    <div class="shop-tips">商品规格：{{ scope.row.productSpec }}</div>
                  </div>
                </div>
              </template> </el-table-column
            >>
            <el-table-column prop="unitPrice" label="单价" />
            <el-table-column prop="buyNum" label="数量" />
            <el-table-column prop="totalPrice" label="金额" />
          </el-table>
        </div>
        <div class="top-title">
          <div class="totalNum">
            <span class="label">购买件数：</span>
            <span class="value">{{ detailData.totalNum }}</span>
          </div>
          <div class="payTypeTips">
            <span class="label">支付方式：</span>
            <span class="value">{{ detailData.payTypeTips }}</span>
          </div>
          <div class="totalPrice">
            <span class="label">总价：</span>
            <span class="value">￥{{ detailData.totalPrice }}</span>
          </div>
          <div class="username">
            <span class="label">买家：</span>
            <span class="value">{{ detailData.username }} {{ detailData.mobile }}</span>
          </div>
          <div class="remark">
            <span class="label">备注：</span>
            <span class="value"
              >{{ detailData.remark }}<br v-if="detailData.remark" /><span
                class="button"
                @click="editRemark"
                >编辑备注</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="remarkVisible" :title="'编辑' + detailData.username + '的订单备注'">
      <el-input
        v-model="remarkValue"
        :rows="5"
        maxlength="200"
        show-word-limit
        type="textarea"
        placeholder="请输入"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="makeSureEdit" type="primary">确定</el-button>
          <el-button @click="remarkVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getorderDetail, getorderDelete, getOrderRemarkEdit } from '@/http';
import { ElMessageBox, ElMessage } from 'element-plus';

const emit = defineEmits(['update:hideAside']);

const route = useRoute();
const router = useRouter();
const detailData = reactive<any>({
  buyTypeTips: '', //购买方式
  orderSn: '', //订单号
  orderTime: '', //订单时间
  productLists: <any>[], //商品列表
  totalNum: '', //购买件数
  totalPrice: '', //总价
  username: '', //买家名
  mobile: '', //买家联系方式
  payTypeTips: '', //支付方式
  remark: '', //备注
});
// 编辑弹窗
const remarkVisible = ref(false);
const remarkValue = ref('');

let id = computed(() => route.query.id);

onMounted(async () => {
  emit('update:hideAside', false);
  // 获取详情信息
  let r = await getorderDetail(id.value);
  detailData.buyTypeTips = r.buyTypeTips;
  detailData.orderSn = r.orderSn;
  detailData.orderTime = r.orderTime;
  detailData.productLists = r.productLists;
  detailData.totalNum = r.totalNum;
  detailData.totalPrice = r.totalPrice;
  detailData.username = r.username;
  detailData.mobile = r.mobile;
  detailData.payTypeTips = r.payTypeTips;
  detailData.remark = r.remark;
  remarkValue.value = r.remark;
  // console.log(r)
});

// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 去特定的路由
function goPage(path: string) {
  router.push({
    path,
  });
}

// 删除订单
function setorderDelete() {
  ElMessageBox.confirm('确定删除订单吗？', '删除提示')
    .then(async () => {
      let r = await getorderDelete(id.value);
      ElMessage({
        message: r instanceof Array ? '删除成功' : r.msg,
        type: 'success',
      });
      setTimeout(() => {
        goPage('/goods-sold');
      }, 1000);
    })
    .catch(() => {});
}
// 编辑备注 getOrderRemarkEdit
function editRemark() {
  remarkVisible.value = true;
}
// 编辑确定
async function makeSureEdit() {
  // console.log(remarkValue.value)
  // console.log(id.value)
  let params = {
    orderId: id.value,
    remark: remarkValue.value,
  };
  let r = await getOrderRemarkEdit(params);
  remarkVisible.value = false;
  // console.log('r', r)
  ElMessage({
    message: r instanceof Array ? '编辑成功' : r.msg,
    type: 'success',
  });
  setTimeout(() => {
    detailData.remark = remarkValue.value;
  }, 1000);
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid $border-color;
}

.content-box {
  background: #fff;

  .detail-title {
    width: 100%;
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid $border-color;

    .title {
      display: inline-block;
      font-weight: bold;
      font-size: 14px;
      color: #333;
      margin: 0 10px 0 20px;
    }

    .del {
      display: inline-block;
      font-size: 14px;
      cursor: pointer;
      color: $theme-color;
      padding-left: 10px;
    }
  }

  .content-detail {
    width: 100%;
    padding: 20px;

    .top-title {
      div {
        margin-bottom: 20px;
        font-family: 'SimSun', couriernew, courier, monospace;
        font-size: 14px;
        color: #333;

        .label {
          display: inline-block;
          width: 155px;
          text-align: right;
        }

        .value {
          display: inline-block;
          text-align: left;
          font-family: Microsoft YaHei;
        }
      }

      .totalPrice {
        .value {
          font-size: 18px;
          color: #ff6600;
          font-weight: bold;
        }
      }

      .remark {
        .value {
          width: calc(100% - 160px);
        }

        .label {
          vertical-align: top;
        }

        .button {
          color: $theme-color;
          font-family: SimSun;
          font-weight: 400;
          cursor: pointer;
        }
      }
    }

    .table-box {
      // padding-right: 100px;
      margin-bottom: 30px;

      .content {
        width: 400px;
        height: 90px;

        .logo {
          display: inline-block;
          border: 1px solid $border-color;
          width: 72px;
          height: 72px;
          margin-right: 30px;
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
          width: calc(100% - 110px);
          text-align: left;

          .title-tips {
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 25px;
            margin-bottom: 5px;
            font-size: 14px;
          }

          .code-tips {
            display: inline-block;
            font-family: SimSun;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 50px;
            font-size: 12px;
            margin-right: 5px;
          }

          .shop-tips {
            display: inline-block;
            font-family: SimSun;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 20px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
