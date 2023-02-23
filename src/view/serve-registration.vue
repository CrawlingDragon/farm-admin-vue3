<template>
  <div class="serve-registration border bg-w pd40">
    <div class="head right-head soil-right-head">
      <div class="tab" :class="{ active: active == 0 }" @click="choose(0)">挂号记录</div>
      <div class="tab" :class="{ active: active == 1 }" @click="choose(1)">专家排班</div>
      <el-button v-if="active == 1" type="primary" class="add" @click="goSoilPage()"
        >新增专家排班</el-button
      >
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w200 m-2 mr20"
        size="large"
        :placeholder="keywordPlaceholder"
      />
      <div class="date-box">
        <label class="mr10">{{ dateValLabel }}</label>
        <el-date-picker
          style="width: 250px"
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
        <label class="mr10">全部时段</label>
        <el-select v-model="timeStatus" style="width: 130px" placeholder="Select" size="large">
          <el-option
            v-for="item in timeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="select-box mr10">
        <label class="mr10">状态</label>
        <el-select v-model="statuStatus" style="width: 100px" placeholder="Select" size="large">
          <el-option
            v-for="item in statuOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="table-box" v-if="active == 0">
      <el-table :data="soilData.tableData" style="width: 100%">
        <el-table-column
          width="180"
          header-align="center"
          align="center"
          prop="orderSn"
          label="挂号单号"
        />
        <el-table-column header-align="center" align="center" prop="username" label="会员" />
        <el-table-column
          header-align="center"
          align="center"
          prop="visitTimeTips"
          width="200"
          label="就诊时间"
        />
        <el-table-column header-align="center" align="center" prop="number" label="号码" />
        <el-table-column header-align="center" align="center" prop="expertName" label="专家" />
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          prop="registerTime"
          label="挂号时间"
        />
        <el-table-column header-align="center" align="center" prop="statusTips" label="状态" />
        <el-table-column header-align="center" align="center" prop="status" label="操作">
          <template #default="scope">
            <div class="color cursor" @click="goDetail(scope.row.subId)">详情</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-box" v-if="active == 1">
      <el-table :data="soilData.tableData" style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          prop="outpatientTime"
          width="250"
          label="门诊时间"
        />
        <el-table-column header-align="center" align="center" prop="repeat" label="是否重复" />
        <el-table-column
          header-align="center"
          align="center"
          prop="expertName"
          width="200"
          label="专家"
        />
        <el-table-column
          header-align="center"
          align="center"
          prop="addTime"
          width="250"
          label="添加时间"
        />
        <el-table-column header-align="center" align="center" prop="statusTips" label="状态" />
        <el-table-column
          prop="status"
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template #default="scope">
            <div>
              <span class="cursor color del" @click="deleteExpert(scope.row.schId)">删除</span>
              <span class="color cursor" @click="detailExpert(scope.row)">详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pages :total="soilData.totalData" v-model:page="page"></Pages>
    <el-dialog v-model="dialogFormVisible" :title="expertTitle">
      <el-form ref="ruleFormRef" label-width="118px" :rules="rules" size="large" :model="ruleForm">
        <el-form-item label="门诊日期:" prop="outpatientTime">
          <el-date-picker
            :disabled-date="disabledDate"
            :clearable="false"
            value-format="YYYY-MM-DD"
            v-model="ruleForm.outpatientTime"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>
        <el-form-item label="时段:" prop="apm">
          <el-select v-model="ruleForm.apm" class="m-2" placeholder="请选择时段" size="default">
            <el-option label="上午" value="1" />
            <el-option label="下午" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="每周重复:" prop="isRepeat">
          <el-radio-group v-model="ruleForm.isRepeat" class="ml-4">
            <el-radio label="1" size="large">是</el-radio>
            <el-radio label="0" size="large">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="专家:" prop="expertId">
          <ExpertSelect v-model:expert="ruleForm.expertId"></ExpertSelect>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="ruleForm.status" class="ml-4">
            <el-radio label="1" size="large">启用</el-radio>
            <el-radio label="2" size="large">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="添加时间:" v-if="expertAddtime">
          <div>
            {{ expertAddtime }}
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="makeSureEdit(ruleFormRef)" type="primary">保存</el-button>
          <el-button @click="dialogFormVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogDetailVisible" title="排班详情">
      <dic class="content-detail">
        <div class="list">
          <div class="label">时间：</div>
          <div class="content">{{ detailData.outpatientTime }}</div>
        </div>
        <div class="list">
          <div class="label">每周重复：</div>
          <div class="content">{{ detailData.repeat }}</div>
        </div>
        <div class="list">
          <div class="label">专家：</div>
          <div class="content">{{ detailData.expertName }}</div>
        </div>
        <div class="list">
          <div class="label">状态：</div>
          <div class="content">{{ detailData.statusTips }}</div>
        </div>
        <div class="list">
          <div class="label">添加时间：</div>
          <div class="content">{{ detailData.addTime }}</div>
        </div>
      </dic>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteExpert(detailData.schId)" type="danger">删除</el-button>
          <el-button @click="dialogDetailVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Pages from '@/components/pages.vue';
import {
  getSubscribeLists,
  getExpertSchedulLists,
  getExpertSchedulDel,
  getExpertSchedulDetail,
  getAddExpert,
} from '@/http';
import { ElMessageBox, ElMessage } from 'element-plus';
import ExpertSelect from '@/components/expertSelect.vue';
import type { FormInstance, FormRules } from 'element-plus';

const active = ref(0);
const keywordPlaceholder = ref('挂号单号/会员姓名/专家姓名');
const dateValLabel = ref('就诊日期');

const keyword = ref('');
const dateVal = ref();
const timeOptions = ref([
  { label: '全部时段', value: 0 },
  { label: '上午', value: 1 },
  { label: '下午', value: 2 },
]);
const timeStatus = ref(0);
const statuOptions = ref([
  { label: '全部', value: 0 },
  { label: '已就诊', value: 1 },
  { label: '待就诊', value: 2 },
  { label: '已过期', value: 3 },
]);
const statuStatus = ref(0);
const page = ref(1);
const soilData = reactive({
  totalData: 0,
  tableData: [],
});
//自定义弹窗的显示
const dialogFormVisible = ref(false);
const dialogDetailVisible = ref(false);
// 专家排班详情信息
const detailData = reactive({
  outpatientTime: '', //时间
  repeat: '', //每周重复
  expertName: '', //专家
  statusTips: '', //状态
  addTime: '', //添加时间
  schId: '', //id
});

// 专家排班编辑信息
const rules = reactive<FormRules>({
  outpatientTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
  apm: [{ required: true, message: '请选择时段', trigger: 'blur' }],
  isRepeat: [{ required: true, message: '请选择是否重复', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  expertId: [{ required: true, message: '请选择专家', trigger: 'blur' }],
});
let ruleForm = reactive({
  outpatientTime: '', //时间
  apm: '', //时段
  isRepeat: '', //重复是否
  status: '', //状态
  expertId: '' as any, //专家
  schId: '', //排班ID,为空则表示新增
});
const expertTitle = ref<string>();
const expertAddtime = ref('');
const ruleFormRef = ref<FormInstance>();

// 点击tab切换
function choose(activeVal: number) {
  active.value = activeVal;
}
watch(active, (newVal, oldVal) => {
  timeStatus.value = 0;
  statuStatus.value = 0;
  keyword.value = '';
  dateVal.value = null;
  page.value = 1;
  if (newVal == 0) {
    keywordPlaceholder.value = '挂号单号/会员姓名/专家姓名';
    dateValLabel.value = '就诊日期';
    statuOptions.value = [
      { label: '全部', value: 0 },
      { label: '已就诊', value: 1 },
      { label: '待就诊', value: 2 },
      { label: '已过期', value: 3 },
    ];
    setSubscribeLists();
  } else {
    keywordPlaceholder.value = '专家姓名';
    dateValLabel.value = '门诊日期';
    statuOptions.value = [
      { label: '全部', value: 0 },
      { label: '启用', value: 1 },
      { label: '禁用', value: 2 },
      { label: '已过期', value: 3 },
    ];
    setSubscribeLists();
  }
});
const router = useRouter();
function goSoilPage() {
  // if (active.value == 0) {
  //   router.push({
  //     path: `/serve-registration-add`,
  //     params: {},
  //   });
  // } else {
  expertTitle.value = '新增专家排班';
  expertAddtime.value = '';
  ruleForm.outpatientTime = ''; //时间
  ruleForm.apm = '1'; //时段
  ruleForm.isRepeat = '1'; //重复是否
  ruleForm.status = '1'; //状态
  ruleForm.expertId = ''; //专家
  ruleForm.schId = ''; //排班ID,为空则表示新增
  dialogFormVisible.value = true;
  // }
}

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
    apm: timeStatus.value,
  };
  return params;
});
// 点击搜索按钮
function search() {
  page.value = 1;
  setSubscribeLists();
}
async function setSubscribeLists() {
  if (active.value == 0) {
    let r = await getSubscribeLists(params.value);
    soilData.tableData = r.data;
    soilData.totalData = r.totalData;
  } else {
    let r = await getExpertSchedulLists(params.value);
    soilData.tableData = r.data;
    soilData.totalData = r.totalData;
  }
}
onMounted(() => {
  setSubscribeLists();
});
watch(page, () => {
  setSubscribeLists();
});

// 挂号记录详情
function goDetail(cetuId: number) {
  router.push({
    path: `/serve-registration-detail`,
    query: { id: cetuId },
  });
}

// 专家排班删除
function deleteExpert(id: string | number) {
  dialogDetailVisible.value = false;
  ElMessageBox.confirm('确定删除该排班记录?', '删除提示')
    .then(async () => {
      let r = await getExpertSchedulDel({ schId: id });
      ElMessage({
        message: '已删除',
        type: 'success',
         duration: 1500,
      });
      page.value = 1;
      setTimeout(() => {
        setSubscribeLists();
      }, 1000);
    })
    .catch(() => {});
}
// 专家排班详情
async function detailExpert(row: any) {
  expertTitle.value = '排班详情';
  if (row.status == 3) {
    // console.log('不可编辑', row)
    detailData.outpatientTime = row.outpatientTime;
    detailData.repeat = row.repeat;
    detailData.expertName = row.expertName;
    detailData.statusTips = row.statusTips;
    detailData.addTime = row.addTime;
    detailData.schId = row.schId;
    dialogDetailVisible.value = true;
  } else {
    let r = await getExpertSchedulDetail({ schId: row.schId });
    ruleForm.schId = r.schId;
    ruleForm.outpatientTime = r.outpatientTime;
    ruleForm.apm = r.apm;
    ruleForm.isRepeat = String(r.isRepeat);
    ruleForm.status = String(r.status);
    ruleForm.expertId = { value: r.expertId, label: r.expertName };
    expertAddtime.value = r.addTime;
    dialogFormVisible.value = true;
  }
}
// 编辑保存
async function makeSureEdit(formEl: FormInstance | undefined) {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (
        new Date(ruleForm.outpatientTime).getTime() <
          new Date(new Date().toLocaleDateString()).getTime() &&
        ruleForm.isRepeat == '0'
      ) {
        ElMessageBox.confirm('该时间段已过期，请确定后再提交', '信息')
          .then(async () => {
            setAddExpert();
          })
          .catch(() => {});
      } else {
        setAddExpert();
      }
      // console.log('formEl', formEl)
      // console.log('ruleForm', ruleForm)
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
}

async function setAddExpert() {
  if (ruleForm.expertId instanceof Object) {
    ruleForm.expertId = ruleForm.expertId.value;
  }
  let r = await getAddExpert(ruleForm);
  if (!r.msg) {
    ElMessage({ message: '保存成功', type: 'success', duration: 1500, });
    dialogFormVisible.value = false;
    setTimeout(() => {
      setSubscribeLists();
    }, 1000);
  } else {
    ElMessage.warning(r.msg);
  }
}
// 新增排班时间选择限制
const disabledDate = (time: Date) => {
  return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
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

.content-detail {
  .list {
    margin: 20px 0;
    font-size: 14px;
    color: #333;

    .label {
      display: inline-block;
      width: 150px;
      text-align: right;
    }

    .content {
      display: inline-block;
    }
  }
}
</style>
