<style>
.ivu-upload-drag{background: #f8f9fa;border: 1px solid rgba(57,73,103,.18);border-radius: 0;}
.ivu-upload-drag:hover{border-style: solid;}
.upload{padding: 60px 0;height: 200px;color: #a7abb1; position: relative;}
.size{font-weight: 900; font-size: 22px;}
.way{font-weight: 900;font-size: 14px;line-height: 2;}
.name{margin-top: -2px;}
.name .ivu-input{border-radius: 0;}
.ivu-input-group-append{border-radius: 0;}
.imgbox{position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    z-index: 10;
    overflow: hidden;
    object-fit: scale-down;
    background-repeat: no-repeat;
    background-position: center;  background-size: contain;}
</style>
<template>
    <div class="creative">   
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
            <div class="upload">
                <div class="imgbox" :style="'background-image:url(' + preview_url+ ')'">  </div>              
                <div class="size">{{size}}(px)</div>
                <p>(推荐尺寸)</p>
                <p class="way">点击或将文件拖拽到这里上传</p>  
                <p>{{des}}</p> 
            </div>
        </Upload>
        <div class="name">
            <Input v-model="remark" :maxlength="10" placeholder="请输入图片描述(可选)"><span slot="append">{{remark.length}}/10</span></Input>
        </div>
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
                actionUrl:"",
                imgSize:10000,
                remark: '',
                accept:[],
                image_id:'',
                preview_url:'',
            }
        },
        methods: {
            //图片上传成功            
            handleSuccess(filte){
                console.log(filte)
                let info={type:this.type}
                if(filte.ret == '1'){
                    this.image_id = filte.data.image_id
                    this.preview_url = filte.data.preview_url
                    info.image_id = this.image_id;
                    this.$emit('on-change', info);
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