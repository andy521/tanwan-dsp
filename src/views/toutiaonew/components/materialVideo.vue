
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
        <p class="gray f13">
            支持mp4、mpeg、3gp、avi文件格式 <br>
            宽高比16:9的分辨率需大于等于1280*720，码率 >=516kbps ，视频大小不超过1000M <br>
            宽高比9:16的分辨率需大于等于720*1280，码率 >=516kbps ，视频大小不超过100M
        </p>
        <div @click="pushVideo" class="add-btn"><Icon class="icon" type="plus-circled"></Icon> 最多添加6张图片</div>
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
        pushVideo(){
            console.log('添加视频')
        }
    }
}
</script>