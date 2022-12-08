<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      信息管理
      <el-button type="primary" icon="Plus" class="add" @click="goLink('/serve-message-add')">发布信息</el-button>
    </div>
    <div class="table-box md20">
      <el-table :data="messageData.tableData" style="width: 100%">
        <el-table-column header-align="center" align="center" prop="newId" width="100" label="ID" />
        <el-table-column header-align="center" align="center" prop="title" :show-overflow-tooltip="true" label="标题" />
        <el-table-column header-align="center" align="center" prop="addTime" width="150" label="添加时间" />
        <el-table-column header-align="center" align="center" width="200" label="操作">
          <template #default="scope">
            <div>
              <span class="color cursor del" @click="deleteMsg(scope.row)">
                删除
              </span>
              <span class="color cursor" @click="goLink('/serve-message-add', scope.row.newId)">
                编辑
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="messageData.totalData" v-model:page="page"></Pages>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
import Pages from '@/components/pages.vue';
import { getMessageLists, getMessageDelete } from '@/http';
import { ElMessageBox, ElMessage } from 'element-plus';

const page = ref(1)
const router = useRouter()
const messageData = reactive({
  totalData: 0,
  tableData: []
})

function goLink(params: string, id?: string | number) {
  router.push({
    path: params,
    query: { id: id }
  })
}
const params = computed(() => {
  let params = {
    page: page.value,
    pageCount: 10,
  };
  return params;
});
watch(page, () => {
  setMessageLists()
})
// 获取信息列表
async function setMessageLists() {
  let r = await getMessageLists(params.value)
  messageData.totalData = r.totalData
  messageData.tableData = r.data
}
onMounted(() => {
  setMessageLists()
})
function deleteMsg(params: any) {
  ElMessageBox.confirm(`确定删除${params.title}吗？`, '删除提示').then(
    async () => {
      let r = await getMessageDelete({ newId: params.newId })
      ElMessage({
        message: r instanceof Array ? '删除成功' : r.msg,
        type: 'success',
      });
      page.value = 1
      setMessageLists()
    }
  ).catch(() => {

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

  .add {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.cursor {
  :deep(.el-icon) {
    vertical-align: middle;
  }
}

.color-check {
  color: $theme-color;

  :deep(.el-icon) {
    vertical-align: middle;
  }
}

.del {
  display: inline-block;
  margin-right: 15px;
}
</style>

