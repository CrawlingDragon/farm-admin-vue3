<template>
  <div class="border" style="margin-bottom: 50px">
    <div class="nav-bar">
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vip-admin' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item
          >会员:{{ detailData.userInfo.userName }} {{ detailData.userInfo.tel }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="left-bar">
        <div class="user">
          <el-avatar :size="100" :src="detailData.userInfo.face" class="avatar" />
          <div class="info">
            <h4 class="name">{{ detailData.userInfo.userName }}</h4>
            <p class="time">加入时间：{{ detailData.userInfo.joinTime }}</p>
            <div class="btn">
              <el-dropdown>
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
                      >测土</el-dropdown-item
                    >
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
          <div class="item" v-if="soil.testingsoilLists">
            <div class="num fb">{{ detailData.tempArray.cetu }}</div>
            <div class="p">测土</div>
          </div>
          <div class="item" v-if="soil.observepointLists">
            <div class="num fb">{{ detailData.tempArray.viewpoint }}</div>
            <div class="p">观测点</div>
          </div>
          <div class="item" v-if="soil.zuozhenLists">
            <div class="num fb">{{ detailData.tempArray.wenzhen }}</div>
            <div class="p">坐诊</div>
          </div>
          <div class="item" v-if="soil.xunzhenLists">
            <div class="num fb">{{ detailData.tempArray.xunzhen }}</div>
            <div class="p">巡诊</div>
          </div>
          <div class="item" v-if="soil.questionLists">
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
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="158px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <div class="tip">基本信息</div>
          <el-form-item label="姓名:" prop="name">
            <el-input
              @change="nameChane"
              v-model="ruleForm.name"
              label="right"
              class="w300"
              placeholder="请输入姓名"
            />
          </el-form-item>
          <el-form-item label="手机号码:" prop="phone">
            <p>{{ ruleForm.phone }}</p>
            <!-- <el-input v-model.number="ruleForm.phone" label="right" class="w300" readonly /> -->
          </el-form-item>

          <el-form-item label="所在地区:" prop="local">
            <el-cascader
              v-model="ruleForm.local"
              :options="area"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
              class="localCls w300"
              placeholder="请选择省市区地址"
            />
          </el-form-item>
          <el-form-item label="详细地址:" prop="address">
            <el-input
              v-model="ruleForm.address"
              label="right"
              show-word-limit
              maxlength="100"
              placeholder="请输入村名，如松茸村"
              class="w300"
            />
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证:" prop="card">
            <el-input
              v-model="ruleForm.card"
              label="right"
              class="w300"
              placeholder="请输入身份证"
              @change="nameChane"
            />
          </el-form-item>
          <el-form-item label="家庭成员数:" prop="family">
            <el-input
              v-model.number="ruleForm.family"
              label="right"
              class="w300"
              placeholder="请输入家庭成员数量"
            />
          </el-form-item>
          <div class="tip">种类情况</div>
          <template v-for="(item, index) in ruleForm.baseInfo">
            <el-form-item
              :label="`种类名称${index + 1}:`"
              prop="kinds"
              class="kind"
              :rules="
                item.require
                  ? [
                      {
                        required: true,
                        message: '请选择种类',
                        trigger: 'change',
                      },
                    ]
                  : [
                      {
                        required: false,
                        message: '请选择种类',
                        trigger: 'change',
                      },
                    ]
              "
            >
              <el-select v-model="item.zuowuId" placeholder="请选择种类">
                <el-option-group
                  v-for="group in options.kindOptions"
                  :key="group.label"
                  :label="group.label"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
              <el-icon class="close" @click="deleteBaseInfo(index)"><CloseBold /></el-icon>
            </el-form-item>
            <el-form-item label="数量:" prop="growNumber">
              <el-input
                v-model.number="item.mushu"
                label="right"
                placeholder="请输入数字"
                class="grow-number"
              />
              <el-select-v2 v-model="item.unitId" :options="options.unitOptions" class="unit" />
            </el-form-item>
            <el-form-item label="地址:" prop="address" class="address">
              <el-input v-model="item.address" label="right" placeholder="种养区域/地址(选填)" />
            </el-form-item>
            <div class="line" v-if="index !== 0"></div>
          </template>
          <el-button type="primary" class="add" @click="addKind">添加种类</el-button>
          <div class="tip">备注信息</div>
          <el-form-item prop="message">
            <el-input
              v-model="ruleForm.message"
              type="textarea"
              rows="5"
              class="w300"
              show-word-limit
              maxlength="2000"
              placeholder="请输入备注信息"
            />
          </el-form-item>
          <div class="submit-bar">
            <div class="content">
              <el-button
                type="primary"
                size="large"
                @click="submitForm(ruleFormRef, '')"
                class="mr20"
                >保存</el-button
              >
              <el-button @click="goBack" size="large">取消</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <el-dialog v-model="dialogFormVisible" title="提示">
        <p class="md20">
          用户{{ ruleForm.phone }}加入了多家庄稼医院，修改姓名或身份证，需要输入用户收到的验证码
        </p>
        <el-form>
          <el-form-item label="验证码" class="code-item">
            <el-input
              v-model.number="ruleForm.codeVerify"
              autocomplete="off"
              class="w200 mr10"
              :class="!ruleForm.codeVerifyFlag ? 'code' : ''"
              @blur="checkCode"
              ref="code"
            />
            <el-button @click="getSetInterval" :disabled="!time.isShowSend">{{
              time.isShowSend ? '发送验证码' : `${time.timeNum}s后重发`
            }}</el-button>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="makeSureEdit" type="primary">确定</el-button>
            <el-button @click="dialogFormVisible = false">放弃修改</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, computed, ref, watch } from 'vue';
import storage from 'good-storage';
import { useRouter, useRoute } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getVipDetail, getDeleteVip, getVipEdit, getSendPhoneCode } from '@/http';
import { area } from '@/common/js/area_level4';
import type { FormInstance, FormRules } from 'element-plus';
import { getSelectInfo } from '@/http/getSelectInfo';

const formSize = ref<any>('large');
const ruleFormRef = ref<FormInstance>();

const router = useRouter();
const route = useRoute();
// 隐藏左边栏
const emit = defineEmits(['update:hideAside']);

let soil = storage.session.get('soil');

let id = computed(() => route.query.uId);
//detail data
const detailData = reactive<any>({
  userInfo: '',
  tempArray: '',
  recentlog: '',
  canDelete: 0, //是否能删除 0不能删除，1可以
  isJoinOther: 0, // 是否加入其他
});

const ruleForm = reactive({
  name: '', //姓名
  local: '', //所在地区
  address: '', //详细地址
  phone: '', // 手机号码
  sex: '男', // 性别
  card: '', //身份证
  // cardIsRequired: false,
  family: '', //家庭数量
  baseInfo: [
    {
      zuowuId: '', //种植种类
      mushu: '', // 种植数量
      unitId: 1, //单位
      address: '', //种植地址
      require: false,
    },
  ],
  message: '', // 备注信息
  codeVerify: '', //验证码
  codeVerifyFlag: true,
});

//自定义弹窗的显示
const dialogFormVisible = ref(false);

// 发送验证码倒计时
const time = reactive<any>({
  timeNum: 60,
  isShowSend: true,
  countDown: '', // 倒计时清除函数
});

const code = ref();
// 倒计时按钮函数
function getSetInterval() {
  if (!time.isShowSend) {
    return;
  }
  code.value.focus(); //验证码input 获得焦点
  getSendPhoneCode({ tel: ruleForm.phone });
  time.countDown = setInterval(() => {
    if (time.timeNum > 0 && time.timeNum <= 60) {
      time.isShowSend = false;
      time.timeNum--;
    } else {
      time.timeNum = 0;
      time.isShowSend = true;
      clearInterval(time.countDown);
    }
  }, 1000);
}

const rules = reactive<FormRules>({
  local: [{ required: true, message: '所在地区不能为空', trigger: 'change' }],
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  card: [{ required: false, message: '身份证不能为空', trigger: 'change' }],
});
const options = reactive({
  kindOptions: [
    // 作物select option
    {
      label: 'A',
      options: [
        {
          value: '板栗',
          label: '板栗',
        },
        {
          value: '白菜',
          label: '白菜',
        },
      ],
    },
  ],
  unitOptions: [
    // 种养单位 select option
    { label: '亩', value: 1 },
  ],
});

// watch 种植分类
watch(
  () => ruleForm.baseInfo,
  (newVal) => {
    newVal.map((item) => {
      if (item.mushu !== '' && item.zuowuId === '') {
        item.require = true;
      } else {
        item.require = false;
      }
    });
    // console.log('newVal', newVal);
  },
  {
    deep: true,
  }
);
// 添加种类按钮
function addKind() {
  ruleForm.baseInfo.push({
    zuowuId: '', //种植种类
    mushu: '', // 种植数量
    unitId: 1, //单位})
    address: '',
    require: false,
  });
}
// 选择地区
function handleChange(val: any) {
  // console.log(val);
}

// 删除种类
function deleteBaseInfo(index: number) {
  ruleForm.baseInfo.splice(index, 1);
}

// 提交编辑内容
async function submitEditData() {
  let r = await getVipEdit({
    id: id.value,
    userName: ruleForm.name,
    resideprovince: !ruleForm.local ? '' : ruleForm.local[0],
    residecity: !ruleForm.local ? '' : ruleForm.local[1],
    residedist: !ruleForm.local ? '' : ruleForm.local[2],
    residecommunity: !ruleForm.local ? '' : ruleForm.local[3],
    address: ruleForm.address,
    selfcard: ruleForm.card,
    sex: ruleForm.sex === '男' ? 1 : 2,
    familycount: ruleForm.family,
    zuowuJson: JSON.stringify(ruleForm.baseInfo) as any,
    remarks: ruleForm.message,
    codeVerify: ruleForm.codeVerify,
  });
  if (r.code) {
    ElMessage.error(r.msg);
  } else {
    ElMessage.success('编辑成功');
    setTimeout(() => {
      goBack();
    }, 200);
    // setTimeout(() => {
    //   router.replace({
    //     path: '/vip-detail',
    //     query: { id: id.value },
    //   });
    // }, 1000);
  }
}
// 姓名和身份证改变
const nameChaneShow = ref<boolean>(false);
const nameChane = () => {
  nameChaneShow.value = true;
  // console.log(nameChaneShow.value)
};

const submitForm = async (formEl: FormInstance | undefined, goOn: any) => {
  if (!formEl) return;
  // if (ruleForm.cardIsRequired) {
  //   rules.card = [{ required: true, message: '身份证不能为空', trigger: 'change' }];
  // }

  await formEl.validate((valid, fields) => {
    if (valid) {
      // 如果 detailData === 1并且姓名或身份证修改了，则需要接受验证码在修改，验证成功后 修改资料
      // 否则直接修改资料
      if (detailData.isJoinOther == 1 && nameChaneShow.value) {
        dialogFormVisible.value = true;
      } else {
        // 发送编辑数据ajax
        submitEditData();
      }
    } else {
      ElMessage.warning('提交失败,请修改后再提交');
      console.log('error submit!', fields);
    }
  });
};

// blur 验证 手机验证码
function checkCode() {
  if (ruleForm.codeVerify == '') {
    ruleForm.codeVerifyFlag = false;
  } else {
    ruleForm.codeVerifyFlag = true;
  }
}
// 发送手机验证码 确定按钮
const makeSureEdit = () => {
  if (ruleForm.codeVerify == '') {
    return;
  }
  submitEditData();
  ruleForm.codeVerify = '';
  dialogFormVisible.value = false;
};

// 去特定的路由
function goPage(path: string) {
  router.push({
    path,
    query: { uId: id.value },
  });
}

// 是否删除会员的按钮函数
function deleteVip() {
  if (detailData.canDelete !== 0) {
    ElMessageBox.confirm('确定删除该会员？', '删除提示')
      .then(async (res) => {
        let r = await getDeleteVip({ id: id.value });
        ElMessage({
          message: '删除成功',
          type: 'success',
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

onMounted(async () => {
  // 隐藏左边栏
  emit('update:hideAside', false);
  let r = await getVipDetail({ id: id.value });
  // console.log('r', r);
  detailData.userInfo = r.userInfo;
  detailData.tempArray = r.tempArray;
  detailData.recentlog = r.recentlog;
  detailData.canDelete = r.canDelete; //是否可以删除
  detailData.isJoinOther = r.isJoinOther;
  ruleForm.name = r.userInfo.userName; //姓名
  ruleForm.local = r.userInfo.residecommunity
    ? ([
        r.userInfo.resideprovince,
        r.userInfo.residecity,
        r.userInfo.residedist,
        r.residecommunity,
      ] as any)
    : ([r.userInfo.resideprovince, r.userInfo.residecity, r.userInfo.residedist] as any); //所在地区
  ruleForm.address = r.userInfo.address; //详细地址
  ruleForm.phone = r.userInfo.tel; // 手机号码
  ruleForm.sex = r.userInfo.sex; // 性别
  ruleForm.card = r.userInfo.selfcard; //身份证
  ruleForm.family = r.userInfo.familycount; //家庭数量
  ruleForm.baseInfo = r.userInfo.zuowu || []; //种类情况
  ruleForm.message = r.userInfo.remarks;

  let { categoryArr, unitArr } = await getSelectInfo();
  options.kindOptions = categoryArr;
  options.unitOptions = unitArr;
  if (r.userInfo.selfcard == '') {
    // console.log('r.userInfo.selfcard', r.userInfo.selfcard);
    // ruleForm.cardIsRequired = false;
    rules.card = [{ required: false, message: '身份证不能为空', trigger: 'change' }];
  } else {
    // ruleForm.cardIsRequired = true;
    rules.card = [{ required: true, message: '身份证不能为空', trigger: 'change' }];
  }
});
const goBack = () => {
  // router.go(-1);
  router.push({
    path: '/vip-detail',
    query: { id: id.value },
  });
};
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
.content-box {
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
.demo-ruleForm {
  width: 470px;
}
.grow-number {
  width: 215px;
  margin-right: 15px;
}
.unit {
  width: 73px;
}
.add {
  margin-left: 158px;
}
.kind {
  position: relative;
  .close {
    position: absolute;
    right: 0;
    font-size: 20px;
    cursor: pointer;
  }
}
.code {
  position: relative;
  &::after {
    content: '验证码不能为空';
    position: absolute;
    left: 0;
    color: red;
    font-size: 14px;
    top: 100%;
  }
}
</style>
