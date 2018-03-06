<style>
	@import "../../styles/common.less";
</style>
<template>
	<Card :bordered="false" shadow>
		<p slot="title">选择投放帐号</p>
		<p>
			<Row>
				<Col span="12">
				<Select v-model="account_id" placeholder="请选择帐号">
					<Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
				</Select>

				<Button type="primary" class="margin-top-20" size="large" style="width: 150px;" @click="tonewadd">确定</Button>
				</Col>
			</Row>
		</p>
	</Card>

</template>

<script>
	export default {
		data() {
			return {
				account_id: ''
			}
		},
		mounted() {
			this.$store.dispatch('getMediaList');
		},
		methods: {
			//新建广告
			tonewadd() {
				if(this.account_id == '') {
					this.$Message.info('请选择帐号');
					return;
				}
				let query = {
					account_id: this.account_id
				};
				this.$router.push({
					name: 'newad',
					params: query
				});
			}
		},
		computed: {
			//获取媒体账号
			mediaList() {
				return this.$store.state.plan.mediaList;
			}
		}
	};
</script>

<style>

</style>