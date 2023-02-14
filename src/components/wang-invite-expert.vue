<template>
  <el-dialog v-model="inviteShowFlag" title="邀请专家回答" width="60%" @close="handleClose">
    <div class="invite-box">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="avatar" label="头像" width="80px">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" :size="50"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="姓名" width="80px" />
        <el-table-column prop="company" label="所属企业/单位" />
        <el-table-column prop="zuowu" label="擅长领域" width="120px" />
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getWangExpertAnswer, getExpertList } from '@/http';
import { ElMessage } from 'element-plus';
const props = defineProps({
  inviteShowFlag: {
    type: Boolean,
    default: false,
  },
  //选中问题id
  questionIds: {
    type: Array,
    default: function () {
      return [];
    },
  },
});
const emits = defineEmits(['update:inviteShowFlag']);
const handleClose = () => {
  // console.log('11', 11);
  emits('update:inviteShowFlag', false);
};

//选中数据的列表
const multipleSelection = ref<any[]>([]);
//选中函数
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
  console.log('val', val);
};

//table数据
const tableData = ref([]);

//专家id filter函数
const filterId = (arr: any[], key: string) => {
  let result: any = [];
  arr.forEach((item: any) => {
    result.push(item[key]);
  });
  return result.join(',');
};

//提交问题参数 computed
const submitExpertParams = computed(() => {
  let params = {
    questionIds: props.questionIds.join(','),
    expertIds: filterId(multipleSelection.value, 'expertId'),
  };
  return params;
});

//提交按钮函数
const confirm = async () => {
  let r = await getWangExpertAnswer(submitExpertParams.value as any);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('提交成功');
    emits('update:inviteShowFlag', false);
  }
};
//dialog 关闭函数
const cancel = () => {
  emits('update:inviteShowFlag', false);
};
onMounted(() => {
  getExpertListData();
});

//请求专家列表函数
const getExpertListData = async () => {
  let r = await getExpertList({ page: 1, pageCount: 100 });
  tableData.value = r.data;
  // console.log('expert-list', r);
};
</script>
<style lang="scss" scoped></style>
