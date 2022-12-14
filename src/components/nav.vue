<template>
  <div class="nav">
    <div class="content flex align-center" v-if="active">
      <div class="name">新型庄稼医院管理平台</div>
      <router-link to="/index" class="nav-item">首页</router-link>
      <router-link to="/set" class="nav-item">设置</router-link>
      <router-link to="/cashier-desk" class="nav-item">收银台</router-link>
      <div class="search-box">
        <el-input v-model.trim="search" placeholder="会员手机号/姓名/身份证/会员ID" size="large" class="search"
          @keydown.enter="searchFn">
          <template #append>
            <div @click="searchFn">搜索会员</div>
          </template>
        </el-input>
      </div>
    </div>
    <div class="content flex align-center " v-if="!active">
      <div class="name">{{ hospitalName }}收银台</div>
      <div class="back">
        <router-link class="back-link" to="/index">
          <el-icon>
            <ArrowLeft />
          </el-icon>新型庄稼医院管理平台</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getHospitalDetail } from '@/http';
const router = useRouter();
const active = ref(true)
const hospitalName = ref()//收银台医院名称
router.beforeEach(async (to, from) => {
  if (to.path == '/cashier-desk') {
    active.value = false
    let r = await getHospitalDetail()
    hospitalName.value = r.hospitalName
    // console.log('r', r)
  } else {
    active.value = true
  }
});

const search = ref('');
const beforeSearchVal = ref(''); // 用于保存上一次搜索内容

// 搜索函数
const searchFn = () => {
  if (search.value == '') return;
  if (beforeSearchVal.value === search.value) {
    // 上一次搜索内容和 这一次一样，则不跳转
    // console.log('same');
    return;
  }
  beforeSearchVal.value = search.value;
  router.push({
    path: '/vip-admin',
    query: {
      keyword: search.value,
    },
  });
};
</script>
<style lang="scss" scoped>
.nav {
  height: 80px;
  background: $theme-color;

  .content {
    max-width: 1200px;
    margin: 0 auto;
    height: inherit;
    position: relative;

    .name {
      margin-right: 50px;
      font-size: 28px;
      font-weight: 400;
      color: #fffefe;
      // cursor: pointer;
      user-select: none;
    }

    .nav-item {
      padding: 0 30px;
      font-size: 20px;
      font-weight: 400;
      color: #fffefe;
      height: inherit;
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 5px;

      &:hover {
        font-weight: bold;
        background: $theme-second-color;
      }
    }

    .search-box {
      position: absolute;
      right: 0;
      top: 50%;
      width: 380px;
      transform: translateY(-50%);
    }

    .back {
      position: absolute;
      right: 0;
      top: 50%;
      // width: 380px;
      transform: translateY(-50%);

      .back-link {
        color: #fff;
        font-size: 16px;
        font-family: Microsoft YaHei;
        line-height: 80px;

        i {
          vertical-align: middle;
        }
      }
    }

    :deep().el-input__wrapper.is-focus {
      box-shadow: none;
    }

    :deep().el-input-group__append {
      cursor: pointer;
    }

    .router-link-active {
      font-weight: bold;
      background: $theme-second-color;
    }
  }
}
</style>
