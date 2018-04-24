<style lang="less">
@import "../../styles/common.less";
</style>
<template>
	<div class="ad">
       这里做广告组   aaa
	</div>
</template>
<script>
	import Axios from "@/api/index";
    import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
	export default {
		data() {
			return {
                height:document.body.clientHeight - 200,                
            };
        },
		methods: {	
            
        },
        beforeMount(){
            
        }
	};
</script>