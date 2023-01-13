<template>
  <div>
    <div
      class="apply-content border bg-w pd40"
      v-loading="loading"
      element-loading-text="加载中..."
    >
      <div class="head right-head">审核会员申请</div>
      <div class="input-bar">
        <el-input
          v-model="keyword"
          class="w300 m-2 mr20"
          size="large"
          placeholder="用户姓名/手机号"
        />
        <div class="date-box">
          <label class="mr10">申请时间</label>
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
          <el-select v-model="vipActive" class="w100" placeholder="Select" size="large">
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
        <el-table :data="vipApplyData.tableData" style="width: 100%">
          <!-- 姓名	手机号码	详细地址	种养种类	申请时间	状态	操作 -->
          <el-table-column prop="userName" label="姓名" />
          <el-table-column prop="tel" label="手机号码" />
          <el-table-column prop="address" label="详细地址" />
          <el-table-column prop="zuowuName" label="种养种类" />
          <el-table-column prop="applyTime" label="申请时间" />
          <el-table-column prop="statusTips" label="状态" width="100">
            <template #default="scope">
              <div :class="{ red: scope.row.statusTips === '待审核' }">
                {{ scope.row.statusTips }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <div
                class="color cursor"
                @click="doOperation(scope.row.statusTips, scope.row.detail)"
              >
                {{ operation(scope.row.statusTips) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pages :total="vipApplyData.totalData" v-model:page="page">
        <!-- <el-pagination
          background
          layout="prev, pager, next"
          :total="vipApplyData.totalData"
          class="mt-4"
          v-model:current-page="page"
        /> -->
      </Pages>
    </div>
    <el-dialog v-model="dialogVisible" title="Shipping address">
      <template #header="{ close, titleId, titleClass }">
        <div>
          审核会员申请
          <span class="red ml20" v-show="dialogVal.isFarAway === 1">地里位置离医院较远</span>
        </div>
      </template>
      <ul class="dialog-ul">
        <li>
          <span class="left">姓名:</span>
          <span class="text">{{ dialogVal.userName }}</span>
        </li>
        <li>
          <span class="left">手机:</span>
          <span class="text">{{ dialogVal.tel }}</span>
        </li>
        <li>
          <span class="left">身份证:</span>
          <span class="text">{{ dialogVal.selfcard }}</span>
        </li>
        <li>
          <span class="left">性别:</span>
          <span class="text">{{ dialogVal.sex }}</span>
        </li>
        <li>
          <span class="left">详细地址:</span>
          <span class="text">{{ dialogVal.address }}</span>
        </li>
        <li>
          <span class="left">种类情况:</span>
          <div class="kind">
            <div v-for="item in dialogVal.zuowuArr">{{ item.name }}（{{ item.mushu }}）</div>
          </div>
        </li>
        <li>
          <span class="left">申请时间:</span>
          <span class="text">{{ dialogVal.applyTime }}</span>
        </li>
      </ul>
      <template #footer>
        <span class="dialog-footer">
          <div class="title">是否通过会员申请？</div>
          <el-button type="primary" @click="passApplyFn">通过</el-button>
          <el-button @click="noPassApplyFn">拒绝</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogDetailVisible" title="Shipping address">
      <template #header="{ close, titleId, titleClass }">
        <div>会员申请详情</div>
      </template>
      <ul class="dialog-ul">
        <li>
          <span class="left">姓名:</span>
          <span class="text">{{ dialogVal.userName }}</span>
        </li>
        <li>
          <span class="left">手机:</span>
          <span class="text">{{ dialogVal.tel }}</span>
        </li>
        <li>
          <span class="left">身份证:</span>
          <span class="text">{{ dialogVal.selfcard }}</span>
        </li>
        <li>
          <span class="left">性别:</span>
          <span class="text">{{ dialogVal.sex }}</span>
        </li>
        <li>
          <span class="left">详细地址:</span>
          <span class="text">{{ dialogVal.address }}</span>
        </li>
        <li>
          <span class="left">种类情况:</span>
          <div class="kind md10 mt10">
            <div v-for="item in dialogVal.zuowuArr">{{ item.name }}（{{ item.mushu }}）</div>
          </div>
        </li>
        <li>
          <span class="left">申请时间:</span>
          <span class="text">{{ dialogVal.applyTime }}</span>
        </li>
        <li>
          <span class="left">拒绝时间:</span>
          <span class="text">{{ dialogVal.examineTime }}</span>
        </li>
        <li>
          <span class="left">拒绝理由:</span>
          <span class="text">{{ dialogVal.reason || '无' }}</span>
        </li>
      </ul>
      <template #footer>
        <span class="dialog-footer">
          <div :class="dialogVal.statusTips === '已通过' ? 'color' : 'red'">
            {{ dialogVal.statusTips }}
          </div>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogFormVisible"
      :title="`请填写拒绝${activeVipName}会员申请的理由`"
      style="width: 400px"
    >
      <el-form>
        <el-form-item>
          <el-input
            v-model="refusedVal"
            autocomplete="off"
            type="textarea"
            class="w300"
            show-word-limit
            maxlength="30"
            :rows="4"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="refused">确定拒绝</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import Pages from '@/components/pages.vue';
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { getVipApply, getVipApplyAction } from '../http';
import { ElMessage } from 'element-plus';

const keyword = ref('');
const dateVal = ref(''); //默认起始，结束时间，有数据后是 [起始时间,结束时间]
const vipActive = ref({ value: 0, label: '全部' });
const page = ref(1);
const options = [
  { value: 0, label: '全部' },
  { value: 1, label: '待审核' },
  { value: 2, label: '已通过' },
  { value: 99, label: '已拒绝' },
];
const vipApplyData = reactive({
  tableData: [],
  totalData: 0,
  totalPage: 0,
});

const dialogVisible = ref(false);
const dialogDetailVisible = ref(false);
const dialogFormVisible = ref(false);

const activeVipName = ref(''); //选中的会员名字
const refusedVal = ref(''); // 拒绝理由

const param = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    keyword: keyword.value,
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
    status: vipActive.value.value,
  };
  return params;
});

// 操作文案
const operation = computed(() => (active: string) => {
  return active === '待审核' ? '审核' : '详情';
});
const loading = ref(true);
// 请求列表数据
async function setApplyData() {
  loading.value = true;
  let r = await getVipApply(param.value);
  vipApplyData.tableData = r.data;
  vipApplyData.totalData = r.totalData;
  vipApplyData.totalPage = r.totalPage;
  loading.value = false;
}

// 搜索按钮函数
function search() {
  // 如果第一页，就直接请求数据
  if (page.value === 1) {
    setApplyData();
  } else {
    page.value = 1;
  }
}

// 弹窗内容
const dialogVal = ref<any>('');
//表格内的操作按钮 ，审核 或者 详情
function doOperation(status: string, detail: any) {
  console.log('detail', detail);
  activeVipName.value = detail.userName; //选中的会员名字
  dialogVal.value = detail;
  if (status === '已通过' || status === '已拒绝') {
    dialogDetailVisible.value = true;
  } else {
    dialogVisible.value = true;
  }
}

// 通过申请
async function passApplyFn() {
  let r = await getVipApplyAction({ applyId: dialogVal.value.applyId, status: 99 });
  if (!r.code) {
    setApplyData();
  } else {
    ElMessage.error(r.msg);
  }
}
//拒绝申请
function noPassApplyFn() {
  dialogFormVisible.value = true;
  dialogVisible.value = false;
}
// 拒绝理由的函数
async function refused() {
  let r = await getVipApplyAction({
    applyId: dialogVal.value.applyId,
    status: 1,
    reason: refusedVal.value,
  });
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    setApplyData();
    ElMessage.success('已拒绝');
  }
  dialogFormVisible.value = false;
}
// watch page变化
watch(page, () => {
  setApplyData();
});

onMounted(() => {
  setApplyData();
});
</script>
<style lang="scss" scoped>
.red {
  color: red;
}
.dialog-ul {
  li {
    margin-bottom: 5px;
    .left {
      color: #999;
      margin-right: 5px;
    }
    .text {
      color: #333;
    }
  }
}
.dialog-footer {
  position: relative;
  width: 100%;
  display: block;

  .title {
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
    color: #333;
  }
}
</style>
