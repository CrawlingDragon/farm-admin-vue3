<template>
  <div class="serve-registration border bg-w pd40">
    <div class="head right-head soil-right-head">
      人才培训
      <el-button type="primary" class="add" @click="goPeoplePage()">新增培训</el-button>
    </div>
    <div class="input-bar">
      <el-input v-model="keyword" class="w200 m-2 mr20" size="large" placeholder='培训ID/培训主题' />
      <div class="date-box">
        <label class="mr10">培训开始日期</label>
        <el-date-picker style="width: 300px" v-model="dateVal" type="daterange" range-separator="-"
          start-placeholder="选择起始时间" end-placeholder="选择结束时间" size="large" class="mr10" value-format="YYYY-MM-DD" />
      </div>
      <div class="select-box mr10">
        <label class="mr10">状态</label>
        <el-select v-model="statuStatus" style="width: 100px" placeholder="Select" size="large">
          <el-option v-for="item in statuOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table :data="peopleData.tableData" style="width: 100%">
        <el-table-column header-align="center" align="center" prop="trainId" width="100" label="培训ID" />
        <el-table-column header-align="center" :show-overflow-tooltip="true" align="center" prop="title" label="培训主题" />
        <el-table-column header-align="center" align="center" prop="trainTeacher" width="100" label="主讲师" />
        <el-table-column header-align="center" :show-overflow-tooltip="true" align="center" prop="trainAddress"
          width="100" label="培训地点" />
        <el-table-column header-align="center" align="center" prop="startTime" width="200" label="培训开始时间" />
        <el-table-column header-align="center" align="center" prop="trainStatusTips" width="100" label="状态" />
        <el-table-column prop="status" header-align="center" align="center" width="150" label="操作">
          <template #default="scope">
            <div>
              <span class="cursor color del" @click="deleteExpert(scope.row.trainId)">删除</span>
              <span class="color cursor" @click="detailExpert(scope.row.trainId)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="peopleData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getTrainLists, getTrainDel } from '@/http';
import Pages from '@/components/pages.vue';
import { ElMessageBox, ElMessage } from 'element-plus';

const keyword = ref('');//关键词
const dateVal = ref();//时间
const statuStatus = ref(0);//状态
const page = ref(1);//状态
// 状态[0:全部 1:待培训 2:培训中 3:已结束]
const statuOptions = ref([
  { label: '全部', value: 0 },
  { label: '待培训', value: 1 },
  { label: '培训中', value: 2 },
  { label: '已结束', value: 3 },
]);
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
const peopleData = reactive({
  totalData: 0,
  tableData: []
})

const router = useRouter();
function goPeoplePage() {
  router.push({
    path: `/serve-people-add`,
    params: {},
  });
}
// 点击搜索按钮
function search() {
  page.value = 1;
  setTrainLists()
}
onMounted(() => {
  setTrainLists();
});
watch(page, () => {
  setTrainLists();
});
// 获取信息列表
async function setTrainLists() {
  let r = await getTrainLists(params.value)
  peopleData.tableData = r.data;
  peopleData.totalData = r.totalData;
}
// 删除
function deleteExpert(params: string) {
  ElMessageBox.confirm('确定删除该培训任务吗？', '删除提示').then(
    async () => {
      let r = await getTrainDel({ trainId: params })
      ElMessage({
        message: '已删除',
        type: 'success'
      })
      page.value = 1
      setTimeout(() => {
        setTrainLists()
      }, 1000);
    }
  )
}
// 详情
async function detailExpert(params: any) {
  router.push({
    path: `/serve-people-add`,
    query: { id: params },
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


  .add {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.input-bar {
  display: flex;
  justify-content: space-between;
}

.del {
  display: inline-block;
  margin-right: 15px;
}
</style>


