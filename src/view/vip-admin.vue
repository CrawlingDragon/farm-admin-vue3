<template>
  <div class="vip-admin border bg-w pd40" v-loading="loading" element-loading-text="加载中...">
    <div class="head right-head">会员管理</div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr50"
        size="large"
        placeholder="会员手机号/姓名/身份证/会员ID"
      />
      <div class="date-box">
        <label class="mr10">加入时间</label>
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
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table empty-text="抱歉，没有找到相关会员" :data="vipAdminData.tableData" style="width: 100%">
        <el-table-column prop="imUserId" label="会员ID" />
        <el-table-column prop="userName" label="姓名" width="70px" />
        <el-table-column prop="tel" label="手机号码" width="150px" />
        <el-table-column prop="selfcard" label="身份证" />
        <el-table-column prop="address" label="所在地" />
        <el-table-column prop="zuowuName" label="种类名" />
        <el-table-column prop="joinTime" label="加入时间" />
        <el-table-column prop="recentlog" label="最近诊疗记录" />
        <el-table-column prop="do" label="操作" width="110">
          <template #default="scope">
            <div class="btn flex align-center">
              <!-- <div class="add mr10 color cursor"> -->
              <el-dropdown>
                <span class="el-dropdown-link add mr10 color cursor">
                  新增<el-icon><CaretBottom /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleCommand('soil', scope.row.id)" v-if="soil === 1"
                      >测土</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleCommand('zuozhen', scope.row.id)"
                      >坐诊</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleCommand('xunzhen', scope.row.id)"
                      >巡诊</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleCommand('point', scope.row.id)"
                      >观测点</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

              <div class="detail color cursor" @click="goPageDetail(scope.row.id)">详情</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="vipAdminData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import Pages from '@/components/pages.vue';
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getVipAdmin } from '../http/getVipAdmin';
import storage from 'good-storage';

let soil = storage.session.get('soil');

const route = useRoute();
const router = useRouter();
const loading = ref(true);

const keyword = ref('');
const dateVal = ref(''); //默认起始，结束时间，有数据后是 [起始时间,结束时间]
const page = ref(1);

function setRouteKeyword() {
  if (route.query.keyword == null) {
    return;
  }
  keyword.value = route.query.keyword as string;
}

// 监控网址的keyword 参数，如果改变，则修改搜索框的内容
watch(
  () => route.query.keyword,
  () => {
    setRouteKeyword();
    search();
  }
);

// 请求数据参数的 computed => 关键字，起始时间，结束时间，页码数，每页数量
const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = { keyword: keyword.value, startTime, endTime, page: page.value, pageCount: 10 };
  return params;
});

let vipAdminData = reactive({
  totalData: 0, // 所有数据数量
  totalPage: 0, // 所有的page数
  tableData: [], // 表格数据
});

// 请求会员管理接口
async function setVipAdminData() {
  loading.value = true;
  let result = await getVipAdmin(params.value);
  vipAdminData.totalData = result.totalData;
  vipAdminData.totalPage = result.totalPage;
  vipAdminData.tableData = result.data;
  loading.value = false;
}

// 搜索按钮函数
function search() {
  // 如果第一页，就直接请求数据
  if (page.value === 1) {
    setVipAdminData();
  } else {
    // 如果不是第一页，变成第一页，由watch page 请求数据
    page.value = 1;
  }
}

watch(page, () => {
  setVipAdminData();
});

onMounted(() => {
  setRouteKeyword();
  setVipAdminData();
});

function goPageDetail(id: number) {
  router.push({
    path: '/vip-detail',
    query: {
      id: id,
    },
  });
}

function handleCommand(command: string | number | object, uId: number) {
  router.push({
    path: `/examine-${command}-add`,
  });
}
</script>
<style lang="scss" scoped></style>
