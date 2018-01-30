<style>
	@import "../../styles/common.less";
	.ad {
		padding-left: 200px;
		background: #fff;
		padding-right: 240px;
		overflow: auto;
		height: 100%;
		font-size: 14px;
	}
</style>
<template>
	<div class="ad">
		<side-bar></side-bar>
		<Content :style="{padding: '40px', minHeight: '280px', background: '#fff'}">
			<!--步骤1-->
			<step-one></step-one>
			<!--步骤2-->
			<step-two></step-two>
            <!-- 步骤3 -->
            <step-three></step-three>
		</Content>

	</div>
</template>

<script>
	import sideBar from './components/sideBar.vue';
	import stepOne from './components/stepOne.vue';
    import stepTwo from './components/stepTwo.vue';
    import stepThree from './components/stepThree.vue';

	export default {
		components: {
			sideBar,
			stepOne,
            stepTwo,
            stepThree
		},
		data() {
			return {
				account_id: this.$route.params.account_id,
			}
		},
		mounted() {

		},
		methods: {
			//获取推广计划
			getCampaigns() {

			},
		},
		computed: {
			
		}
	};
</script>

<style>

</style>