<template>
  <!-- 种类的select的选择 -->
  <el-select v-model="selectKind" placeholder="请选择种类" class="w300" @change="changeFn">
    <el-option-group v-for="group in kindOptions.options" :key="group.label" :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-option-group>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue';
import { getSelectInfo } from '../http/getSelectInfo';

const prop = defineProps({
  kind: {
    type: [Number, String],
    default: '',
  },
  options: {
    type: Array,
    default: function () {
      return [];
    },
  },
});

const emit = defineEmits(['update:kind']);
const selectKind = ref();
let kindOptions = reactive({
  options: [
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
});
const changeFn = (el: any, lab: any) => {
  emit('update:kind', el);
};

const trimData = computed(() => {
  kindOptions.options.map((item) => {
    item.label = `item.expertName`;
  });
});
onMounted(async () => {
  if (prop.options.length === 0) {
    let { categoryArr } = await getSelectInfo();
    // console.log('categoryArr', categoryArr);
    kindOptions.options = categoryArr;
  } else {
    kindOptions.options = prop.options as any;
    // console.log('prop');
  }
  selectKind.value = prop.kind;
});
</script>
<style lang="scss" scoped></style>
