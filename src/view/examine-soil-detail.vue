<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-soil' }">测土配方</el-breadcrumb-item>
        <el-breadcrumb-item> 测土详情: {{ ruleForm.cetuId }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <AddSecondBar title="测土配方" :mobile="userInfo.mobile" :time="userInfo.time" @del="del" />
    <div class="content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="default"
        status-icon
      >
        <div class="top-box bg-w border">
          <div class="left-bar">
            <div class="tip">土壤信息</div>
            <el-form-item label="会员:"> {{ userInfo.name }} {{ userInfo.mobile }} </el-form-item>
            <el-form-item label="位置:" prop="address">
              {{ ruleForm.address }}
            </el-form-item>
            <el-form-item prop="name" label="北纬:">
              {{ ruleForm.latitude || '暂无' }}
              <span>东经:</span>
              {{ ruleForm.longitude || '暂无' }}
            </el-form-item>
            <el-form-item label="现种养种类:" prop="nowKind">
              {{ ruleForm.nowKind }}
            </el-form-item>
            <el-form-item label="前种养种类:" prop="beforeKind">
              {{ ruleForm.beforeKind }}
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              {{ ruleForm.number }}{{ ruleForm.unit }}
            </el-form-item>
            <el-form-item label="地形:" prop="terrain">
              {{ ruleForm.terrain }}
            </el-form-item>
            <el-form-item label="采样深度(cm):" prop="sampleNumber">
              {{ ruleForm.sampleNumber }}
            </el-form-item>
            <el-form-item
              label="采样日期:"
              prop="sampleDate"
              v-model="ruleForm.sampleDate"
              class="w300"
              readonly
            >
              {{ ruleForm.sampleDate }}
            </el-form-item>
            <el-form-item label="初复诊:" prop="diagnosis">
              {{ ruleForm.diagnosis }}
            </el-form-item>

            <el-form-item label="图片:" prop="image">
              {{ ruleForm.image }}
            </el-form-item>
            <el-form-item label="测试人:" prop="testPeople">
              {{ ruleForm.testPeople }}
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              {{ ruleForm.describe }}
            </el-form-item>
            <div class="tip">检测信息</div>
            <el-form-item label="测土状态:" prop="soilStatus">
              {{ ruleForm.soilStatus }}
            </el-form-item>
          </div>

          <div class="right-bar">
            <div class="right-box border">
              <div class="tip">测土配方结果</div>

              <el-form-item label="铵态氮含量:" prop="soilResult.an">
                <div>
                  <!-- <p v-if="ruleForm.soilStatus === 1">检测中...</p> -->
                  {{ ruleForm.soilResult.an }}
                  <div class="standard">标准值:10-15mg/kg</div>
                </div>
              </el-form-item>

              <el-form-item label="速效磷含量:" prop="soilResult.lin">
                <div>
                  {{ ruleForm.soilResult.lin }}
                  <div class="standard">极高:>=90|高:90-60|中:60-30|低30-15|极低:&lt;15</div>
                </div>
              </el-form-item>

              <el-form-item label="有效钾含量:" prop="soilResult.jia">
                <div>
                  {{ ruleForm.soilResult.jia }}
                  <div class="standard">极高: >=155|高:155-125|中:125-100|低100-70|极低:&lt;70</div>
                </div>
              </el-form-item>
              <el-form-item label="PH值:" prop="ph">
                <div>
                  {{ ruleForm.soilResult.ph }}
                  <div class="standard">标中性值:7</div>
                </div>
              </el-form-item>
              <el-form-item label="有机质:" prop="organic">
                {{ ruleForm.soilResult.organic }}
                <div>
                  <div class="standard">极高:>=25|高:25-20|中:20-15 | 低15-10 | 极低:&lt; 15</div>
                </div>
              </el-form-item>
              <el-form-item label="盐分" prop="salt">
                {{ ruleForm.soilResult.salt }}
              </el-form-item>
              <el-form-item label="结果描述" prop="soilDescribe">
                {{ ruleForm.soilResult.soilDescribe }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="left-bar">
            <div class="tip">
              处方信息
              <el-checkbox-group v-model="ruleForm.Prescribing.open" class="open-Prescribing">
                <el-checkbox label="公开处方" name="type" />
              </el-checkbox-group>
            </div>
            <el-form-item label="处方专家" prop="Prescribing.expert">
              {{ ruleForm.Prescribing.expert }}
            </el-form-item>
            <el-form-item label="看诊结果" prop="Prescribing.result">
              {{ ruleForm.Prescribing.result }}
            </el-form-item>
            <el-form-item label="最近测土记录" prop="leastSoilRecord">
              {{ ruleForm.Prescribing.leastSoilRecord }}
            </el-form-item>
            <div class="tip">用药信息</div>
            <div class="medicine">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">价格</div>
                <div class="item">数量</div>
              </div>
              <div class="bar" v-for="(item, index) in ruleForm.Prescribing.medicine">
                <div class="item">
                  {{ item.drugName }}
                </div>
                <div class="item">
                  {{ item.drugSpecIds }}
                </div>
                <div class="item">1</div>
                <div class="item">
                  {{ item.drugQuantity }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="tip">诊疗跟踪(0)</div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="tip">新增诊疗跟踪</div>
          <el-button size="large" @click="submitForm(ruleFormRef)" class="mr20">发布</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
import { ElMessage, UploadProps, UploadRawFile, UploadFiles, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getAddSoil } from '@/http/getAddSoil';
import { getTestExpert, getTestSoilDetail, getDelSoil } from '@/http';
import UnitSelect from '@/components/unitSelect.vue';
import ExpertSelect from '@/components/expertSelect.vue';
import medicineSelectVue from '@/components/medicineSelect.vue';
import PrescribingTemplateVue from '@/components/prescribingTemplate.vue';
import UserSelectVue from '@/components/userSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import UploadImageVue from '@/components/uploadImage.vue';
import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const cetuId = computed(() => route.params.cetuId);
const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  nameId: '', //姓名
  address: '', //位置
  latitude: '', //经度
  longitude: '', //纬度
  nowKind: '', //现在种类
  beforeKind: '', //之前种类
  unit: 1, //单位
  number: '', //数量
  terrain: 1, //地形
  sampleNumber: '', // 采样深度
  sampleDate: '', //采样日期
  diagnosis: 1, // 初复诊
  describe: '', //描述
  image: [], // 图片
  // aliossImage: [],
  testPeople: 0, //测试人
  soilStatus: 1, //测土状态
  soilResult: {
    // 测土配方结果
    an: '', //氨态碳含量
    lin: '', //磷含量
    jia: '', //钾含量
    ph: '', //ph值
    organic: '', //有机质
    salt: '', // 盐分
    soilDescribe: '', //测土结果描述
  },
  Prescribing: {
    // 处方信息
    open: ['公开处方'],
    expert: '', //处方专家
    result: '', // 看诊结果
    leastSoilRecord: '', //最近测土记录
    medicine: [
      //用药信息
      {
        drugName: '', //药品名字
        drugId: '', //药品id
        drugSpecIds: '', //药品规格
        sizeSelectOption: [],
        drugQuantity: 1, // 药品数量
      },
    ],
  },
  cetuId: '', //用于详情显示的cetuId
  templates: {}, // 选中的处方模板
});

// 用于select的option设置，数据化
const selectOptions = reactive({
  expertList: [], // 测试专家
  cetuOrderList: [], // 最近测土记录
  recipeTemList: [], //处方模板列表
});

const rules = reactive<FormRules>({
  nameId: [{ required: true, message: '会员不能为空', trigger: 'change' }],
  address: [{ required: true, message: '地址不能为空', trigger: 'change' }],
  nowKind: [{ required: true, message: '现种类不能为空', trigger: 'change' }],
  number: [{ required: true, message: '数量不能为空', trigger: 'change' }],
  terrain: [{ required: true, message: '地形不能为空', trigger: 'change' }],
  sampleNumber: [{ required: true, message: '采样深度不能为空', trigger: 'change' }],
  sampleDate: [{ required: true, message: '采样日期不能为空', trigger: 'change' }],
  diagnosis: [{ required: true, message: '初复诊不能为空', trigger: 'change' }],
  testPeople: [{ required: true, message: '测试人不能为空', trigger: 'change' }],
  soilStatus: [{ required: true, message: '测土状态不能为空', trigger: 'change' }],
  'soilResult.an': [{ required: true, message: '氨态碳不能为空', trigger: 'change' }],
  'soilResult.lin': [{ required: true, message: '速效磷不能为空', trigger: 'change' }],
  'soilResult.jia': [{ required: true, message: '有效钾不能为空', trigger: 'change' }],
  'Prescribing.expert': [{ required: true, message: '处方专家不能为空', trigger: 'change' }],
  'Prescribing.result': [{ required: true, message: '看诊结果不能为空', trigger: 'change' }],
});

//顶部的删除按钮
const del = () => {
  ElMessageBox.confirm('是否要删除测土配方', '提示')
    .then(async (res) => {
      let r = await getDelSoil(ruleForm.cetuId);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        router.replace({ path: '/examine-soil' });
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

// 添加用药
function addMedicine() {
  ruleForm.Prescribing.medicine.push({
    drugName: '', //药品名字
    drugId: '', //药品id
    drugSpecIds: '', //药品规格
    sizeSelectOption: [],
    drugQuantity: 1, // 药品数量
  });
}

// 删除用药
function delMedicine(index: number) {
  ruleForm.Prescribing.medicine.splice(index, 1);
}

// 选择模板
function selectPrescribing(detail: any) {
  console.log('detail', detail);
  const { content, drugInfo } = detail;
  ruleForm.Prescribing.result = content;
  integrationMedicine(drugInfo);
}
// 整合自定义用药数组 和 后端用药数组
function integrationMedicine(drugInfo: any) {
  ruleForm.Prescribing.medicine = [];
  if (drugInfo.length === 0) {
    ruleForm.Prescribing.medicine.push({
      drugName: '', //药品名字
      drugId: '', //药品id
      drugSpecIds: '', //药品规格
      sizeSelectOption: [],
      drugQuantity: 1, // 药品数量
    });
    return;
  }
  drugInfo.forEach((item: any, index: number) => {
    ruleForm.Prescribing.medicine.push({
      drugName: '', //药品名字
      drugId: '', //药品id
      drugSpecIds: '', //药品规格
      sizeSelectOption: [],
      drugQuantity: 1, // 药品数量
    });
    if (ruleForm.Prescribing.medicine.length > drugInfo.length) {
      return;
    }
    ruleForm.Prescribing.medicine[index].drugName = item.drugName;
    ruleForm.Prescribing.medicine[index].drugSpecIds = item.drugSpec;
    ruleForm.Prescribing.medicine[index].drugQuantity = item.drugQuantity;
  });
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log('uploadFile', uploadFile);
  console.log('ruleForm.image', ruleForm.image);
  console.log('uploadFiles', uploadFiles);
  // console.log('remove');
};

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setSoilData();
      if (goPage) {
        setTimeout(() => {
          router.push('/examine-soil');
        }, 500);
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 取消按钮
const cancel = function () {
  router.push('/examine-soil');
};

const soilParams = computed<any>(() => {
  let soilResultsJson = JSON.stringify({
    atdVal: ruleForm.soilResult.an,
    sxlVal: ruleForm.soilResult.lin,
    yxjVal: ruleForm.soilResult.jia,
    phVal: ruleForm.soilResult.ph,
    organicVal: ruleForm.soilResult.organic,
    saltVal: ruleForm.soilResult.salt,
    resultVal: ruleForm.soilResult.soilDescribe,
  });
  let chufangInfoJson = JSON.stringify({
    isPublic: ruleForm.Prescribing.open[0],
    expertId: ruleForm.Prescribing.expert,
    chufangResult: ruleForm.Prescribing.result,
    lastCetuNumber: ruleForm.Prescribing.leastSoilRecord,
  });

  let yongyaoInfoJson = JSON.stringify(ruleForm.Prescribing.medicine);
  let params = {
    cetuId: cetuId.value,
    uid: ruleForm.nameId,
    northLat: ruleForm.latitude,
    eastLng: ruleForm.longitude,
    address: ruleForm.address,
    zuowuId: ruleForm.nowKind,
    beforeZuowuId: ruleForm.beforeKind,
    mushu: ruleForm.number,
    unit: ruleForm.unit,
    dixing: ruleForm.terrain,
    depth: ruleForm.sampleNumber,
    datecollected: ruleForm.sampleDate,
    isFrist: ruleForm.diagnosis,
    soildescribe: ruleForm.describe,
    images: ruleForm.image.join(','),
    expertId: ruleForm.testPeople,
    status: ruleForm.soilStatus,
    soilResultsJson,
    chufangInfoJson,
    yongyaoInfoJson,
  };
  return params;
});

// 提价测土结果请求
async function setSoilData() {
  let r = await getAddSoil(soilParams.value);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('已经添加');
  }
}

// 测土配方，处方模板，专家列表的select option的数据请求
async function setExpertSoilTemplateSelectData() {
  let { expertList, recipeTemList, cetuOrderList } = await getTestExpert();
  selectOptions.expertList = expertList;
  selectOptions.recipeTemList = recipeTemList;
  selectOptions.cetuOrderList = cetuOrderList;
}

const userInfo = reactive({ mobile: 0, time: 0, name: '' });
async function getSoilDetail() {
  // 没有cetuId，说明是新增页面不需要请求详情数据
  if (!cetuId.value) return;

  let r = await getTestSoilDetail(cetuId.value as any);
  console.log('r', r);
  let s = r.soilInfo;
  let cetuResult = r.cetuResult;
  let chufangInfo = r.chufangInfo;
  ruleForm.cetuId = s.cetuId;
  userInfo.mobile = s.mobile;
  userInfo.time = s.datecollected;
  userInfo.name = s.username;
  ruleForm.address = s.address;
  ruleForm.latitude = s.northLat;
  ruleForm.longitude = s.eastLng;
  ruleForm.nowKind = s.zuowuId;
  ruleForm.beforeKind = s.beforeZuowuId;
  ruleForm.unit = s.unitId;
  ruleForm.number = s.mushu;
  ruleForm.terrain = +s.dixing;
  ruleForm.sampleNumber = s.depth;
  ruleForm.sampleDate = s.datecollected;
  ruleForm.diagnosis = +s.isFrist;
  ruleForm.describe = s.soildescribe;
  ruleForm.image = s.images;
  
  ruleForm.testPeople = +s.expertId;
  ruleForm.soilStatus = +r.status;
  ruleForm.soilResult.an = cetuResult.atdVal;
  ruleForm.soilResult.lin = cetuResult.sxlVal;
  ruleForm.soilResult.jia = cetuResult.yxjVal;
  ruleForm.soilResult.ph = cetuResult.phVal;
  ruleForm.soilResult.organic = cetuResult.organicVal;
  ruleForm.soilResult.salt = cetuResult.saltVal;
  ruleForm.soilResult.soilDescribe = cetuResult.resultVal;
  ruleForm.Prescribing.open = chufangInfo.isPublic ? ['公开处方'] : [];
  ruleForm.Prescribing.expert = chufangInfo.expertId;
  ruleForm.Prescribing.result = chufangInfo.chufangResult;
  ruleForm.Prescribing.leastSoilRecord = chufangInfo.lastCetuNumber;
  integrationMedicine(r.drugInfo);
}
onMounted(async () => {
  emit('update:hideAside', false);
  setExpertSoilTemplateSelectData();
  getSoilDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
</script>
<style lang="scss" scoped>
.nav-bar {
  border-bottom: none;
}
.top-box {
  display: flex;
  justify-content: space-between;
  & > div {
    flex: 1;
  }
  .right-bar {
    .right-box {
      background: #f8f8f8;
      margin: 10px;
    }
  }
}
.bottom-box {
  display: flex;
  justify-content: space-between;
  & > div {
    flex: 1;
  }
  .right-bar {
    border-left: 1px solid $border-color;
  }
}
.standard {
  font-size: 12px;
  color: #999;
  line-height: 22px;
}
.result-input,
.organic-input,
.salt-input {
  position: relative;
}
.result-input::after {
  position: absolute;
  content: 'mg/kg';
  right: -50px;
  color: #333;
}
.organic-input::after {
  content: 'g/kg';
  right: -50px;
  color: #333;
  position: absolute;
}
.salt-input::after {
  content: 'ms/cm';
  position: absolute;
  right: -60px;
  color: #333;
}
.tip {
  position: relative;
  display: flex;
  align-items: center;
  .open-Prescribing {
    margin-left: 44px;
    // position: absolute;
    // top
  }
}
.medicine {
  .bar {
    width: 80%;
    height: 40px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    margin-top: 5px;
    .item {
      flex: 1;
      font-size: 14px;
      padding: 5px;
    }
    .del {
      width: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
  .title {
    margin-top: 0;
  }
}
.add-medicine-btn {
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 30px;
}
</style>
