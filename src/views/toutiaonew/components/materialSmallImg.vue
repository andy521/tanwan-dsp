
<style scoped>
    .panel{
        position: relative;
        min-height: 240px;
    }
    .btns{
        position: absolute;
        left: -120px;
        top: 0;
        bottom: 0;
        width: 120px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        min-height: 230px;
        justify-content: center;
        padding-top: 10px;
    }
    .btns .ivu-btn-ghost{
        margin:0 15px 10px 0;
    }
    .add{
        width: 56px;
        height: 51px;
        line-height: 41px;
        font-size: 26px;
    }
    .list{
        overflow-x: auto;
    }
    .image{
        float: left;
        width: 228px;
        min-height: 230px;
        padding-right: 16px;
        position: relative;
    }
</style>
<template>
    <div class="panel">
        <div class="btns">
            <Button @click="addMaterial" class="add" type="ghost" size="large" icon="android-add"></Button>
            <Button type="ghost">创意<br>灵感</Button>
        </div>
        <div class="list">
            <div class="image_box clearfix" :style=" 'width:' + ( imgList.length * 230) + 'px'">
                <div class="image" v-for="(item,index) in imgList" >
                    <upload-img @on-remove="removeMaterial" :ids="index" :desc="item.desc" :title="item.title"></upload-img>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import Axios from "@/api/index";
import uploadImg from './uploadImg.vue';
export default {
    components: {
        uploadImg
    },
    name: "materialSmallImg",
    // props:{
    //     account:{
    //         type: String,
    //         default: ''
    //     }
    // },
    data() {
        return {
            account_id:this.account, //账户id
            imgList:[
                {title:'请输入创意标题（6~25个字符）',desc:'宽高比1.52,大小500K以下最低尺寸456*300',img:'',min:6,max:25},
                {title:'请输入创意标题（6~25个字符）',desc:'宽高比1.52,大小500K以下最低尺寸456*300',img:'',min:6,max:25},
                {title:'请输入创意标题（6~25个字符）',desc:'宽高比1.52,大小500K以下最低尺寸456*300',img:'',min:6,max:25}
            ]
        }
    },
    mounted() {

    },
    methods: {
        removeMaterial(val){
            this.imgList.splice(val,1)
        },
        addMaterial(){
            this.imgList.push({title:'请输入创意标题（6~25个字符）',desc:'宽高比1.52,大小500K以下最低尺寸456*300',img:'',min:6,max:25})
        }
    }
}
</script>