<style scoped>
.chart{ border: 1px solid #eee;}
#echart{min-height: 550px;}
.ec_tit{line-height: 34px; padding: 0 15px; background: #f5f5f5;}
.view{cursor: pointer; float: right;color: #28bd8b;}
.echart_area{padding: 10px;}
</style>
<template>
	<div class="chart">
        <div class="ec_tit">
            推广资源报告
            <span class="view" @click="es = !es"><Icon type="stats-bars"></Icon> 查看趋势图</span>
        </div>            
        <div v-show="es" class="echart_area">
            <div>
                <Select v-model="left" @on-change="changeChart" size="small" style="width:120px">
                    <Option v-for="item in echartData" :value="item.eng" :key="item.eng">{{ item.name }}</Option>
                </Select>
                <Select v-model="right" @on-change="changeChart" size="small" style="width:120px;float:right;">
                    <Option v-for="item in echartData" :value="item.eng" :key="item.eng">{{ item.name }}</Option>
                </Select>
            </div>
            <div id="echart">

            </div>
        </div>
	</div>
</template>
<script>  
    import echarts from 'echarts';
	export default {
        name: 'lineChart',
        props:{
            datas: {
                type: Array,
                default: () => []       
            }
        },
		data() {
			return {
                es:true,
                echartData:[],
                left:'',
                right:''
			};
        },
        watch: {
            datas(val) {
                this.left = val[0].eng || '';
                this.right = val[1].eng || '';
                this.echartData = val;      
                this.echartUpdate(val);
            }
        },
		methods: {
            changeChart(){
                this.echartUpdate();
            },
			echartUpdate(){
                let list= this.echartData,
                    d = [],
                    xAxis =[],
                    series = [],
                    name = [];
                d.push(this.left);
                d.push(this.right);
                d.forEach(val=>{
                    for(let x in list){
                        if(list[x].eng == val){
                            name.push(list[x].name);
                            let datas = list[x].data,
                                s = [],
                                seriesData = {},
                                axis = [];                            
                            for(let y in datas){
                                axis.push(y);
                                s.push(datas[y]);
                            }
                            seriesData.type = list[x].type;
                            seriesData.data = s;
                            seriesData.name = list[x].name;
                            xAxis = axis;
                            series.push(seriesData); 
                            return;
                        }
                    }
                });
                const option = {
                    legend: {
                        data:name
                    },
                    grid: {top: '5%',left: '1.2%',right: '1%',bottom: '3%',containLabel: true},
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
                const serviceRequestCharts = echarts.init(document.getElementById('echart'));
                serviceRequestCharts.setOption(option);
                window.addEventListener('resize', function () {
                    serviceRequestCharts.resize();
                });
            }
        }
	};
</script>