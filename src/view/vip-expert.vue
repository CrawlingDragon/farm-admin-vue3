<template>
  <div class="vip-apply border bg-w pd60">
    <div class="head right-head">专家管理</div>
    <div class="table-box">
      <el-table :data="expertData.tableData" style="width: 100%">
        <el-table-column prop="avatar" label="头像" width="80">
          <template #default="scope">
            <el-image class="avatar" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="姓名" />
        <el-table-column prop="mobile" label="手机号码" />
        <el-table-column prop="company" label="单位" />
        <el-table-column prop="zuowu" label="擅长种类" />
        <el-table-column prop="addtime" label="加入时间" />
        <el-table-column prop="do" label="操作">
          <template #default="scope">
            <div class="btn">
              <div @click="deleteExpert(scope.row.expertId, scope.row.realname)" class="mr10">
                删除
              </div>
              <div @click="editExpert(scope.row.expertId)">编辑</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="expertData.totalData" v-model:page="page"></Pages>
  </div>
</template>
<script setup lang="ts">
import Pages from '@/components/pages.vue';
import { reactive, ref, onMounted } from 'vue';
import { getExpertList, getExpertDelete } from '@/http';
import { ElMessageBox, ElMessage } from 'element-plus';
import { Message } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const expertData = reactive({
  tableData: [],
  totalData: 0,
});
const page = ref(1);
// 删除专家函数
function deleteExpert(id: number, name: string) {
  ElMessageBox.confirm(`确定删除该专家${name}？`, '提示')
    .then(async () => {
      let r = await getExpertDelete({ expertId: id });
      if (r.code) {
        Message.error(r.msg);
        return;
      } else {
        ElMessage.success({ message: '已删除', duration: 1500 });
      }
      setExpertListData();
    })
    .catch(() => {
      // catch error
    });
}
//编辑专家函数
function editExpert(expertId: string) {
  router.push({
    path: `/vip-expert-edit/${expertId}`,
    // params: { expertId },
  });
}

async function setExpertListData() {
  let r = await getExpertList({ page: page.value });
  expertData.tableData = r.data;
  expertData.totalData = r.totalData;
  // console.log('r', r);
}
onMounted(() => {
  setExpertListData();
});
</script>
<style lang="scss" scoped>
.btn {
  display: flex;
  color: $theme-color;
  & > div {
    cursor: pointer;
  }
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>
