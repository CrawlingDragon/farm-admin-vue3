<template>
  <!-- 处方模板列表 -->
  <div class="box">
    <div
      v-for="item in prescribingTemplateList"
      class="item border"
      @click="selectItem(item.templateId)"
    >
      {{ item.templateTitle }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTestExpert, getTemplateDetail } from '@/http';

export interface ListItem {
  templateTitle: string;
  templateId: number;
}

const emit = defineEmits(['selectTemplate']);

const prescribingTemplateList = ref<ListItem[]>([]);
onMounted(async () => {
  let r = await getTestExpert();
  prescribingTemplateList.value = r.recipeTemList;
});

// 选择模板函数
function selectItem(id: number) {
  setDetail(id);
}

async function setDetail(id: number) {
  let detail = await getTemplateDetail({ templateId: id });
  emit('selectTemplate', detail);
  // console.log('detail', detail);
}
</script>
<style lang="scss" scoped>
.box {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  .item {
    padding: 5px;
    margin-right: 15px;
    margin-bottom: 5px;
    border-radius: 5px;
    border-color: $theme-color;
    cursor: pointer;
    color: #333;
  }
}
</style>
