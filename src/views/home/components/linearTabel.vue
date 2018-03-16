<style scoped>
    .linear-table{height: 300px; padding: 20px 0;}  
    .ivu-card-head-inner, .ivu-card-head p{height: 32px;}
</style>
<template>
    <Row class-name="home-page-row1" class="margin-top-10">
        <Card :padding="0" dis-hover shadow>             
            <div class="linear-table">                
                <div style="width:100%;height:100%;" id="service_request_con"></div>
            </div>
        </Card>
    </Row>
</template>
<script>
import echarts from 'echarts';
export default {
    name: 'linearTabel',
    props:{
        datas: {
            type: [Array, Object]         
        }
    },
    data () {
        return {
            echartData:{}
        };
    },
    watch: {
        datas(val) {
            this.echartData = val;      
            this.echartUpdate(val);
        }
    },
    methods : {
        echartUpdate(data){ 
            let xb = [],
                len = this.echartData[0].data.length;
            for(let i=1; i<= len; i++){
                xb.push( i + '小时')
            };

            const option = {
                tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }},                
                legend: {
                    data:['点击','下载','曝光量','转化']
                },
                grid: {left: '3%',right: '4%',bottom: '3%',containLabel: true},
                toolbox: {feature: {saveAsImage: {}}},
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xb
                },
                yAxis: {
                    type: 'value'
                }, 
                series: data        
            };           
            const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
            serviceRequestCharts.setOption(option);
            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }
    }
};
</script>