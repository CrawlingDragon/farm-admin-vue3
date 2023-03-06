<template>
  <el-transfer
    class="transfer"
    filterable
    v-model="transferKind"
    :data="transferData"
      :titles="['未选的种类', '已选的种类']"
    @change="chooseTransfer"
  />
</template>
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { getSelectInfo } from '../http/getSelectInfo';

const props = defineProps<{ kind: any[] }>();
// {
// kind: {
//   type: Array,
//   default: function () {
//     return [];
//   },
// },
// }
const emits = defineEmits(['update:kind']);

//穿梭框右边已经选择的值
const transferKind = ref<any[]>([]);

// 穿梭框的默认值,也就是左边可供选择的值
const transfer = ref<any>([]);
// 请求的穿梭框的数据重新组织
const transferData = computed(() => {
  let arr: any = [];
  transfer.value.forEach((item: any) => {
    arr.push(...item.options);
  });
  arr.map((item: any) => {
    item.key = item.value;
  });
  return arr;
});

const chooseTransfer = (val: any[]) => {
  console.log('val', val);
  emits('update:kind', val);
};
onMounted(async () => {
  let r = await getSelectInfo();
  transfer.value = r.categoryArr;
});

watch(
  () => props.kind,
  () => {
    transferKind.value = props.kind;
  }
);
</script>
<style lang="scss" scoped>
.transfer {
  :deep(.el-button.is-disabled) {
    background-color: #cddfbd;
    border-color: #fff;
  }

  :deep(.el-transfer-panel__header) {
    .el-checkbox__label {
      span {
        display: none;
      }
    }
  }
}
</style>
