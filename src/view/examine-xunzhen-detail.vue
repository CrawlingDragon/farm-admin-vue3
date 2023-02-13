<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-xunzhenlist' }">巡诊记录</el-breadcrumb-item>
        <el-breadcrumb-item> 巡诊详情:{{ ruleForm.enterInfo.zuoxunNumber }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="point-container">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <div class="title-fiexed-bar border">
          <AddSecondBar
            title="巡诊详情"
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
            <div class="last-active">{{ ruleForm.trackInfo.lastEffectStr }}</div>
          </AddSecondBar>
        </div>
        <div class="basis-info border">
          <div class="left-main">
            <div class="tip">种类病情资料</div>
            <el-form-item label="会员:" prop="username">
              {{ ruleForm.username }} {{ ruleForm.enterInfo.enterMobile }}
            </el-form-item>
            <el-form-item label="巡诊种类:" prop="nowKind">
              {{ ruleForm.nowKind }}
            </el-form-item>
            <el-form-item label="种养模式:" prop="plantType">
              {{ ruleForm.plantType }}
            </el-form-item>
            <el-form-item label="病发程度:" prop="degree">
              {{ ruleForm.degree }}
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              {{ ruleForm.number }}
              {{ ruleForm.unit }}
            </el-form-item>
            <el-form-item
              label="巡诊日期:"
              prop="time"
              v-model="ruleForm.time"
              class="w300"
              readonly
            >
              {{ ruleForm.time }}
            </el-form-item>
            <el-form-item label="巡诊地点:" prop="address">
              {{ ruleForm.address }}
            </el-form-item>
            <el-form-item label="初复诊:" prop="diagnosis">
              <!-- <ExpertSelect
                v-if="selectOptions.expertList.length !== 0"
                v-model:expert="ruleForm.testPeople"
                :options="selectOptions.expertList"
              ></ExpertSelect> -->
              {{ ruleForm.diagnosis }}
            </el-form-item>
            <el-form-item label="描述:" prop="describe">
              {{ ruleForm.describe }}
            </el-form-item>
            <el-form-item label="图片:" prop="image" v-show="ruleForm.image.length != 0">
              <el-image
                v-for="(item, index) in ruleForm.image"
                :src="item.url"
                fit="scale-down"
                @click="getImgView(index, ruleForm.image)"
                class="upload-image"
              ></el-image>
            </el-form-item>
          </div>
        </div>

        <div class="dayTest test-soil-box border">
          <div class="tip">处方信息</div>
          <el-form-item label="巡诊专家:" prop="describe">
            {{ ruleForm.Prescribing.expert }}
            {{ ruleForm.Prescribing.mobile }}
          </el-form-item>
          <el-form-item label="看诊结果:" prop="describe">
            {{ ruleForm.Prescribing.result }}
          </el-form-item>
          <el-form-item label="测土记录:" prop="soilRecord">
            {{ ruleForm.Prescribing.soilRecord }}
          </el-form-item>
        </div>
        <div class="dayTest test-soil-box border">
          <div class="tip">用药信息</div>
          <div class="medicine" v-show="ruleForm.Prescribing.medicine.length != 0">
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
        <div class="conclusion border">
          <template v-if="ruleForm.trackInfo.trackCount !== 0">
            <div class="tip">诊疗跟踪({{ ruleForm.trackInfo.trackCount }})</div>
            <div class="conclusion-content" v-for="item in ruleForm.trackInfo.trackLists">
              <div class="time">{{ item.trackTime }}</div>
              <div class="text">
                <div class="p1">录入时间: {{ item.inputTime }}</div>
                <div class="p2">{{ item.content }}</div>
              </div>
              <div class="status">
                <el-icon color="#599524" v-if="item.effectStr == '已调理'"><Select /></el-icon>
                <el-icon color="#599524" v-if="item.effectStr == '待跟进'">
                  <Clock />
                </el-icon>
                <el-icon color="#da993c" v-if="item.effectStr == '没效果'">
                  <Warning />
                </el-icon>
                <span>{{ item.effectStr }}</span>
                <el-icon class="close-icon" @click="delZuoTrack(item.trackId)">
                  <CloseBold />
                </el-icon>
              </div>
            </div>
          </template>
          <div class="tip">新增诊疗跟踪</div>
          <el-form-item
            label="跟踪日期:"
            prop="addTrack.time"
            v-model="ruleForm.addTrack.time"
            class="w300"
            readonly
          >
            <el-date-picker
              v-model="ruleForm.addTrack.time"
              type="date"
              placeholder="选择时间"
              :disabled-date="disabledDate"
              size="large"
              class="w300"
              style="width: 300px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="诊疗效果:" prop="addTrack.effect">
            <el-radio-group v-model="ruleForm.addTrack.effect">
              <el-radio label="1">没效果</el-radio>
              <el-radio label="2">待跟进</el-radio>
              <el-radio label="3">已调理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="效果描述:" prop="addTrack.describe">
            <el-input
              v-model="ruleForm.addTrack.describe"
              class="w300"
              type="textarea"
              rows="4"
              maxlength="2000"
              show-word-limit
              placeholder="请输入描述"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">发布</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 大图预览 -->
    <imgPreview v-model:index="imgIndex" :lists="imgLists" />
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, onUnmounted, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import imgPreview from '@/components/imgPreview.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getZuoXunDetail, getDelZuoXunTrack, getAddZuoXunTrack, getDelZuoXun } from '@/http';
import AddSecondBar from '@/components/add-second-bar.vue';
import { transformImageParams } from '@/common/js/util';

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const xunzhenId = computed(() => route.params.xunzhenId) as any;
// const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  enterInfo: {
    enterMobile: '',
    enterTime: '',
    zuoxunNumber: '',
  },
  username: '', //姓名
  nameId: '', //姓名id
  address: '', //位置
  nowKind: '', //现在种类
  unit: 1, //单位
  plantType: '1', //种养模式
  degree: '1', //病发程度
  number: '', //数量
  time: '', //巡诊日期
  diagnosis: 1, // 初复诊
  describe: '', //描述
  image: [] as any, // 图片
  Prescribing: {
    // 处方信息
    expert: '', //处方专家
    mobile: '', //专家手机
    result: '', // 看诊结果
    soilRecord: '', //测土记录
    medicine: [
      //用药信息
      {
        drugName: '', //药品名字
        drugId: '', //药品id
        drugSpecIds: '', //药品规格
        sizeSelectOption: [],
        drugPrice: '', //单价
        drugQuantity: 1, // 药品数量
      },
    ],
  },
  zuozhenId: '', //用于详情显示的zuozhenId
  trackInfo: { trackCount: 0 } as any, //诊疗跟踪
  addTrack: {
    // 新增跟踪诊疗
    time: '',
    effect: '1',
    describe: '',
  },
});

//路由到编辑页
const goPageEdit = () => {
  router.push({ path: `/examine-xunzhen-add/${xunzhenId.value}` });
};

const rules = reactive<FormRules>({
  'addTrack.time': [{ required: true, message: '跟踪日期不能为空', trigger: 'change' }],
  'addTrack.effect': [{ required: true, message: '诊疗效果不能为空', trigger: 'change' }],
});

//顶部的删除按钮
const del = () => {
  ElMessageBox.confirm('是否要删除巡诊', '提示')
    .then(async (res) => {
      let r = await getDelZuoXun(xunzhenId.value as any);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        router.replace({ path: '/examine-xunzhenlist' });
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

// 整合自定义用药数组 和 后端用药数组
function integrationMedicine(drugInfo: any, target: 'Prescribing') {
  ruleForm[target].medicine = [];
  if (drugInfo.length === 0) {
    // ruleForm[target].medicine.push({
    //   drugName: '', //药品名字
    //   drugId: '', //药品id
    //   drugSpecIds: '', //药品规格
    //   sizeSelectOption: [],
    //   drugQuantity: 1, // 药品数量
    // });
    return;
  }
  // console.log('drugInfo', drugInfo);

  drugInfo.forEach((item: any) => {
    // if (ruleForm[target].medicine.length > drugInfo.length) {
    //   return;
    // }
    ruleForm[target].medicine.push({
      drugName: item.drugName, //药品名字
      drugId: item.drugId, //药品id
      drugSpecIds: item.drugSpec, //药品规格
      sizeSelectOption: [],
      drugPrice: item.drugPrice,
      drugQuantity: +item.drugQuantity, // 药品数量
    });
    // ruleForm[target].medicine[index].drugName = item.drugName;
    // ruleForm[target].medicine[index].drugSpecIds = item.drugSpec;
    // ruleForm[target].medicine[index].drugQuantity = item.drugQuantity;
  });
  // console.log('ruleForm[target]', ruleForm[target]);
  // console.log('ruleForm[target].medicine', ruleForm[target].medicine);
}

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, pageName?: string) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!');
      setZuoXunTrack().then((res) => {
        if (pageName) {
          setTimeout(() => {
            router.push({ path: pageName });
          }, 500);
        }
      });
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
};

// //保存观测点数据
// function save() {}

const zuoZhenParams = computed<any>(() => {
  let params = {
    zxId: xunzhenId.value,
    addType: '2',
    trackTime: ruleForm.addTrack.time,
    effect: ruleForm.addTrack.effect,
    content: ruleForm.addTrack.describe,
  };
  return params;
});

// 发布新增诊疗跟踪
async function setZuoXunTrack() {
  let r = await getAddZuoXunTrack(zuoZhenParams.value);
  // console.log('r', r);
  if (r.code) {
    ElMessage.error(r.msg);
    return Promise.reject('error');
  } else {
    ElMessage.success('已发布');
    setTimeout(() => {
      getZuozhenDetail();
      cleanTrackData(ruleFormRef.value);
    }, 500);
    return Promise.resolve('ok');
  }
}

// const userInfo = reactive({ mobile: 0, time: 0, name: '' });
async function getZuozhenDetail() {
  // 没有zuozhenId，说明是新增页面不需要请求详情数据
  if (!xunzhenId.value) return;
  let r = await getZuoXunDetail(xunzhenId.value as any);
  // console.log('r', r);
  let enterInfo = r.enterInfo;
  let s = r.soilInfo;
  let chufangInfo = r.chufangInfo;
  ruleForm.enterInfo = enterInfo;
  ruleForm.username = s.username;
  ruleForm.nameId = s.uid;
  ruleForm.zuozhenId = s.zxId;
  ruleForm.plantType = s.plantTypeTips;
  ruleForm.degree = s.degreeTips;
  ruleForm.address = s.address;
  ruleForm.nowKind = s.zuowuName;
  ruleForm.unit = s.unitName;
  ruleForm.number = s.mushu;
  ruleForm.time = s.wenzhenTime;
  ruleForm.diagnosis = s.isFristTips;
  ruleForm.describe = s.content;
  ruleForm.image = s.images;
  ruleForm.Prescribing.expert = chufangInfo.expertName;
  ruleForm.Prescribing.mobile = chufangInfo.expertMobile;
  ruleForm.Prescribing.result = chufangInfo.chufangResult;
  ruleForm.Prescribing.soilRecord = chufangInfo.cetuNumber;
  integrationMedicine(r.drugInfo, 'Prescribing');
  ruleForm.trackInfo = r.trackInfo;
}

//删除底部的巡诊记录
const delZuoTrack = async (trackId: string) => {
  ElMessageBox.confirm('是否要删除诊疗跟踪记录', '提示')
    .then(async (res) => {
      let r = await getDelZuoXunTrack(trackId);
      // console.log('r', r);
      if (r.code) {
        ElMessage.error(r.msg);
      } else {
        ElMessage.success('删除成功');
        setTimeout(() => {
          getZuozhenDetail();
        }, 500);
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

// 清空数据
const cleanTrackData = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
onMounted(async () => {
  emit('update:hideAside', false);
  // setExpertSoilTemplateSelectData();
  // setUnitAndKindSelectData();
  getZuozhenDetail();
});
// 隐藏左边栏
onUnmounted(() => {
  emit('update:hideAside', true);
});
// 大图预览
const imgIndex = ref<number>();
const imgLists = ref<any>();
const getImgView = (index: number, lists: any) => {
  imgIndex.value = index;
  imgLists.value = lists;
};
// 新增诊疗跟踪日期限制
const disabledDate = (time: Date) => {
  return time.getTime() > new Date(new Date().toLocaleDateString()).getTime();
};
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
        margin-left: 10px;
      }

      .close-icon {
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
