<style scoped>
.author-btn{width: 100%; margin-top: 10px;}
.author-btn>.ivu-btn{width: 50%;}
.author-item{display: block;padding: 10px 0;border-bottom: 1px solid #f5f5f5;}
.author .ivu-poptip-body-content{overflow: initial;}
.author-list{max-height: 300px; overflow-y: auto;}
</style>
<template>

  <Poptip class="author" placement="bottom-start" width="200" trigger="hover">
        <Button type="ghost"><Icon type="person-stalker"></Icon> 选择负责人</Button>
        <div class="api" slot="content">      
            <div class="author-list">      
                <Checkbox-group v-model="value" @on-change="authorChange">
                    <Checkbox class="author-item" v-for="(item,index) in authorList" :key="index" :label="item.inChargeId">{{item.inChargeName}}</Checkbox>
                </Checkbox-group>
            </div>
            <Button-group class="author-btn" long>
                <Button type="ghost" @click="handleSelectAll"> 全选 </Button>
                <Button type="ghost" @click="handleClearAll"> 取消 </Button>
            </Button-group>
        </div>
    </Poptip>

</template>
<script>
import  Axios  from '@/api/index'
export default {
    name: 'selectAuthor',
    data() {
        return {
            value:[],
            authorList: []
        }
    },
    methods: {
        handleSelectAll(){
            if(this.value.length == this.authorList.length){
                return
            }
            let a = []
            this.authorList.forEach(item => {
                a.push(item.inChargeId)
            })
            this.value = a
            this.authorChange()
        },
        handleClearAll(){
            if(this.value.length === 0){
                return
            }
            this.value = []
            this.authorChange()
        },
        // 获取负责人列表    
        getAuthor(){
            Axios.get('api.php',{'action':'sys','opt':'getInCharge'})
            .then(res => { 
                if(res.ret == '1'){
                    this.authorList = res.data
                }
            }).catch( 
                err=>{
                    console.log('获取负责人列表错误', err)
                }
            )
        },
        //点击树节点时触发
        authorChange() {
            console.log(this.val)
            this.$emit('on-change', this.value)
        }
    },
    mounted(){   
        this.getAuthor()
    }
}
</script>
