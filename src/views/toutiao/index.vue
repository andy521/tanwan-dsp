<style lang="less">
@import "../../styles/common.less";
</style>
<template>
	<div class="ad">
    头条总览
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