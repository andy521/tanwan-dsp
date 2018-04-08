<style lang="less">
	
</style>
<template>
	<div>
		UC推广单元
        <week-date :value="period"></week-date>
	</div>
</template>

<script>
    import Axios from "@/api/index"
    import weekDate from "@/components/week-date/index.vue";
	export default {
        components: {
            weekDate
        },
		data() {
			return {
                period:[
                    '111111111111111111111111',
                    '111111111111111111111111',
                    '111111111111111111111111',
                    '111111111111111111111111',
                    '111111111111111111111111',
                    '111111111111111111111111',
                    '111111111111111111111111'
                ],
			};
		},
		methods: {			
			
		}
	};
    
</script>