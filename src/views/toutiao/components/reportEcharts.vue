<style scoped>
.chart {
  border: 1px solid #dddee1;
}
#echart {
  min-height: 350px;
}
.ec_tit {
  line-height: 34px;
  padding: 0 15px;
  background: #f5f5f5;
}
.view {
  cursor: pointer;
  float: right;
  color: #28bd8b;
}
.echart_area {
  padding: 10px;
}

</style>
<template>
    <div class="chart">
        <div class="ec_tit">
            {{title}}
            <span class="view" @click="es = !es">
                <Icon type="stats-bars"></Icon> 查看趋势图</span>
        </div>
        <div v-show="es" class="echart_area">
            <div class="es_select">
                <Select v-model="left" @on-change="changeChart" size="small" style="width:120px">
                    <Option v-for="item in echartData" :value="item.eng" :key="item.eng">{{ item.name }}</Option>
                </Select>
                <Select v-model="right" @on-change="changeChart" size="small" style="width:120px;float:right;">
                    <Option v-for="item in echartData" :value="item.eng" :key="item.eng">{{ item.name }}</Option>
                </Select>
            </div>
            <div id="echart"></div>
        </div>
    </div>
</template>
<script>  
import echarts from 'echarts';
export default {
    name: 'reportEcharts',
    props: {
        datas: {
            type: [Object, Array]
        },
        title: {
            type: String,
            default: ''
        },
        zoom: {
            type: [Boolean, String],
            default: false
        },
    },
    data() {
        return {
            tname: this.title,
            es: true,
            echartData: [],
            left: '',
            right: '',
            name: this.id,
            x: []
        };
    },
    watch: {
        datas(val) {
            //console.log(val)
            this.left = val.echartData[0].eng || '';
            this.right = val.echartData[1].eng || '';
            this.echartData = val.echartData;
            this.x = val.xAxis;
            this.echartUpdate(val);
        }
    },
    methods: {
        changeChart() {
            this.echartUpdate();
        },
        echartUpdate() {
            let list = this.echartData,
                xAxis = this.x,
                select = [],
                series = [],
                name = [];
            select.push(this.left);
            select.push(this.right);
            let isData = select.some(v => v != '')
            if (!isData) return;

            select.forEach(val => {
                for (let x in list) {
                    if (list[x].eng == val) {
                        name.push(list[x].name);
                        let datas = list[x].data,
                            s = [],
                            seriesData = {},
                            axis = [];
                        for (let y in datas) {
                            axis.push(y);
                            s.push(datas[y]);
                        }
                        seriesData.type = list[x].type;
                        seriesData.data = s;
                        seriesData.name = list[x].name;
                        seriesData.smooth=true;
                        series.push(seriesData);
                        return;
                    }
                }
            });
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: name
                },
                color: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#9d96f5', '#8378ea', '#96bfff'],
                grid: { left: '2%', right: '4%', bottom: '2%',top:'10%', containLabel: true },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis
                },
                yAxis: {
                    type: 'value'
                },
                series: series
            };
            if (!!this.zoom) {
                option.dataZoom = [
                    { show: true, realtime: true, start: 0, end: 100 },
                    //{type: 'inside',realtime: true,start: 0,end: 100}
                ]
            };
            const serviceRequestCharts = echarts.init(document.getElementById('echart'));
            serviceRequestCharts.setOption(option);
            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }
    }
};
</script>