<template>
  <div class="medicine-show-box">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="drugName" label="商品名称" />
      <el-table-column prop="drugSpec" label="商品规格" />
      <el-table-column prop="drugPrice" label="参考单价" />
      <el-table-column prop="drugQuantity" label="商品数量" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tableData: {
    type: Array,
    default: function () {
      return [];
    },
  },
});
</script>
<style lang="scss" scoped>
.medicine-show-box {
  width: 100%;
}
</style>
