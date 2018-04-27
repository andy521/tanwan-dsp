<style lang="less" scoped>

</style>
<template>
  <div class="linear-chart">                
    <div style="width:100%;height:100%;" id="service_request_con"></div>
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  name: 'linearChart',
  props: {
    datas: {
      type: [Array, Object]
    }
  },
  data: () => ({
    echartData: {}
  }),
  watch: {

  }
}
</script>
