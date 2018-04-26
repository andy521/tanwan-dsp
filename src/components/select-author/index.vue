<style scoped>
.author-btn{width: 100%; margin-top: 10px;}
.author-btn>.ivu-btn{width: 50%;}
.author-item{display: block;padding: 10px 0;border-bottom: 1px solid #f5f5f5;}
.author .ivu-poptip-body-content{overflow: initial;}
.author-list{max-height: 300px; overflow-y: auto;}
</style>
<template>

  <Poptip class="author" placement="bottom-start" width="200" trigger="click">
        <Button type="ghost"><Icon type="person-stalker"></Icon> 选择负责人</Button>
        <div class="api" slot="content">      
            <div class="author-list">      
                <Checkbox-group v-model="value" @on-change="authorChange">
                    <Checkbox class="author-item" v-for="(item,index) in author" :key="index" :label="item.author"></Checkbox>
                </Checkbox-group>
            </div>
            <Button-group class="author-btn" long>
                <Button type="ghost" @click="selectAll"> 全选 </Button>
                <Button type="ghost" @click="cancel"> 取消 </Button>
            </Button-group>
        </div>
    </Poptip>

</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'selectAuthor',
		data() {
			return {
                value:[],
                author: []
			}
        },
        props: {
            // 媒体类型 :空值：返回全部媒体账号1: 广点通媒体2: 今日头条 3: Uc媒体 
            mediaType: {
                type: [String, Number],
                default: ''
            },
            isLinkage: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            mediaType(val) {
                this.isLinkage = false
                this.getAuthor();
            }
        },
		methods: {
            selectAll(){
                if(this.value.length == this.author.length){
                    return
                }
                let a = [];
                this.author.forEach(item => {
                    a.push(item.author)
                });
                this.value = a;   
                this.authorChange();       
            },
            cancel(){
                if(this.value.length<1){
                    return
                }
                this.value = [];
                this.authorChange();
            },
            //获取全部游戏     
            getAuthor(){
                if (this.isLinkage) {
                    this.$Notice.info({
                        title: '请选择媒体类型'
                    });
                    return;
                }
                if (typeof val === 'string') this.mediaType = parseInt(this.mediaType);
                Axios.get('api.php',{'action':'api','opt':'getAuthor','media_type':this.mediaType})
                .then( 
                    res=>{ 
                        if(res.ret == '1'){
                            this.author = res.data
                        }
                    }
                ).catch( 
                    err=>{ console.log(err) }
                );
            },
			//点击树节点时触发
			authorChange() {
                let data = this.value;
                this.$emit('on-change', data);
			}
        },
        mounted(){       
            this.getAuthor();
        }
	}
</script>