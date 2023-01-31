<template>
  <div class="mb50">
    <!-- <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-point' }">观测点</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          routeName === 'examine-point-add' ? '新增观测点' : '观测点详情:' + ruleForm.pointNumber
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <AddPointHeader :pointNumber="ruleForm.pointNumber" />
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
              :title="pointId ? '观测点详情' : '观测点信息'"
              :mobile="pointId ? ruleForm.centerMobile : ''"
              :time="pointId ? ruleForm.centerTime : ''"
              class="left"
              :onlyShowTitle="pointId ? true : false"
              ><div class="save" @click="submitForm(ruleFormRef, '/examine-point-detail')">保存</div>
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
              <el-input
                v-model="ruleForm.pointName"
                class="w300"
                placeholder="请输入观测点名称"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="种类:" prop="kind">
              <KindSelect
                v-if="unitAndKindSelectOption.kindOption.length !== 0"
                v-model:kind="ruleForm.kind"
                :options="unitAndKindSelectOption.kindOption"
              ></KindSelect>
            </el-form-item>
            <el-form-item label="试验地点:" prop="address">
              <el-input
                v-model="ruleForm.address"
                class="w300"
                placeholder="请填写试验地点"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item prop="latitude" label="北纬:">
              <el-input v-model="ruleForm.latitude" class="w120 mr20" placeholder="如:30°12'42”" />
              <span class="mr10">东经:</span>
              <el-input v-model="ruleForm.longitude" class="w120" placeholder="如:120°12'18”" />
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              <el-input
                v-model.number="ruleForm.number"
                label="right"
                placeholder="请输入数字"
                class="grow-number w200 mr30"
              />
              <UnitSelect
                v-model:unit="ruleForm.unit"
                v-if="unitAndKindSelectOption.unitOption.length !== 0"
                :options="unitAndKindSelectOption.unitOption"
              ></UnitSelect>
            </el-form-item>
            <el-form-item
              label="开始观察日期:"
              prop="sampleDate"
              v-model="ruleForm.sampleDate"
              class="w300"
              readonly
            >
              <el-date-picker
                v-model="ruleForm.sampleDate"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300 date-wrap"
                style="width: 300px"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            <el-form-item label="试验会员:" prop="nameId">
              <UserSelectVue
                v-model:user="ruleForm.nameId"
                :disabled="!!uId || routeName !== 'examine-point-add'"
              />
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              <el-input
                v-model="ruleForm.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="图片:" prop="image">
              <UploadImageVue v-model:images="ruleForm.image" :limit="4" />
            </el-form-item>
          </div>
          <div class="right-main"></div>
        </div>
        <div class="first-test-box border">
          <div class="left-main">
            <div class="tip">首次测土信息</div>
            <el-form-item label="最近测土记录" prop="leastSoilRecord.soilId">
              <LatestTestSoilSelectVue
                v-if="selectOptions.cetuOrderList.length != 0"
                v-model:soilTestRecord="ruleForm.leastSoilRecord.soilId"
                :soilSelectOption="selectOptions.cetuOrderList"
                :clearable="true"
              >
              </LatestTestSoilSelectVue>
            </el-form-item>
            <template v-if="ruleForm.leastSoilRecord.soilId !== ''">
              <el-form-item label="测土状态:" prop=""
                >{{ ruleForm.leastSoilRecord.status }}
              </el-form-item>
              <el-form-item label="取样日期:" prop="">
                {{ ruleForm.leastSoilRecord.date }}</el-form-item
              >
              <el-form-item label="铵态氮含量:" prop=""
                >{{ ruleForm.leastSoilRecord.an }}
              </el-form-item>
              <el-form-item label="速效磷含量:" prop=""
                >{{ ruleForm.leastSoilRecord.lin }}
              </el-form-item>
              <el-form-item label="有效钾含量:" prop=""
                >{{ ruleForm.leastSoilRecord.jia }}
              </el-form-item>
              <el-form-item label="pH值:" prop="">{{ ruleForm.leastSoilRecord.ph }} </el-form-item>
              <el-form-item label="盐分:" prop=""
                >{{ ruleForm.leastSoilRecord.salt }}
              </el-form-item>
            </template>
          </div>
          <div class="right-main"></div>
        </div>
        <div class="use-farm-box border">
          <div class="left-main">
            <div class="tip">使用农资信息</div>
            <el-form-item
              label="采样日期:"
              prop="leftUseFormInfo.date"
              v-model="ruleForm.leftUseFormInfo.date"
              class="w300"
              readonly
            >
              <el-date-picker
                v-model="ruleForm.leftUseFormInfo.date"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300"
                style="width: 300px"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            <el-form-item label="描述:" prop="leftUseFormInfo.describe">
              <el-input
                v-model="ruleForm.leftUseFormInfo.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
                placeholder="输入用药描述"
              />
            </el-form-item>
            <el-form-item prop="leftUseFormInfo.medicine" label-width="100px">
              <Medicine v-model:medicineProp="ruleForm.leftUseFormInfo.medicine" />
            </el-form-item>
            <!-- <div class="medicine" v-if="ruleForm.leftUseFormInfo.medicine.length !== 0">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">数量</div>
                <div class="del"></div>
              </div>

              <div class="bar" v-for="(item, index) in ruleForm.leftUseFormInfo.medicine">
                <div class="item">
                  <medicineSelectVue
                    v-model:drugName="item.drugName"
                    v-model:drugId="item.drugId"
                    v-model:size="item.sizeSelectOption"
                  />
                </div>
                <div class="item">
                  <el-select v-model="item.drugSpecIds" placeholder="请选择" class="unit">
                    <el-option
                      v-for="it in item.sizeSelectOption"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value"
                    >
                    </el-option>
                  </el-select>
                 <el-select-v2
                    v-model="item.drugSpecIds"
                    :options="item.sizeSelectOption"
                    class="unit"
                  /> 
           </div>
                <div class="item">
                  <el-input v-model="item.drugQuantity" placeholder=""></el-input>
                </div>
                <div class="del" @click="delMedicine(index, 'left')">x</div>
              </div>
            </div>
            <el-form-item>
              <el-button @click="addMedicine('left')">添加用药</el-button>
            </el-form-item> -->
          </div>
          <div class="right-main">
            <div class="tip">使用农资信息</div>
            <el-form-item
              label="采样日期:"
              prop="rightUseFormInfo.date"
              v-model="ruleForm.rightUseFormInfo.date"
              class="w300"
              readonly
            >
              <el-date-picker
                v-model="ruleForm.rightUseFormInfo.date"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300"
                style="width: 300px"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            <el-form-item label="描述:" prop="rightUseFormInfo.describe">
              <el-input
                v-model="ruleForm.rightUseFormInfo.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
                placeholder="输入用药描述"
              />
            </el-form-item>
            <el-form-item label-width="100px">
              <Medicine v-model:medicineProp="ruleForm.rightUseFormInfo.medicine" />
            </el-form-item>
            <!-- <Medicine v-model:medicineProp="ruleForm.Prescribing.medicine" /> -->
            <!-- <div class="medicine" v-if="ruleForm.rightUseFormInfo.medicine.length !== 0">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">数量</div>
                <div class="del"></div>
              </div>

              <div class="bar" v-for="(item, index) in ruleForm.rightUseFormInfo.medicine">
                <div class="item">
                  <medicineSelectVue
                    v-model:drugName="item.drugName"
                    v-model:drugId="item.drugId"
                    v-model:size="item.sizeSelectOption"
                  />
                </div>
                <div class="item">
                  <el-select v-model="item.drugSpecIds" placeholder="请选择" class="unit">
                    <el-option
                      v-for="it in item.sizeSelectOption"
                      :key="it.value"
                      :label="it.label"
                      :value="it.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="item">
                  <el-input v-model="item.drugQuantity" placeholder=""></el-input>
                </div>
                <div class="del" @click="delMedicine(index, 'right')">x</div>
              </div>
            </div>
            <el-form-item>
              <el-button @click="addMedicine('right')">添加用药</el-button>
            </el-form-item> -->
          </div>
        </div>
        <div class="submit-bar" v-if="!pointId">
          <!-- 这是新增页面的按钮 -->
          <div class="content">
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, '/examine-point')"
              class="mr20"
              >确定添加</el-button
            >
            <el-button size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >确定并继续添加</el-button
            >
            <el-button size="large" @click="cancel">取消</el-button>
          </div>
        </div>
        <div class="submit-bar" v-else>
          <div class="content">
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, '/examine-point-detail')"
              class="mr20"
              >保存</el-button
            >
            <el-button size="large" @click="cancel">取消</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted, watch } from 'vue';
import { ElMessage, UploadProps, UploadRawFile, UploadFiles, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getTestExpert, addObservePoint, getObservePointDetail } from '@/http';
import { getSelectInfo } from '../http/getSelectInfo';
import KindSelect from '@/components/kindSelect.vue';
import UnitSelect from '@/components/unitSelect.vue';
import UserSelectVue from '@/components/userSelect.vue';
import medicineSelectVue from '@/components/medicineSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import UploadImageVue from '@/components/uploadImage.vue';
import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';
import { integrationMedicine, transformImageParams } from '@/common/js/util';
import AddPointHeader from '@/components/add-point-header.vue';
import Medicine from '@/components/medicine.vue';
// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const pointId = computed(() => route.params.pointId);
const uId = computed(() => route.query.uId);
const routeName = computed(() => route.name);

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
  nameId: '', //试验会员
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
});

// 用于select的option设置，数据化
const selectOptions = reactive({
  expertList: [], // 测试专家
  cetuOrderList: [], // 最近测土记录
  // recipeTemList: [], //处方模板列表
});

const unitAndKindSelectOption = reactive({
  unitOption: [], //单位selectOption
  kindOption: [], //种类selectOption
});

// 测土配方，处方模板，专家列表的select option的数据请求
async function setExpertSoilTemplateSelectData() {
  let { expertList, cetuOrderList } = await getTestExpert();
  selectOptions.expertList = expertList;
  // console.log('expertList', expertList);
  // selectOptions.recipeTemList = recipeTemList;
  selectOptions.cetuOrderList = cetuOrderList;
}
//单位和种类的select 请求
async function setUnitAndKindSelectData() {
  let { unitArr, categoryArr } = await getSelectInfo();
  unitAndKindSelectOption.unitOption = unitArr;
  // console.log('expertList', expertList);
  // selectOptions.recipeTemList = recipeTemList;
  unitAndKindSelectOption.kindOption = categoryArr;
}
//自定义左边用药不能为空
const validatorMedicine = (rule: any, value: any, callback: any) => {
  if (value.length !== 0) {
    if (value[0].drugId == '' || value[0].drugSpecIds == '') {
      callback(new Error('请至少添加一种用药'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  pointName: [{ required: true, message: '观测点名称', trigger: 'change' }],
  kind: [{ required: true, message: '种类不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '试验地点不能为空', trigger: 'change' }],
  number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  sampleDate: [{ required: true, message: '开始观察日期不能为空', trigger: 'change' }],
  nameId: [{ required: true, message: '试验会员不能为空', trigger: 'change' }],
  'leftUseFormInfo.date': [{ required: true, message: '开始用药日期不能为空', trigger: 'change' }],
  'leftUseFormInfo.medicine': [
    { required: true, message: '请至少添加一种用药', trigger: 'blur' },
    { validator: validatorMedicine, trigger: 'change' },
  ],
  'leftUseFormInfo.describe': [{ required: true, message: '用药描述不能为空', trigger: 'change' }],
  'rightUseFormInfo.describe': [{ required: true, message: '用药描述不能为空', trigger: 'change' }],
});

//顶部的删除按钮
// const del = () => {
//   ElMessageBox.confirm('是否要删除测土配方', '提示')
//     .then(async (res) => {
//       let r = await getDelSoil(ruleForm.cetuId);
//       if (r.code) {
//         ElMessage.error(r.msg);
//       } else {
//         ElMessage.success('删除成功');
//         router.replace({ path: '/examine-soil' });
//       }
//       // console.log('r', r);
//       //删除配方
//     })
//     .catch(() => {});
// };

// 添加用药
// function addMedicine(target: string) {
//   let key: 'leftUseFormInfo' | 'rightUseFormInfo';
//   key = target === 'left' ? 'leftUseFormInfo' : 'rightUseFormInfo';
//   ruleForm[key].medicine.push({
//     drugName: '', //药品名字
//     drugId: '', //药品id
//     drugSpecIds: '', //药品规格
//     sizeSelectOption: [],
//     drugQuantity: 1, // 药品数量
//   });
// }

// 删除用药
// function delMedicine(index: number, target: string) {
//   let key: 'leftUseFormInfo' | 'rightUseFormInfo';
//   key = target === 'left' ? 'leftUseFormInfo' : 'rightUseFormInfo';
//   ruleForm[key].medicine.splice(index, 1);
// }

// 整合自定义用药数组 和 后端用药数组
// function integrationMedicine(drugInfo: any, target: 'leftUseFormInfo' | 'rightUseFormInfo') {
//   ruleForm[target].medicine = [];
//   if (drugInfo.length === 0) {
//     // ruleForm[target].medicine.push({
//     //   drugName: '', //药品名字
//     //   drugId: '', //药品id
//     //   drugSpecIds: '', //药品规格
//     //   sizeSelectOption: [],
//     //   drugQuantity: 1, // 药品数量
//     // });
//     return;
//   }
//   // console.log('drugInfo', drugInfo);

//   drugInfo.forEach((item: any) => {
//     // if (ruleForm[target].medicine.length > drugInfo.length) {
//     //   return;
//     // }
//     ruleForm[target].medicine.push({
//       drugName: item.drugName, //药品名字
//       drugId: item.drugId, //药品id
//       drugSpecIds: item.drugSpec, //药品规格
//       sizeSelectOption: [],
//       drugQuantity: +item.drugQuantity, // 药品数量
//     });
//     // ruleForm[target].medicine[index].drugName = item.drugName;
//     // ruleForm[target].medicine[index].drugSpecIds = item.drugSpec;
//     // ruleForm[target].medicine[index].drugQuantity = item.drugQuantity;
//   });
//   // console.log('ruleForm[target]', ruleForm[target]);
//   // console.log('ruleForm[target].medicine', ruleForm[target].medicine);
// }

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, pageName?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setPintData().then((res) => {
        if (pageName) {
          if (pointId.value) {
            setTimeout(() => {
              router.push({ path: `${pageName}/${pointId.value}` });
            }, 500);
          } else {
            setTimeout(() => {
              router.push({ path: pageName });
            }, 500);
          }
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};

// //保存观测点数据
// function save() {}

// 取消按钮
const cancel = function () {
  router.go(-1);
};

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
    uid: ruleForm.nameId,
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
  console.log('r', r);
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
  if (uId.value) {
    ruleForm.nameId = +uId.value as any;
    // ruleForm.nameId = '4279';
  }
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
  ruleForm.kind = observeInfo.zuowuId;
  ruleForm.address = observeInfo.address;
  ruleForm.latitude = observeInfo.northLat;
  ruleForm.longitude = observeInfo.eastLng;
  ruleForm.number = observeInfo.mushu;
  ruleForm.unit = observeInfo.unitId;
  ruleForm.sampleDate = observeInfo.observeTime;
  ruleForm.nameId = observeInfo.uid;
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

  ruleForm.leftUseFormInfo.medicine = integrationMedicine(useDrugInfo.useYongyaoLists);

  ruleForm.rightUseFormInfo.date = useDrugInfo.contrastUseDrugTime;
  ruleForm.rightUseFormInfo.describe = useDrugInfo.contrastUseDrugContent;
  ruleForm.rightUseFormInfo.medicine = integrationMedicine(useDrugInfo.contrastUseYongyaoLists);
}

//watch 第一次测土单号变化
watch(
  () => ruleForm.leastSoilRecord.soilId,
  (newVal) => {
    // console.log('newVal', newVal);
    selectOptions.cetuOrderList.forEach((item: any) => {
      if (item.cetuNumber === newVal) {
        // console.log('item', item);
        ruleForm.leastSoilRecord.status = item.statusTips;
        ruleForm.leastSoilRecord.date = item.dateCollected;
        ruleForm.leastSoilRecord.an = item.atdVal;
        ruleForm.leastSoilRecord.lin = item.sxlVal;
        ruleForm.leastSoilRecord.jia = item.yxjVal;
        ruleForm.leastSoilRecord.ph = item.phVal;
        ruleForm.leastSoilRecord.salt = item.saltVal;
      }
    });
  }
);
onMounted(async () => {
  emit('update:hideAside', false);
  setExpertSoilTemplateSelectData();
  setUnitAndKindSelectData();
  getPointDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime()
}
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
.save {
  color: $theme-color;
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
}
</style>
