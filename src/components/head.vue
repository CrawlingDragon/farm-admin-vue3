<template>
  <div class="header">
    <div class="content flex justify-between align-center">
      <div class="left-bar flex align-center">
        <router-link to="/index" custom v-slot="{ navigate }">
          <img class="logo" :src="getAssetsImage('logo.png')" @click="navigate" />
        </router-link>
        <div class="web-nav flex align-item">
          <el-dropdown>
            <div class="flex align-center ant-dropdown-link">
              <!-- <unordered-list-outlined class="icon1" />网站导航<down-outlined class="icon2" /> -->
              <el-icon class="icon1"><Fold /></el-icon>
              网站导航
              <el-icon class="icon2"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <div class="web-drop-box box1">
                <div class="title">生产</div>
                <div class="href-box">
                  <a :href="urls.hospital">庄稼医院</a>
                  <a :href="urls.fall_ill">病虫害图库</a>
                  <a :href="urls.video">农技视频</a>
                </div>
                <div class="title">供销</div>
                <div class="href-box">
                  <a href="https://mall.114nz.com/Index/Index/index.html" class="shop">
                    农资商城
                    <div class="shop-icon"></div>
                  </a>
                  <a href="https://mall.114nz.com/Index/Category/index/id/2.html">农药</a>
                  <a href="https://mall.114nz.com/Index/Category/index/id/1.html">肥料</a>
                  <a href="https://mall.114nz.com/Index/Category/index/id/32.html">农膜</a>
                </div>
                <a href="https://www.114nz.com/" class="shop-index">中农在线官网 ></a>
              </div>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="right flex">
        <div class="user-box">
          <div class="login-box flex align-center" v-if="!userInfoStore.userInfo">
            <div class="" @click="login('password')">登录</div>
            <div class="" @click="login('register')">注册</div>
          </div>
          <el-dropdown v-else>
            <div class="ant-dropdown-link flex align-center" style="height: 50px">
              <el-avatar :size="35" :src="userInfoStore.userInfo.avatar" />
              {{ userInfoStore.userInfo.mobile }}
              <el-icon class="icon2"><ArrowDown /></el-icon>
              <!-- <down-outlined class="icon2" /> -->
            </div>
            <template #dropdown>
              <div class="web-drop-box box2">
                <router-link class="item" to="/change-password">修改密码</router-link>
                <div class="item" @click="loginOut">退出</div>
              </div>
            </template>
          </el-dropdown>
        </div>
        <div class="admin-title">
          <el-dropdown>
            <a class="ant-dropdown-link">
              管理中心<el-icon class="icon2"><ArrowDown /></el-icon>
            </a>
            <template #dropdown placement="bottom-end">
              <div class="web-drop-box box3">
                <div class="item" @click="goPage(urls.vip_center)">医院管理中心</div>
                <div class="item" @click="goPage(urls.vip_admin)">会员管理</div>
                <a :href="urls.vip_base" class="item">基地管理中心</a>
              </div>
            </template>
          </el-dropdown>
        </div>
        <div class="phone">
          <el-dropdown>
            <a class="ant-dropdown-link">
              手机APP<el-icon class="icon2"><Iphone /></el-icon>
            </a>
            <template #dropdown placement="bottom-end">
              <div class="web-drop-box phone-drop">
                <img src="/code-pic.png" alt="二维码" />
                <p>扫一扫下载益农宝</p>
              </div>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  <!-- <Nav /> -->
</template>
<script setup lang="ts">
import { login, loginOut } from '@/common/js/getToken';
import { userInfoDefineStore } from '@/store/index';
import { urls } from '@/common/js/urls';
import { h, ref, onMounted } from 'vue';
import storage from 'good-storage';
// import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { getAssetsImage } from '@/common/js/util';

// const router = useRouter();
const userInfoStore = userInfoDefineStore();
let token = storage.get('token');
// console.log('token', token);
// userInfo store
const goPage = (url: string) => {
  let token = storage.get('token');
  if (token != '') {
    if (userInfoStore.userInfo.isUserAccount === 1) {
      // 个人账户
      ElMessageBox.alert('医院管理中心/会员管理仅支持新型庄稼医院账号访问', '访问失败', {
        confirmButtonText: '知道了',
      });
      return;
    }
  }
  window.location.href = url;
};
</script>
<style lang="scss" scoped>
.header {
  height: 50px;
  width: 100%;
  background: #fff;
}
.logo {
  cursor: pointer;
}
.content {
  max-width: 1200px;
  margin: 0 auto;
  height: inherit;
}
.web-nav {
  margin-left: 50px;
  cursor: pointer;
  font-size: 16px;
}
.icon1 {
  margin-right: 10px;
}
.icon2 {
  margin-left: 10px;
  font-size: 12px !important;
}
.ant-dropdown-link {
  line-height: 50px;
  cursor: pointer;
  color: #333333;
  font-size: 16px;
}
.web-drop-box {
  box-shadow: 0px 1px 7px 0px rgba(106, 104, 104, 0.35);
  margin-top: -4px;
}
.web-drop-box.box1 {
  padding: 0 20px 0;
  width: 260px;
  height: 230px;
  background: #ffffff;
}
.web-drop-box.box1 .title {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  padding-bottom: 10px;
  padding-top: 17px;
  border-bottom: 1px solid #e5e5e5;
}

.web-drop-box.box1 .href-box {
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  padding-top: 10px;
  display: flex;
  margin-bottom: 10px;
}
.href-box a {
  flex: 1 auto;
  display: inline-block;
}
.shop {
  position: relative;
}
.shop-icon {
  position: absolute;
  width: 15px;
  height: 19px;
  background: #ff6600;
  font-size: 12px;
  font-family: SimSun;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  right: 4px;
  top: -8px;
  background: url('@/assets/shop-icon.png') no-repeat;
}
.shop-index {
  font-size: 14px;
  font-family: SimSun;
  font-weight: bold;
  color: #333333;
  margin-top: 20px;
}
.box2,
.box3 {
  width: 113px;
  height: 88px;
  background: #ffffff;
  padding: 5px 0;
  /* position: absolute; */
  /* right: 0; */
}
.box3 {
  height: 138px;
}
.box2 .item,
.box3 .item {
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  padding-left: 20px;
  cursor: pointer;
}

.box2 .item:hover,
.box3 .item:hover {
  background: $theme-color;
  color: #fff;
}
.right {
  font-size: 16px;
  color: #333;
}
.user-box,
.admin-title {
  margin-right: 50px;
}
.user-box .login-box {
  height: 100%;
}
.user-box .login-box > div {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
}
.phone {
  cursor: pointer;
}
.phone-drop {
  width: 125px;
  height: 147px;
  background: #ffffff;
  padding: 10px;
}
.phone-drop img {
  width: 100%;
}
.phone-drop p {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  text-align: center;
}
a {
  color: #333;
}
a:hover {
  color: var(--main-color);
}
.header .ant-dropdown-link:hover {
  color: #333;
}
</style>
