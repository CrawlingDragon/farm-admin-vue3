<template>
  <div class="mb50">
    <!-- <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-soil' }">测土配方</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          routeName === 'examine-soil-add' ? '新增测土' : '测土详情:' + ruleForm.cetuId
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <AddSoilHeader :cetu-id="ruleForm.testingsoilNumber" />
    <AddSecondBar
      title="测土配方"
      :mobile="userInfo.mobile"
      :time="userInfo.time"
      @del="del"
      v-if="cetuId"
    />
    <div class="content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <div class="top-box bg-w border">
          <div class="left-bar">
            <div class="tip">土壤信息</div>
            <el-form-item label="会员:" prop="nameId" v-if="!cetuId">
              <UserSelectVue v-model:user="ruleForm.nameId" :disabled="!!uId" />
            </el-form-item>
            <el-form-item label="会员:" v-else>
              {{ userInfo.name }} {{ userInfo.mobile }}
            </el-form-item>
            <el-form-item label="位置:" prop="address">
              <el-input
                v-model="ruleForm.address"
                class="w300"
                placeholder="请详细描述采样地址信息"
              />
            </el-form-item>
            <el-form-item prop="name" label="北纬:">
              <el-input v-model="ruleForm.latitude" class="w120 mr20" placeholder="如:30°12‘42’‘" />
              <span>东经:</span>
              <el-input v-model="ruleForm.longitude" class="w120" placeholder="如:120°12’18‘’" />
            </el-form-item>
            <el-form-item label="现种养种类:" prop="nowKind">
              <KindSelect
                v-model:kind="ruleForm.nowKind"
                :options="kindOptions"
                v-if="kindOptions.length != 0"
              ></KindSelect>
            </el-form-item>
            <el-form-item label="前种养种类:" prop="beforeKind">
              <KindSelect
                v-model:kind="ruleForm.beforeKind"
                :options="kindOptions"
                v-if="kindOptions.length != 0"
              ></KindSelect>
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
                v-if="unitOptions.length != 0"
                :options="unitOptions"
              ></UnitSelect>
            </el-form-item>
            <el-form-item label="地形:" prop="terrain">
              <el-radio-group v-model="ruleForm.terrain">
                <el-radio :label="1">平原</el-radio>
                <el-radio :label="2">盆地</el-radio>
                <el-radio :label="3">高原</el-radio>
                <el-radio :label="4">丘陵</el-radio>
                <el-radio :label="5">山地</el-radio>
                <el-radio :label="6">水塘</el-radio>
                <el-radio :label="7">水库</el-radio>
                <el-radio :label="8">湖泊</el-radio>
                <el-radio :label="9">河流</el-radio>
                <el-radio :label="10">海洋</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="采样深度(cm):" prop="sampleNumber">
              <el-input v-model="ruleForm.sampleNumber" class="w300" />
            </el-form-item>
            <el-form-item
              label="采样日期:"
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
                class="w300"
                style="width: 300px"
                value-format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            <el-form-item label="初复诊:" prop="diagnosis">
              <el-radio-group v-model="ruleForm.diagnosis">
                <el-radio :label="1">初诊</el-radio>
                <el-radio :label="2">复诊</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              <el-input
                v-model="ruleForm.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
                placeholder="请输入描述"
              />
            </el-form-item>
            <el-form-item label="图片:" prop="image">
              <UploadImageVue v-model:images="ruleForm.image" />
            </el-form-item>
            <el-form-item label="测试专家:" prop="testPeople">
              <ExpertSelect
                v-model:expert="ruleForm.testPeople"
                v-if="expertListArr.length != 0"
                :options="expertListArr"
              ></ExpertSelect>
            </el-form-item>
            <div class="tip">检测信息</div>
            <el-form-item label="测土状态:" prop="soilStatus">
              <el-radio-group v-model="ruleForm.soilStatus">
                <el-radio :label="1">检测中</el-radio>
                <el-radio :label="2">检测完成</el-radio>
                <el-radio :label="3">给处方</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="right-bar">
            <div class="right-box border">
              <div class="tip">测土配方结果</div>
              <el-form-item label="铵态氮含量:" v-if="ruleForm.soilStatus === 1">
                <div>
                  <p>检测中...</p>
                  <div class="standard">标准值:10-15mg/kg</div>
                </div>
              </el-form-item>
              <el-form-item label="铵态氮含量:" prop="soilResult.an" v-else>
                <div>
                  <!-- <p v-if="ruleForm.soilStatus === 1">检测中...</p> -->
                  <el-input v-model="ruleForm.soilResult.an" class="w200 result-input" />
                  <div class="standard">标准值:10-15mg/kg</div>
                </div>
              </el-form-item>
              <el-form-item label="速效磷含量:" v-if="ruleForm.soilStatus === 1">
                <div>
                  <p>检测中...</p>
                  <div class="standard">极高:>=90|高:90-60|中:60-30|低30-15|极低:&lt;15</div>
                </div>
              </el-form-item>
              <el-form-item label="速效磷含量:" prop="soilResult.lin" v-else>
                <div>
                  <el-input v-model="ruleForm.soilResult.lin" class="w200 result-input" />
                  <div class="standard">极高:>=90|高:90-60|中:60-30|低30-15|极低:&lt;15</div>
                </div>
              </el-form-item>
              <el-form-item label="有效钾含量:" v-if="ruleForm.soilStatus === 1">
                <div>
                  <p>检测中...</p>

                  <div class="standard">极高: >=155|高:155-125|中:125-100|低100-70|极低:&lt;70</div>
                </div>
              </el-form-item>
              <el-form-item label="有效钾含量:" prop="soilResult.jia" v-else>
                <div>
                  <el-input v-model="ruleForm.soilResult.jia" class="w200 result-input" />
                  <div class="standard">极高: >=155|高:155-125|中:125-100|低100-70|极低:&lt;70</div>
                </div>
              </el-form-item>
              <el-form-item label="PH值:" prop="ph">
                <div>
                  <el-input v-model="ruleForm.soilResult.ph" class="w200" />
                  <div class="standard">标中性值:7</div>
                </div>
              </el-form-item>
              <el-form-item label="有机质:" prop="organic">
                <el-input v-model="ruleForm.soilResult.organic" class="w200 organic-input" />
                <div>
                  <div class="standard">极高:>=25|高:25-20|中:20-15 | 低15-10 | 极低:&lt; 15</div>
                </div>
              </el-form-item>
              <el-form-item label="盐分" prop="salt">
                <el-input v-model="ruleForm.soilResult.salt" class="w200 salt-input" />
              </el-form-item>
              <el-form-item label="结果描述" prop="soilDescribe">
                <el-input
                  v-model="ruleForm.soilResult.soilDescribe"
                  class="w300"
                  type="textarea"
                  placeholder="请输入其他检测数据（如:有机质）、土壤养分综合评估、适合种植种类种类等信息"
                  show-word-limit
                  maxlength="2000"
                  rows="5"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10" v-if="ruleForm.soilStatus === 3">
          <div class="left-bar">
            <div class="tip">
              处方信息
              <el-checkbox-group v-model="ruleForm.Prescribing.open" class="open-Prescribing">
                <el-checkbox label="公开处方" name="type" />
              </el-checkbox-group>
            </div>
            <el-form-item label="处方专家" prop="Prescribing.expert">
              <ExpertSelect
                v-model:expert="ruleForm.Prescribing.expert"
                :options="expertListArr"
                v-if="expertListArr.length != 0"
              />
            </el-form-item>
            <el-form-item label="看诊结果" prop="Prescribing.result">
              <el-input
                v-model="ruleForm.Prescribing.result"
                class="w300"
                type="textarea"
                rows="5"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="最近测土记录" prop="leastSoilRecord">
              <LatestTestSoilSelectVue
                v-model:soilTestRecord="ruleForm.Prescribing.leastSoilRecord"
                :soilSelectOption="selectOptions.cetuOrderList"
              >
              </LatestTestSoilSelectVue>
            </el-form-item>
            <div class="tip">用药信息</div>
            <Medicine v-model:medicineProp="ruleForm.Prescribing.medicine" />
          </div>
          <div class="right-bar">
            <div class="tip">请选择处方模板</div>
            <div class="choose-box">
              <PrescribingTemplateVue @select-template="selectPrescribing">
              </PrescribingTemplateVue>
            </div>
          </div>
        </div>
        <div class="submit-bar" v-if="!cetuId">
          <!-- 这是新增页面的按钮 -->
          <div class="content">
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, 'goPage')"
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
            <el-button type="primary" size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >保存</el-button
            >
            <!-- <el-button size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >确定并继续添加</el-button
            > -->
            <el-button size="large" @click="cancel">取消</el-button>
          </div>
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
import { getTestSoilDetail, getDelSoil } from '@/http';
import KindSelect from '@/components/kindSelect.vue';
import UnitSelect from '@/components/unitSelect.vue';
import ExpertSelect from '@/components/expertSelect.vue';
import PrescribingTemplateVue from '@/components/prescribingTemplate.vue';
import UserSelectVue from '@/components/userSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import UploadImageVue from '@/components/uploadImage.vue';
import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';
import { integrationMedicine, transformImageParams } from '@/common/js/util';
import AddSoilHeader from '@/components/add-soil-header.vue';
import Medicine from '@/components/medicine.vue';
import { useKindUnitSelectOptions } from '@/hooks/useKindUnitSelectOptions';
import { useExpertTemplateTestSelectOptions } from '@/hooks/useExpertTemplateTestSelectOptions';
const { kindOptions, unitOptions } = useKindUnitSelectOptions();
let { expertListArr, cetuOrderListArr, recipeTemListArr } = useExpertTemplateTestSelectOptions();

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const cetuId = computed(() => route.params.cetuId);
const uId = computed(() => route.query.uId);
const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  testingsoilNumber: '', //测土数字
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
  image: [] as any, // 图片
  // aliossImage: [],
  testPeople: '' as any, //测试专家
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
  testPeople: [{ required: true, message: '测试专家不能为空', trigger: 'change' }],
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

// 选择模板
function selectPrescribing(detail: any) {
  console.log('detail', detail);
  const { content, drugInfo } = detail;
  ruleForm.Prescribing.result = content;
  ruleForm.Prescribing.medicine = integrationMedicine(drugInfo);
}

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!');
      let r = setSoilData().then((res) => {
        // console.log('res', res);
        if (goPage) {
          setTimeout(() => {
            router.push('/examine-soil');
          }, 500);
        } else {
          resetForm(ruleFormRef.value);
        }
      });
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
};
//成功之后，清空数据
const resetForm = (formEl: FormInstance | undefined) => {
  if (cetuId.value) {
    router.push(`/examine-soil-detail/${cetuId.value}`);
  } else {
    router.go(0);
  }
};

// 取消按钮
const cancel = function () {
  // router.push('/examine-soil');
  router.go(-1);
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
  let isPublicNum = ruleForm.Prescribing.open[0] == '公开处方' ? 1 : 0;
  let chufangInfoJson = JSON.stringify({
    isPublic: isPublicNum,
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
    images: transformImageParams(ruleForm.image),
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
  if (soilParams.value.expertId instanceof Object) {
    soilParams.value.expertId = soilParams.value.expertId.value;
  }
  let r = await getAddSoil(soilParams.value);
  if (r.code) {
    ElMessage.error(r.msg);
    return Promise.reject('error');
  } else {
    if (cetuId.value) {
      ElMessage.success('已保存');
    } else {
      ElMessage.success('已添加');
    }
    return Promise.resolve('ok');
  }
}

const userInfo = reactive({ mobile: 0, time: 0, name: '' });
async function getSoilDetail() {
  if (uId.value) {
    ruleForm.nameId = +uId.value as any;
    // ruleForm.nameId = '4279';
  }
  // 没有cetuId，说明是新增页面不需要请求详情数据
  if (!cetuId.value) return;
  let r = await getTestSoilDetail(cetuId.value as any);
  // console.log('r', r);
  let s = r.soilInfo;
  let cetuResult = r.cetuResult;
  let chufangInfo = r.chufangInfo;
  let enterInfo = r.enterInfo;
  ruleForm.nameId = s.uid;
  ruleForm.cetuId = s.cetuId;
  ruleForm.testingsoilNumber = enterInfo.testingsoilNumber;
  userInfo.mobile = enterInfo.enterMobile;
  userInfo.time = enterInfo.enterTime;
  userInfo.name = s.username;
  ruleForm.address = s.address;
  ruleForm.latitude = s.northLat;
  ruleForm.longitude = s.eastLng;
  ruleForm.nowKind = s.zuowuId;
  ruleForm.beforeKind = s.beforeZuowuId == 0 ? '' : s.beforeZuowuId;
  ruleForm.unit = s.unitId;
  ruleForm.number = s.mushu;
  ruleForm.terrain = +s.dixing;
  ruleForm.sampleNumber = s.depth;
  ruleForm.sampleDate = s.datecollected;
  ruleForm.diagnosis = +s.isFrist;
  ruleForm.describe = s.soildescribe;
  ruleForm.image = s.images;
  ruleForm.testPeople = { value: s.expertId, label: s.expertName };
  ruleForm.soilStatus = +r.status;
  ruleForm.soilResult.an = cetuResult.atdVal;
  ruleForm.soilResult.lin = cetuResult.sxlVal;
  ruleForm.soilResult.jia = cetuResult.yxjVal;
  ruleForm.soilResult.ph = cetuResult.phVal;
  ruleForm.soilResult.organic = cetuResult.organicVal;
  ruleForm.soilResult.salt = cetuResult.saltVal;
  ruleForm.soilResult.soilDescribe = cetuResult.resultVal;
  ruleForm.Prescribing.open = chufangInfo.isPublic == 1 ? ['公开处方'] : [];
  ruleForm.Prescribing.expert = chufangInfo.expertId;
  ruleForm.Prescribing.result = chufangInfo.chufangResult;
  ruleForm.Prescribing.leastSoilRecord = chufangInfo.lastCetuNumber;
  ruleForm.Prescribing.medicine = integrationMedicine(r.drugInfo);
}
onMounted(async () => {
  emit('update:hideAside', false);
  getSoilDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
};
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
