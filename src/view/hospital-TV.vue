<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      TV广告图设置
      <el-tooltip class="box-item tab" effect="customized" content="" placement="right-start">
        <template #content>
          <h3>
            最多添加6张电视机广告图，其中中农在线可添加3张，<br />位置为前三个，庄稼医院可控制后三张。
          </h3>
          <div class="p1">广告图区域见下图：</div>
          <el-image :src="TvTipImg" fit="cover" class="TvTipImg"></el-image>
        </template>
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <el-button :type="addBUtton" :disabled="addBUtton == 'info'" class="add" @click="goAddAdPage"
        >新增广告图</el-button
      >
    </div>
    <div class="table-box">
      <el-table :data="TVListData.tableData" :header-cell-style="{ color: '#000' }">
        <el-table-column prop="listorder" label="排序" width="110px" />
        <el-table-column prop="userName" label="广告图">
          <template #default="scope">
            <div class="image-box">
              <el-image :src="scope.row.images" fit="fill" class="img"></el-image>
              <p class="title">{{ scope.row.title }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="时间" width="210px" />
        <el-table-column prop="status" label="操作" width="110px">
          <template #default="scope">
            <div class="flex">
              <div class="color cursor mr20" @click="goTVAddEditPage(scope.row.adId)">编辑</div>
              <div class="color cursor" @click="delTVFn(scope.row.adId)">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="TVListData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getTvListFetch, getTvDel } from '@/http';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import TvTipImg from '@/assets/tv-tip-img.png';
const router = useRouter();

const page = ref(1);

const TVListData = reactive({
  totalData: 0,
  tableData: [],
});
const addBUtton = ref<any>('primary');
// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getTVListData();
  }
}
async function getTVListData() {
  let r = await getTvListFetch();
  // console.log('r', r);
  TVListData.tableData = r.adLists;
  TVListData.totalData = r.adNum;
  if (r.adNum == 3) {
    addBUtton.value = 'info';
  } else {
    addBUtton.value = 'primary';
  }
}

const delTVFn = (adId: number) => {
  ElMessageBox.confirm('确定删除该广告图', '删除提示')
    .then(async (res) => {
      let r = await getTvDel(adId);
      if (r.code) {
        ElMessage.error({ message: r.msg, duration: 1500 });
      } else {
        ElMessage.success({ message: '已删除', duration: 1500 });
        getTVListData();
      }
    })
    .catch((e) => {});
};

watch(page, () => {
  getTVListData();
});

onMounted(() => {
  getTVListData();
});

//路由到新增观测点
function goAddAdPage() {
  router.push({
    path: `/set/hospital-TV-add`,
  });
}
//路由到观测点详情 or 编辑观测点
function goTVAddEditPage(adId: number) {
  router.push({
    path: `/set/hospital-TV-add/${adId}`,
  });
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
.image-box {
  display: flex;
  align-items: center;
  .img {
    width: 170px;
    height: 84px;
    margin-right: 10px;
  }
  .title {
    flex: 1;
  }
}
.p1 {
  font-size: 14px;
  // color: #333;
  line-height: 40px;
}
.TvTipImg {
  display: block;
  width: 348px;
  height: 195px;
  margin-bottom: 10px;
}
</style>
