<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/serve-note' }">短信管理</el-breadcrumb-item>
        <el-breadcrumb-item>短信详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-detail">
        <div class="detil-title">
          <span class="title">短信详情</span>
          <el-button type="danger" size="small" @click="delNote">删除</el-button>
        </div>
        <div class="detail-box">
          <span class="label">发送状态: </span>
          <span class="content">{{ detailData.statusTips }}</span>
        </div>
        <div class="detail-box">
          <span class="label">发送时间: </span>
          <span class="content">{{ detailData.sendTime }}</span>
        </div>
        <div class="detail-box">
          <span class="label">短信内容: </span>
          <span class="content">{{ detailData.content }}</span>
        </div>
        <div class="detail-box">
          <span class="label">收件人: </span>
          <div class="content-users">
            <span class="content-user" v-for="item in detailData.userArr" :key="item.mobile"
              >{{ item.username }} {{ item.mobile }}</span
            ><br />
            <span class="userCount">共{{ detailData.userCount }}个收件人</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, computed, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getNoteSmsSendInfo, getNoteDelete } from '@/http';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const emit = defineEmits(['update:hideAside']);
let id = computed(() => route.query.id);
const detailData = reactive<any>({
  content: '', //内容
  sendTime: '', //发送时间
  statusTips: '', //发送状态
  smsId: '', //id
  userArr: [], //收件人
  userCount: '', //收件人总数
});

onMounted(async () => {
  emit('update:hideAside', false);
  let r = await getNoteSmsSendInfo({ smsId: id.value });
  // console.log('r', r)
  detailData.content = r.content;
  detailData.sendTime = r.sendTime;
  detailData.statusTips = r.statusTips;
  detailData.smsId = r.smsId;
  detailData.userArr = r.userArr;
  detailData.userCount = r.userCount;
});
function delNote() {
  ElMessageBox.confirm('确定删除这条短信记录吗？', '删除提示')
    .then(async () => {
      let r = await getNoteDelete({ smsId: id.value });
      ElMessage({
        message: r instanceof Array ? '已删除' : r.msg,
        type: 'success',
      });
      setTimeout(() => {
        goPage('/serve-note');
      }, 1000);
    })
    .catch(() => {});
}
// 隐藏侧边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 去特定的路由
function goPage(path: string) {
  router.push({
    path,
  });
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
      padding: 30px;

      .title {
        display: inline-block;
        width: 100px;
      }
    }

    .detail-box {
      margin-bottom: 20px;

      .label {
        display: inline-block;
        width: 150px;
        margin-right: 10px;
        text-align: right;
        vertical-align: top;
      }

      .content {
        display: inline-block;
        width: 1000px;
      }

      .content-users {
        display: inline-block;

        .content-user {
          display: block;
          margin-bottom: 5px;
        }

        .userCount {
          display: inline-block;
          padding-top: 10px;
          padding-bottom: 10px;
          color: $f-color-three;
        }
      }
    }

    .detail-box:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
</style>
