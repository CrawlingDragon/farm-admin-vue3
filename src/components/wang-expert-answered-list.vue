<template>
  <ul class="content-child">
    <li v-for="(item, index) in listData">
      <div class="avatar">
        <el-avatar :src="item.avatar" fit="cover" />
      </div>
      <div class="info-mid">
        <div class="name-bar">
          <span class="name">{{ item.replier }} </span>
          <div class="time">{{ item.dateline }}</div>
        </div>
        <div class="text" v-if="item.message">
          {{ item.message }}
        </div>
        <div class="images" v-if="item.replyImgs.length !== 0">
          <el-image
            fit="fill"
            class="img"
            v-for="(img, index) in item.replyImgs"
            :key="index"
            :src="img.thumb_url"
            @click="getImgView(index, item.replyImgs)"
          ></el-image>
        </div>
        <div class="answer-icons" v-if="item.yongyaoList.length !== 0">
          <MedicineShow :table-data="item.yongyaoList" />
        </div>
        <!-- <div class="edit-box"></div> -->
      </div>
      <div class="chase-question-box" v-if="item.addWenLists.length !== 0">
        <div class="chase-question-item" v-for="(question, questionIndex) in item.addWenLists">
          <div class="info-mid">
            <div class="name-bar">
              <div class="chase-question-avatar">
                <el-avatar :src="question.avatar" fit="cover" />
              </div>
              <span class="name"
                >{{ question.replier }}
                <i class="question-type">{{ question.questionType }}</i></span
              >
              <div class="time">{{ question.dateline }}</div>
            </div>
            <div class="text" v-if="question.message">
              {{ question.message }}
            </div>
            <div class="images" v-if="question.replyImgs.length !== 0">
              <el-image
                fit="fill"
                class="img"
                v-for="(img, questionIndex) in question.replyImgs"
                :key="index"
                :src="img.thumb_url"
                @click="getImgView(questionIndex, question.replyImgs)"
              ></el-image>
            </div>
          </div>
          <div
            class="chase-question-icon"
            v-if="question.isCanReply === 1"
            @click="question.showEdit = !question.showEdit"
          >
            <el-icon class="answer-icon">
              <ChatDotRound />
            </el-icon>
          </div>
          <WangZhenAnswer
            :recipeTemListArr="useExpertTemplateTestSelectOptions"
            v-if="question.showEdit"
            :question-id="question.addWenId"
            :is-reply-answer="true"
            style="margin-bottom: 10px"
          />
        </div>
      </div>
    </li>
  </ul>
  <!-- 大图预览 -->
  <imgPreview v-model:index="imgIndex" :lists="imgLists" />
</template>
<script setup lang="ts">
import imgPreview from '@/components/imgPreview.vue';
import MedicineShow from '@/components/medicine-show.vue';
import WangZhenAnswer from '@/components/wangZhen-answer.vue';
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{ listData: any; useExpertTemplateTestSelectOptions: any }>();
// 大图预览
const imgIndex = ref<number>();
const imgLists = ref<any>();
const getImgView = (index: number, lists: any) => {
  imgIndex.value = index;
  imgLists.value = lists;
};

const showEditBox = ref<any>([]);

const openEditBox = (index: number, questionIndex: number) => {
  debugger;
  showEditBox[index].addWenLists[questionIndex].showEdit = true;
};

onMounted(() => {
  initEditBox();
});

const initEditBox = () => {
  showEditBox.value = props.listData;
  showEditBox.value.forEach((item: any) => {
    if (item.addWenLists.length == 0) return;
    item.addWenLists.map((it: any) => {
      it.showEdit = false;
    });
  });
};
watch(
  () => props.listData,
  (newVal) => {
    if (newVal.length != 0) {
      initEditBox();
    }
  }
);
</script>
<style lang="scss" scoped>
.content-child {
  margin-top: 10px;
  border-top: 1px solid #e5e5e5;
  & > li {
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    padding: 20px 15px 0;
    flex-wrap: wrap;
    &:last-child {
      border: none;
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
      padding: 20px 0 0;
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
        margin-bottom: 15px;
        font-size: 14px;
      }
      .images {
        margin-bottom: 20px;
        .img {
          width: 100px;
          height: 100px;
          border: 1px solid #e5e5e5;
          margin-right: 10px;
        }
      }
      .answer-icons {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 14px;
        color: $theme-color;
        display: flex;
        align-items: center;
      }
    }
    .chase-question-box {
      width: 100%;
      margin-left: 48px;
      background: #f8f8f8;
      padding: 0 20px;
      padding-top: 0;
      margin-bottom: 20px;

      .chase-question-item {
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #e5e5e5;
        padding-top: 20px;
        &:last-child {
          border-bottom: none;
        }
        .info-mid {
          flex: 1;
          min-width: 0;
          padding: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          .name-bar {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            width: 100%;
            flex: 1;
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
            margin-bottom: 15px;
            font-size: 14px;
          }
          .images {
            margin-bottom: 20px;
            .img {
              width: 100px;
              height: 100px;
              border: 1px solid #e5e5e5;
              margin-right: 10px;
            }
          }
          .answer-icons {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 14px;
            color: $theme-color;
            display: flex;
            align-items: center;
          }
          .question-type {
            font-style: normal;
            color: #999999;
            margin-left: 20px;
          }
        }
      }
      .chase-question-avatar {
        width: 40px;
        margin-right: 10px;
      }

      .chase-question-icon {
        width: 100%;
        margin-bottom: 20px;
        .answer-icon {
          font-size: 23px;
          color: $theme-color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
