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
			<!-- <step-one></step-one> -->
			<!--步骤2-->
			<!-- <step-two></step-two> -->
            
            <!-- 步骤3 -->
            <!-- <step-three></step-three> -->

            <!-- 上传创意  这个要根据上一步的数据来生成 -->
            <up-creative :data="creative"></up-creative>
		</Content>

	</div>
</template>

<script>
	import sideBar from './components/sideBar.vue';
	import stepOne from './components/stepOne.vue';
    import stepTwo from './components/stepTwo.vue';
    //import stepThree from './components/stepThree.vue';
    import upCreative from './components/upCreative.vue';

	export default {
		components: {
			sideBar,
			stepOne,
            stepTwo,
            stepThree,
            upCreative
		},
		data() {
			return {
                account_id: this.$route.params.account_id,

                //广告创建数据
                creative:["title","description","image","image2","deep_link_url"],
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