<template>
  <div id="line" class="line" :style="{ width: width, height: height }"></div>
</template>
<script setup lang="ts">
import echarts from '@/common/js/echaets';
import { onMounted, reactive, watch, computed } from 'vue';

const props = defineProps({
  kind: {
    type: String,
    default: 'vip',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
  echartData: {
    type: Object,
    default: function () {
      return {};
    },
  },
});
let options: any = reactive({
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    top: '10%',
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [],
      color: '#599524',
    },
  ],
});
const xData = computed(() => props.echartData[props.kind].xData);
const yData = computed(() => props.echartData[props.kind].yData);
let myEchart: any;
watch([() => props.kind, () => props.echartData], () => {
  // console.log('watch');
  options.xAxis.data = xData.value;
  options.series = yData.value;
  myEchart.setOption(options);
  // initEchart();
});

const initEchart = () => {
  let line: any = document.getElementById('line');
  myEchart = echarts.init(line);
  myEchart.setOption(options);
};

onMounted(() => {
  // console.log('onMounted');
  initEchart();
});
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
}
</style>
