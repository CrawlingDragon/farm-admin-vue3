<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-point' }">观测点</el-breadcrumb-item>
        <el-breadcrumb-item> 观测点详情:{{ ruleForm.pointNumber }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="point-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <el-affix target=".point-container">
          <div class="title-fiexed-bar border">
            <AddSecondBar
              title="观测点详情"
              :mobile="ruleForm.centerMobile"
              :time="ruleForm.centerTime"
              class="left"
            >
              <el-dropdown>
                <span class="el-dropdown-link">
                  <span @click="goPageEdit" class="edit">编辑</span>
                  <el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="goPageEdit">编辑</el-dropdown-item>
                    <el-dropdown-item @click="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <template #states>
                <div class="status">
                  <el-icon color="#599524" v-if="ruleForm.conclusion.effectTips == '已调理'"><Select /></el-icon>
                  <el-icon color="#599524" v-if="ruleForm.conclusion.effectTips == '待跟进'">
                    <Clock />
                  </el-icon>
                  <el-icon color="#da993c" v-if="ruleForm.conclusion.effectTips == '没效果'">
                    <Warning />
                  </el-icon>
                  <span>{{ ruleForm.conclusion.effectTips }}</span>
                </div>
              </template>
            </AddSecondBar>
            <div class="right">
              对照组信息
              <div class="small-title">对照组基本信息和首次测土信息同观测点</div>
            </div>
          </div>
        </el-affix>
        <div class="basis-info border">
          <div class="left-main">
            <div class="tip">基础信息</div>
            <el-form-item label="观测点名称:" prop="pointName">
              {{ ruleForm.pointName }}
            </el-form-item>
            <el-form-item label="种类:" prop="kind">
              {{ ruleForm.kind }}
            </el-form-item>
            <el-form-item label="试验地点:" prop="address">
              {{ ruleForm.address }}
            </el-form-item>
            <el-form-item prop="latitude" label="北纬:" v-if="ruleForm.latitude && ruleForm.longitude">
              <!-- <el-input v-model="ruleForm.latitude" class="w120 mr20" placeholder="如:30°12'42”" /> -->
              <div class="mr10">{{ ruleForm.latitude }}</div>
              <span class="mr10">东经:</span>
              <!-- <el-input v-model="ruleForm.longitude" class="w120" placeholder="如:120°12'18”" /> -->
              {{ ruleForm.longitude }}
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              <!-- <el-input
                v-model.number="ruleForm.number"
                label="right"
                placeholder="请输入数字"
                class="grow-number w200 mr30"
              /> -->
              {{ ruleForm.number }}
              {{ ruleForm.unit }}
              <!-- <UnitSelect
                v-model:unit="ruleForm.unit"
                v-if="unitAndKindSelectOption.unitOption.length !== 0"
                :options="unitAndKindSelectOption.unitOption"
              ></UnitSelect> -->
            </el-form-item>
            <el-form-item
              label="开始观察日期:"
              prop="sampleDate"
              v-model="ruleForm.sampleDate"
              class="w300"
              readonly
            >
              <!-- <el-date-picker
                v-model="ruleForm.sampleDate"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300 date-wrap"
                style="width: 300px"
                value-format="YYYY-MM-DD"
              /> -->
              {{ ruleForm.sampleDate }}
            </el-form-item>
            <el-form-item label="试验会员:" prop="testPeople">
              <!-- <ExpertSelect
                v-if="selectOptions.expertList.length !== 0"
                v-model:expert="ruleForm.testPeople"
                :options="selectOptions.expertList"
              ></ExpertSelect> -->
              {{ ruleForm.testPeople }}
            </el-form-item>
            <el-form-item label="描述:" prop="describe" v-if="ruleForm.describe">
              <!-- <el-input
                v-model="ruleForm.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
              /> -->
              {{ ruleForm.describe }}
            </el-form-item>
            <el-form-item label="图片:" prop="image" v-if="ruleForm.image.length != 0">
              <el-image
                v-for="(item, index) in ruleForm.image"
                :key="item.url"
                :src="item.url"
                @click="getImgView(index, ruleForm.image)"
                fit="scale-down"
                class="upload-image"
              ></el-image>
            </el-form-item>
          </div>
          <div class="right-main"></div>
        </div>
        <div class="first-test-box border">
          <div class="left-main">
            <div class="tip">首次测土信息</div>
            <el-form-item label="测土单号:" prop="leastSoilRecord.soilId">
              {{ ruleForm.leastSoilRecord.soilId || '无' }}
            </el-form-item>
            <el-form-item label="测土状态:" prop="" v-if="ruleForm.leastSoilRecord.soilId">
              {{ ruleForm.leastSoilRecord.status }}
            </el-form-item>
            <el-form-item label="取样日期:" prop="" v-if="ruleForm.leastSoilRecord.soilId">
              {{ ruleForm.leastSoilRecord.date }}
            </el-form-item>
            <el-form-item label="铵态氮含量:" prop="" v-if="ruleForm.leastSoilRecord.soilId"
              >{{ ruleForm.leastSoilRecord.an }}
            </el-form-item>
            <el-form-item label="速效磷含量:" prop="" v-if="ruleForm.leastSoilRecord.soilId"
              >{{ ruleForm.leastSoilRecord.lin }}
            </el-form-item>
            <el-form-item label="有效钾含量:" prop="" v-if="ruleForm.leastSoilRecord.soilId"
              >{{ ruleForm.leastSoilRecord.jia }}
            </el-form-item>
            <el-form-item label="pH值:" prop="" v-if="ruleForm.leastSoilRecord.soilId">{{ ruleForm.leastSoilRecord.ph }}
            </el-form-item>
            <el-form-item label="盐分:" prop="" v-if="ruleForm.leastSoilRecord.soilId">{{ ruleForm.leastSoilRecord.salt }}
            </el-form-item>
          </div>
          <div class="right-main"></div>
        </div>
        <div class="use-farm-box border">
          <div class="left-main">
            <div class="tip">使用农资信息</div>
            <el-form-item
              label="观察日期:"
              prop="leftUseFormInfo.date"
              v-model="ruleForm.leftUseFormInfo.date"
              class="w300"
              readonly
            >
              {{ ruleForm.leftUseFormInfo.date }}
            </el-form-item>
            <el-form-item label="描述:" prop="leftUseFormInfo.describe">
              {{ ruleForm.leftUseFormInfo.describe }}
            </el-form-item>
            <div class="medicine" v-if="ruleForm.leftUseFormInfo.medicine.length !== 0">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">数量</div>
              </div>
              <div class="bar" v-for="(item, index) in ruleForm.leftUseFormInfo.medicine">
                <div class="item">
                  {{ item.drugName }}
                </div>
                <div class="item">
                  {{ item.drugSpecIds }}
                </div>
                <div class="item">
                  {{ item.drugQuantity }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-main">
            <div class="tip">使用农资信息</div>
            <el-form-item
              label="观察日期:"
              prop="rightUseFormInfo.date"
              v-model="ruleForm.rightUseFormInfo.date"
              class="w300"
              readonly
            >
              {{ ruleForm.rightUseFormInfo.date }}
            </el-form-item>
            <el-form-item label="描述:" prop="rightUseFormInfo.describe">
              {{ ruleForm.rightUseFormInfo.describe }}
            </el-form-item>
            <div class="medicine" v-if="ruleForm.rightUseFormInfo.medicine.length !== 0">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">数量</div>
              </div>

              <div class="bar" v-for="(item, index) in ruleForm.rightUseFormInfo.medicine">
                <div class="item">
                  {{ item.drugName }}
                </div>
                <div class="item">
                  {{ item.drugSpecIds }}
                </div>
                <div class="item">
                  {{ item.drugQuantity }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dayTest test-soil-box border" v-if="ruleForm.dailyContentInfo.length !== 0">
          <template v-for="item in ruleForm.dailyContentInfo">
            <div class="left-main">
              <div class="tip">日常观测</div>
              <el-form-item
                label="观察日期:"
                prop="leftUseFormInfo.date"
                v-model="item.observeTime"
                class="w300"
                readonly
              >
                {{ item.observeTime }}
              </el-form-item>
              <el-form-item label="描述:" prop="leftUseFormInfo.describe">
                {{ item.describe }}
              </el-form-item>
              <el-form-item label="图片:" prop="image">
                <el-image
                  v-for="(img,index) in item.images"
                  :src="img.url"
                  fit="scale-down"
                  @click="getImgView(index, item.images)"
                  class="upload-image"
                ></el-image>
              </el-form-item>
            </div>
            <div class="right-main">
              <div class="tip">
                日常观测
                <el-icon class="close-icon" @click="delDayPoint(item.dailyId)">
                  <CloseBold />
                </el-icon>
              </div>
              <el-form-item
                label="观察日期:"
                prop="leftUseFormInfo.date"
                v-model="item.contrastObserveTime"
                class="w300"
                readonly
              >
                {{ item.contrastObserveTime }}
              </el-form-item>
              <el-form-item label="描述:" prop="leftUseFormInfo.describe">
                {{ item.contrastDescribe }}
              </el-form-item>
              <el-form-item label="图片:" prop="image">
                <el-image
                  v-for="(img,index) in item.contrastImages" :key="img.url"
                  :src="img.url"
                  @click="getImgView(index, item.contrastImages)"
                  fit="scale-down"
                  class="upload-image"
                ></el-image>
              </el-form-item>
            </div>
          </template>
        </div>
        <div class="test-soil-box border" v-if="ruleForm.testingsoilInfo.length !== 0">
          <template v-for="(item, index) in ruleForm.testingsoilInfo">
            <div class="left-main">
              <div class="tip">测土信息</div>
              <el-form-item label="测土单号" prop="leastSoilRecord.soilId">
                {{ item.cetuNumber }}
              </el-form-item>
              <el-form-item label="测土状态:" prop="">
                {{ item.statusTips }}
              </el-form-item>
              <el-form-item label="取样日期:" prop="">
                {{ item.datecollected }}
              </el-form-item>
              <el-form-item label="铵态氮含量:" prop="">{{ item.atdVal }} </el-form-item>
              <el-form-item label="速效磷含量:" prop="">{{ item.sxlVal }} </el-form-item>
              <el-form-item label="有效钾含量:" prop="">{{ item.yxjVal }} </el-form-item>
              <el-form-item label="pH值:" prop="">{{ item.phVal }} </el-form-item>
              <el-form-item label="盐分:" prop="">{{ item.saltVal }} </el-form-item>
            </div>
            <div class="right-main">
              <div class="tip">
                测土信息<el-icon class="close-icon" @click="delTestSoil(item.logId)">
                  <CloseBold />
                </el-icon>
              </div>
              <el-form-item label="测土单号" prop="leastSoilRecord.soilId">
                {{ item.conCetuNumber }}
              </el-form-item>
              <el-form-item label="测土状态:" prop="">
                {{ item.conStatusTips }}
              </el-form-item>
              <el-form-item label="取样日期:" prop="">
                {{ item.conDatecollected }}
              </el-form-item>
              <el-form-item label="铵态氮含量:" prop="">{{ item.conAtdVal }} </el-form-item>
              <el-form-item label="速效磷含量:" prop="">{{ item.conSxlVal }} </el-form-item>
              <el-form-item label="有效钾含量:" prop="">{{ item.conYxjVal }} </el-form-item>
              <el-form-item label="pH值:" prop="">{{ item.conPhVal }} </el-form-item>
              <el-form-item label="盐分:" prop="">{{ item.conSaltVal }} </el-form-item>
            </div>
          </template>
        </div>
        <div class="conclusion border" v-if="ruleForm.conclusion != ''">
          <div class="tip">观测结论:</div>
          <div class="conclusion-content">
            <div class="time">{{ ruleForm.conclusion.conclusionTime }}</div>
            <div class="text">
              <div class="p1">录入时间：{{ ruleForm.conclusion.enterTime }}</div>
              <div class="p2">{{ ruleForm.conclusion.observeconclusion }}</div>
            </div>
            <div class="status">
              <el-icon color="#599524" v-if="ruleForm.conclusion.effectTips == '已调理'"><Select /></el-icon>
              <el-icon color="#599524" v-if="ruleForm.conclusion.effectTips == '待跟进'">
                <Clock />
              </el-icon>
              <el-icon color="#da993c" v-if="ruleForm.conclusion.effectTips == '没效果'">
                <Warning />
              </el-icon>
              <span>{{ ruleForm.conclusion.effectTips }}</span>
              <el-icon class="close-icon" @click="delConclusions">
                <CloseBold />
              </el-icon>
            </div>
          </div>
        </div>
        <div class="submit-bar" v-else>
          <!-- 这是新增页面的按钮 -->
          <div class="content">
            <el-button type="primary" size="large" @click="dayDialogFormVisible = true" class="mr20"
              >新增日常观测</el-button
            >
            <el-button size="large" @click="testSoilDialogFormVisible = true" class="mr20"
              >新增测土</el-button
            >
            <el-button size="large" @click="conclusionDialogFormVisible = true">添加结论</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 新增日常观测dialog -->
    <AddDayWatch
      v-model:dayDialogFormVisible="dayDialogFormVisible"
      @save="addDayPointFetchFn"
      :view-id="pointId"
    />
    <AddTestSoil
      :view-id="pointId"
      @save="addDayPointFetchFn"
      v-model:testSoilDialogFormVisible="testSoilDialogFormVisible"
    />
    <AddConclusion
      v-model:conclusionDialogFormVisible="conclusionDialogFormVisible"
      :view-id="pointId"
      @save="addDayPointFetchFn"
    />
    <!-- 大图预览 -->
    <imgPreview v-model:index="imgIndex" :lists="imgLists" />
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted, watch } from 'vue';
import { ElMessage, UploadProps, UploadRawFile, UploadFiles, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import {
  addObservePoint,
  getObservePointDetail,
  delObservePoint,
  delDayObservePoint,
  delTestObservePoint,
  delConclusion,
} from '@/http';
// import { getSelectInfo } from '../http/getSelectInfo';
// import KindSelect from '@/components/kindSelect.vue';
// import UnitSelect from '@/components/unitSelect.vue';
// import ExpertSelect from '@/components/expertSelect.vue';
// import medicineSelectVue from '@/components/medicineSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import AddDayWatch from '@/components/add-day-watch.vue';
import imgPreview from '@/components/imgPreview.vue';
import AddTestSoil from '@/components/add-test-soil.vue';
import AddConclusion from '@/components/add-conclusion.vue';
// import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';
import { transformImageParams } from '@/common/js/util';

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();
const uId = computed(() => route.query.uId);
const pointId = computed(() => route.params.pointId) as any;
// const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  pointNumber: '', //观测点数字
  centerMobile: '', //中间栏目的手机号
  centerTime: '', //中间栏目的时间
  pointName: '', //观测点名称
  kind: '', //种类
  address: '', //试验低点
  latitude: '', //经度
  longitude: '', //纬度
  number: '', //数量
  unit: '亩', //单位
  sampleDate: '', //开始观察日期
  testPeople: '', //试验会员
  describe: '', //描述
  image: [] as any, // 图片
  leastSoilRecord: {
    // 首次测土信息
    soilId: '', //首次测土id
    status: '', //测土状态
    date: '', //取样日期
    an: '', //氨态碳含量
    lin: '', //磷含量
    jia: '', //钾含量
    ph: '', //ph值
    salt: '', // 盐分
  },
  leftUseFormInfo: {
    //左侧使用农资信息
    date: '',
    describe: '',
    medicine: [
      //用药信息
      // {
      //   drugName: '', //药品名字
      //   drugId: '', //药品id
      //   drugSpecIds: '', //药品规格
      //   sizeSelectOption: [] as any,
      //   drugQuantity: 1, // 药品数量
      // },
    ] as any,
  },
  rightUseFormInfo: {
    //右侧侧使用农资信息
    date: '',
    describe: '',
    medicine: [
      //用药信息
      // {
      //   drugName: '', //药品名字
      //   drugId: '', //药品id
      //   drugSpecIds: '', //药品规格
      //   sizeSelectOption: [] as any,
      //   drugQuantity: 1, // 药品数量
      // },
    ] as any,
  },
  testingsoilInfo: [] as any, //测土信息
  dailyContentInfo: [] as any, //日常观察
  conclusion: '' as any, //观测点结论
});

const dayDialogFormVisible = ref(false);
const testSoilDialogFormVisible = ref(false);
const conclusionDialogFormVisible = ref(false);
//路由到编辑页
const goPageEdit = () => {
  router.push({ path: `/examine-point-add/${pointId.value}`, query: { uId: uId.value } });
};

const rules = reactive<FormRules>({
  // pointName: [{ required: true, message: '观测点名称', trigger: 'change' }],
  // kind: [{ required: true, message: '种类不能为空', trigger: 'change' }],
  // address: [{ required: true, message: '试验地点不能为空', trigger: 'change' }],
  // number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  // sampleDate: [{ required: true, message: '开始观察日期不能为空', trigger: 'change' }],
  // testPeople: [{ required: true, message: '试验会员不能为空', trigger: 'change' }],
  // 'leftUseFormInfo.date': [{ required: true, message: '开始用药日期不能为空', trigger: 'change' }],
  // 'leftUseFormInfo.describe': [{ required: true, message: '用药描述不能为空', trigger: 'change' }],
  // 'rightUseFormInfo.describe': [{ required: true, message: '用药描述不能为空', trigger: 'change' }],
});

//顶部的删除按钮
const del = () => {
  ElMessageBox.confirm('是否要删除观测点', '提示')
    .then(async (res) => {
      let r = await delObservePoint(pointId.value as any);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        router.replace({ path: '/examine-point' });
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

// 添加用药
function addMedicine(target: string) {
  let key: 'leftUseFormInfo' | 'rightUseFormInfo';
  key = target === 'left' ? 'leftUseFormInfo' : 'rightUseFormInfo';
  ruleForm[key].medicine.push({
    drugName: '', //药品名字
    drugId: '', //药品id
    drugSpecIds: '', //药品规格
    sizeSelectOption: [],
    drugQuantity: 1, // 药品数量
  });
}

// 删除用药
function delMedicine(index: number, target: string) {
  let key: 'leftUseFormInfo' | 'rightUseFormInfo';
  key = target === 'left' ? 'leftUseFormInfo' : 'rightUseFormInfo';
  ruleForm[key].medicine.splice(index, 1);
}

// 整合自定义用药数组 和 后端用药数组
function integrationMedicine(drugInfo: any, target: 'leftUseFormInfo' | 'rightUseFormInfo') {
  ruleForm[target].medicine = [];
  if (drugInfo.length === 0) {
    // ruleForm[target].medicine.push({
    //   drugName: '', //药品名字
    //   drugId: '', //药品id
    //   drugSpecIds: '', //药品规格
    //   sizeSelectOption: [],
    //   drugQuantity: 1, // 药品数量
    // });
    return;
  }
  // console.log('drugInfo', drugInfo);

  drugInfo.forEach((item: any) => {
    // if (ruleForm[target].medicine.length > drugInfo.length) {
    //   return;
    // }
    ruleForm[target].medicine.push({
      drugName: item.drugName, //药品名字
      drugId: item.drugId, //药品id
      drugSpecIds: item.drugSpec, //药品规格
      sizeSelectOption: [],
      drugQuantity: +item.drugQuantity, // 药品数量
    });
    // ruleForm[target].medicine[index].drugName = item.drugName;
    // ruleForm[target].medicine[index].drugSpecIds = item.drugSpec;
    // ruleForm[target].medicine[index].drugQuantity = item.drugQuantity;
  });
  // console.log('ruleForm[target]', ruleForm[target]);
  // console.log('ruleForm[target].medicine', ruleForm[target].medicine);
}

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, pageName?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setPintData().then((res) => {
        if (pageName) {
          setTimeout(() => {
            router.push({ path: pageName });
          }, 500);
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};

// //保存观测点数据
// function save() {}

const pointParams = computed<any>(() => {
  let yongyaoInfoJson = JSON.stringify(ruleForm.leftUseFormInfo.medicine);
  let contrastYongyaoInfoJson = JSON.stringify(ruleForm.rightUseFormInfo.medicine);

  let params = {
    viewId: pointId.value,
    title: ruleForm.pointName,
    zuowuId: ruleForm.kind,
    address: ruleForm.address,
    northLat: ruleForm.latitude,
    eastLng: ruleForm.longitude,
    mushu: ruleForm.number,
    unit: ruleForm.unit,
    observeTime: ruleForm.sampleDate,
    uid: ruleForm.testPeople,
    describe: ruleForm.describe,
    images: transformImageParams(ruleForm.image),

    cetuNumber: ruleForm.leastSoilRecord.soilId,
    useDrugTime: ruleForm.leftUseFormInfo.date,
    useDrugContent: ruleForm.leftUseFormInfo.describe,
    contrastUseDrugTime: ruleForm.rightUseFormInfo.date,
    contrastUseDrugContent: ruleForm.rightUseFormInfo.describe,
    contrastYongyaoInfoJson,
    yongyaoInfoJson,
  };
  return params;
});

// 提交测土结果请求
async function setPintData() {
  let r = await addObservePoint(pointParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
    return Promise.reject('error');
  } else {
    ElMessage.success('已经添加');
    return Promise.resolve('ok');
  }
}

// const userInfo = reactive({ mobile: 0, time: 0, name: '' });
async function getPointDetail() {
  // 没有cetuId，说明是新增页面不需要请求详情数据
  if (!pointId.value) return;
  let r = await getObservePointDetail(pointId.value as any);
  // console.log('r', r);
  let enterInfo = r.enterInfo;
  let observeInfo = r.observeInfo;
  let fristCetuInfo = r.fristCetuInfo;
  let useDrugInfo = r.useDrugInfo;
  ruleForm.pointNumber = enterInfo.observepointNumber;
  ruleForm.centerMobile = enterInfo.enterMobile;
  ruleForm.centerTime = enterInfo.enterTime;
  ruleForm.pointName = observeInfo.title;
  ruleForm.kind = observeInfo.zuowuName;
  ruleForm.address = observeInfo.address;
  ruleForm.latitude = observeInfo.northLat;
  ruleForm.longitude = observeInfo.eastLng;
  ruleForm.number = observeInfo.mushu;
  ruleForm.unit = observeInfo.unitName;
  ruleForm.sampleDate = observeInfo.observeTime;
  ruleForm.testPeople = observeInfo.realname;
  ruleForm.describe = observeInfo.describe;
  ruleForm.image = observeInfo.images;
  ruleForm.leastSoilRecord.soilId = fristCetuInfo.cetuNumber;
  ruleForm.leastSoilRecord.status = fristCetuInfo.statusTips;
  ruleForm.leastSoilRecord.date = fristCetuInfo.datecollected;
  ruleForm.leastSoilRecord.an = fristCetuInfo.atdVal;
  ruleForm.leastSoilRecord.lin = fristCetuInfo.sxlVal;
  ruleForm.leastSoilRecord.jia = fristCetuInfo.yxjVal;
  ruleForm.leastSoilRecord.ph = fristCetuInfo.phVal;
  ruleForm.leastSoilRecord.salt = fristCetuInfo.saltVal;
  // integrationMedicine(r.drugInfo);
  ruleForm.leftUseFormInfo.date = useDrugInfo.useDrugTime;
  ruleForm.leftUseFormInfo.describe = useDrugInfo.useDrugContent;

  integrationMedicine(useDrugInfo.useYongyaoLists, 'leftUseFormInfo');

  ruleForm.rightUseFormInfo.date = useDrugInfo.contrastUseDrugTime;
  ruleForm.rightUseFormInfo.describe = useDrugInfo.contrastUseDrugContent;
  integrationMedicine(useDrugInfo.contrastUseYongyaoLists, 'rightUseFormInfo');

  ruleForm.testingsoilInfo = r.testingsoilInfo;
  ruleForm.dailyContentInfo = r.dailyContentInfo;
  ruleForm.conclusion = r.resultInfo;
}
//添加日常观测点,新增测土，添加结论成功
function addDayPointFetchFn(boolean: boolean) {
  if (boolean) {
    getPointDetail();
  }
}

//删除日常观测
function delDayPoint(dailyId: string) {
  ElMessageBox.confirm('是否要删除日常观测', '提示')
    .then(async (res) => {
      let r = await delDayObservePoint(dailyId);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        getPointDetail();
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
}
//删除测土记录
function delTestSoil(logId: string) {
  ElMessageBox.confirm('是否要删除测土信息', '提示')
    .then(async (res) => {
      let r = await delTestObservePoint(logId);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        getPointDetail();
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
}
//删除观测结论
function delConclusions() {
  ElMessageBox.confirm('是否要删除观测结论', '提示')
    .then(async (res) => {
      let r = await delConclusion(pointId.value);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        getPointDetail();
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
}

onMounted(async () => {
  emit('update:hideAside', false);
  // setExpertSoilTemplateSelectData();
  // setUnitAndKindSelectData();
  getPointDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 大图预览
const imgIndex = ref<number>();
const imgLists = ref<any>();
const getImgView = (index: number, lists: any) => {
  imgIndex.value = index;
  imgLists.value = lists;
};
</script>
<style lang="scss" scoped>
.title-fiexed-bar {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
  border-top: none;

  .left {
    flex: 1;
    border-right: 1px solid #e5e5e5;
    padding-left: 20px;
    font-size: 14px;
    // font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;
    border-top: none;
    border-left: none;
  }

  .right {
    flex: 1;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;

    .small-title {
      color: #999;
      margin-left: 10px;
      font-weight: normal;
      font-size: 12px;
    }
  }
}

.basis-info {
  border-top: none;
  background: #fff;
  display: flex;

  .left-main {
    border-right: 1px solid #e5e5e5;
    flex: 1;
  }

  .right-main {
    flex: 1;
  }
}

.first-test-box {
  margin-top: 10px;
  background: #fff;
  display: flex;

  .left-main {
    flex: 1;
    border-right: 1px solid #e5e5e5;
  }

  .right-main {
    flex: 1;
  }
}

.use-farm-box {
  margin-top: 10px;
  background: #fff;
  display: flex;

  .left-main {
    flex: 1;
    border-right: 1px solid #e5e5e5;
  }

  .right-main {
    flex: 1;
  }
}

:deep(.date-wrap .el-input__wrapper) {
  width: 300px !important;
}

.medicine {
  margin-bottom: 20px;

  .bar {
    width: 80%;
    height: 40px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid #e5e5e5;
    border-top: none;

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
    border-top: 1px solid #e5e5e5;
  }
}

.save {
  color: $theme-color;
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
}

.upload-image {
  width: 100px;
  height: 100px;
  margin-right: 5px;
  border: 1px solid #e5e5e5;
  margin-bottom: 5px;
}

.edit,
.el-icon--right {
  color: $theme-color;
  cursor: pointer;
}

.el-icon--right {
  margin-right: 10px;
}

.test-soil-box {
  flex-wrap: wrap;
  margin-top: 10px;
  background: #fff;
  display: flex;

  .left-main {
    width: 50%;
    border-right: 1px solid #e5e5e5;
  }

  .right-main {
    width: 50%;
  }
}

.conclusion {
  margin-top: 10px;
  background: #fff;

  .conclusion-content {
    display: flex;
    align-items: start;
    font-size: 16px;
    padding: 20px;
    padding-top: 0;

    .time {
      width: 180px;
    }

    .text {
      flex: 1;

      .p1 {
        color: #999;
        margin-bottom: 10px;
      }
    }

    }
    }
  
    .status {
      width: 180px;
      display: flex;
      justify-content: end;
      align-items: center;
  
      span {
        margin-right: 10px;
        margin-left: 10px;
      }
  
      .close-icon {
        color: #999;
        cursor: pointer;
  }
}

.tip {
  position: relative;

  .close-icon {
    position: absolute;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
