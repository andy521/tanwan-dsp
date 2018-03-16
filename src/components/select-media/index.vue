<style scoped>

</style>
<template>
    <Select @on-change="mediaChange" placeholder="请选择媒体" clearable>
        <Option v-for="item in media" :value="item.MeidaType" :key="this">{{ item.name }}</Option>
    </Select>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'selectMedia',
        props: {
            // placeholder: {
            //     type: String,
            //     default: ''
            // }
        },
		data() {
			return {
                media: []
			}
        },
		methods: {
            //获取全部游戏     
            getMedia(){
                Axios.get('api.php',{'action':'api','opt':'getMedia'})
                .then( 
                    res=>{ 
                        if(res.ret == '1'){
                            let list = res.data;
                            list.unshift({MeidaType:'',mediaId:'',name:'全部'})
                            this.media= list;
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
			//点击树节点时触发
			mediaChange(data) {
                this.$emit('on-change', data);
			}
        },
        mounted(){       
            this.getMedia();
        }
	}
</script>