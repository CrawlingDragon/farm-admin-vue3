<template>
  <div class="vip-admin border bg-w pd40" v-loading="loading" element-loading-text="加载中...">
    <div class="head right-head soil-right-head">
      处方模板
      <el-tooltip class="box-item tab" effect="customized" content="" placement="right-start">
        <template #content
          >提前设置好用药和看诊结果，生成处方模板；<br />稍后在坐诊、巡诊、测土配方、网诊开处方可<br />以一键使用该模板。</template
        >
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>

      <el-button type="primary" class="add" @click="openTemplateDetail(0)">新增模板</el-button>
    </div>

    <div class="table-box">
      <el-table :data="templateListData.tableData" style="width: 100%">
        <el-table-column prop="title" label="处方名" />
        <el-table-column prop="yongyao" label="用药">
          <template #default="scope">
            {{ scope.row.yongyao }}
            <el-icon v-show="scope.row.showWarning !== 0" :size="25" color="#ff6600"
              ><Warning
            /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200px" />
        <el-table-column prop="status" label="操作" width="150px">
          <template #default="scope">
            <div class="flex">
              <div class="color cursor mr10" @click="delTemplate(scope.row.templateId)">删除</div>
              <div class="color cursor" @click="openTemplateDetail(scope.row.templateId)">详情</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="templateListData.totalData" v-model:page="page"></Pages>
    <ExamineTemplateAdd
      :templateId="activeTemplateId"
      v-model:showDialog="showDialogFlag"
      @addEditSuccess="getTemplateListData"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import { getTemplateListFetch, getTemplateDel } from '@/http';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import ExamineTemplateAdd from '@/components/examine-template-add.vue';
const router = useRouter();
const active = ref(0);
const page = ref(1);
const showDialogFlag = ref(false);
const activeTemplateId = ref(0);

const templateListData = reactive({
  totalData: 0,
  tableData: [],
});

const loading = ref(true);
// 获取模版列表内容
async function getTemplateListData() {
  loading.value = true;
  let r = await getTemplateListFetch(page.value);
  // console.log(r);
  setTimeout(() => {
    loading.value = false;
    templateListData.tableData = r.data;
    templateListData.totalData = r.totalData;
  }, 500);
}

watch(page, () => {
  getTemplateListData();
});

watch(active, () => {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getTemplateListData();
  }
});

onMounted(() => {
  getTemplateListData();
});

// 删除模版
const delTemplate = (templateId: number) => {
  ElMessageBox.confirm('确定删除这条处方模版？', '提示')
    .then(async (res) => {
      let r = await getTemplateDel(templateId);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        getTemplateListData();
      }
    })
    .catch((res) => {});
};
//打开模版详情
const openTemplateDetail = (templateId: number) => {
  // 判断是否超过20个模版，弹出提示
  if (templateListData.totalData == 20 && templateId == 0) {
    ElMessageBox.alert('最多创建20个模板,请先删除后添加', '提示', { confirmButtonText: '知道了' });
    return;
  }
  showDialogFlag.value = true;
  // console.log('showDialog.value', showDialogFlag.value);
  activeTemplateId.value = templateId;
};
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
</style>
