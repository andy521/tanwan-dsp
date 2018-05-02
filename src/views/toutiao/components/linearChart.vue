<style lang="less" scoped>
.linear-chart{
  height: 300px;
}
</style>
<template>
  <div class="linear-chart">                
    <div style="width:100%;height:100%;" id="top_chart"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
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
    datas(val) {
      this.echartData = val
      this.echartsUpdate(val)
    }
  },
  methods: {
    /**
     * 根据长度获取本天前指定长度日期。
     * @augments {Number} dataLen 日期指定长度
     * @returns {array} 返回日期数组
     * 
     * */
    getDatelist(dataLen) {
      const y = new Date().getFullYear()
      const m = new Date().getMonth() + 1
      const d = new Date().getDate()
      const isLeapY = (y % 4 == 0) && (y % 100 != 0) ? true : false // 闰年？
      const mv = {
        1: 31,
        2: isLeapY ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
      } // 枚举月份天数

      let ret = []
      let cy = 0
      let cm = 0
      let cd = 0
      let diff = 0
      for (let i = dataLen; i > 0; i--) {
        diff = d - i
        switch (m) {
          case 1:
            cm = diff > 0 ? m : 12
            cy = diff > 0 ? y : y - 1
            cd = diff > 0 ? diff : mv[cm] + diff
            break
          default:
            cm = diff > 0 ? m : m - 1
            cy = y
            cd = diff > 0 ? diff : mv[cm] + diff
        }
        ret.push(
          `${cy}-${cm}-${cd}`
        )
      }
        return ret
    },
    echartsUpdate(data) {
      let period = this.getDatelist(7)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['展示数', '点击数', '点击率', '平均点击价格(元)', '总花费(元)', '平均千次展现费用(元)']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: period
        },
        yAxis: {
          type: 'value'
        },
        series: data
      }

      const topCharts = echarts.init(document.getElementById('top_chart'))
      topCharts.setOption(option);
      window.addEventListener('resize', function(){
        topCharts.resize()
      })
    }
  }
}
</script>
