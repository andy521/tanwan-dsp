<style scoped>
	.tabllebox {
		margin-left: 20px;
	}
	
	.linear-table {
		background: #fff;
		padding: 20px 0;
		margin-bottom: 20px;
	}
</style>
<template>
	<div class="tabllebox">
		<div class="linear-table">
			<Select v-model="adhourArrname" style="width:200px;margin-left: 20px;" @on-change="changname">
				<Option v-for="item in adhourArr" :value="item.name" :key="this">{{ item.name }}</Option>
			</Select>
			<div style="width:100%;height:300px;" :id="datas.adgroup_id"></div>
		</div>
		<div>
			<!--<RadioGroup v-model="adcreative_name" type="button" style="margin-bottom: 10px;">
				<Radio v-for="item in datas.adcreative"  :key="this" :label="item.adcreative_name"></Radio>
			</RadioGroup>-->
			
			<Select v-model="adcreative_name" style="width:200px;margin-bottom: 10px;" @on-change="chang_adcreative_name">
				<Option v-for="item in datas.adcreative" :value="item.adcreative_name" :key="this">{{ item.adcreative_name }}</Option>
			</Select>
			<Table stripe :columns="columns1" :data="tadata"></Table>
		</div>
	</div>

</template>
<script>
	import echarts from 'echarts';
	import { toHourMinute } from '@/utils/DateShortcuts.js';
	export default {
		name: 'echartsTabel',
		props: ['datas'],
		data() {
			return {
				adhourArr: [],
				adhourArrname: '',
				name: [],
				newadhourArr: [],
				xb: [],
				columns1: [{
						title: '时间',
						width: 80,
						key: 'time'
					}, {
						title: '点击',
						width: 80,
						key: 'click'
					},
					{
						title: '下载',
						width: 80,
						key: 'download'
					},
					{
						title: '曝光量',
						width: 80,
						key: 'impression'
					},
					{
						title: '转化',
						width: 80,
						key: 'conversion'
					},
					{
						title: '消耗',
						width: 80,
						key: 'cost'
					},
					{
						title: '激活',
						width: 80,
						key: 'activation'
					},
					{
						title: 'APP付费行为次数',
						key: 'app_payment_count'
					},
					{
						title: 'APP付费总金额',
						key: 'app_payment_amount'
					},
					{
						title: 'APP安装量',
						key: 'app_installation'
					}
				],
				adcreative_name: '',
				tadata: [],
			};
		},
		watch: {
			datas(val) {
				this.adhourArr = val.adcreative[0].adhourArr;
				this.adhourArrname = val.adcreative[0].adhourArr[0].name;
				this.adcreative_name = val.adcreative[0].adcreative_name;
			}
		},
		mounted() {

		},
		methods: {
			//选择创意
			chang_adcreative_name(val) {
				let arr = [];
				this.datas.adcreative.forEach(v => {
					if(v.adcreative_name == val) {
						for(let i = 0; i < v.adhourArr[0].data.length; i++) {
							let time = '',
								click = '',
								download = '',
								impression = '',
								conversion = '',
								cost = '',
								activation = '',
								app_payment_count = '',
								app_payment_amount = '',
								app_installation = '';
							v.adhourArr.forEach(v => {
								if(v.name == '点击') {
									click = v.data[i];
								} else if(v.name == '下载') {
									download = v.data[i];
								} else if(v.name == '曝光量') {
									impression = v.data[i];
								} else if(v.name == '转化') {
									conversion = v.data[i];
								} else if(v.name == '消耗') {
									cost = v.data[i];
								} else if(v.name == '激活') {
									activation = v.data[i];
								} else if(v.name == 'APP付费行为次数') {
									app_payment_count = v.data[i];
								} else if(v.name == 'APP付费总金额') {
									app_payment_amount = v.data[i];
								} else if(v.name == 'APP安装量') {
									app_installation = v.data[i];
								}
							})
							let item = {
								time: toHourMinute(i * 60),
								click: click,
								download: download,
								impression: impression,
								conversion: conversion,
								cost: cost,
								activation: activation,
								app_payment_count: app_payment_count,
								app_payment_amount: app_payment_amount,
								app_installation: app_installation
							};
							arr.push(item);
						}
					}
				})
				this.tadata = arr;
			},
			//选择效果走势
			changname(val) {
				let arr = [],
					name = [];
				this.datas.adcreative.forEach(v => {
					let data = [],
						xb = [];
					v.adhourArr.forEach(v => {
						if(v.name == val) {
							data = v.data;
						}
					})
					//x轴
					data.forEach((v, i) => {
						xb.push(toHourMinute(i * 60));
					})
					let item = {
						name: v.adcreative_name + '-' + val,
						type: 'line',
						data: data
					};
					arr.push(item);
					name.push(v.adcreative_name + '-' + val);
					if(this.xb.length == 0) {
						this.xb = xb;
					}
				});
				this.newadhourArr = arr;
				this.name = name;
				this.echartUpdate();
			},
			//生成图表
			echartUpdate() {
				let option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						}
					},
					legend: {
						data: this.name
					},
					grid: {
						left: '2%',
						right: '2%',
						bottom: '2%',
						containLabel: true
					},
					//					toolbox: {
					//						feature: {
					//							saveAsImage: {}
					//						}
					//					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.xb
					},
					yAxis: {
						type: 'value'
					},
					series: this.newadhourArr
				};
				this.$nextTick(function() {
					const serviceRequestCharts = echarts.init(document.getElementById(this.datas.adgroup_id));
					serviceRequestCharts.setOption(option);
					//					window.addEventListener('resize', function() {
					//						serviceRequestCharts.resize();
					//					});
				})
			}
		}
	};
</script>