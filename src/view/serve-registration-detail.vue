<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-registration' }">挂号记录</el-breadcrumb-item>
        <el-breadcrumb-item>挂号单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-detail">
        <div class="detil-title">
          <span class="line"></span>
          挂号单详情 {{ detailData.orderSn }}
        </div>
        <div class="detail-box">
          <span class="label">会员: </span>
          <span class="content">{{ detailData.username }}</span>
        </div>
        <div class="detail-box">
          <span class="label">就诊时间: </span>
          <span class="content">{{ detailData.visitTimeTips }}</span>
        </div>
        <div class="detail-box">
          <span class="label">序号: </span>
          <span class="content">{{ detailData.positionNum }}</span>
        </div>
        <div class="detail-box">
          <span class="label">专家: </span>
          <span class="content">{{ detailData.expertName }}</span>
        </div>
        <div class="detail-box">
          <span class="label">挂号时间: </span>
          <span class="content">{{ detailData.visitTime }}</span>
        </div>
        <div class="detail-box">
          <span class="label">状态: </span>
          <span class="content content-status">
            <el-radio-group v-model="detailData.statusTips" class="ml-4">
              <el-radio v-if="statusShow == 2" :label="2" size="large">待就诊</el-radio>
              <el-radio v-if="statusShow == 3 || statusShow == 1" :label="3" size="large">已过期</el-radio>
              <el-radio :label="1" size="large">已就诊</el-radio>
            </el-radio-group>
          </span>
        </div>
      </div>
      <div class="submit-bar">
        <div class="content">
          <el-button type="primary" size="large" class="mr20" @click="preservation">保存</el-button>
          <el-button @click="goPage('/serve-registration')" size="large">取消</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, computed, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getSubscribeDetail, getSubscribeDetailSave } from '@/http';
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:hideAside']);
const router = useRouter();
const route = useRoute();
const detailData = reactive<any>({
  orderSn: '',//挂号单
  username: '',//会员
  visitTimeTips: '',//就诊时间
  positionNum: '',//序号
  expertName: '',//专家
  visitTime: '',//挂号时间
  statusTips: '',//状态
});
const statusShow = ref<number>()

let id = computed(() => route.query.id);

onMounted(async () => {
  emit('update:hideAside', false);
  // 获取详情信息
  let r = await getSubscribeDetail({ subId: id.value })
  detailData.orderSn = r.orderSn
  detailData.username = r.username
  detailData.visitTimeTips = r.visitTimeTips
  detailData.positionNum = r.positionNum
  detailData.expertName = r.expertName
  detailData.visitTime = r.registerTime
  detailData.statusTips = r.status
  statusShow.value = r.status
  // console.log(detailData)
})

// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
})

// 去特定的路由
function goPage(path: string) {
  router.push({
    path,
  });
}
async function preservation() {
  let r = await getSubscribeDetailSave({
    subId: id.value,
    status: detailData.statusTips
  })
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('编辑成功');
    setTimeout(() => {
      router.push({
        path: "/serve-registration"
      })
    }, 1000);

  }
}

</script>

<style lang="scss" scoped>
.nav-bar {
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-bottom: 1px solid $border-color;
}

.content-box {
  background: #fff;

  .content-detail {
    min-height: 50vh;
    color: #333;
    font-size: 14px;

    .detil-title {
      font-weight: bold;
      padding: 30px 0;

      .line {
        width: 5px;
        height: 20px;
        display: inline-block;
        margin-right: 15px;
        background: $theme-color;
        vertical-align: bottom;
      }
    }

    .detail-box {
      margin-bottom: 20px;

      .label {
        display: inline-block;
        width: 150px;
        margin-right: 10px;
        text-align: right;
      }

      .content-status {
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
}
</style>
