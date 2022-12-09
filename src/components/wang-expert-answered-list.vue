<template>
  <ul class="content-child">
    <li v-for="(item, index) in listData">
      <div class="avatar">
        <el-avatar :src="item.avatar" />
      </div>
      <div class="info-mid">
        <div class="name-bar">
          <span class="name">{{ item.replier }}</span>
          <div class="time">{{ item.dateline }}</div>
        </div>
        <div class="text" v-if="item.message">
          {{ item.message }}
        </div>
        <div class="images" v-if="item.replyImgs.length !== 0">
          <el-image
            fit="scale-down"
            class="img"
            v-for="img in item.replyImgs"
            :src="img.thumbImg"
          ></el-image>
        </div>
        <div class="answer-icons" v-if="item.yongyaoList.length !== 0">
          <MedicineShow :table-data="item.yongyaoList" />
        </div>
        <!-- <div class="edit-box"></div> -->
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import MedicineShow from '@/components/medicine-show.vue';
const props = defineProps<{ listData: any }>();
</script>
<style lang="scss" scoped>
.content-child {
  margin-top: 10px;
  border-top: 1px solid #e5e5e5;
  & > li {
    border: 1px solid transparent;

    display: flex;
    padding: 5px 15px;
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
        margin-bottom: 10px;
        font-size: 14px;
      }
      .images {
        margin-bottom: 10px;
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
  }
}
</style>
