<template>
  <div class="mb50">
    <!-- <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-xunzhenlist' }">巡诊记录</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          routeName === 'examine-xunzhen-add'
            ? '新增巡诊'
            : '巡诊详情:' + ruleForm.enterInfo.zuoxunNumber
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <AddXunzhenHeader :zuoxunNumber="ruleForm.enterInfo.zuoxunNumber" />
    <AddSecondBar
      v-if="routeName !== 'examine-xunzhen-add'"
      title="巡诊详情"
      :mobile="ruleForm.enterInfo.enterMobile"
      :time="ruleForm.enterInfo.enterTime"
      class="left"
      ><div
        class="save mr10"
        @click="submitForm(ruleFormRef, '/examine-xunzhen-detail/' + xunzhenId, '保存')"
      >
        保存
      </div>
    </AddSecondBar>
    <div class="content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
      >
        <div class="top-box bg-w border">
          <div class="left-bar">
            <div class="tip">种类病情资料</div>
            <el-form-item label="会员:" prop="nameId" v-if="!xunzhenId">
              <UserSelectVue v-model:user="ruleForm.nameId" :disabled="!!uId" />
            </el-form-item>
            <el-form-item label="会员:" v-else>
              {{ ruleForm.username }} {{ ruleForm.userMobile }}
            </el-form-item>

            <el-form-item label="巡诊种类:" prop="nowKind">
              <KindSelect
                v-model:kind="ruleForm.nowKind"
                v-if="kindOptions.length != 0"
                :options="kindOptions"
              ></KindSelect>
            </el-form-item>

            <el-form-item label="种养模式:" prop="plantType">
              <el-radio-group v-model="ruleForm.plantType">
                <el-radio label="1">露地</el-radio>
                <el-radio label="2">大棚</el-radio>
                <el-radio label="3">人造水域</el-radio>
                <el-radio label="4">自然水域</el-radio>
                <el-radio label="5">野生</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="病发程度:" prop="degree">
              <el-radio-group v-model="ruleForm.degree">
                <el-radio label="1">零星发生</el-radio>
                <el-radio label="2">局部发生</el-radio>
                <el-radio label="3">整片发生</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              <el-input
                v-model="ruleForm.number"
                label="right"
                placeholder="请输入数字"
                class="grow-number w200 mr27"
                @input="numberKeyup"
              />
              <UnitSelect
                v-model:unit="ruleForm.unit"
                v-if="unitOptions.length != 0"
                :options="unitOptions"
              ></UnitSelect>
            </el-form-item>
            <el-form-item
              label="巡诊日期:"
              prop="time"
              v-model="ruleForm.time"
              class="date"
              readonly
            >
              <el-date-picker
                v-model="ruleForm.time"
                type="date"
                placeholder="选择时间"
                size="large"
                value-format="YYYY-MM-DD"
                class="date-wrap-300"
                :disabled-date="disabledDate"
              />
            </el-form-item>
            <el-form-item label="巡诊地点:" prop="address">
              <el-input
                v-model="ruleForm.address"
                label="right"
                placeholder="请输入巡诊地点"
                class="w300"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="初复诊:" prop="diagnosis">
              <el-radio-group v-model="ruleForm.diagnosis">
                <el-radio :label="1">初诊</el-radio>
                <el-radio :label="2">复诊</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="病情描述:" prop="describe">
              <el-input
                v-model="ruleForm.describe"
                placeholder="输入具体描述"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="图片:" prop="image">
              <UploadImageVue v-model:images="ruleForm.image" />
            </el-form-item>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="left-bar">
            <div class="tip">处方信息</div>
            <el-form-item label="巡诊专家:" prop="Prescribing.expert">
              <ExpertSelect
                v-if="expertListArr.length != 0"
                v-model:expert="ruleForm.Prescribing.expert"
                :options="expertListArr"
              />
            </el-form-item>
            <el-form-item label="看诊结果:" prop="Prescribing.result">
              <el-input
                placeholder="输入具体描述"
                v-model="ruleForm.Prescribing.result"
                class="w300"
                type="textarea"
                rows="5"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="测土记录" prop="leastSoilRecord">
              <LatestTestSoilSelectVue
                v-model:soilTestRecord="ruleForm.Prescribing.soilRecord"
                :soilSelectOption="cetuOrderListArr"
              >
              </LatestTestSoilSelectVue>
            </el-form-item>
            <div class="tip">用药信息</div>

            <Medicine v-model:medicineProp="ruleForm.Prescribing.medicine" />
          </div>

          <div class="right-bar">
            <div class="tip">请选择处方模板</div>
            <div class="choose-box">
              <PrescribingTemplateVue
                v-if="recipeTemListArr.length != 0"
                @select-template="selectPrescribing"
                :recipeTemList="recipeTemListArr"
              >
              </PrescribingTemplateVue>
            </div>
          </div>
        </div>

        <div class="submit-bar" v-if="routeName == 'examine-xunzhen-add'">
          <div class="content">
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, '/examine-xunzhenlist', '添加')"
              class="mr20"
              >确定添加</el-button
            >
            <el-button size="large" @click="submitForm(ruleFormRef, undefined, '添加')" class="mr20"
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
              @click="submitForm(ruleFormRef, '/examine-xunzhen-detail/' + xunzhenId, '保存')"
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
import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
import { ElMessage, UploadProps, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getDelSoil, getAddEditZuoXun, getZuoXunDetail } from '@/http';
import KindSelect from '@/components/kindSelect.vue';
import UnitSelect from '@/components/unitSelect.vue';
import ExpertSelect from '@/components/expertSelect.vue';
// import medicineSelectVue from '@/components/medicineSelect.vue';
import PrescribingTemplateVue from '@/components/prescribingTemplate.vue';
import UserSelectVue from '@/components/userSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import UploadImageVue from '@/components/uploadImage.vue';
import LatestTestSoilSelectVue from '@/components/latestTestSoilSelect.vue';
// import DrugSizeSelect from '@/components/drugSizeSelect.vue';
import Medicine from '@/components/medicine.vue';
import { transformImageParams, integrationMedicine } from '@/common/js/util';
import { useKindUnitSelectOptions } from '@/hooks/useKindUnitSelectOptions';
import { useExpertTemplateTestSelectOptions } from '@/hooks/useExpertTemplateTestSelectOptions';
import AddXunzhenHeader from '@/components/add-xunzhen-header.vue';

let { kindOptions, unitOptions } = useKindUnitSelectOptions();
let { expertListArr, cetuOrderListArr, recipeTemListArr } = useExpertTemplateTestSelectOptions();
// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const xunzhenId = computed(() => route.params.xunzhenId);
const uId = computed(() => route.query.uId);
const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  enterInfo: {
    enterMobile: '',
    enterTime: '',
    zuoxunNumber: '',
  },
  username: '', //姓名
  userMobile: '', //用户手机
  nameId: '', //姓名id
  address: '', //位置
  nowKind: '', //现在种类
  unit: 1, //单位
  plantType: '1', //种养模式
  degree: '1', //病发程度
  number: '', //数量
  time: '', //巡诊日期
  diagnosis: 1, // 初复诊
  describe: '', //描述
  image: [] as any, // 图片
  Prescribing: {
    // 处方信息
    expert: '' as any, //处方专家
    result: '', // 看诊结果
    soilRecord: '', //测土记录
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
  xunzhenId: '', //用于详情显示的xunzhenId
  templates: {}, // 选中的处方模板
});

const rules = reactive<FormRules>({
  nameId: [{ required: true, message: '会员不能为空', trigger: 'change' }],
  nowKind: [{ required: true, message: '巡诊种类不能为空', trigger: 'blur' }],
  number: [{ required: true, message: '数量不能为空', trigger: 'blur' }],
  plantType: [{ required: true, message: '种养模式不能为空', trigger: 'change' }],
  degree: [{ required: true, message: '病发程度不能为空', trigger: 'change' }],
  time: [{ required: true, message: '巡诊日期不能为空', trigger: 'change' }],
  address: [{ required: true, message: '巡诊地点不能为空', trigger: 'blur' }],
  describe: [{ required: true, message: '描述不能为空', trigger: 'change' }],
  diagnosis: [{ required: true, message: '初复诊不能为空', trigger: 'change' }],
  'Prescribing.expert': [{ required: true, message: '巡诊专家不能为空', trigger: 'change' }],
  'Prescribing.result': [{ required: true, message: '看诊结果不能为空', trigger: 'change' }],
});

//顶部的删除按钮
const del = () => {
  ElMessageBox.confirm('是否要删除测土配方', '提示')
    .then(async (res) => {
      let r = await getDelSoil(ruleForm.xunzhenId);
      if (r.code) {
        ElMessage.error({ message: r.msg, duration: 1500 });
      } else {
        ElMessage.success({ message: '已删除', duration: 1500 });
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

//成功之后，重置清空数据
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // console.log('ruleform', ruleForm);
  ruleForm.Prescribing.soilRecord = '';
  ruleForm.Prescribing.medicine = [];
  formEl.resetFields();
  if (uId.value) {
    // 有uId，说明是从会员管理页面过来的，置空数据后，需要保留选择的会员
    ruleForm.nameId = +uId.value as any;
  }

  // debugger;
  // if (xunzhenId.value) {
  //   router.push(`/examine-xunzhen-detail/${xunzhenId.value}`);
  // }
};

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string, msg?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!');
      let r = setZuozhenData(msg).then((res) => {
        if (goPage) {
          setTimeout(() => {
            router.push(goPage);
          }, 600);
        } else {
          resetForm(ruleFormRef.value);
        }
      });
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
};

// 取消按钮
const cancel = function () {
  router.go(-1);
};

const soilParams = computed<any>(() => {
  let yongyaoInfoJson = JSON.stringify(ruleForm.Prescribing.medicine);
  let params = {
    zxId: xunzhenId.value == undefined ? '' : xunzhenId.value,
    uid: ruleForm.nameId,
    addType: 2,
    zuowuId: ruleForm.nowKind,
    mushu: ruleForm.number,
    unit: ruleForm.unit,
    plantType: ruleForm.plantType,
    degree: ruleForm.degree,
    wenzhenTime: ruleForm.time,
    address: ruleForm.address,
    isFrist: ruleForm.diagnosis,
    content: ruleForm.describe,
    images: transformImageParams(ruleForm.image),
    expertId: ruleForm.Prescribing.expert,
    result: ruleForm.Prescribing.result,
    cetuNumber: ruleForm.Prescribing.soilRecord,
    yongyaoInfoJson,
  };
  return params;
});

// 提价测土结果请求
async function setZuozhenData(msg: string | undefined) {
  if (soilParams.value.expertId instanceof Object) {
    soilParams.value.expertId = soilParams.value.expertId.value;
  }
  let r = await getAddEditZuoXun(soilParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error({ message: r.msg, duration: 1500 });
    return Promise.reject('error');
  } else {
    ElMessage.success('已' + msg);
    return Promise.resolve('ok');
  }
}

async function getZuozhenDetail() {
  if (uId.value) {
    ruleForm.nameId = +uId.value as any;
    // ruleForm.nameId = '4279';
  }
  // 没有xunzhenId，说明是新增页面不需要请求详情数据
  if (!xunzhenId.value) return;
  let r = await getZuoXunDetail(xunzhenId.value as any);
  // console.log('r', r);
  let enterInfo = r.enterInfo;
  let s = r.soilInfo;
  let chufangInfo = r.chufangInfo;
  ruleForm.enterInfo = enterInfo;
  ruleForm.username = s.username;
  ruleForm.userMobile = s.mobile;
  ruleForm.nameId = s.uid;
  ruleForm.xunzhenId = s.xunzhenId;
  ruleForm.plantType = s.plantType;
  ruleForm.degree = s.degree;
  ruleForm.address = s.address;
  ruleForm.nowKind = s.zuowuId;
  ruleForm.unit = s.unitId;
  ruleForm.number = s.mushu;
  ruleForm.time = s.wenzhenTime;
  ruleForm.address = s.address;
  ruleForm.diagnosis = +s.isFrist;
  ruleForm.describe = s.content;
  ruleForm.image = s.images;
  ruleForm.Prescribing.expert = { value: chufangInfo.expertId, label: chufangInfo.expertName };
  ruleForm.Prescribing.result = chufangInfo.chufangResult;
  ruleForm.Prescribing.soilRecord = chufangInfo.cetuNumber;
  ruleForm.Prescribing.medicine = integrationMedicine(r.drugInfo);
}
onMounted(async () => {
  emit('update:hideAside', false);
  getZuozhenDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
};
//自定义验证数字为小数点后两位
const numberKeyup = () => {
  ruleForm.number = ruleForm.number
    .toString()
    .replace(/[^\d.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
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
.save {
  color: $theme-color;
  cursor: pointer;
}
</style>
