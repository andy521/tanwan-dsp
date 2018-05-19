<template>

    <div style="width:100%;height:300px;" id="campaignEcharts"></div>

</template>
<script>
import echarts from "echarts";
export default {
    name: "campaignEcharts",
    props: ["datas"],
    data() {
        return {};
    },
    watch: {
        datas(val) {}
    },
    mounted() {
        this.echartUpdate();
    },
    methods: {
        //生成图表
        echartUpdate() {
            let option = {
                title: {
                    text: "图表"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: [
                        "假数据1",
                        "假数据2",
                        "假数据3",
                        "假数据4",
                        "假数据5"
                    ]
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六",
                        "周日"
                    ]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        name: "假数据1",
                        type: "line",
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: "假数据2",
                        type: "line",
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: "假数据3",
                        type: "line",
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: "假数据4",
                        type: "line",
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: "假数据5",
                        type: "line",
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };

            const serviceRequestCharts = echarts.init(
                document.getElementById("campaignEcharts")
            );
            serviceRequestCharts.setOption(option);
        }
    }
};
</script>