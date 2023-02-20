<template>
  <div class="vip-admin border bg-w pd20 mb50">
    <div class="head right-head hospital-info-head">医院信息</div>
    <div class="content pt20">
      <el-form
        ref="ruleFormRef"
        :model="hospitalInfo"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <el-form-item label="申请账号:" label-width="150px" prop="account">
          {{ hospitalInfo.account }}
        </el-form-item>
        <el-form-item label="名称:" label-width="150px" prop="name">
          <el-input
            v-model="hospitalInfo.name"
            placeholder="请输入名称"
            class="w300"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="图标:" label-width="150px" prop="icon">
          <UploadImageVue :images="hospitalInfo.icon" :limit="1" />
        </el-form-item>
        <el-form-item label="当前地区 :" label-width="150px" prop="region">{{
          hospitalInfo.region
        }}</el-form-item>
        <el-form-item label="详细地址 :" label-width="150px" prop="detailRegion">
          <el-input
            v-model="hospitalInfo.detailRegion"
            label="right"
            placeholder="请输入详细地址"
            class="w300"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="级别:" label-width="150px" prop="level">
          {{ hospitalInfo.level }}
        </el-form-item>
        <el-form-item label="作物科室:" label-width="150px" prop="crop">
          <CropTransfer v-model:kind="hospitalInfo.crop" />
        </el-form-item>
        <el-form-item label="营业执照:" label-width="150px" prop="businessImg">
          <UploadImageVue :images="hospitalInfo.businessImg" :limit="1" />
        </el-form-item>
        <el-form-item label="真实姓名:" label-width="150px" prop="realName">
          <el-input v-model="hospitalInfo.realName" placeholder="请输入真实姓名" class="w300"
        /></el-form-item>
        <el-form-item label="身份证:" label-width="150px" prop="card">
          <el-input v-model="hospitalInfo.card" placeholder="请输入身份证" class="w300"
        /></el-form-item>
        <el-form-item label="工作单位:" label-width="150px" prop="workAddress"
          ><el-input v-model="hospitalInfo.workAddress" placeholder="请输入工作单位" class="w300" />
        </el-form-item>
        <el-form-item label="联系手机:" label-width="150px" prop="phone">
          <el-input v-model="hospitalInfo.phone" placeholder="请输入联系手机" class="w300" />
        </el-form-item>
        <el-form-item label="医院简介:" label-width="150px" prop="info">
          <el-input
            v-model="hospitalInfo.info"
            placeholder="请输入医院简介"
            class="w300"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="通讯地址:" label-width="150px" prop="contactAddress">
          <el-input
            v-model="hospitalInfo.contactAddress"
            placeholder="请输入通讯地址"
            class="w300"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <div class="submit-bar">
          <div class="content">
            <el-button type="primary" size="large" @click="submitForm(ruleFormRef)" class="mr20"
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
import { reactive, onMounted, ref, computed } from 'vue';
import { getHospitalDetail, getHospitalEdit } from '@/http';
import type { FormInstance, FormRules } from 'element-plus';
import UploadImageVue from '@/components/uploadImage.vue';
import CropTransfer from '@/components/crop-transfer.vue';
import { useRouter } from 'vue-router';
import { initTransferData } from '@/common/js/util';
import { ElMessage } from 'element-plus';
const router = useRouter();

const ruleFormRef = ref<FormInstance>();
const hospitalInfo = reactive({
  account: '',
  name: '',
  icon: [] as any,
  region: '',
  detailRegion: '', //详细地址
  level: '',
  crop: [], //科室
  businessImg: [] as any, //营业执照
  realName: '',
  card: '',
  workAddress: '', //工作单位
  phone: '',
  info: '',
  contactAddress: '',
});
const rules = reactive<FormRules>({
  account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
  // region: [{ required: true, message: '当前地址不能为空', trigger: 'blur' }],
  detailRegion: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  // level: [{ required: true, message: '级别不能为空', trigger: 'blur' }],
  crop: [{ required: true, message: '作物科室不能为空', trigger: 'blur' }],
  realName: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
  businessImg: [{ required: true, message: '营业执照不能为空', trigger: 'blur' }],
  card: [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
  workAddress: [{ required: true, message: '工作单位不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '联系手机不能为空', trigger: 'blur' }],
  info: [{ required: true, message: '医院简介不能为空', trigger: 'blur' }],
  contactAddress: [{ required: true, message: '通讯地址不能为空', trigger: 'blur' }],
});
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!');
      editHospitalInfo();
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
};

const editParams = computed(() => {
  let params = {
    hospitalName: hospitalInfo.name,
    hospitalLogo: hospitalInfo.icon[0].url,
    address: hospitalInfo.detailRegion,
    zuowu: hospitalInfo.crop.join(','),
    yyzzPic: hospitalInfo.businessImg[0].url,
    realname: hospitalInfo.realName,
    company: hospitalInfo.workAddress,
    selfcard: hospitalInfo.card,
    tel: hospitalInfo.phone,
    introduce: hospitalInfo.info,
    linkAddress: hospitalInfo.contactAddress,
  };
  return params;
});

async function editHospitalInfo() {
  let r = await getHospitalEdit(editParams.value as any);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('保存成功');
    router.push({
      path: `/set/hospital-info`,
    });
  }
}
onMounted(async () => {
  let r = await getHospitalDetail();
  // console.log('r', r);
  hospitalInfo.account = r.username;
  hospitalInfo.name = r.hospitalName;
  hospitalInfo.icon = r.hospitalLogo == '' ? [] : [{ url: r.hospitalLogo }];
  hospitalInfo.region = r.province + r.city + r.dist + r.community;
  hospitalInfo.level = r.hospitalLevel;
  hospitalInfo.crop = initTransferData(r.zuowu) as any;
  hospitalInfo.businessImg = r.yyzzPic == '' ? [] : [{ url: r.yyzzPic }];
  hospitalInfo.realName = r.realname;
  hospitalInfo.card = r.selfcard;
  hospitalInfo.workAddress = r.company;
  hospitalInfo.phone = r.tel;
  hospitalInfo.info = r.introduce;
  hospitalInfo.contactAddress = r.linkAddress;
  hospitalInfo.detailRegion = r.address;
});
// 取消按钮
const cancel = function () {
  router.go(-1);
};
</script>
<style lang="scss" scoped>
.hospital-info-head {
  display: flex;
  align-items: center;
  position: relative;
}
.icon-image {
  width: 80px;
  height: 80px;
  border: 1px solid #e5e5e5;
}
</style>
