<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-tongfang' }">统防统治</el-breadcrumb-item>
        <el-breadcrumb-item>{{
          routeName === 'examine-tongfang-add'
            ? '新增统防统治'
            : '统防统治详情:' + ruleForm.enterInfo.tongfangNumber
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <AddSecondBar
      v-if="routeName !== 'examine-tongfang-add'"
      title="统防统治详情"
      :mobile="ruleForm.enterInfo.enterMobile"
      :time="ruleForm.enterInfo.enterTime"
      class="left"
      ><div class="save mr10" @click="submitForm(ruleFormRef)">保存</div>
    </AddSecondBar>
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
            <div class="tip">基础信息</div>
            <el-form-item label="名称:" prop="title">
              <el-input
                v-model="ruleForm.title"
                label="right"
                placeholder="请输入名称"
                class="grow-number w300 mr30"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
            <!-- <el-form-item label="名称:" v-else>
              {{ ruleForm.username }} {{ ruleForm.enterInfo.enterMobile }}
            </el-form-item> -->
            <el-form-item label="种类:" prop="nowKind">
              <KindSelect
                v-model:kind="ruleForm.nowKind"
                v-if="kindOptions.length != 0"
                :options="kindOptions"
              ></KindSelect>
            </el-form-item>
            <el-form-item
              label="开始防治日期:"
              prop="time"
              v-model="ruleForm.time"
              class="w300"
              readonly
            >
              <el-date-picker
                v-model="ruleForm.time"
                type="date"
                placeholder="选择时间"
                size="large"
                class="w300"
                style="width: 300px"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="防治数量:" prop="number">
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
            <el-form-item label="农户数:" prop="farmersNum">
              <el-input
                v-model.number="ruleForm.farmersNum"
                label="right"
                placeholder="请输入数字"
                class="grow-number w300 mr30"
              />
            </el-form-item>

            <el-form-item label="描述:" prop="describe">
              <el-input
                placeholder="输入具体描述"
                v-model="ruleForm.describe"
                class="w300"
                type="textarea"
                rows="4"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="left-bar">
            <div class="tip">用药信息</div>
            <Medicine v-model:medicineProp="ruleForm.Prescribing.medicine" />
          </div>
        </div>
        <div class="submit-bar" v-if="routeName == 'examine-tongfang-add'">
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
            <el-button
              type="primary"
              size="large"
              @click="submitForm(ruleFormRef, 'goPage')"
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
import { getAddEditTongFang, getTongFangDetail } from '@/http';
import KindSelect from '@/components/kindSelect.vue';
import UnitSelect from '@/components/unitSelect.vue';
import AddSecondBar from '@/components/add-second-bar.vue';
import Medicine from '@/components/medicine.vue';
import { integrationMedicine } from '@/common/js/util';
import { useKindUnitSelectOptions } from '@/hooks/useKindUnitSelectOptions';

let { kindOptions, unitOptions } = useKindUnitSelectOptions();

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const tfId = computed(() => route.params.tfId);
const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  enterInfo: {
    enterMobile: '',
    enterTime: '',
    tongfangNumber: '',
  },
  username: '', //姓名
  title: '', //名称
  nowKind: '', //现在种类
  unit: 1, //单位
  number: '', //数量
  farmersNum: '', //农户数
  time: '', //坐诊日期
  describe: '', //描述
  Prescribing: {
    // 处方信息
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
  tfId: '',
});

const rules = reactive<FormRules>({
  title: [{ required: true, message: '名称不能为空', trigger: 'change' }],
  nowKind: [{ required: true, message: '种类不能为空', trigger: 'change' }],
  time: [{ required: true, message: '开始防治日期不能为空', trigger: 'change' }],
  number: [{ required: true, message: '防治数量不能为空', trigger: 'change' }],
  farmersNum: [{ required: true, message: '农户数量不能为空', trigger: 'change' }],
});

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!');
      let r = setTongFangData().then((res) => {
        // console.log('res', res);
        if (goPage) {
          setTimeout(() => {
            router.push('/examine-tongfang');
          }, 600);
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 取消按钮
const cancel = function () {
  router.go(-1);
};

const tongFangParams = computed<any>(() => {
  let yongyaoInfoJson = JSON.stringify(ruleForm.Prescribing.medicine);
  let params = {
    tfId: tfId.value == undefined ? '' : tfId.value,
    title: ruleForm.title,
    zuowuId: ruleForm.nowKind,
    mushu: ruleForm.number,
    farmersNum: ruleForm.farmersNum,
    unit: ruleForm.unit,
    fangzhiTime: ruleForm.time,
    content: ruleForm.describe,
    yongyaoInfoJson,
  };
  return params;
});

// 添加统防统治结果请求
async function setTongFangData() {
  let r = await getAddEditTongFang(tongFangParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
    return Promise.reject('error');
  } else {
    ElMessage.success('已经添加');
    return Promise.resolve('ok');
  }
}

async function getTongFangDetailData() {
  // 没有tfId，说明是新增页面不需要请求详情数据
  if (!tfId.value) return;
  let r = await getTongFangDetail(tfId.value as any);
  // console.log('r', r);
  let enterInfo = r.enterInfo;
  let s = r.tongfangInfo;
  ruleForm.enterInfo = enterInfo;
  ruleForm.title = s.title;
  ruleForm.tfId = s.tfId;

  ruleForm.nowKind = +s.zuowuId as any;
  ruleForm.unit = s.unitId;
  ruleForm.number = s.mushu;
  ruleForm.time = s.fangzhiTime;
  ruleForm.farmersNum = s.farmersNum;
  ruleForm.describe = s.content;
  ruleForm.Prescribing.medicine = integrationMedicine(r.drugInfo);
}
onMounted(async () => {
  emit('update:hideAside', false);
  getTongFangDetailData();
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

  .left-bar {
    width: 50%;
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
