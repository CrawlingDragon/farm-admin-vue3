<template>
  <div class="border">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vip-admin' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item
          >会员:{{ detailData.userInfo.userName }} {{ detailData.userInfo.tel }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="left-bar">
        <div class="user">
          <el-avatar :size="100" :src="detailData.userInfo.face" class="avatar" />
          <div class="info">
            <h4 class="name">{{ detailData.userInfo.userName }}</h4>
            <p class="time">录入时间：{{ detailData.userInfo.joinTime }}</p>
            <div class="btn">
              <el-dropdown v-if="detailData.userInfo.isCancelMember == 0">
                <span class="el-dropdown-link">
                  <el-button type="primary" class="add-btn mr10">
                    新增诊疗
                    <el-icon class="el-icon--right">
                      <arrow-down />
                    </el-icon>
                  </el-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="goPage('/examine-soil-add')"
                      v-if="soil.testingsoilLists"
                      >测土
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="goPage('/examine-zuozhen-add')"
                      v-if="soil.zuozhenLists"
                      >坐诊</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="goPage('/examine-xunzhen-add')"
                      v-if="soil.xunzhenLists"
                      >巡诊</el-dropdown-item
                    >
                    <el-dropdown-item
                      @click="goPage('/examine-point-add')"
                      v-if="soil.observepointLists"
                      >观测点</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button @click="deleteVip">删除会员</el-button>
            </div>
          </div>
        </div>
        <div class="numbers">
          <div class="item" v-if="soil.testingsoilLists" @click="goPage('/vip-soil-list')">
            <div class="num fb">{{ detailData.tempArray.cetu }}</div>
            <div class="p">测土</div>
          </div>
          <div class="item" v-if="soil.observepointLists" @click="goPage('/vip-point-list')">
            <div class="num fb">{{ detailData.tempArray.viewpoint }}</div>
            <div class="p">观测点</div>
          </div>
          <div class="item" v-if="soil.zuozhenLists" @click="goPage('/vip-zuozhen-list')">
            <div class="num fb">{{ detailData.tempArray.wenzhen }}</div>
            <div class="p">坐诊</div>
          </div>
          <div class="item" v-if="soil.xunzhenLists" @click="goPage('/vip-xunzhen-list')">
            <div class="num fb">{{ detailData.tempArray.xunzhen }}</div>
            <div class="p">巡诊</div>
          </div>
          <div class="item" v-if="soil.questionLists" @click="goPage('/vip-wangzhen-list')">
            <div class="num fb">{{ detailData.tempArray.ask }}</div>
            <div class="p">网诊</div>
          </div>
          <div class="item" v-if="false">
            <div class="num fb">{{ detailData.tempArray.order }}</div>
            <div class="p">购买记录</div>
          </div>
        </div>
        <div class="tip">最近诊疗记录</div>
        <ul class="look-ul">
          <li v-if="detailData.recentlog.length == 0">暂无诊疗记录</li>
          <li v-else v-for="item in detailData.recentlog">
            {{ item.viewtime }}<i style="display: inline-block; width: 20px"></i>{{ item.title }}
          </li>
        </ul>
      </div>
      <div class="right-bar">
        <el-button size="small" type="primary" class="edit-btn" @click="goPage('/vip-edit')"
          >编辑</el-button
        >
        <div class="tip">基本信息</div>

        <div class="info-box" v-if="detailData.userInfo.userName != ''">
          <div class="label">姓名:</div>
          <div class="right-text">{{ detailData.userInfo.userName }}</div>
        </div>
        <div class="info-box" v-if="detailData.userInfo.tel != ''">
          <div class="label">手机:</div>
          <div class="right-text">{{ detailData.userInfo.tel }}</div>
        </div>
        <div class="info-box" v-if="detailData.userInfo.selfcard != ''">
          <div class="label">身份证:</div>
          <div class="right-text">{{ detailData.userInfo.selfcard }}</div>
        </div>
        <div class="info-box" v-if="detailData.userInfo.resideprovince != ''">
          <div class="label">所在地:</div>
          <div class="right-text">
            {{ detailData.userInfo.resideprovince }}{{ detailData.userInfo.residecity
            }}{{ detailData.userInfo.residedist }}{{ detailData.userInfo.residecommunity }}
          </div>
        </div>
        <div class="info-box" v-if="detailData.userInfo.address != ''">
          <div class="label">详细地址:</div>
          <div class="right-text">{{ detailData.userInfo.address }}</div>
        </div>
        <div class="info-box">
          <div class="label">性别:</div>
          <div class="right-text">{{ detailData.userInfo.sex }}</div>
        </div>

        <div class="info-box" v-if="detailData.userInfo.familycount != ''">
          <div class="label">家庭成员:</div>
          <div class="right-text">{{ detailData.userInfo.familycount }}</div>
        </div>
        <div class="info-box" v-if="detailData.userInfo.userfrom != ''">
          <div class="label">会员来源:</div>
          <div class="right-text">{{ detailData.userInfo.userfrom }}</div>
        </div>
        <div class="tip">种类情况</div>
        <template v-if="detailData.userInfo?.zuowu.length != 0">
          <div class="crop" v-for="(item, index) in detailData.userInfo.zuowu" :key="item.zuowuId">
            <div class="info-box">
              <div class="label">种类名称{{ index + 1 }}:</div>
              <div class="right-text">{{ item.zuowuName }}</div>
            </div>
            <div class="info-box" v-if="item.mushu">
              <div class="label">数量:</div>
              <div class="right-text">{{ item.mushu }}{{ item.unitName }}</div>
            </div>
            <div class="info-box" v-if="item.address">
              <div class="label">种类地址:</div>
              <div class="right-text">{{ item.address }}</div>
            </div>
          </div>
        </template>
        <div class="tip" v-if="detailData.userInfo.remarks">备注信息</div>
        <div class="info-box">
          <div class="label"></div>
          <div class="right-text">{{ detailData.userInfo.remarks }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed } from 'vue';
import storage from 'good-storage';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getVipDetail, getDeleteVip } from '@/http';

const router = useRouter();
const route = useRoute();
// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);

let soil = storage.session.get('soil');

let id = computed(() => route.query.id);
//detail data
const detailData = reactive<any>({
  userInfo: { zuowu: [] },
  tempArray: '',
  recentlog: '',
  canDelete: 0, //是否能删除 0不能删除，1可以
  isJoinOther: 1, // 是否加入其他
});

// 去特定的路由
function goPage(path: string) {
  router.push({
    path: path,
    query: { uId: id.value },
  });
}

// 是否删除会员的按钮函数
function deleteVip(done: any) {
  if (detailData.canDelete !== 0) {
    ElMessageBox.confirm('确定删除该会员？', '删除提示')
      .then(async (res) => {
        let r = await getDeleteVip({ id: id.value });
        // if (r.code) {
        //   ElMessage({
        //     message: r.msg,
        //     type: 'error',
        //     duration: 1500,
        //   });
        //   return;
        // }
        ElMessage({
          message: '已删除',
          type: 'success',
          duration: 1500,
        });
        setTimeout(() => {
          router.replace({
            path: '/vip-admin',
          });
        }, 1000);
      })
      .catch(() => {
        // catch error
      });
  } else {
    ElMessageBox.alert('删除失败，该会员的诊疗记录或购买记录不为空，请清空后再删除', '删除失败', {
      confirmButtonText: '知道了',
    });
  }
}

// 隐藏左边栏
onMounted(async () => {
  emit('update:hideAside', false);
  let r = await getVipDetail({ id: id.value });
  // console.log('r', r);
  detailData.userInfo = r.userInfo;
  detailData.tempArray = r.tempArray;
  detailData.recentlog = r.recentlog;
  detailData.canDelete = r.canDelete;
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
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
.content {
  background: #fff;
  display: flex;
  .left-bar {
    width: 380px;
    border-right: 1px solid $border-color;
    .user {
      display: flex;
      margin: 30px 0;
      .avatar {
        margin: 0 20px;
      }
      .time {
        font-size: 12px;
        color: $f-color-second;
        margin-bottom: 20px;
      }
      .add-btn {
        width: 85px;
      }
    }
    .numbers {
      display: flex;
      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid $border-color;
        cursor: pointer;
        &:last-child {
          border: none;
        }
        .num {
          color: $theme-color;
          font-weight: bold;
        }
      }
    }
    .look-ul {
      padding-left: 30px;
      li {
        list-style: disc;
        margin-bottom: 10px;
        font-size: 14px;
        color: $f-color-second;
      }
    }
  }
  .right-bar {
    flex: 1;
    position: relative;
    .edit-btn {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 22;
    }
    .info-box {
      display: flex;
      padding-right: 20px;
      align-items: start;
      margin-bottom: 10px;
      .label {
        width: 200px;
        text-align: right;
        margin-right: 10px;
      }
      .right-text {
        flex: 1;
        min-width: 0;
      }
    }
    .crop {
      margin-bottom: 25px;
    }
  }
}
</style>
