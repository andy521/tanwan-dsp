
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
        cursor: pointer;
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
    .text-num {
        position: absolute;
        bottom: 4px;
        right: 9px;
        z-index: 10;
        background: white;
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
    .image-content{
        height: 360px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #f2f2f2;
    }
    .image-select-lists{
        background: #f2f2f2;
        padding: 10px 20px; 
        width: 100%;
        font-family: PingFangSC-Light;
        font-size: 12px;
        color: #4d4d4d;
        margin-top: 30px;
    }
    .image-select-lists-con{
        padding-top: 5px;
        white-space: nowrap;
        height: 65px;
        -ms-touch-action: auto;
        touch-action: auto;
        -ms-overflow-style: none;
    }
</style>
<style>
.caption textarea.ivu-input{
        border: none
    }
.caption .ivu-input:focus{
        box-shadow:none;
    }
</style>
<template>
    <div class="creative">
        <div @click="remove" class="remove tc"><Icon type="close-circled"></Icon></div>
        <div class="thumbnail">
            <div class="img">
                <div class="alt-upload tc">
                    <Button @click="selectModal = true" type="primary">选择图片</Button>
                    <p>{{desc}}</p>
                </div>
            </div>
            <div class="caption">
                <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="title"></Input>
                <span class="text-num">6/24</span>
            </div>
        </div>

        <Modal v-model="selectModal" width="720" @on-ok="modelOk" :mask-closable="false">
            <Tabs :animated="false" style="margin-right:10px;">                
                <Tab-pane label="本地上传">
                    <div class="image-content">
                        <Upload 
                            :format="accept"
                            :show-upload-list="false"
                            :max-size="imgSize"
                            :action="actionUrl"
                            :on-success="handleSuccess"        
                            :on-format-error="handleFormatError"
                            :before-upload="handleBeforeUpload"
                            :on-progress="handleProgress"
                            :on-error="handleError"
                        >
                            <Button type="primary" icon="ios-upload">上传文件</Button>
                        </Upload>
                        fdsfsdf
                    </div>
                </Tab-pane>
                <Tab-pane label="我的图库">
                    <div class="image-content">
                        我的图库
                    </div>
                </Tab-pane>
            </Tabs>
            <div class="image-select-lists">
                <p>选择图片（0/1）</p>
                <div class="image-select-lists-con">
                    城标
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index";
import Util from '@/utils/index';
export default {
    name: "uploadImg",
    props:{
        ids:{
            type: Number
        },
        desc:{
            type: String,
            default: ''
        },
        title:{
            type: String,
            default: ''
        },
    },
    data() {
        return {
            selectModal:false,
            actionUrl:"", //action 上传地址            
            accept:[], //上传格式
            imgSize:10000, //图片大小
        }
    },
    mounted() {

    },
    methods: {
        remove(){
            this.$emit('on-remove', this.ids);
        },
        //图片上传成功            
        handleSuccess(filte){
            console.log(filte)
            
        //http://localhost:8080/#/ttnew/creative?account_id=84069989750

            // this.loading = true;
            // if(filte.ret == '1'){
            //     this.loading = false;     
            //     this.isShowImg = true;             
            //     this.info.image_id = filte.data.image_id;
            //     this.preview_url = filte.data.preview_url;
            //     this.$emit('on-change', this.info);                    
            // }
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            });
        },
        handleBeforeUpload (file) {
            // this.$Notice.warning({
            //     title: '文件准备上传',
            //     desc: '文件 ' + file.name + ' 准备上传。'
            // });
        },
        handleProgress (event, file) {
            console.log(event.percent)
            // this.$Notice.info({
            //     title: '文件正在上传',
            //     desc: '文件 ' + file.name + ' 正在上传。'
            // });

        },
        handleError (event, file) {
            this.$Notice.error({
                title: '文件上传成功',
                desc: '文件 ' + file.name + ' 上传失败。'
            });
        },
        modelOk(){

        },
        pushImgs(){
            console.log('添加图片')
        }
    },
    beforeMount(){
        this.actionUrl = Util.baseURL + 'api.php?action=ttAdPut&opt=addImage&account_id=' + this.$route.query.account_id + '&sessionid=' + Util.getItem('sessionid');
        
        console.log(this.actionUrl)

    }
}
</script>