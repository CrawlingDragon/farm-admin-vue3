<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-tongfang' }">统防统治</el-breadcrumb-item>
        <el-breadcrumb-item>
          统防统治详情:{{ ruleForm.enterInfo.tongfangNumber }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="point-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="default"
        status-icon
      >
        <div class="title-fiexed-bar border">
          <AddSecondBar
            title="统防统治详情"
            :mobile="ruleForm.enterInfo.enterMobile"
            :time="ruleForm.enterInfo.enterTime"
            class="left"
          >
            <el-dropdown>
              <span class="el-dropdown-link">
                <span @click="goPageEdit" class="edit">编辑</span>
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goPageEdit">编辑</el-dropdown-item>
                  <el-dropdown-item @click="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <div class="last-active">{{ ruleForm.trackInfo.lastEffectStr }}</div> -->
          </AddSecondBar>
        </div>
        <div class="basis-info border">
          <div class="left-main">
            <div class="tip">种类病情资料</div>
            <el-form-item label="名称:" prop="username">
              {{ ruleForm.title }}
            </el-form-item>
            <el-form-item label="种类:" prop="nowKind">
              {{ ruleForm.nowKind }}
            </el-form-item>

            <el-form-item
              label="开始防治日期:"
              prop="time"
              v-model="ruleForm.time"
              class="w300"
              readonly
            >
              {{ ruleForm.time }}
            </el-form-item>
            <el-form-item label="防治数量:" prop="mushu">
              {{ ruleForm.number }}{{ ruleForm.unit }}
            </el-form-item>
            <el-form-item label="农户数:" prop="describe">
              {{ ruleForm.farmersNum }}
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              {{ ruleForm.describe }}
            </el-form-item>
          </div>
        </div>

        <div class="dayTest test-soil-box border">
          <div class="tip">用药信息</div>
          <div class="medicine" v-show="ruleForm.Prescribing.medicine">
            <div class="bar title border">
              <div class="item">商品名称</div>
              <div class="item">商品规格</div>
              <div class="item">参考单价</div>
              <div class="item">数量</div>
            </div>
            <div class="bar" v-for="(item, index) in ruleForm.Prescribing.medicine">
              <div class="item">{{ item.drugName }}</div>
              <div class="item">{{ item.drugSpecIds }}</div>
              <div class="item">{{ item.drugPrice }}</div>
              <div class="item">
                {{ item.drugQuantity }}
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getTongFangDetail, getDelTongFang } from '@/http';
import AddSecondBar from '@/components/add-second-bar.vue';
import { integrationMedicine } from '@/common/js/util';
// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();
const router = useRouter();
const tfId = computed(() => route.params.tfId) as any;

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
  tfId: '', //用于详情显示的tfId
});

//路由到编辑页
const goPageEdit = () => {
  router.push({ path: `/examine-tongfang-add/${tfId.value}` });
};

const rules = reactive<FormRules>({});

//顶部的删除按钮
const del = () => {
  ElMessageBox.confirm('确定删除统这条统防统治记录？', '提示')
    .then(async (res) => {
      let r = await getDelTongFang(tfId.value as any);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        router.replace({ path: '/examine-tongfang' });
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

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
  ruleForm.nowKind = s.zuowuName;
  ruleForm.unit = s.unitName;
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
.title-fiexed-bar {
  height: 50px;
  display: flex;
  align-items: center;
  background: #fff;
  border-top: none;
  .left {
    flex: 1;
    border-right: 1px solid #e5e5e5;
    padding-left: 20px;
    font-size: 14px;
    // font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;
    border-top: none;
    border-left: none;
  }
  .right {
    flex: 1;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
    height: 100%;
    display: flex;
    align-items: center;
    .small-title {
      color: #999;
      margin-left: 10px;
      font-weight: normal;
      font-size: 12px;
    }
  }
}
.basis-info {
  border-top: none;
  background: #fff;
  display: flex;
  .left-main {
    border-right: 1px solid #e5e5e5;
    flex: 1;
  }
  .right-main {
    flex: 1;
  }
}
.first-test-box {
  margin-top: 10px;
  background: #fff;
  display: flex;
  .left-main {
    flex: 1;
    border-right: 1px solid #e5e5e5;
  }
  .right-main {
    flex: 1;
  }
}
.use-farm-box {
  margin-top: 10px;
  background: #fff;
  display: flex;
  .left-main {
    flex: 1;
    border-right: 1px solid #e5e5e5;
  }
  .right-main {
    flex: 1;
  }
}

:deep(.date-wrap .el-input__wrapper) {
  width: 300px !important;
}
.medicine {
  margin-bottom: 20px;
  .bar {
    width: 80%;
    height: 40px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 5px;
    border: 1px solid #e5e5e5;
    border-top: none;
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
    border-top: 1px solid #e5e5e5;
  }
}
.save {
  color: $theme-color;
  margin-right: 10px;
  font-weight: bold;
  cursor: pointer;
}
.upload-image {
  width: 100px;
  height: 100px;
  margin-right: 5px;
  border: 1px solid #e5e5e5;
  margin-bottom: 5px;
}
.edit,
.el-icon--right {
  color: $theme-color;
  cursor: pointer;
}
.el-icon--right {
  margin-right: 10px;
}
.test-soil-box {
  // flex-wrap: wrap;
  margin-top: 10px;
  background: #fff;
  // display: flex;
}
.conclusion {
  margin-top: 10px;
  background: #fff;
  .conclusion-content {
    display: flex;
    align-items: start;
    font-size: 16px;
    padding: 20px;
    padding-top: 0;
    .time {
      width: 180px;
    }
    .text {
      flex: 1;
      .p1 {
        color: #999;
        margin-bottom: 10px;
      }
    }
    .status {
      width: 180px;
      display: flex;
      justify-content: end;
      align-items: center;
      span {
        margin-right: 10px;
      }
      .icon {
        color: #999;
        cursor: pointer;
      }
    }
  }
}
.tip {
  position: relative;
  .close-icon {
    position: absolute;
    right: 10px;
    font-size: 20px;
    cursor: pointer;
  }
}
.last-active {
  position: absolute;
  right: 10px;
}
</style>
