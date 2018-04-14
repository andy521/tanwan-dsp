<style scoped>
	.bottom_line {
		border-bottom: 1px solid rgb(233, 233, 233);
		padding-bottom: 10px;
	}
	
	.poptipdiv {
		white-space: normal;
		text-align: left;
		padding: 20px;
	}
	
	.checklist {
		padding-bottom: 5px;
		padding-top: 20px;
	}
	
	.Poptiptap .ivu-poptip-body-content {
		overflow: inherit;
	}
</style>

<template>
	<div style="display: inline-block;">
		<Poptip placement="bottom-end" width="500" class="Poptiptap" trigger="hover">
			<Button type="primary">自定义指标</Button>
			<div  slot="content" class="poptipdiv">
				<div class="bottom_line">
					<Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
				</div>
				<div class="checklist">媒体列</div>
				<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="paused">投放开关</Checkbox>
					<Checkbox label="cpc">平均点击价格</Checkbox>
					<Checkbox label="cpm">千次展现价格</Checkbox>
					<Checkbox label="click">点击量</Checkbox>
                    <Checkbox label="ctr">点击率</Checkbox>
				</CheckboxGroup>
                <div class="checklist">落地页</div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
					<Checkbox label="aa">展示PV</Checkbox>
                    <Checkbox label="aa">展示IP</Checkbox>
                    <Checkbox label="aa">下载IP</Checkbox>
                    <Checkbox label="aa">下载数</Checkbox>
                    <Checkbox label="aa">下载率</Checkbox>
				</CheckboxGroup>
                <div class="checklist">激活注册</div>
                
				<!-- <div class="margin-top-20">
					<Button type="ghost" @click="set_user_memo">保存操作</Button>
				</div> -->
			</div>
		</Poptip>
	</div>
</template>
<script>
	import Axios from '@/api/index';
	export default {
		name: 'viewTab',
		props: ['action', 'opt'],
		data() {
			return {
				indeterminate: true,
				checkAll: false,
				checkAllGroup: ['campaign_name','paused','state','impression','click','ctr','cost','adResourceId','budget'], //默认选中
				checkAllGroups: ['account_id', 'adResourceId', 'appId', 'budget',
					'campaign_id', 'campaign_name', 'click',
                    'cost', 'cpc', 'cpm', 'ctr',  'impression', 'invalidReasonList', 'paused', 'platform',
                   'state'
                ]
			}
		},
		mounted() {
            this.checkChange();
			// Axios.get('api.php', {
			// 	action: 'sys',
			// 	opt: 'get_user_memo',
			// 	taction: this.action,
			// 	topt: this.opt
			// }).then(
			// 	res => {
			// 		if(res.ret == 1) {
			// 			this.checkAllGroup = res.data.split(',');
			// 			this.checkChange();
			// 		}
			// 	}
			// ).catch(
			// 	err => {
			// 		console.log(err)
			// 	}
			// );
		},
		methods: {
			//保存自定义指标
			set_user_memo() {
				Axios.get('api.php', {
					action: 'sys',
					opt: 'set_user_memo',
					taction: this.action,
					topt: this.opt,
					memo: this.checkAllGroup.join(',')
				}).then(
					res => {
						if(res.ret == 1) {
							this.$Message.info(res.msg);
						}
					}
				).catch(
					err => {
						console.log(err)
					}
				);
			},
			//自定义指标全选
			handleCheckAll() {
				if(this.indeterminate) {
					this.checkAll = false;
				} else {
					this.checkAll = !this.checkAll;
				}
				this.indeterminate = false;
				if(this.checkAll) {
					this.checkAllGroup = this.checkAllGroups;
				} else {
					this.checkAllGroup = [];
				}
				this.checkChange();
			},
			//自定义指标
			checkAllGroupChange(data) {
				if(data.length === 28) {
					this.indeterminate = false;
					this.checkAll = true;
				} else if(data.length > 0) {
					this.indeterminate = true;
					this.checkAll = false;
				} else {
					this.indeterminate = false;
					this.checkAll = false;
				}
				this.checkChange();
			},
			//点击树节点时触发
			checkChange() {
				let uncheck = [];
				this.checkAllGroups.forEach(item => {
					let is = true;
					this.checkAllGroup.forEach(col => {
						if(item == col) {
							is = false;
						}
					});
					if(is) {
						uncheck.push(item)
					}
				});
				this.$emit('on-change', uncheck);
			}
		}
	}
</script>