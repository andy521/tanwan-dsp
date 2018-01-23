<style lang="less">
    .linear-table{height: 300px;}  
</style>
<template>
    <Row class-name="home-page-row1" class="margin-top-10">
        <Card :padding="0" dis-hover shadow>              
            <p slot="title" class="card-title">                   
                <Select placeholder="暴光率"  @on-change="getChange" style="width:200px">
                    <Option v-for="item in exposureList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </p>            
            <div class="linear-table">                
                <div style="width:100%;height:100%;" v-model="dataEchart" id="service_request_con"></div>
            </div>
        </Card>
    </Row>
</template>
<script>
import echarts from 'echarts';
export default {
    name: 'linearTabel',
    props:{
        dataEchart:Object
    },
    data () {
        return {
            echartData:{},
            exposureList : [
                {value: 'click',label: '点击率'},
                {value: 'activation',label: '激活注册'},
                {value: 'download',label: '下载率'},
                {value: 'impression',label: '曝光率'}
            ]
        };
    },
    watch: {
        dataEchart (val) {            
            this.echartData = val;          
            this.echartUpdate(val.impression);
        }
    },
    methods : {
        getChange(value){
            let getData = this.echartData[value]
            this.echartUpdate(getData)
        },
        echartUpdate(data){ 
            let xb = [],
                 len = data.length;
            for(let i=1; i<= len; i++){
                xb.push( i + '小时')
            };

            const option = {
                tooltip: { trigger: 'axis', axisPointer: { type: 'cross' }},                
                // legend: {
                //     data:['暴光量']
                // },
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
                series: [
                        {
                            name:'暴光量',
                            type:'line',
                            stack: '总量',
                            data: data
                        }
                    ]
            };
            //http://echarts.baidu.com/examples/index.html
            const serviceRequestCharts = echarts.init(document.getElementById('service_request_con'));
            serviceRequestCharts.setOption(option);
            window.addEventListener('resize', function () {
                serviceRequestCharts.resize();
            });
        }

    }
};
</script>