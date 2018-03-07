<style>
.ivu-upload-drag{background: #f8f9fa;border: 1px solid rgba(57,73,103,.18);border-radius: 0;}
.ivu-upload-drag:hover{border-style: solid;}
.upload{padding: 60px 0;height: 200px;color: #a7abb1; position: relative;}
.size{font-weight: 900; font-size: 22px;}
.way{font-weight: 900;font-size: 14px;line-height: 2;}
.name{margin-top: -2px;}
.name .ivu-input{border-radius: 0;}
.ivu-input-group-append{border-radius: 0;}
.imgbox{position: absolute; display: block; top: 0; left: 0;  width: 100%; bottom: 0;z-index: 10; overflow: hidden; object-fit: scale-down;background-repeat: no-repeat;background-position: center;  background-size: contain;}
.imgbox .ts{display: none; opacity: 0; background: rgba(0, 0, 0, .5); position: absolute; left: 0; right: 0; bottom: 0; top: 0; text-align: center; color: #fff; line-height: 1.6; }
.imgbox:hover .ts{display: block; opacity: 1;}
.imgbox .ts p{ width:50%; position: absolute;  top: 50%; left: 50%;  -webkit-transform: translate(-50%, -50%);  transform: translate(-50%, -50%);}
.ivu-spin-fix{z-index: 100;}
.ivu-upload{position: relative;z-index: 10;}
.gallery_area{min-height: 40px; font-weight: 400; font-size: 14px; position: absolute; z-index: 10; left:0; top:calc(100% - 32px);width:100%; border: 1px solid #dbdee4;  text-align: center; background: #fff;box-shadow: 0 1px 5px rgba(0,0,0,.15);  color: #a7abb1;}
.gallery_link{display: inline-block;font-size: 16px;padding: 0 30px;cursor: pointer;}
.gallery_link:hover{background-color: #f5f6f8;}
</style>
<template>
    <div class="creative">   
        <Spin v-if="loading" fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>正在上传</div>
        </Spin>        
        <Upload
            multiple
            type="drag"
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
            <div class="upload" v-on:mouseenter="isShowGallery = true" v-on:mouseleave="isShowGallery = false">                
                <div class="imgbox" v-show="isShowImg" :style="'background-image:url(' + preview_url+ ')'">
                    <div class="ts">
                        <p>请上传图片尺寸为：{{size}}(px)<br>
                        点击重新上传</p>
                    </div>
                </div>
                <div class="size">{{size}}(px)</div>
                <p>(推荐尺寸)</p>
                <p class="way">点击或将文件拖拽到这里上传</p>  
                <p>{{des}}</p> 
            </div>            
        </Upload>        
        <div class="name">
            <Input v-model="remark" :maxlength="10" placeholder="请输入图片描述(可选)"><span slot="append">{{remark.length}}/10</span></Input>
        </div>
        <div v-show="isShowGallery" class="gallery_area" v-on:mouseenter="isShowGallery = true" v-on:mouseleave="isShowGallery = false" >
            <p class="gallery_link" @click="galleryLink"><Icon type="ios-albums-outline"></Icon> 从图库选择</p>
        </div>
        <Modal
            v-model="galleryModal"
            width="980"
            title="从创意库选择"
            @on-ok="ok"
            @on-cancel="cancel">
            <p>对话框内容</p>
            <p>对话框内容</p>
            <p>对话框内容</p>
        </Modal>      
    </div>    
</template>
<script>
import util from '@/utils/index';
    export default {
        name: 'create-image',
        props: {
            id: {
                type: [String, Number],
                required: true
            },
            type: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            },
            des: {
                type: String,
                default: ''
            },
            quality: {
                type: String,
                default: ''
            },
            format: {
                type: String,
                default: ''
            }
        },
        data () {
            return { 
                //是否显示图库
                isShowGallery:false,
                galleryModal:false,
                //上传图片loading
                loading:false,
                //是否显示预览图片
                isShowImg:false,
                //预览图片地址
                preview_url:'',
                //action 上传地址
                actionUrl:"",
                //图片大小
                imgSize:10000,
                //图片描述
                remark: '',
                //上传格式
                accept:[],
                //图片提交信息
                info:{
                    'type':this.type,
                    'image_id':''
                }
            }
        },
        methods: {
            ok () {
                this.$Message.info('点击了确定');
            },
            cancel () {
                this.$Message.info('点击了取消');
            },
            galleryLink(){
                this.galleryModal=true;
                
            },
            //图片上传成功            
            handleSuccess(filte){
                console.log(filte)
                this.loading = true;
                if(filte.ret == '1'){
                    this.loading = false;     
                    this.isShowImg = true;             
                    this.info.image_id = filte.data.image_id;
                    this.preview_url = filte.data.preview_url;
                    this.$emit('on-change', this.info);                    
                }
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
        },
        mounted() {
            this.imgSize = parseInt(this.format);
            this.actionUrl = 'http://ads.tanwan.com/api.php?action=gdtAdPut&opt=adsimg_doadd&account_id=' + this.id + '&sessionid=' + util.getItem('sessionid') + '&remark=' + this.remark;
            let gs = this.format.split('|'),
                accept = [];
            gs.forEach(e => {
                accept.push(e.split('.')[1])
            });
            this.accept = accept;
		}
    }
</script>