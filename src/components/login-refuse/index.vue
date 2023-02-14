<template>
  <div class="refuse-box">
    <el-header style="height: auto">
      <!-- <header-refuse v-model:refuseShow="refuseShow" /> -->
      <header-refuse />
    </el-header>
    <el-main>
      <div class="login-refuse" v-if="refuseShow">
        <div class="top">
          <el-icon :size="50" color="#FF6600">
            <WarningFilled />
          </el-icon>
          <span class="tips">访问失败</span>
        </div>
        <p>新院管理平台仅支持新型庄稼医院运营账号登录</p>
        <p>请选择其他产品和服务进行登录</p>
        <div class="button" @click="loginOut">知道了</div>
      </div>
      <!-- <div class="change-paw" v-if="!refuseShow">
        <changePassword />
      </div> -->
    </el-main>
  </div>
</template>
<script setup lang="ts">
import { loginOut } from '@/common/js/getToken';
import HeaderRefuse from '@/components/HeaderRefuse.vue';
// import changePassword from '@/view/change-password.vue';
import { ref } from 'vue';
const refuseShow = ref(true)


</script>
<style lang="scss" scoped>
.refuse-box {
  width: 100%;
}

.login-refuse {
  text-align: center;
  margin-top: 200px;

  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;

    .tips {
      display: inline-block;
      width: 150px;
      font-size: 28px;
      font-weight: bold;
      color: #FF6600;
    }
  }

  p {
    height: 30px;
    font-size: 16px;
    color: #333333;
  }

  .button {
    text-align: center;
    margin: 10px auto;
    line-height: 34px;
    width: 150px;
    height: 34px;
    background: #FFFFFF;
    border: 1px solid #599524;
    border-radius: 5px 5px 5px 5px;

    &:hover {
      cursor: pointer;
    }
  }
}

.change-paw {
  margin: 0 auto;
  width: 1200px;
}
</style>