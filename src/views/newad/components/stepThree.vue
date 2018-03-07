<style lang="less">
	.newad .ivu-table-row-hover td {
		background-color: #f8f9fa;
	}
	
	.newad .ivu-table-row-highlight td {
		color: #e88e00
	}
	
	.newad .ivu-form-item-label {
		color: #888;
	}
	
	.newad .ivu-form-item {
		margin-bottom: 15px;
	}
	
	.adspace {
		margin: 10px 0 30px;
		position: relative;
	}
	
	.modify {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 999;
	}
	
	.ad_table {
		margin-right: 210px;
	}
	
	.preview {
		position: absolute;
		width: 200px;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #f8f9fa;
		display: none;
	}
	
	.ad_table .preview {
		display: block;
	}
	
	.carousel-caption {
		padding-left: 20px;
		padding-right: 20px;
		margin-top: 20px;
		text-align: center;
	}
	
	.carousel-caption h3 {
		color: #404246;
		padding-top: 0;
		margin-bottom: 0;
		line-height: 1.4;
		font-size: 16px;
	}
	
	.carousel {
		height: 358px;
		background-color: #6b6e7b;
		position: relative;
	}
	
	.carousel img {
		display: inline-block;
		max-width: 200px;
		max-height: 358px;
	}
	
	.tips {
		margin-top: 8px;
		color: #b9bdc2;
		font-size: 12px;
		line-height: 1;
		position: absolute;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, .2);
		padding: 8px;
		text-align: center;
	}
	
	.ad-info {
		margin-top: 27px;
		color: #555;
	}
	
	.date_price {
		margin: 20px 0;
	}
	
	.next_btn {
		width: 300px;
		margin-top: 40px;
	}
	
	.next_btn .ivu-btn-large {
		padding: 10px 15px;
		font-size: 16px;
	}
	
	.week {
		margin: 0 0 20px 90px;
	}
	
	.week .btn_clear {
		color: red;
	}
	
	.ivu-table td {
		cursor: pointer;
	}
	
	.fl {
		float: left;
	}
</style>
<template>
	<div class="newad">
		<div @click="tostep([1,1])">
			<h3 class="subtit">广告版位</h3>
			<Alert type="error" v-if="verify.ad" show-icon class="margin-top-10">请选择要投放的版位</Alert>
			<div id="J_edition" class="adspace">
				<!-- 阻止修改版位 -->
				<div class="modify" v-if="modify" @click="isModify"></div>
				<div :class="className">
					<Table :columns="columnsAdSpace" :data="edition" highlight-row @on-row-click="rowClick" size="small"></Table>
					<div class="preview">
						<div class="carousel">
							<p class="tips">(广告可能出现在以上位置)</p>
							<img :src="imgSrc" alt="微信公众号、新闻插件底部">
						</div>
						<!-- <div class="carousel-caption">                        
                        <h3>微信公众号、新闻插件底部</h3>
                        <p class="tips">(广告可能出现在以上位置)</p>
                        <div class="ad-info">创意尺寸：465×230</div>
                    </div>                     -->
					</div>
				</div>
			</div>
		</div>
		<div @click="tostep([1,2])">
			<h3 class="subtit">排期与出价</h3>
			<Alert type="error" v-if="verify.dp" show-icon class="margin-top-10">{{verify.dp_txt}}</Alert>
			<div id="J_bid" class="date_price">
				<Form :model="adgroup" :label-width="90">
					<FormItem label="投放日期：">
						<DatePicker @on-change="changeDateLong" v-model="adgroup.setdate" type="date" format="yyyy-MM-dd" placeholder="长期投放" style="width: 300px; margin-right:15px;"></DatePicker>
						<DatePicker @on-change="changeDate" v-model="adgroup.setdate" type="daterange" format="yyyy-MM-dd" placement="bottom-end" placeholder="在某日期范围内投放" style="width: 300px"></DatePicker>
					</FormItem>
					<FormItem label="投放时间：">
						<div class="fl">
							<Checkbox @on-change="isAllDay" v-model="allDay">
								<span>全天</span>
							</Checkbox>
							<span style="margin:0 20px; color:#999">/</span>
						</div>
						<div class="fl" v-if="allDay" @click="period">特定时间段</div>
						<div class="fl" v-else>
							<Select :disabled="allDay" @on-change="startTime" placeholder="00:00" style="width:100px">
								<Option v-for="item in timeStateList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
							</Select>
							-
							<Select :disabled="allDay" @on-change="endTime" placeholder="24:00" style="width:100px;margin-right:10px;">
								<Option v-for="item in timeEndList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
							</Select>
							<Button @click="showWeek" type="dashed">{{isWeekText}}</Button>
						</div>
					</FormItem>
					<div class="week" v-if="isWeek">
						<week-time v-model="adgroup.time_series"></week-time>
					</div>
					<FormItem label="出价方式：">
						<Select @on-change="getStyle" style="width:180px;margin-right:15px;" placeholder="请选择优化目标">
							<Option v-for="item in goalList" :value="item.value" :key="item.id">{{ item.label }}</Option>
						</Select>
						<RadioGroup v-model="adgroup.style" type="button">
							<Radio label="BILLINGEVENT_IMPRESSION" :disabled="disabled_cpc">按曝光扣费</Radio>
							<Radio label="BILLINGEVENT_CLICK" :disabled="disabled_cpm">按点击扣费</Radio>
						</RadioGroup>
						<span style="color:#ccc;">（请先选优化目录，然后才可选择出价方式）</span>
					</FormItem>
					<FormItem label="出价：">
						<Input v-model="adgroup.bid_amount" placeholder="输入价格" number style="width:180px" @on-blur="getPrice" icon=""></Input> <span class="input-ts">元/点击</span>
					</FormItem>
					<FormItem label="日限额：" v-if="plandata.campaign_type=='CAMPAIGN_TYPE_WECHAT_MOMENTS'">
						<Input v-model="adgroup.daily_budget" placeholder="输入日限额" number style="width:180px" icon=""></Input> <span class="input-ts">分</span>
					</FormItem>
					<FormItem label="落地页 url：">
						<Input v-model="adgroup.destination_url" placeholder="输入落地页 url" type="url" style="width:450px" icon=""></Input> 
					</FormItem>
					

					<FormItem style="margin-top:70px" label="广告名称">
						<Input v-model="adgroup.adcreative_name" :maxlength="40" style="width: 450px"></Input> <span class="input-ts">{{adgroup.adcreative_name.length}}/40</span>
					</FormItem>
					<FormItem label="广告组名称">
						<Input v-model="adgroup.adgroup_name" :maxlength="40" style="width: 450px"></Input> <span class="input-ts">{{adgroup.adgroup_name.length}}/40</span>
					</FormItem>
				</Form>
			</div>
		</div>

		<div class="next_btn">
			<Button type="primary" @click="nextStep" long size="large">下一步</Button>
		</div>

		<!-- <p style="width:800px;word-break:break-all;">{{adgroup.time_series}}</p> -->
	</div>
</template>
<script>
	import weekTime from './weekTime.vue';
	import p65 from '@/images/adcreative/65.png';
	import p148 from '@/images/adcreative/148.png';
	import p184 from '@/images/adcreative/184.png';
	import p210 from '@/images/adcreative/210.png';
	import p471 from '@/images/adcreative/471.png';
	import p473 from '@/images/adcreative/473.png';
	import p486 from '@/images/adcreative/486.png';
	import p487 from '@/images/adcreative/487.png';
	export default {
		components: {
			weekTime,
		},
		name: 'step-three',
		props: {
			//广告版位数据
			edition: {
				type: Array,
				default: () => []
			},
			setp: [1, 1],
			plandata: {
				type: Object
			},
		},
		data() {
			return {
				className: '',
				columnsAdSpace: [{
						title: '广告版位',
						key: 'name'
					},
					{
						title: '创意形式',
						key: 'modus'
					},
					{
						title: '描述',
						key: 'description'
					}
				],
				setdata: '',
				adgroup: {
					//选择广告id
					adcreative_template_id: '',
					//站点
					site_set: '',
					//广告优化目标类型
					optimization_goal: '',
					//开始投放日期
					begin_date: '',
					//结束投放日期
					end_date: '',
					//投放时间段
					time_series: '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
					style: '',
					//出价
					bid_amount: '',
					//广告名称              
					adcreative_name: '',
					adgroup_name: '',
					daily_budget: '',
					destination_url:''
				},
				imgSrc: '',
				//投放时间
				allDay: true,
				//特定时间段-开始时间
				timeStateList: [],
				//特定时间段-结束时间
				timeEndList: [],
				//选中的开始时间
				timeState: '0',
				//选中的结束时间
				timeEnd: '24',
				//出价方式
				disabled_cpc: true,
				disabled_cpm: true,
				//是否显示高级设置
				isWeek: false,
				isWeekText: '高级设置',
				//下一步操作时判断
				verify: {
					ad: false,
					dp: false,
					dp_txt: ''
				},
				//是否修改版位
				modify: false
			}
		},
		watch: {

		},
		computed: {

			//优化目标   出价方式要跟据优化目标来决定   
			goalList() {
				let goalArr = [],
					goal = this.$store.state.newad.ads_config.optimization_goal;
				for(let i in goal) {
					goalArr.push({
						'id': i,
						'value': goal[i].val_type,
						'label': goal[i].name
					})
				}
				return goalArr;
			},
		},
		methods: {
			tostep(step) {
				this.$emit('tostep', step)
			},
			//阻止修改广告版位
			isModify() {
				this.$Modal.confirm({
					title: '修改版位',
					content: '<p>修改版位，已填写的广告创意将会被清空',
					onOk: () => {
						this.modify = false;
					},
					onCancel: () => {

					}
				});
			},
			//选择优化目标
			getStyle(val) {
				if(val == 'OPTIMIZATIONGOAL_CLICK' || val == 'OPTIMIZATIONGOAL_APP_ACTIVATE' || val == 'OPTIMIZATIONGOAL_APP_REGISTER' || val == 'OPTIMIZATIONGOAL_PROMOTION_CLICK_KEY_PAGE' || val == 'OPTIMIZATIONGOAL_ECOMMERCE_ORDER' || val == 'OPTIMIZATIONGOAL_APP_PURCHASE' || val == 'OPTIMIZATIONGOAL_ECOMMERCE_CHECKOUT' || val == 'OPTIMIZATIONGOAL_PAGE_RESERVATION') {
					this.disabled_cpc = false;
					this.disabled_cpm = true;
				} else if(val == 'OPTIMIZATIONGOAL_IMPRESSION') {
					this.disabled_cpm = this.disabled_cpc = false;
				}
				this.adgroup.optimization_goal = val;
				this.adgroup.style = 'BILLINGEVENT_CLICK';
			},
			//选择广告版位
			rowClick(row) {
				this.className = 'ad_table';
				this.adgroup.adcreative_template_id = row.id;
				this.adgroup.site_set = row.site_set;
				switch(row.id) {
					case 65:
						this.imgSrc = p65;
						break;
					case 148:
						this.imgSrc = p148;
						break;
					case 184:
						this.imgSrc = p184;
						break;
					case 210:
						this.imgSrc = p210;
						break;
					case 471:
						this.imgSrc = p471;
						break;
					case 473:
						this.imgSrc = p473;
						break;
					case 486:
						this.imgSrc = p486;
						break;
					case 487:
						this.imgSrc = p487;
						break;
				};
				if(!this.adgroup.adcreative_name) {
					this.adgroup.adcreative_name = row.name + '/' + row.modus + '/' + row.description;
				}
				this.$emit('on-edition', row.element);
			},
			//长期投放
			changeDateLong(val) {
				this.adgroup.begin_date = val;
				this.adgroup.end_date = '';
			},
			//在期日期范围内投放
			changeDate(val) {
				this.adgroup.begin_date = val[0];
				this.adgroup.end_date = val[1];
			},
			//出价 正则过滤非数字
			getPrice() {
				let patrn = /^\d+(\.\d+)?$/;
				if(!patrn.exec(this.adgroup.bid_amount)) {
					//this.$Message.error('请输入正确价格！');
					this.adgroup.bid_amount = '';
				}
			},
			//投放时间全天
			isAllDay(val) {
				if(val) {
					this.isWeek = false;
					this.adgroup.time_series = '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
				}
			},
			//特定时间段
			period() {
				this.allDay = false;
			},
			//显示高级设置
			showWeek() {
				if(!this.isWeek) {
					this.isWeek = true;
					this.isWeekText = '退出高级设置';
				} else {
					this.isWeek = false;
					this.isWeekText = '高级设置';
				}

			},
			//特定时间段 - 开始时间
			startTime(val) {
				this.timeState = val;
				this.setEndTime(this.timeState);
				this.adgroup.time_series = this.timeSeries(val, this.timeEnd);
			},
			//特定时间段 - 结束时间
			endTime(val) {
				this.timeEnd = val;
				this.setStartTime(this.timeEnd);
				this.adgroup.time_series = this.timeSeries(this.timeState, val);
			},
			//设置特定时间开始时间
			setStartTime(t) {
				let time = [];
				for(let i = 0; i <= 24; i++) {
					let index = i < 10 ? '0' + i : i;
					let obj = {}
					obj.value = i
					obj.label = index + ':00';
					if(i >= t) {
						obj.disabled = true;
					} else {
						obj.disabled = false;
					}
					time.push(obj)
				}
				this.timeStateList = time;

			},
			//设置特定时间结束时间
			setEndTime(t) {
				let time = [];
				for(let i = 24; i >= 0; i--) {
					let index = i < 10 ? '0' + i : i;
					let obj = {}
					obj.value = i
					obj.label = index + ':00';
					if(i <= t) {
						obj.disabled = true;
					} else {
						obj.disabled = false;
					}
					time.push(obj)
				}
				this.timeEndList = time;
			},
			//计算出时间系
			timeSeries(start, end) {
				/*
				投放时间段，格式为 48 * 7 位字符串，且都为 0 和 1，以半个小时为最小粒度，从周一零点开始至周日 24 点结束。 
				0 为不投放， 1 为投放，不传此字段、全为 0 、全为 1 均视为全时段投放。朋友圈广告的投放时间需大于等于 6 小时，小于等于 10 个自然日，
				且每天投放的时段需保持一致字段长度最小 336 字节，长度最大 336 字节
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				111111000000000000111111111111111111111111111111
				*/
				let day = 7,
					grid = 23,
					serice = '';
				for(let i = 0; i < 7; i++) {
					for(let index = 0; index <= grid; index++) {
						if(index >= start && index <= end) {
							serice += '11'
						} else {
							serice += '00'
						}
					}
				}
				//console.log(serice)
				return serice;
			},
			//下一步
			nextStep() {
				if(this.adgroup.id == '') {
					this.verify.ad = true;
					return
				};
				if(this.adgroup.begin_date == '') {
					this.verify.dp = true;
					this.verify.dp_txt = "请设置投放日期";
					return
				};
				if(this.adgroup.bid_amount < 10 || this.adgroup.bid_amount > 10000) {
					this.verify.dp = true;
					this.verify.dp_txt = "出价需介于10分-10,000分之间";
					return
				};
				if(this.plandata.campaign_type== 'CAMPAIGN_TYPE_WECHAT_MOMENTS') {
					if(this.adgroup.daily_budget < 100000 || this.adgroup.daily_budget > 1000000000) {
						this.verify.dp = true;
						this.verify.dp_txt = "日预算要求介于 100,000 – 1,000,000,000 分之间";
						return
					};
				}else{
					this.adgroup.daily_budget=='';
				}				
				if(this.adgroup.destination_url == '') {
					this.verify.dp = true;
					this.verify.dp_txt = "请填写落地页 url";
					return
				};
				if(this.adgroup.adcreative_name == '') {
					this.verify.dp = true;
					this.verify.dp_txt = "请填写广告名称";
					return
				};
				if(this.adgroup.adgroup_name == '') {
					this.verify.dp = true;
					this.verify.dp_txt = "请填写广告组名称";
					return
				};
				//提交下一步需要的信息
				this.modify = true;
				//关闭错误提示信息
				this.verify.ad = this.verify.dp = false;
				//提交数据
				this.$emit('on-click', this.adgroup);
			}
		},
		mounted() {
			this.setStartTime(24);
			this.setEndTime(0);
			//this.timeSeries(0,23);      
		}
	};
</script>