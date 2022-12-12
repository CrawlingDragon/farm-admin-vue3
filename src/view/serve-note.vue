<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      短信管理
      <el-tooltip class="box-item tab" effect="dark" content="" placement="right-start">
        <template #content> 将最新农资商品、培训、测土配方取报告等信息发短信给会员，会员会收到相应的手机短信。</template>
        <el-icon class="icon">
          <QuestionFilled />
        </el-icon>
      </el-tooltip>
      <el-button type="primary" class="add" @click="goNote">发短信</el-button>
    </div>
    <div class="input-bar">
      <div class="date-box">
        <label class="mr10">发送日期</label>
        <el-date-picker style="width: 400px" v-model="dateVal" type="datetimerange" range-separator="-"
          start-placeholder="选择起始时间" end-placeholder="选择结束时间" size="large" class="mr10"
          value-format="YYYY-MM-DD HH:mm:ss" />
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table :data="noteData.tableData" style="width: 100%">
        <el-table-column header-align="center" align="center" prop="sendTime" width="300" label="发送时间" />
        <el-table-column header-align="center" align="center" prop="content" width="300" :show-overflow-tooltip="true"
          label="内容" />
        <el-table-column header-align="center" align="center" prop="userCount" width="100" label="会员数" />
        <el-table-column header-align="center" align="center" prop="statusTips" class-name="status-tips" label="发送状态">
          <template #default="scope">
            <div>
              <span class="status-tips">{{ scope.row.statusTips }}</span>
            </div>
          </template>
        </el-table-column>>
        <el-table-column header-align="center" align="center" width="150" label="操作">
          <template #default="scope">
            <div>
              <span class="color cursor" @click="detailNote(scope.row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="noteData.totalData" v-model:page="page"></Pages>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import Pages from '@/components/pages.vue';
import { getNoteLists } from '@/http';

const dateVal = ref('')
const page = ref(1)
const router = useRouter()
const noteData = reactive({
  totalData: 0,
  tableData: []
})

function goNote() {
  router.push({
    path: '/serve-note-detail',
  })
}
const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    startTime,
    endTime,
    page: page.value,
    pageCount: 10,
  };
  return params;
});
// 搜索
async function search() {
  page.value = 1;
  setNoteLists()
}
watch(page, () => {
  setNoteLists()
})
// 获取信息列表
async function setNoteLists() {
  let r = await getNoteLists(params.value)
  noteData.totalData = r.totalData
  noteData.tableData = r.data
}
onMounted(() => {
  setNoteLists()
})
function detailNote(params: any) {
  router.push({
    path: '/serve-note-show',
    query: { id: params.smsId }
  })

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

.status-tips {
  color: $theme-three-color !important;
}
</style>

