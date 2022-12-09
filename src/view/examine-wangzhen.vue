<template>
  <div class="vip-admin border bg-w pd40">
    <div class="head right-head soil-right-head">
      网诊管理
      <el-tooltip class="box-item tab" effect="dark" content="" placement="right-start">
        <template #content
          >记录专家田间巡诊数据，包含种类基本情况，<br />巡诊地点和开处方信息。</template
        >
        <el-icon class="icon color"><QuestionFilled /></el-icon>
      </el-tooltip>
      <div class="export" @click="exportPDFFn">导出PDF</div>
    </div>
    <div class="input-bar">
      <el-input
        v-model="keyword"
        class="w300 m-2 mr20"
        size="large"
        placeholder="会员姓名/手机号码"
      />
      <div class="date-box">
        <label class="mr10">提问日期</label>
        <el-date-picker
          v-model="dateVal"
          type="daterange"
          range-separator="-"
          start-placeholder="选择起始时间"
          end-placeholder="选择结束时间"
          size="large"
          class="mr10"
          value-format="YYYY-MM-DD"
        />
      </div>

      <div class="select-box mr10">
        <label class="mr10">状态</label>
        <el-select v-model="status" style="width: 130px" placeholder="Select" size="large">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button size="large" @click="search">搜索</el-button>
    </div>
    <div class="list-container">
      <div class="top-bar">
        <el-checkbox v-model="checkAll" class="check" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div class="times">已选中{{ checkedList.length }}条</div>
        <el-button type="" @click="inviteExpertFn"> 邀请专家回复</el-button>
      </div>
      <el-checkbox-group v-model="checkedList" @change="handleCheckedCitiesChange">
        <ul class="content">
          <li v-for="(item, index) in wangListData.listData">
            <div class="button">
              <el-checkbox :key="checkList[index]" :label="checkList[index]"> </el-checkbox>
            </div>
            <div class="avatar">
              <el-avatar :src="item.userFace" />
            </div>
            <div class="info-mid">
              <div class="name-bar">
                <span class="name">{{ item.username }} {{ item.mobile }}</span>
                <div class="crop">{{ item.zuowuName }}</div>
                <div class="time">{{ item.questionTime }}</div>
              </div>
              <div class="text" v-if="item.question">
                {{ item.question }}
              </div>
              <div class="images" v-if="item.questionImgs.length !== 0">
                <el-image
                  fit="scale-down"
                  class="img"
                  v-for="img in item.questionImgs"
                  :src="img.thumbImg"
                ></el-image>
              </div>
              <div class="answer-icons" @click="item.showEditBox = !item.showEditBox">
                <el-icon class="answer-icon"><ChatDotRound /></el-icon>
                ({{ item.replyNum }})
              </div>
              <div class="edit-box" v-show="item.showEditBox">
                <WangZhenAnswer
                  :recipeTemListArr="recipeTemListArr"
                  v-if="item.showEditBox"
                  :question-id="item.questionId"
                />
                <WangExpertAnsweredList
                  :list-data="item.replyLists"
                  v-if="item.replyLists.length !== 0"
                />
              </div>
            </div>
          </li>
        </ul>
      </el-checkbox-group>
    </div>
    <Pages :total="wangListData.totalData" v-model:page="page"></Pages>
    <!-- 邀请的专家弹窗模块 -->
    <WangInviteList v-model:inviteShowFlag="inviteShowFlags" :questionIds="checkedList" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import Pages from '@/components/pages.vue';
import WangInviteList from '@/components/wang-invite-expert.vue';
import WangZhenAnswer from '@/components/wangZhen-answer.vue';
import WangExpertAnsweredList from '@/components/wang-expert-answered-list.vue';
import { getWangList, getWangPDF, getWangToAnswer } from '@/http';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useExpertTemplateTestSelectOptions } from '@/hooks/useExpertTemplateTestSelectOptions';
const { recipeTemListArr } = useExpertTemplateTestSelectOptions();
const router = useRouter();
const active = ref(0);
const keyword = ref('');
const dateVal = ref();
const status = ref(0);
const page = ref(1);
const options = ref([
  { label: '全部', value: 0 },
  { label: '未回复', value: 1 },
  { label: '已回复', value: 2 },
]);

const inviteShowFlags = ref(false);
const checkAll = ref(false);
const checkedList = ref([]);
const handleCheckAllChange: any = (val: boolean) => {
  checkedList.value = val ? (checkList.value as any) : [];
};
const handleCheckedCitiesChange: any = (value: string[]) => {
  console.log('value', value);
  const checkedCount = value.length;
  checkAll.value = checkedCount === checkList.value.length;
};

const checkList = computed(() => {
  let arr: number[] = [];
  wangListData.listData.forEach((item: any) => {
    arr.push(item.questionId);
  });
  return arr;
});
const wangListData = reactive({
  totalData: 0,
  listData: [] as any,
});

const params = computed(() => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];

  let params = {
    getType: '2',
    keyword: keyword.value,
    startTime,
    endTime,
    isReply: status.value,
    page: page.value,
    pageCount: 10,
  };
  return params;
});

// 点击搜索按钮
function search() {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getWangListData();
  }
}
async function getWangListData() {
  let r = await getWangList(params.value);
  console.log('r', r);
  wangListData.listData = r.lists.data;
  wangListData.totalData = r.lists.totalData;
  wangListData.listData.map((item: any) => {
    item.checked = false;
    item.showEditBox = false;
  });
}

watch(page, () => {
  getWangListData();
});

watch(active, () => {
  if (page.value !== 1) {
    page.value = 1;
  } else {
    getWangListData();
  }
});
onMounted(() => {
  getWangListData();
});

//邀请专家的按钮函数
const inviteExpertFn = () => {
  if (checkedList.value.length === 0) {
    ElMessage.error('请先选择问题');
  } else {
    inviteShowFlags.value = true;
  }
};
//导出pdf
const exportPDFFn = async () => {
  let startTime = !dateVal.value ? '' : dateVal.value[0];
  let endTime = !dateVal.value ? '' : dateVal.value[1];
  let params = {
    getType: '2',
    keyword: keyword.value,
    startTime,
    endTime,
    isReply: status.value,
  };
  let r = await getWangPDF(params);
  console.log('r', r.downLink);
  window.open(r.downLink, '_target');
};
</script>
<style lang="scss" scoped>
.soil-right-head {
  display: flex;
  align-items: center;
  position: relative;

  .icon {
    margin-left: 5px;
    cursor: pointer;
    font-size: 20px;
  }
}
.export {
  font-size: 16px;
  color: $theme-color;
  margin-left: 20px;
  cursor: pointer;
}
.list-container {
  padding: 0 20px;
  .top-bar {
    display: flex;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
    align-items: center;
    .check {
      flex: 1;
    }
    .times {
      margin-right: 20px;
      font-size: 12px;
      color: #999;
    }
  }
  .content {
    :deep().el-checkbox__label {
      display: none;
    }
    & > li {
      border: 1px solid transparent;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      padding: 30px 15px;
      &:hover {
        border: 1px solid $theme-color;
      }
      .button {
        width: 44px;
      }
      .avatar {
        width: 40px;
        margin-right: 10px;
      }
      .info-mid {
        flex: 1;
        min-width: 0;
        .name-bar {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          .name {
            width: 400px;
            font-size: 14px;
            color: #333;
          }
          .crop {
            width: 68px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            background: #cddfbd;
            color: #666;
          }
          .time {
            flex: 1;
            text-align: right;
            font-size: 14px;
            color: #999;
          }
        }
        .text {
          color: #333;
          line-height: 24px;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .images {
          margin-bottom: 15px;
          .img {
            width: 100px;
            height: 100px;
            border: 1px solid #e5e5e5;
            margin-right: 10px;
          }
        }
        .answer-icons {
          margin-top: 20px;
          font-size: 14px;
          color: $theme-color;
          display: flex;
          align-items: center;
          cursor: pointer;
          .answer-icon {
            font-size: 23px;
            margin-right: 3px;
          }
        }
      }
    }
  }
}
</style>
