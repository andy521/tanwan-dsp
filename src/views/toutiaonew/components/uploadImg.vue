
<style scoped>
    .creative{
        position: relative;
        width: 100%;
        height: 230px;
        line-height: 1.42857143;
    }
    .creative:hover .thumbnail{
        border-color: red;
    }
    .creative:hover .remove{
        display: block;
    }
    .remove{
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
        color: red;
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 20px;
        display: none;
    }
    .thumbnail{
        display: block;
        line-height: 1.42857143;
        background-color: #fff;
        border: 1px solid #ddd;
        transition: border .2s ease-in-out;
    }
    .img{
        height: 138px;
        width: 100%;
        position: relative;
        display: block;
        background-color: #e8e8e8;
    }
    .caption{
        height: 70px;
        padding-bottom: 20px;
        position: relative;
        padding: 4px 9px;
        color: #222;
        font-size: 14px;
    }
    .caption textarea{
        display: block;
        width: 100%;
        background-color: #fff;
        background-image: none;
        border: 0;
        overflow: hidden;
        resize: none;
        outline: 0;
    }
    .text-num {
        position: absolute;
        bottom: 4px;
        right: 9px;
        z-index: 10;
    }
    .alt-upload {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 12px;
    }
    .alt-upload .ivu-btn{
        margin: 40px 10px 20px;
    }
</style>
<template>
    <div class="creative">
        <Icon class="remove tc" type="close-circled"></Icon>
        <div class="thumbnail">
            <div class="img">
                <div class="alt-upload tc">
                    <Button @click="selectModal = true" type="primary">选择图片</Button>
                    <p>宽高比1.52,大小500K以下最低尺寸456*300</p>
                </div>
            </div>
            <div class="caption">
                <textarea rows="2" placeholder="请输入创意标题（6~25个字符）"></textarea>
                <span class="text-num">6/24</span>
            </div>
        </div>

        <Modal v-model="selectModal" width="720" ok-text="modelOk" :mask-closable="false">
            <Tabs :animated="false">
                <Tab-pane label="我的图库">标签一的内容</Tab-pane>
                <Tab-pane label="本地上传">标签二的内容</Tab-pane>
            </Tabs>
        </Modal>

    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "uploadImg",
    data() {
        return {
            selectModal:false,
        }
    },
    mounted() {
    },
    methods: {
        modelOk(){

        },
        pushImgs(){
            console.log('添加图片')
        }
    }
}
</script>