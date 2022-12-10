<template>
  <div class="table">
    <el-table :data="props.tableData" style="width:100%;">
      <template v-for="item in props.columns" :key="item.prop">
        <el-table-column header-align="center" align="center" v-if="item.prop == 'contentSplicing'" :label="item.label">
          <template #default="scope">
            <span v-for="str in item.content" :key="str">{{ scope.row[str] }}
              &nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column v-else header-align="center" align="center" :prop="item.prop"
          :label="item.label"></el-table-column>
      </template>
    </el-table>

  </div>
</template>
<script setup lang="ts">
const props: any = defineProps({
  tableData: {
    type: Array,
    default: [],
  },
  columns: {
    type: Array,
    default: [],
  },
});

</script>
<style lang="scss" scoped>
.table {
  width: 100%;

}
</style>
