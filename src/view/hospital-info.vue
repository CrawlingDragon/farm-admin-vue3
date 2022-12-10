<template>
  <div class="vip-admin border bg-w pd20">
    <div class="head right-head hospital-info-head">
      医院信息
      <!-- <div class="tips">
        <el-icon :size="20" class="mr10"><Warning /></el-icon>
        审核中，暂时不能操作
      </div> -->
      <div class="edit-btn" @click="goEditPageFn">编辑</div>
    </div>
    <div class="content pt20">
      <el-form-item label="申请账号:" label-width="150px">
        {{ hospitalInfo.account }}
      </el-form-item>
      <el-form-item label="名称:" label-width="150px" v-show="hospitalInfo.name != ''"
        >{{ hospitalInfo.name }}
      </el-form-item>
      <el-form-item label="图标:" label-width="150px" v-show="hospitalInfo.icon != ''">
        <el-image :src="hospitalInfo.icon" class="icon-image"></el-image>
      </el-form-item>
      <el-form-item label="所在区域:" label-width="150px" v-show="hospitalInfo.region != ''"
        >{{ hospitalInfo.region }}
      </el-form-item>
      <el-form-item label="医院级别:" label-width="150px" v-show="hospitalInfo.level != ''"
        >{{ hospitalInfo.level }}
      </el-form-item>
      <el-form-item label="作物科室:" label-width="150px" v-show="hospitalInfo.crop != ''"
        >{{ hospitalInfo.crop }}
      </el-form-item>
      <el-form-item label="营业执照:" label-width="150px" v-show="hospitalInfo.businessImg != ''">
        <el-image :src="hospitalInfo.businessImg" class="business-image" fit="cover"></el-image>
      </el-form-item>
      <el-form-item label="真实姓名:" label-width="150px" v-show="hospitalInfo.realName != ''">{{
        hospitalInfo.realName
      }}</el-form-item>
      <el-form-item label="身份证:" label-width="150px" v-show="hospitalInfo.card != ''">{{
        hospitalInfo.card
      }}</el-form-item>
      <el-form-item label="工作单位:" label-width="150px" v-show="hospitalInfo.workAddress != ''">
        {{ hospitalInfo.workAddress }}</el-form-item
      >
      <el-form-item label="联系手机:" label-width="150px" v-show="hospitalInfo.phone != ''">
        {{ hospitalInfo.phone }}
      </el-form-item>
      <el-form-item label="医院简介:" label-width="150px" v-show="hospitalInfo.info != ''">
        {{ hospitalInfo.info }}
      </el-form-item>
      <el-form-item
        label="通讯地址:"
        label-width="150px"
        v-show="hospitalInfo.contactAddress != ''"
      >
        {{ hospitalInfo.contactAddress }}
      </el-form-item>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { getHospitalDetail } from '@/http';
import { useRouter } from 'vue-router';
const router = useRouter();
const hospitalInfo = reactive({
  account: '',
  name: '',
  icon: '',
  region: '',
  level: '',
  crop: '', //科室
  businessImg: '', //营业执照
  realName: '',
  card: '',
  workAddress: '', //工作单位
  phone: '',
  info: '',
  contactAddress: '',
});

onMounted(async () => {
  let r = await getHospitalDetail();
  console.log('r', r);
  hospitalInfo.account = r.username;
  hospitalInfo.name = r.hospitalName;
  hospitalInfo.icon = r.hospitalLogo;
  hospitalInfo.region = r.province + r.city + r.dist + r.community;
  hospitalInfo.level = r.hospitalLevel;
  hospitalInfo.crop = r.zuowuStr;
  hospitalInfo.businessImg = r.yyzzPic;
  hospitalInfo.realName = r.realname;
  hospitalInfo.card = r.selfcard;
  hospitalInfo.workAddress = r.company;
  hospitalInfo.phone = r.tel;
  hospitalInfo.info = r.introduce;
  hospitalInfo.contactAddress = r.linkAddress;
});

const goEditPageFn = () => {
  router.push({
    path: '/set/hospital-info-edit',
  });
};
</script>
<style lang="scss" scoped>
.hospital-info-head {
  display: flex;
  align-items: center;
  position: relative;
  // .tips {
  //   display: flex;
  //   align-items: center;
  //   margin-left: 100px;
  //   color: #ff6600;
  //   font-weight: 100;
  //   font-size: 14px;
  // }
  .edit-btn {
    position: absolute;
    right: 0;
    color: $theme-color;
    margin-right: 20px;
    cursor: pointer;
    font-weight: 100;
  }
}
.icon-image,
.business-image {
  width: 80px;
  height: 80px;
  border: 1px solid #e5e5e5;
}
</style>
