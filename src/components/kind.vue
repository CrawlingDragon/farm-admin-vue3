<template>
  <!-- 作物选择 -->
  <div>
    <template v-for="(item, index) in baseInfo">
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
        <el-icon class="close" v-if="index !== 0" @click="deleteBaseInfo(index)"
          ><CloseBold
        /></el-icon>
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
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
const props = defineProps<{
  baseInfo: [
    {
      mushu: ''; // 种植数量
      zuowuId: ''; //种植种类
      unitId: '亩'; //单位
      address: ''; //种植地址
      require: false;
    }
  ];
}>();
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
    { label: '亩', value: '亩' },
  ],
});
// 添加种类按钮
function addKind() {
  props.baseInfo.push({
    zuowuId: '', //种植种类
    mushu: '', // 种植数量
    unitId: '亩', //单位})
    address: '',
    require: false,
  });
}

// 删除种类
function deleteBaseInfo(index: number) {
  props.baseInfo.splice(index, 1);
}
</script>
<style lang="scss" scoped></style>
