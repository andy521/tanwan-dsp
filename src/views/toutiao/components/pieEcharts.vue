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
    name: 'pieEcharts',
    props: ["datas", "title"],
    data() {
        return {
            type: "ageEcharts"
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
            const option = {
                title: {
                    text: this.title,
                    x: 'center',
                    top: '20',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: '20',
                    data: data.xAxis.data ? data.xAxis.data : "无数据"
                },
                color: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#9d96f5', '#8378ea', '#96bfff'],
                series: [
                    {
                        name: this.title,
                        type: 'pie',
                        radius: '40%',
                        center: ['50%', '50%'],
                        data: data.series[0].data ? data.series[0].data : [{ value: 0, name: '无数据' }],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
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