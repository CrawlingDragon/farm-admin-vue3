<template>
  <div class="mb50">
    <div class="nav-bar border">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/examine-soil' }">测土配方</el-breadcrumb-item>
        <el-breadcrumb-item> 测土详情: {{ ruleForm.testingsoilNumber }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <AddSecondBar title="测土配方" :mobile="userInfo.mobile" :time="userInfo.time">
      <el-dropdown style="margin-right: 20px">
        <span class="el-dropdown-link">
          <span>编辑</span>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="editFn">编辑</el-dropdown-item>
            <el-dropdown-item @click="delFn">删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="last-active">{{ ruleForm.trackInfo.lastEffectStr }}</div>
    </AddSecondBar>
    <div class="content">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        size="default"
      >
        <div class="top-box bg-w border">
          <div class="left-bar">
            <div class="tip">土壤信息</div>
            <el-form-item label="会员:">
              {{ userInfo.name }} {{ userInfo.userMobile }}
            </el-form-item>
            <el-form-item label="位置:" prop="address">
              {{ ruleForm.address }}
            </el-form-item>
            <el-form-item prop="name" label="北纬:" v-if="ruleForm.latitude && ruleForm.longitude">
              {{ ruleForm.latitude || '暂无' }}
              <span class="mr10" style="color: #606266">东经:</span>
              {{ ruleForm.longitude || '暂无' }}
            </el-form-item>
            <el-form-item label="现种养种类:" prop="nowKind">
              {{ ruleForm.nowKind }}
            </el-form-item>
            <el-form-item label="前种养种类:" prop="beforeKind" v-if="ruleForm.beforeKind">
              {{ ruleForm.beforeKind }}
            </el-form-item>
            <el-form-item label="数量:" prop="number">
              {{ ruleForm.number }}{{ ruleForm.unit }}
            </el-form-item>
            <el-form-item label="地形:" prop="terrain">
              {{ ruleForm.terrain }}
            </el-form-item>
            <el-form-item label="采样深度(cm):" prop="sampleNumber">
              {{ ruleForm.sampleNumber }}
            </el-form-item>
            <el-form-item
              label="采样日期:"
              prop="sampleDate"
              v-model="ruleForm.sampleDate"
              class="w300"
              readonly
            >
              {{ ruleForm.sampleDate }}
            </el-form-item>
            <el-form-item label="初复诊:" prop="diagnosis">
              {{ ruleForm.diagnosis }}
            </el-form-item>

            <el-form-item label="图片:" prop="image" v-if="ruleForm.image.length > 0">
              <el-image
                v-for="(item, index) in ruleForm.image"
                class="upload-img"
                :src="item.thumb_url"
                @click="getImgView(index, ruleForm.image)"
                fit="cover"
              >
              </el-image>
              <span v-if="ruleForm.image.length == 0">暂无</span>
            </el-form-item>
            <el-form-item label="测试专家:" prop="testPeople">
              {{ ruleForm.testPeople }}
            </el-form-item>
            <el-form-item label="描述:" prop="describe" v-if="ruleForm.describe">
              {{ ruleForm.describe }}
            </el-form-item>
            <div class="tip">检测信息</div>
            <el-form-item label="测土状态:" prop="soilStatus">
              {{ ruleForm.soilStatus }}
            </el-form-item>
          </div>

          <div class="right-bar">
            <div class="right-box border">
              <div class="tip">测土配方结果</div>

              <el-form-item label="铵态氮含量:" prop="soilResult.an">
                <div>
                  <!-- <p v-if="ruleForm.soilStatus === 1">检测中...</p> -->
                  <span class="result-input">{{ ruleForm.soilResult.an }}</span>
                  <div class="standard">标准值:10-15mg/kg</div>
                </div>
              </el-form-item>

              <el-form-item label="速效磷含量:" prop="soilResult.lin">
                <div>
                  <span class="result-input">{{ ruleForm.soilResult.lin }}</span>
                  <div class="standard">极高:>=90|高:90-60|中:60-30|低30-15|极低:&lt;15</div>
                </div>
              </el-form-item>

              <el-form-item label="有效钾含量:" prop="soilResult.jia">
                <div>
                  <span class="result-input">{{ ruleForm.soilResult.jia }}</span>
                  <div class="standard">极高: >=155|高:155-125|中:125-100|低100-70|极低:&lt;70</div>
                </div>
              </el-form-item>
              <el-form-item label="PH值:" prop="ph">
                <div>
                  {{ ruleForm.soilResult.ph || '暂无' }}
                  <div class="standard">中性值:7</div>
                </div>
              </el-form-item>
              <el-form-item label="有机质:" prop="organic">
                <div>
                  <span class="organic-input">{{ ruleForm.soilResult.organic || '暂无' }}</span>
                  <div class="standard">极高:>=25|高:25-20|中:20-15 | 低15-10 | 极低:&lt; 10</div>
                </div>
              </el-form-item>
              <el-form-item label="盐分:" prop="salt">
                <span class="organic-input">{{ ruleForm.soilResult.salt || '暂无' }}</span>
              </el-form-item>
              <el-form-item label="结果描述:" prop="soilDescribe">
                {{ ruleForm.soilResult.soilDescribe || '暂无' }}
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="bottom-box border bg-w mt10">
          <div class="left-bar">
            <div class="tip">
              处方信息
              <el-checkbox-group v-model="ruleForm.Prescribing.open" class="open-Prescribing">
                <el-checkbox label="公开处方" name="type" />
              </el-checkbox-group>
            </div>
            <el-form-item label="处方专家:" prop="Prescribing.expert">
              {{ ruleForm.Prescribing.expert }}
            </el-form-item>
            <el-form-item label="看诊结果:" prop="Prescribing.result">
              {{ ruleForm.Prescribing.result }}
            </el-form-item>
            <el-form-item label="最近测土记录:" prop="leastSoilRecord">
              {{ ruleForm.Prescribing.leastSoilRecord }}
            </el-form-item>
            <div class="tip">用药信息</div>
            <div class="medicine" v-if="ruleForm.Prescribing.medicine.length !== 0">
              <div class="bar title border">
                <div class="item">商品名称</div>
                <div class="item">商品规格</div>
                <div class="item">价格</div>
                <div class="item">数量</div>
              </div>
              <div class="bar content-bar" v-for="(item, index) in ruleForm.Prescribing.medicine">
                <div class="item">
                  {{ item.drugName }}
                </div>
                <div class="item">
                  {{ item.drugSpec }}
                </div>
                <div class="item">{{ item.drugPrice }}</div>
                <div class="item">
                  {{ item.drugQuantity }}
                </div>
              </div>
            </div>
            <el-form-item label="" v-else> 暂无 </el-form-item>
          </div>
        </div>
        <div class="border bg-w mt10">
          <div class="tip">诊疗跟踪({{ ruleForm.trackInfo.trackCount }})</div>
          <div
            v-for="track in ruleForm.trackInfo.trackLists"
            :key="track.trackId"
            class="track-wrap"
          >
            <div class="track-del">
              <el-icon color="#599524" v-if="track.effectStr == '已调理'"><Select /></el-icon>
              <el-icon color="#599524" v-if="track.effectStr == '待跟进'">
                <Clock />
              </el-icon>
              <el-icon color="#da993c" v-if="track.effectStr == '没效果'">
                <Warning />
              </el-icon>
              <span>{{ track.effectStr }}</span>
              <el-icon class="close-icon" @click="delTrackFn(track.trackId)">
                <CloseBold />
              </el-icon>
            </div>
            <el-form-item label="跟踪日期:" prop="" style="margin-bottom: 5px">
              <div>{{ track.trackTime }}</div>
            </el-form-item>
            <el-form-item label="诊疗效果:" prop="" style="margin-bottom: 5px">
              <div>{{ track.effectStr }}</div>
            </el-form-item>
            <el-form-item
              label="效果描述:"
              prop=""
              style="margin-bottom: 40px"
              v-if="track.content"
            >
              <div>{{ track.content }}</div>
            </el-form-item>
          </div>
        </div>
        <div class="border bg-w mt10">
          <div class="tip">新增诊疗跟踪</div>
          <el-form-item label="跟踪日期:" prop="newDate" class="date">
            <el-date-picker
              :disabled-date="disabledDate"
              v-model="ruleForm.newDate"
              type="date"
              placeholder="选择时间"
              size="large"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="诊疗效果:" prop="newEffects">
            <el-radio-group v-model="ruleForm.newEffects">
              <el-radio :label="1">没效果</el-radio>
              <el-radio :label="2">待跟进</el-radio>
              <el-radio :label="3">已调理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="效果描述:" prop="newResult">
            <el-input
              v-model="ruleForm.newResult"
              class="w300"
              type="textarea"
              rows="4"
              maxlength="2000"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="" prop="newResult">
            <el-button size="large" type="primary" @click="submitForm(ruleFormRef)">发布</el-button>
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
import { ElMessage, UploadProps, UploadRawFile, UploadFiles, ElMessageBox } from 'element-plus';
import imgPreview from '@/components/imgPreview.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { getTestExpert, getTestSoilDetail, getDelSoil, getTrackDel, getTrackAdd } from '@/http';
import AddSecondBar from '@/components/add-second-bar.vue';
import { transformImageParams } from '@/common/js/util';

// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);
const route = useRoute();

const cetuId = computed(() => route.params.cetuId);
// const routeName = computed(() => route.name);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  testingsoilNumber: '', //测土数字
  nameId: '', //姓名
  address: '', //位置
  latitude: '', //经度
  longitude: '', //纬度
  nowKind: '', //现在种类
  beforeKind: '', //之前种类
  unit: 1, //单位
  number: '', //数量
  terrain: 1, //地形
  sampleNumber: '', // 采样深度
  sampleDate: '', //采样日期
  diagnosis: 1, // 初复诊
  describe: '', //描述
  image: [] as any, // 图片
  // aliossImage: [],
  testPeople: 0, //测试专家x
  soilStatus: 1, //测土状态
  newDate: '', //新增诊疗跟踪方案-跟踪日期
  newEffects: 1, //新增诊疗跟踪方案-诊疗效果
  newResult: '', //新增诊疗跟踪方案-效果描述
  soilResult: {
    // 测土配方结果
    an: '', //氨态碳含量
    lin: '', //磷含量
    jia: '', //钾含量
    ph: '', //ph值
    organic: '', //有机质
    salt: '', // 盐分
    soilDescribe: '', //测土结果描述
  },
  Prescribing: {
    // 处方信息
    open: ['公开处方'],
    expert: '', //处方专家
    result: '', // 看诊结果
    leastSoilRecord: '', //最近测土记录
    medicine: [
      //用药信息
      {
        drugName: '', //药品名字
        drugId: '', //药品id
        drugSpec: '', //药品规格
        drugQuantity: 1, // 药品数量
        drugPrice: '', //价格
      },
    ],
  },
  cetuId: '', //用于详情显示的cetuId
  trackInfo: {
    //诊疗跟踪
    lastEffect: 1, // 暂时用不到
    trackCount: 1, //诊疗跟踪总数
    lastEffectStr: '', //顶部整个订单的状态显示
    trackLists: [{ content: '', effect: '', trackId: '', trackTime: '', effectStr: '' }], // 具体诊疗数据
    // content,effect ,trackId,trackTime
  },
});

const rules = reactive<FormRules>({
  newDate: {
    required: true,
    message: '时间不能为空',
    trigger: 'change',
  },
  newEffects: {
    required: true,
    message: '时间不能为空',
    trigger: 'change',
  },
});

//顶部编辑按钮
const editFn = () => {
  router.push({
    path: `/examine-soil-edit/${cetuId.value}`,
  });
};
//顶部的删除按钮
const delFn = () => {
  ElMessageBox.confirm('是否要删除测土配方', '提示')
    .then(async (res) => {
      let r = await getDelSoil(ruleForm.cetuId);
      if (r.code) {
        ElMessage.error({ message: r.msg, duration: 1500 });
      } else {
        ElMessage.success({ message: '删除成功', duration: 1500 });
        router.replace({ path: '/examine-soil' });
      }
      // console.log('r', r);
      //删除配方
    })
    .catch(() => {});
};

const router = useRouter();
const submitForm = async (formEl: FormInstance | undefined, goPage?: string) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // console.log('submit!');
      let r = await getTrackAdd({
        cetuId: ruleForm.cetuId,
        trackTime: ruleForm.newDate,
        effect: ruleForm.newEffects,
        content: ruleForm.newResult,
      });
      console.log('r', r);
      if (!r.code) {
        ElMessage.success('添加成功');
        getSoilDetail();
        clearAddData();
      } else {
        ElMessage.error({ message: r.msg, duration: 1500 });
      }
    } else {
      ElMessage.warning({ message: '提交失败,请修改后再提交', duration: 1500 });
      console.log('error submit!', fields);
    }
  });
};

//成功添加跟踪记录后删除数据
function clearAddData() {
  ruleForm.newDate = '';
  ruleForm.newEffects = 1;
  ruleForm.newResult = '';
}
// 取消按钮
// const cancel = function () {
//   router.push('/examine-soil');
// };

const soilParams = computed<any>(() => {
  let soilResultsJson = JSON.stringify({
    atdVal: ruleForm.soilResult.an,
    sxlVal: ruleForm.soilResult.lin,
    yxjVal: ruleForm.soilResult.jia,
    phVal: ruleForm.soilResult.ph,
    organicVal: ruleForm.soilResult.organic,
    saltVal: ruleForm.soilResult.salt,
    resultVal: ruleForm.soilResult.soilDescribe,
  });
  let chufangInfoJson = JSON.stringify({
    isPublic: ruleForm.Prescribing.open[0],
    expertId: ruleForm.Prescribing.expert,
    chufangResult: ruleForm.Prescribing.result,
    lastCetuNumber: ruleForm.Prescribing.leastSoilRecord,
  });

  let yongyaoInfoJson = JSON.stringify(ruleForm.Prescribing.medicine);
  let params = {
    cetuId: cetuId.value,
    uid: ruleForm.nameId,
    northLat: ruleForm.latitude,
    eastLng: ruleForm.longitude,
    address: ruleForm.address,
    zuowuId: ruleForm.nowKind,
    beforeZuowuId: ruleForm.beforeKind,
    mushu: ruleForm.number,
    unit: ruleForm.unit,
    dixing: ruleForm.terrain,
    depth: ruleForm.sampleNumber,
    datecollected: ruleForm.sampleDate,
    isFrist: ruleForm.diagnosis,
    soildescribe: ruleForm.describe,
    images: transformImageParams(ruleForm.image),
    expertId: ruleForm.testPeople,
    status: ruleForm.soilStatus,
    soilResultsJson,
    chufangInfoJson,
    yongyaoInfoJson,
  };
  return params;
});

const userInfo = reactive({ mobile: 0, time: 0, name: '', userMobile: '' });
async function getSoilDetail() {
  // 没有cetuId，说明是新增页面不需要请求详情数据
  if (!cetuId.value) return;
  let r = await getTestSoilDetail(cetuId.value as any);
  // console.log('r', r);
  let soilInfo = r.soilInfo;
  let cetuResult = r.cetuResult;
  let chufangInfo = r.chufangInfo;
  let enterInfo = r.enterInfo;
  ruleForm.testingsoilNumber = enterInfo.testingsoilNumber;
  ruleForm.cetuId = soilInfo.cetuId;
  userInfo.mobile = enterInfo.enterMobile;
  userInfo.userMobile = soilInfo.mobile;
  userInfo.time = enterInfo.enterTime;
  userInfo.name = soilInfo.username;
  ruleForm.address = soilInfo.address;
  ruleForm.latitude = soilInfo.northLat;
  ruleForm.longitude = soilInfo.eastLng;
  ruleForm.nowKind = soilInfo.zuowuName;
  ruleForm.beforeKind = soilInfo.beforeZuowuName;
  ruleForm.unit = soilInfo.unitName;
  ruleForm.number = soilInfo.mushu;
  ruleForm.terrain = soilInfo.dixingStr;
  ruleForm.sampleNumber = soilInfo.depth;
  ruleForm.sampleDate = soilInfo.datecollected;
  ruleForm.diagnosis = soilInfo.isFristStr;
  ruleForm.describe = soilInfo.soildescribe;
  ruleForm.image = soilInfo.images;

  ruleForm.testPeople = soilInfo.expertName;
  ruleForm.soilStatus = r.statusStr;
  ruleForm.soilResult.an = cetuResult.atdVal;
  ruleForm.soilResult.lin = cetuResult.sxlVal;
  ruleForm.soilResult.jia = cetuResult.yxjVal;
  ruleForm.soilResult.ph = cetuResult.phVal;
  ruleForm.soilResult.organic = cetuResult.organicVal;
  ruleForm.soilResult.salt = cetuResult.saltVal;
  ruleForm.soilResult.soilDescribe = cetuResult.resultVal;

  ruleForm.Prescribing.open = chufangInfo.isPublic == 1 ? ['公开处方'] : [];
  ruleForm.Prescribing.expert = chufangInfo.expertName;
  ruleForm.Prescribing.result = chufangInfo.chufangResult;
  ruleForm.Prescribing.leastSoilRecord = chufangInfo.lastCetuNumber;
  ruleForm.Prescribing.medicine = r.drugInfo;
  ruleForm.trackInfo = r.trackInfo;
}

// 删除诊疗跟踪记录
const delTrackFn = (id: string) => {
  ElMessageBox.confirm('确定删除这条诊疗跟踪吗?', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    //请求删除函数
    let r = await getTrackDel(id);
    if (!r.code) {
      ElMessage.success({ message: '删除成功', duration: 1500 });
    } else {
      ElMessage.error({ message: r.msg, duration: 1500 });
    }
    //重新请求数据，刷新页面数据
    getSoilDetail();
  });
};
onMounted(async () => {
  emit('update:hideAside', false);
  // setExpertSoilTemplateSelectData();
  getSoilDetail();
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
.nav-bar {
  border-bottom: none;
}

.top-box {
  display: flex;
  justify-content: space-between;

  & > div {
    flex: 1;
  }

  .right-bar {
    .right-box {
      background: #f8f8f8;
      margin: 10px;
    }
  }
}

.bottom-box {
  display: flex;
  justify-content: space-between;

  & > div {
    flex: 1;
  }

  .right-bar {
    border-left: 1px solid $border-color;
  }
}

.standard {
  font-size: 12px;
  color: #999;
  line-height: 22px;
}

.result-input,
.organic-input,
.salt-input {
  position: relative;
}

.result-input::after {
  position: absolute;
  content: 'mg/kg';
  right: -60px;
  color: #333;
}

.organic-input::after {
  content: 'g/kg';
  right: -47px;
  color: #333;
  position: absolute;
}

.salt-input::after {
  content: 'ms/cm';
  position: absolute;
  right: -60px;
  color: #333;
}

.tip {
  position: relative;
  display: flex;
  align-items: center;

  .open-Prescribing {
    margin-left: 44px;
    // position: absolute;
    // top
  }
}

.medicine {
  margin-bottom: 10px;

  .bar {
    width: 80%;
    height: 40px;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    // margin-top: 5px;

    .item {
      flex: 1;
      font-size: 14px;
      height: 100%;
      // padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #e5e5e5;

      &:last-child {
        border: none;
      }
    }

    .del {
      width: 30px;
      text-align: center;
      cursor: pointer;
    }
  }

  .content-bar {
    border: 1px solid #e5e5e5;
    border-top: none;
  }

  .title {
    margin-top: 0;
  }
}

.add-medicine-btn {
  margin-top: 30px;
  margin-left: 20px;
  margin-bottom: 30px;
}

.upload-img {
  width: 70px;
  height: 70px;
  margin-right: 10px;
}

.track-wrap {
  position: relative;

  .track-del {
    position: absolute;
    right: 20px;
    top: 5px;
    color: #333;
    display: flex;
    align-items: center;
    z-index: 2;
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

.el-dropdown-link {
  color: $theme-color;
  cursor: pointer;
}

.last-active {
  position: absolute;
  right: 10px;
  // top: 50%;
  // transform: translateX(-50%);
}
</style>
