<style scoped>
.chart {
  border: 1px solid #dddee1;
  height: 400px;
}
</style>
<template>
    <div class="chart" :id="type"></div>
</template>
<script>  
import echarts from 'echarts';
export default {
    name: 'barEcharts',
    props: ["datas", "title"],
    data() {
        return {
            type: "barEcharts"
        };
    },
    watch: {
        datas(val) {
            this.echartUpdate(val);
            this.type = val.xAxis.type;
        }
    },
    methods: {
        echartUpdate(data) {
            let option = {
                color: ['#3398DB', '#000000'],
                title: { text: this.title, x: 'center', top: '20' },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                    formatter: function (params) {
                        let res = params[0].name + '<br/>';
                        params.forEach(e => {
                            e.componentSubType == 'line' ? res += e.seriesName + ':' + (e.data * 100).toFixed(2) + '%<br/>' : res += e.seriesName + ':' + e.data + '<br/>';
                        });
                        return res;
                    }
                },
                grid: { top: '60', left: '2%', right: '2%', bottom: '60', containLabel: true },
                legend: { bottom: '20', data: ['展现', '占比'] },
                xAxis: [{ type: 'category', data: data.xAxis.data }],
                yAxis: [{ type: 'value' }],
                series: data.series
            };


            const ageEcharts = echarts.init(
                document.getElementById(this.type)
            );
            ageEcharts.setOption(option);
            window.addEventListener('resize', function () {
                ageEcharts.resize();
            });
        }
    }
};
</script>