<style lang="less">
@import "../../styles/common.less";
.report .ivu-form-item{margin-bottom: 15px;}
.report .ivu-form .ivu-form-item-label{font-weight: bold;}
</style>
<template>
	<div class="report">
		<Card shadow class="margin-top-10">

            <Tabs :animated="false" @on-click="tabsFun">
                <Tab-pane label="推广资源报告"></Tab-pane>
                <Tab-pane label="APP数据报表"></Tab-pane>
                <Tab-pane label="实时报告"></Tab-pane>
                <Tab-pane label="分推广层级报告"></Tab-pane>
                <Tab-pane label="受众分析报告"></Tab-pane>
            </Tabs>
            <!-- 能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。 -->
            <keep-alive> 
                <component :is="curent" :account="account"></component>
            </keep-alive>
        </Card>

        <Modal v-model="accountModal"  title="选择账户" @on-ok="accountOk">
            <div class="account">
                <get-account title="请选择用户" @on-change="accountChange"></get-account>
            </div>
        </Modal>
	</div>    
</template>

<script>
    import adresourceReporting from "./components/report-tab/adresourceReporting.vue";
    import appReporting from "./components/report-tab/appReporting.vue";
    import hourReporting from "./components/report-tab/hourReporting.vue";
    import gradationReporting from "./components/report-tab/gradationReporting.vue";
    import audienceReporting from "./components/report-tab/audienceReporting.vue";
    import getAccount from '@/components/get-account/getAccount.vue';
	export default {
        components: {
            getAccount,
            adresourceReporting,
            appReporting,
            hourReporting,
            gradationReporting,
            audienceReporting
        },
		data() {
			return {
                curent:'adresourceReporting',
                accountModal:true,
                account:{}
			};
		},
		methods: {		
			tabsFun(val){
                let name = '';
                switch (val) {
                    case 0: name = 'adresourceReporting'; break;
                    case 1: name = 'appReporting'; break;
                    case 2: name = 'hourReporting'; break;
                    case 3: name = 'gradationReporting'; break;
                    case 4: name = 'audienceReporting'; break;
                }
                this.curent = name;
            },
            accountChange(data){
                this.account = data;
            },
            accountOk(){
                console.log('选择')
            }
		},
        beforeMount(){
            let account = this.$store.state.user.account;
            if(account){
                this.accountModal = false;
            }
        }
	};
</script>