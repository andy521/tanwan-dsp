<style scoped>
.chart {
  border: 1px solid #dddee1;
  height: 400px;
}
</style>
<template>
    <div class="chart" id="map"></div>
</template>
<script>  
import echarts from 'echarts';
import 'echarts/map/js/china.js';
export default {
    name: 'chinaEcharts',
    props: ["datas", "title"],
    data() {
        return {

        };
    },
    watch: {
        datas(val) {
            this.echartUpdate(val);
        }
    },
    methods: {
        convertData(data) {
            let geoCoordMap = { '新疆维吾尔自治区': [84.9023, 42.148], '西藏自治区': [87.8695, 31.6846], '内蒙古自治区': [112.5977, 46.3408], "青海": [95.2402, 35.4199], "四川": [101.9199, 30.1904], "黑龙江": [126.1445, 48.7156], "甘肃": [99.7129, 38.166], "云南": [101.0652, 25.1807], "广西壮族自治区": [107.7813, 23.6426], "湖南": [111.5332, 27.3779], "陕西": [109.5996, 35.7396], "广东": [113.4668, 22.8076], "吉林": [125.7746, 43.5938], "河北": [115.4004, 39.4688], "湖北": [112.2363, 31.1572], "贵州": [106.6113, 26.9385], "山东": [118.7402, 36.4307], "江西": [116.0156, 27.29], "河南": [113.0668, 33.8818], "辽宁": [122.0438, 41.0889], "山西": [112.4121, 37.6611], "安徽": [117.2461, 32.0361], "福建": [118.3008, 25.9277], "浙江": [120.498, 29.0918], "江苏": [118.8586, 32.915], "重庆市": [107.7539, 30.1904], "宁夏回族自治区": [105.9961, 37.3096], "海南省": [109.9512, 19.2041], "台湾": [120.0254, 23.5986], "北京": [116.4551, 40.2539], "天津市": [117.4219, 39.4189], "上海市": [121.4648, 31.2891], "香港特别行政区": [114.1178, 22.3242], "澳门特别行政区": [111.5547, 22.1484] };
            let res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        },
        echartUpdate(data) {
            let impression = data[0],
                precent = data[1],
                min = 1,
                max = 50000;
            // max = parseInt(data.max) || 0,
            // min = parseInt(data.min) || 0;

            let option = {
                title: {
                    text:this.title,
                    x: 'center',
                    top: '20',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        var res = params.name + '<br/>';
                        var myseries = option.series;
                        for (var i = 0; i < myseries.length; i++) {
                            for (var j = 0; j < myseries[i].data.length; j++) {
                                if (myseries[i].data[j].name == params.name) {
                                    if (myseries[i].eng == 'precent') {
                                        res += myseries[i].name + ' : ' + myseries[i].data[j].value[2] * 100 + '%</br>';
                                    } else {
                                        res += myseries[i].name + ' : ' + myseries[i].data[j].value[2] + '</br>';
                                    }
                                }
                            }
                        }
                        return res;
                    }
                },
                legend: { orient: 'vertical', left: 'left', data: ['impression', 'precent'] },
                visualMap: { min: min, max: max, left: 'left', top: 'bottom', text: ['高', '低'], calculable: true, color: ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c'] },
                
                series: [
                    {
                        name: impression.name,
                        eng: impression.eng,
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: { normal: { show: true }, emphasis: { show: true } },
                        data:impression.data? this.convertData(impression.data):""
                    },
                    {
                        name: precent.name,
                        eng: precent.eng,
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        label: { normal: { show: true }, emphasis: { show: true } },
                        data: precent.data?this.convertData(precent.data):""
                    }
                ]
            };

            const ageEcharts = echarts.init(
                document.getElementById("map")
            );
            ageEcharts.setOption(option);
            window.addEventListener('resize', function () {
                ageEcharts.resize();
            });
        }
    }
};
</script>