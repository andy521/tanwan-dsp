<style lang="less">
@import "../../styles/common.less";
</style>
<template>
	<div class="report">
		<Card shadow class="margin-top-10">
            <Tabs :animated="false">
                <Tab-pane label="推广资源报告">
                    <adresource-reporting></adresource-reporting>                    
                </Tab-pane>
                <Tab-pane label="APP数据报表">
                    f
                </Tab-pane>
                <Tab-pane label="实时报告">
                    f
                </Tab-pane>
            </Tabs>
        </Card>
	</div>
</template>

<script>
    import adresourceReporting from "./components/report-tab/adresourceReporting.vue";

	export default {
        components: {
            adresourceReporting
        },
		data() {
			return {
				curent:0
			};
		},
		methods: {		
			
		}
	};
</script>