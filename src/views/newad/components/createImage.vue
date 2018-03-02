<style>
.ivu-upload-drag{background: #f8f9fa;border: 1px solid rgba(57,73,103,.18);border-radius: 0;}
.ivu-upload-drag:hover{border-style: solid;}
.upload{padding: 60px 0;height: 200px;color: #a7abb1;}
.size{font-weight: 900; font-size: 22px;}
.way{font-weight: 900;font-size: 14px;line-height: 2;}
.name{margin-top: -2px;}
.name .ivu-input{border-radius: 0;}
.ivu-input-group-append{border-radius: 0;}
</style>
<template>
    <div class="creative">   
        <Upload
            multiple
            type="drag"
            :show-upload-list="false"
            :action="actionUrl"
            :on-success="handleSuccess"
            >
            <div class="upload">
                <!-- <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon> -->
                <div class="size">{{size}}(px)</div>
                <p>(推荐尺寸)</p>
                <p class="way">点击或将文件拖拽到这里上传</p>  
                <p>{{des}}</p>              
            </div>
        </Upload>
        <div class="name">
            <Input v-model="desc" :maxlength="10" placeholder="请输入图片描述(可选)"><span slot="append">{{desc.length}}/10</span></Input>
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
                desc: ''
            }
        },
        methods: {
            //图片上传成功
            handleSuccess(filte){
                console.log(filte)
            }
        },
        mounted() {
            //this.actionUrl = 'http://ads.tanwan.com/api.php?action=gdtAdPut&opt=adsimg_doadd&account_id=' + this.id + '&sessionid=' + util.getItem('sessionid');
            //console.log(this.id)
		}
    }
</script>