<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      TV广告图设置
      <el-tooltip class="box-item tab" effect="dark" content="" placement="right-start">
        <template #content
          >最多添加6张电视机广告图，其中中农在线可添加3张，位置为前三个，庄稼医院可控制后三张。
          广告图区域见下图：</template
        >
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <el-button type="primary" class="add" @click="goAddAdPage">新增广告图</el-button>
    </div>
    <div class="table-box md20">
      <el-table :data="TVListData.tableData" style="margin: 20px; width: auto">
        <el-table-column prop="listorder" label="排序" />
        <el-table-column prop="userName" label="广告图" width="400px">
          <template #default="scope">
            <div class="image-box">
              <el-image :src="scope.row.images" fit="scale-down" class="img"></el-image>
              <p class="title">{{ scope.row.title }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="时间" />
        <el-table-column prop="status" label="操作">
          <template #default="scope">
            <div class="color cursor" @click="goTVAddEditPage(scope.row.adId)">详情</div>
            <!-- <div v-else class="color cursor" @click="goAddPointPageFn(scope.row.viewId)">编辑</div> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="TVListData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getTvListFetch, getExportZuoXunPDF } from '@/http';
import { useRouter } from 'vue-router';
import { start } from 'repl';
const router = useRouter();

const page = ref(1);

const TVListData = reactive({
  totalData: 0,
  tableData: [],
});

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
  console.log('r', r);
  TVListData.tableData = r.adLists;
  TVListData.totalData = r.adNum;
}

watch(page, () => {
  getTVListData();
});

onMounted(() => {
  getTVListData();
});

//路由到新增观测点
function goAddAdPage() {
  router.push({
    path: `/examine-TV-add`,
  });
}
//路由到观测点详情 or 编辑观测点
function goTVAddEditPage(adId: number) {
  router.push({
    path: `/examine-TV-add/${adId}`,
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
  align-items: start;
  .img {
    width: 170px;
    height: 84px;
    margin-right: 10px;
  }
  .title {
    flex: 1;
  }
}

:deep().el-table__header-wrapper {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
</style>
