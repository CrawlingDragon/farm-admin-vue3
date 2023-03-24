<template>
  <!-- 种类的select的选择 -->
  <el-select v-model="selectKind" :filter-method="filterMethed" filterable clearable placeholder="请选择种类" class="w300"
    @change="changeFn">
    <template #prefix>
      <el-icon>
        <Search />
      </el-icon>
    </template>
    <el-option-group v-for="group in kindOptions.options" :key="group.label" :label="group.label">
      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" />
    </el-option-group>
  </el-select>
</template>
<script setup lang="ts">
import { reactive, onMounted, computed, ref, watch } from 'vue';
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
const selectKind = ref<number | string>('');
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
let kindOptionsVal = reactive([]);
const changeFn = (el: any, lab: any) => {
  emit('update:kind', el);
};

const trimData = computed(() => {
  kindOptions.options.map((item) => {
    item.label = `item.expertName`;
  });
});
const filterMethed = async (values: any) => {
  if (!values) {
    kindOptions.options = kindOptionsVal;
    // console.log('!values', kindOptions.options)
  } else {
    kindOptions.options = [];
    kindOptionsVal.map((item: any) => {
      kindOptions.options.push({
        label: item.label,
        options: item.options.filter((items: any) => items.label.indexOf(values) >= 0),
      });
    });
    kindOptions.options = kindOptions.options.filter((item: any) => {
      return item.options.length !== 0;
    });
    if (kindOptions.options.length == 0) {
      kindOptions.options.push({
        label: '暂无数据，可选其他',
        options: [
          {
            value: '195',
            label: '其他',
          },
        ],
      });
    }
  }
};
onMounted(() => {
  setSelectInfo();
});
const setSelectInfo = async () => {
  if (prop.options.length === 0) {
    let { categoryArr } = await getSelectInfo();
    // console.log('categoryArr', categoryArr);
    kindOptionsVal = categoryArr;
  } else {
    kindOptionsVal = prop.options as any;
    // console.log('prop');
  }
  kindOptions.options = kindOptionsVal;
  selectKind.value = prop.kind;
};

watch(
  () => prop.kind,
  () => {
    selectKind.value = prop.kind;
  }
);
</script>
<style lang="scss" scoped></style>
