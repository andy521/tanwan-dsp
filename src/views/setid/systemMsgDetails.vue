<style scoped>
	@import "../../styles/common.less";
	.unread {
		font-weight: bold;
	}
	
	.message_time {
		color: #999;
		margin-bottom: 10px;
	}
</style>
<template>
	<div class="ad">
		<Card shadow>
			<p slot="title">
				<Icon type="email" size="16" color="#999"></Icon>
				{{getSingleMessages.uName}}
			</p>
			<div class="message_time">{{getSingleMessages.message_time}}</div>
			<div>{{getSingleMessages.message}}</div>
		</Card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				id: this.$route.params.id,
			}
		},
		mounted() {

		},
		methods: {

		},
		computed: {
			//获取消息
			getSingleMessages() {
				return this.$store.state.setid.SingleMessages;
			}
		}
	};
</script>