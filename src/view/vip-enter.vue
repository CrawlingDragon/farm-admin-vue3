<template>
  <div class="vip-enter border bg-w pd20 mb50">
    <div class="head right-head">录入会员</div>
    <div class="tip">基本信息</div>
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="158px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="手机号码:" prop="phone">
        <el-input @change="getPhone" v-model.number="ruleForm.phone" label="right" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="ruleForm.name" label="right" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="所在地区:" prop="local">
        <el-cascader
          v-model="ruleForm.local"
          :options="area"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
          class="localCls"
          placeholder="请选择省市区地址"
        />
        <!-- <el-input v-model="ruleForm.local" label="right" /> -->
      </el-form-item>
      <!-- <el-form-item label="详细地址:" prop="address">
        <el-input v-model="ruleForm.address" label="right" />
      </el-form-item> -->
      <el-form-item label="详细地址:" prop="address">
        <el-input
          v-model="ruleForm.address"
          label="right"
          show-word-limit
          maxlength="100"
          placeholder="请输入村名，如松茸村"
        />
      </el-form-item>

      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="身份证:" prop="card">
        <el-input v-model="ruleForm.card" label="right" placeholder="请输入身份证" />
      </el-form-item>
      <el-form-item label="家庭成员数:" prop="family">
        <el-input v-model.number="ruleForm.family" label="right" placeholder="请输入家庭成员数量" />
      </el-form-item>
      <div class="tip">种类情况</div>
      <template v-for="(item, index) in ruleForm.baseInfo">
        <el-form-item
          :label="`种类名称${index + 1}:`"
          prop="kinds"
          class="kind"
          :rules="
            item.require
              ? [
                  {
                    required: true,
                    message: '请选择种类',
                    trigger: 'change',
                  },
                ]
              : [
                  {
                    required: false,
                    message: '请选择种类',
                    trigger: 'change',
                  },
                ]
          "
        >
          <!-- <el-select v-model="item.zuowuId" placeholder="请选择种类">
            <el-option-group
              v-for="group in options.kindOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-option-group>
          </el-select> -->
          <KindSelect v-model:kind="item.zuowuId" :options="kindOptions" v-if="kindOptions.length != 0">
          </KindSelect>
          <el-icon class="close" v-if="index !== 0" @click="deleteBaseInfo(index)"
            ><CloseBold
          /></el-icon>
        </el-form-item>
        <el-form-item label="数量:" prop="growNumber">
          <el-input
            v-model.number="item.mushu"
            label="right"
            placeholder="请输入数字"
            class="grow-number"
          />
          <el-select-v2 v-model="item.unitId" :options="options.unitOptions" class="unit" />
        </el-form-item>
        <el-form-item label="地址:" prop="address" class="address">
          <el-input v-model="item.address" label="right" placeholder="种养区域/地址(选填)" />
        </el-form-item>
        <div class="line" v-if="index !== 0"></div>
      </template>

      <el-button type="primary" class="add" @click="addKind">添加种类</el-button>
      <div class="tip">备注信息</div>
      <el-form-item prop="message">
        <el-input v-model="ruleForm.message" type="textarea" rows="5" show-word-limit maxlength="2000" />
      </el-form-item>

      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" @click="submitForm(ruleFormRef, '')">确定录入</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef, 'goOn')"
            >确定并继续录入</el-button
          >
          <el-button @click="goBackPage">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { getSelectInfo } from '../http/getSelectInfo';
import { area } from '@/common/js/area_level4';
import { getAddVip, getUserInfoByTel } from '../http/getAddVip';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import KindSelect from '@/components/kindSelect.vue';
import { useKindUnitSelectOptions } from '@/hooks/useKindUnitSelectOptions';
const { kindOptions } = useKindUnitSelectOptions();

const router = useRouter();

const formSize = ref<any>('large');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: '', //姓名
  local: '', //所在地区
  address: '', //详细地址
  phone: '', // 手机号码
  sex: '男', // 性别
  card: '', //身份证
  family: '', //家庭数量
  baseInfo: [
    {
      zuowuId: '', //种植种类
      mushu: '', // 种植数量
      unitId: 1, //单位
      address: '', //种植地址
      require: false,
    },
  ],
  message: '', // 备注信息
});

const rules = reactive<FormRules>({
  local: [{ required: true, message: '请选择省市区', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  card: [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
});
watch(
  () => ruleForm.baseInfo,
  (newVal) => {
    newVal.map((item) => {
      if (item.mushu !== '' && item.zuowuId === '') {
        item.require = true;
      } else {
        item.require = false;
      }
    });
    // console.log('newVal', newVal);
  },
  {
    deep: true,
  }
);
const submitForm = async (formEl: FormInstance | undefined, goOn: any) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let r = submitVipInfo().then((res) => {
        // 提交成功后 then
        if (!goOn) {
          setTimeout(() => {
            router.push({ path: '/vip-admin' });
          }, 600);
        } else {
          //goOn参数代表是 继续录入按钮
          clearForm();
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};
// 手机号获取信息
async function getPhone(val: string | number) {
  let r = await getUserInfoByTel({ tel: val })
  if (r.isExist == 1) {
    ruleForm.name = r.realname//姓名
    ruleForm.local = r.residecommunity
      ? [r.resideprovince, r.residecity, r.residedist, r.residecommunity] as any
      : [r.resideprovince, r.residecity, r.residedist] as any; //所在地区
    ruleForm.address = r.address //详细地址
    ruleForm.sex = r.gender == 1 ? '男' : '女' // 性别
    ruleForm.card = r.idcard //身份证
    ruleForm.family = r.familycount //家庭数量
  } else {
    // console.log('不存在')
  }
}

// 添加种类按钮
function addKind() {
  ruleForm.baseInfo.push({
    zuowuId: '', //种植种类
    mushu: '', // 种植数量
    unitId: 1, //单位})
    address: '',
    require: false,
  });
}
// 选择地区
function handleChange(val: any) {
  // console.log(val);
}

// 删除种类
function deleteBaseInfo(index: number) {
  ruleForm.baseInfo.splice(index, 1);
}

// 提交会员录入信息
async function submitVipInfo() {
  let params = {
    userName: ruleForm.name,
    resideprovince: ruleForm.local[0],
    residecity: ruleForm.local[1],
    residedist: ruleForm.local[2],
    residecommunity: ruleForm.local.length >= 4 ? ruleForm.local[3] : '',
    address: ruleForm.address,
    tel: ruleForm.phone,
    sex: ruleForm.sex === '男' ? 1 : 2,
    selfcard: ruleForm.card,
    familycount: ruleForm.family,
    zuowuJson: JSON.stringify(ruleForm.baseInfo),
    remarks: ruleForm.message,
  };

  let r = await getAddVip(params);
  if (r.code) {
    // ElMessage.error(r.msg);
    ElMessageBox.alert(r.msg, '录入会员', {
      confirmButtonText: '知道了',
      showClose: false,
    })
    return Promise.reject();
  } else {
    ElMessage({
      type: 'success',
      message: '已录入',
    });
  }
}
//情况数据
function clearForm() {
  ruleForm.name = ''; //姓名
  ruleForm.local = ''; //所在地区
  ruleForm.address = ''; //详细地址
  ruleForm.phone = ''; // 手机号码
  ruleForm.sex = '男'; // 性别
  ruleForm.card = ''; //身份证
  ruleForm.family = ''; //家庭数量
  ruleForm.baseInfo = [
    {
      zuowuId: '', //种植种类
      mushu: '', // 种植数量
      unitId: 1, //单位
      address: '', //种植地址
      require: false,
    },
  ];
  ruleForm.message = '';
  // 备注信息
}

// 取消按钮，返回上一级
function goBackPage() {
  router.go(-1);
}

onMounted(async () => {
  let { categoryArr, unitArr } = await getSelectInfo();
  options.kindOptions = categoryArr;
  options.unitOptions = unitArr;
});

const options = reactive({
  kindOptions: [
    // 作物select option
    {
      label: 'A',
      options: [
        {
          value: '板栗',
          label: '板栗',
        },
        {
          value: '白菜',
          label: '白菜',
        },
      ],
    },
  ],
  unitOptions: [
    // 种养单位 select option
    { label: '亩', value: '亩' },
  ],
});
</script>
<style lang="scss" scoped>
:deep().localCls {
  width: 310px;
}
.vip-enter {
  height: auto;
}
.demo-ruleForm {
  width: 470px;
}
.grow-number {
  width: 215px;
  margin-right: 15px;
}
.unit {
  width: 73px;
}
.add {
  margin-left: 158px;
}
.kind {
  position: relative;
  .close {
    position: absolute;
    right: 0;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
