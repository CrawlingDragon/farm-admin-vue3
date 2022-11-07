<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-soil' }">测土配方</el-breadcrumb-item>
        <el-breadcrumb-item>测土详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <AddSecondBar title="测土配方" :mobile="11" :time="123544" @del="del" />
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
            <el-form-item label="会员：" prop="nameId">
              <!-- <el-input v-model="ruleForm.nameId" class="w300" placeholder="姓名/手机号码" /> -->
              <UserSelectVue v-model:user="ruleForm.nameId" />
            </el-form-item>
            <el-form-item label="位置：" prop="address">
              <el-input
                v-model="ruleForm.address"
                class="w300"
                placeholder="请详细描述采样地址信息"
              />
            </el-form-item>
            <el-form-item prop="name" label="北纬：">
              <el-input
                v-model="ruleForm.latitude"
                class="w120 mr20"
                placeholder="如：30°12‘42’‘"
              />
              <span>东经：</span>
              <el-input v-model="ruleForm.longitude" class="w120" placeholder="如:120°12’18‘’" />
            </el-form-item>
            <el-form-item label="现种养种类：" prop="name">
              <KindSelect v-model:kind="ruleForm.nowKind"></KindSelect>
            </el-form-item>
            <el-form-item label="前种养种类：" prop="name">
              <KindSelect v-model:kind="ruleForm.beforeKind"></KindSelect>
            </el-form-item>
            <el-form-item label="数量:" prop="growNumber">
              <el-input
                v-model.number="ruleForm.number"
                label="right"
                placeholder="请输入数字"
                class="grow-number w200 mr30"
              />
              <UnitSelect v-model:unit="ruleForm.unit"></UnitSelect>
            </el-form-item>
            <el-form-item label="地形:" prop="name">
              <el-radio-group v-model="ruleForm.terrain">
                <el-radio label="平原" />
                <el-radio label="盆地" />
                <el-radio label="高原" />
                <el-radio label="丘陵" />
                <el-radio label="山地" />
                <el-radio label="水塘" />
                <el-radio label="水库" />
                <el-radio label="湖泊" />
                <el-radio label="河流" />
                <el-radio label="海洋" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="采样深度(cm)：" prop="name">
              <el-input v-model="ruleForm.sampleNumber" class="w300" />
            </el-form-item>
            <el-form-item label="采样日期：" prop="name" v-model="ruleForm.sampleDate" class="w300">
              <el-date-picker
                v-model="ruleForm.sampleDate"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="初复诊：" prop="name">
              <el-radio-group v-model="ruleForm.diagnosis">
                <el-radio label="初诊" />
                <el-radio label="复诊" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述：" prop="name">
              <el-input
                v-model="ruleForm.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="图片：" prop="name">
              <UploadImageVue v-model:images="ruleForm.image" />
            </el-form-item>
            <el-form-item label="测试人:" prop="name">
              <ExpertSelect v-model:expert="ruleForm.testPeople"></ExpertSelect>
            </el-form-item>
            <el-form-item label="测土状态:" prop="name">
              <el-radio-group v-model="ruleForm.soilStatus">
                <el-radio label="检测中" />
                <el-radio label="检测完成" />
                <el-radio label="给处方" />
              </el-radio-group>
            </el-form-item>
            <div class="tip">检测信息</div>
          </div>

          <div class="right-bar">
            <div class="right-box border">
              <div class="tip">测土配方结果</div>
              <el-form-item label="铵态氮含量：" prop="name">
                <div>
                  <p v-if="ruleForm.soilStatus === '检测中'">检测中...</p>
                  <el-input v-model="ruleForm.soilResult.an" class="w200 result-input" v-else />
                  <div class="standard">标准值：10-15mg/kg</div>
                </div>
              </el-form-item>
              <el-form-item label="速效磷含量：" prop="name">
                <div>
                  <p v-if="ruleForm.soilStatus === '检测中'">检测中...</p>
                  <el-input v-model="ruleForm.soilResult.lin" class="w200 result-input" v-else />
                  <div class="standard">极高：>=90|高：90-60|中：60-30|低30-15|极低：&lt;15</div>
                </div>
              </el-form-item>
              <el-form-item label="有效钾含量：" prop="name">
                <div>
                  <p v-if="ruleForm.soilStatus === '检测中'">检测中...</p>
                  <el-input v-model="ruleForm.soilResult.jia" class="w200 result-input" v-else />
                  <div class="standard">
                    极高： >=155|高：155-125|中：125-100|低100-70|极低：&lt;70
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="PH值：" prop="name">
                <div>
                  <el-input v-model="ruleForm.soilResult.ph" class="w200" />
                  <div class="standard">标中性值：7</div>
                </div>
              </el-form-item>
              <el-form-item label="有机质：" prop="name">
                <el-input v-model="ruleForm.soilResult.organic" class="w200 organic-input" />
                <div>
                  <div class="standard">
                    极高：>=25|高：25-20|中：20-15 | 低15-10 | 极低：&lt; 15
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="盐分" prop="name">
                <el-input v-model="ruleForm.soilResult.salt" class="w200 salt-input" />
              </el-form-item>
              <el-form-item label="结果描述" prop="name">
                <el-input
                  v-model="ruleForm.soilResult.soilDescribe"
                  class="w300"
                  type="textarea"
                  placeholder="请输入其他检测数据（如：有机质）、土壤养分综合评估、适合种植种类种类等信息"
                  show-word-limit
                  maxlength="2000"
                  rows="5"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10" v-if="ruleForm.soilStatus === '给处方'">
          <div class="left-bar">
            <div class="tip">
              处方信息
              <el-checkbox-group v-model="ruleForm.Prescribing.open" class="open-Prescribing">
                <el-checkbox label="公开处方" name="type" />
              </el-checkbox-group>
            </div>
            <el-form-item label="处方专家" prop="name">
              <ExpertSelect v-model:expert="ruleForm.Prescribing.expert" />
            </el-form-item>
            <el-form-item label="看诊结果" prop="name">
              <el-input
                v-model="ruleForm.Prescribing.result"
                class="w300"
                type="textarea"
                rows="5"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <div class="tip">用药信息</div>
            <div class="medicine">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">数量</div>
                <div class="del"></div>
              </div>
              <div class="bar" v-for="(item, index) in ruleForm.Prescribing.medicine">
                <div class="item">
                  <medicineSelectVue
                    v-model:drugName="item.drugName"
                    v-model:drugId="item.drugId"
                    v-model:size="item.sizeSelectOption"
                  />
                </div>
                <div class="item">
                  <el-select-v2
                    v-model="item.drugSpecIds"
                    :options="item.sizeSelectOption"
                    class="unit"
                  />
                </div>
                <div class="item">
                  <el-input v-model="item.drugQuantity" placeholder=""></el-input>
                </div>
                <div class="del" @click="delMedicine(index)">x</div>
              </div>
            </div>
            <el-button class="add-medicine-btn" @click="addMedicine">添加用药</el-button>
          </div>
          <div class="right-bar">
            <div class="tip">请选择处方模板</div>
            <div class="choose-box">
              <PrescribingTemplateVue @select-template="selectPrescribing">
              </PrescribingTemplateVue>
            </div>
          </div>
        </div>
        <div class="submit-bar">
          <div class="content">
            <el-button type="primary" size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >确定添加</el-button
            >
            <el-button size="large" @click="submitForm(ruleFormRef)" class="mr20"
              >确定并继续添加</el-button
            >
            <el-button size="large">取消</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
import { ElMessage, UploadProps, UploadRawFile, UploadFiles } from 'element-plus';
import { useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getAddSoil, AddSoilParams } from '@/http/getAddSoil';
import KindSelect from '@/components/kindSelect.vue';
import ExpertSelect from '@/components/expertSelect.vue';
import medicineSelectVue from '@/components/medicineSelect.vue';
import PrescribingTemplateVue from '@/components/prescribingTemplate.vue';
import UserSelectVue from '@/components/userSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import { alioss } from '@/common/js/alioss';
import UploadImageVue from '@/components/uploadImage.vue';

// alioss 请求函数
// let { putObject, getAccount } = alioss();
// const action = ref('');
// getAccount().then((res: any) => {
//   action.value = res + '/test.png';
//   console.log('res', res);
// });

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();
const cetuId = computed(() => route.params.cetuId);
// console.log('cetuId.value', cetuId.value);
const detailData = reactive<any>({
  userInfo: {},
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  nameId: '', //姓名
  address: '', //位置
  latitude: '', //经度
  longitude: '', //纬度
  nowKind: '', //现在种类
  beforeKind: '', //之前种类
  unit: '亩', //单位
  number: '', //数量
  terrain: '', //地形
  sampleNumber: '', // 采样深度
  sampleDate: '', //采样日期
  diagnosis: '初诊', // 初复诊
  describe: '', //描述
  image: [], // 图片
  aliossImage: [],
  testPeople: '', //测试人
  soilStatus: '检测完成', //测土状态
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
    medicine: [
      //用药信息
      {
        drugName: '', //药品名字
        drugId: '', //药品id
        drugSpecIds: '', //药品规格
        sizeSelectOption: [],
        drugQuantity: 0, // 药品数量
      },
    ],
  },
  templates: {}, // 选中的处方模板
});

const rules = reactive<FormRules>({});
// 模块化内容 1.用药记录 2.数量单位3，选择作物 a-b 排列的select

//顶部的删除按钮
const del = () => {
  console.log('del');
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
  // console.log('detail', detail);
  const { content, drugInfo } = detail;
  ruleForm.Prescribing.result = content;
  ruleForm.Prescribing.medicine = [];
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

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      setSoilData();
    } else {
      console.log('error submit!', fields);
    }
  });
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
    lastCetuNumber: '4654654',
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
    images: ruleForm.image,
    expertId: ruleForm.testPeople,
    status: ruleForm.soilStatus,
    soilResultsJson,
    chufangInfoJson,
    yongyaoInfoJson,
  };
  return params;
});

async function setSoilData() {
  let r = await getAddSoil(soilParams.value);

  ElMessage(r.msg);
}

onMounted(() => {
  emit('update:hideAside', false);
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
