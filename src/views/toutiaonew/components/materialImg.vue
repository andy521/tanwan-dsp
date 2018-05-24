
<style scoped>
.update{line-height: 1.42857143;}
.add-btn{
    margin-top: 15px;
    cursor: pointer;    
    font-size: 14px;
    line-height: 24px;
}
.add-btn .icon{
    color: #2d8cf0;
    font-size: 24px;
    margin: 0px 7px 0 0;
    float: left;
}
</style>
<template>
    <div class="update">
        <p class="gray f13">小图宽高比1.52，最低尺寸456*300；大图宽高比1.78，最低尺寸1280*720；竖图宽高比0.56，最低尺寸720*1280；支持JPG、PNG等图片格式，大小500K以下；</p>
        <div @click="pushImgs" class="add-btn"><Icon class="icon" type="plus-circled"></Icon> 最多添加6张图片</div>
    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "materialImg",
    props: ["value"],
    data() {
        return {
            name:'zhouyunlong'
        }
    },
    mounted() {
    },
    methods: {
        pushImgs(){
            console.log('添加图片')
        }
    }
}
</script>