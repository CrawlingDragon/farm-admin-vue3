<template>
  <div id="line" :style="{ width: width, height: height }"></div>
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      color: '#599524'
    },
  ],
});
const xData = computed(() => props.echartData[props.kind].xData);
const yData = computed(() => props.echartData[props.kind].yData);
let myEchart: any;
watch([() => props.kind, () => props.echartData], () => {
  options.xAxis.data = xData.value;
  options.series = yData.value;
  myEchart.setOption(options);
});

const initEchart = () => {
  let line: any = document.getElementById('line');
  myEchart = echarts.init(line);
  myEchart.setOption(options);
};

onMounted(() => {
  initEchart();
});
</script>
<style lang="scss" scoped></style>
