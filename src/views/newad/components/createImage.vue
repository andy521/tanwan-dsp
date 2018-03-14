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
.created{margin:10px 0 10px 15px;height: 280px;overflow: auto;}
.created li {
    height: 133px;
    line-height: 128px;
    width: 176px;
    background: #f5f6f8;
    cursor: pointer;
    border: 2px solid #fff;
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    text-align: center;
    vertical-align: middle;
}
.round_select{
    display: none;
    height: 26px;
    width: 26px;
    position: absolute;
    z-index: 10;
    top: 5px;
    right: 5px;
    border: 2px solid #fff;
    border-radius: 13px;
    background:#008fe4;
    cursor: pointer;
}
.created .ivu-icon{
    float: left;
    color: #fff;
    font-size: 14px;
    margin: 4px 0 0 6px;
}
.created li.selected{
    border-color: #008fe4;
}
.created li.selected .round_select{
    display: block;
}
.created li img {
    max-width: 172px;
    max-height: 129px;
}
.created_img{
    height: 100%;
}
.created_img img,.select_img .simg img{
    object-fit: contain;width: 100%; height: 100%; background-color: #f5f6f8;
}
.model_foot{
    border-top: 1px solid #eee;
    padding: 10px 0 0 0;
    margin-left: 20px;
    height: 75px;
}
.model_foot .ivu-page{
    margin-top: 20px;
    float: right;
}
.select_img{
    float: left;
    text-align: left;    
}
.select_img .simg{
    width: 62px;
    height: 46px;
    line-height: 45px;
    background: #888;
    position: relative;
}
.select_close{
    display: inline-block;
    position: absolute;
    height: 26px;
    width: 26px;
    top: -10px;
    right: -7px;
    background:red;
    z-index: 30;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid #fff;
}
.select_close .ivu-icon{
    color: #fff;
    float: left;
    margin: 6px 0 0 6px;
}
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
            <div class="upload" v-on:mouseenter="model.isShowGallery = true" v-on:mouseleave="model.isShowGallery = false">                
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
        <div v-show="model.isShowGallery" class="gallery_area" v-on:mouseenter="model.isShowGallery = true" v-on:mouseleave="model.isShowGallery = false" >
            <p class="gallery_link" @click="galleryLink"><Icon type="ios-albums-outline"></Icon> 从图库选择</p>
        </div>
        <Modal
            v-model="model.galleryModal"
            width="980"
            title="从创意库选择"
            :mask-closable="false"
            @on-ok="ok"
            class-name="vertical-center-modal">
            <div class="created">
                <ul>
                    <li v-for="(item,index) in gallery.list" :key="index" :class="model.sid==item.id? 'selected':''"  @click="selectCreated(item.id)">
                        <div class="created_img">
                            <img :src="item.preview_url">
                        </div>
                        <div class="round_select"><Icon type="checkmark-round"></Icon></div>
                    </li>
                </ul>
            </div>
            <div class="model_foot">
                <div class="select_img">
                    <p>已选择</p>
                    <div v-show="model.isShowSelect" class="simg">
                        <img :src="model.preview_url">
                        <div @click="closeCreated" class="select_close"><Icon type="close-round"></Icon></div>
                    </div>                    
                </div>
                <Page :total="gallery.total_number" :page-size="10" size="small" show-total></Page> 
            </div>                    
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
                },
                //图库
                model:{
                    galleryModal:false,
                    //是否显示图库
                    isShowGallery:false,
                    //选择图库图片ID
                    sid:'',
                    //显示以选择
                    isShowSelect:false,
                    //图库预览地址
                    preview_url:'',
                    //图库选择图片ID
                    image_id:'',
                }
            }
        },
        computed: {
            //获取图库
			gallery() {
				return this.$store.state.newad.gallery;
			},
        },
        methods: {
            ok () {
                this.preview_url = this.model.preview_url;
                this.info.image_id = this.model.image_id;
                this.isShowImg = true; 
            },
            galleryLink(){
                this.model.galleryModal=true;
                let size = this.size.split('*');
                let param = {
                    account_id : this.id,
                    width:size[0],
                    height:size[1],
                };
                this.$store.dispatch('get_gallery',param);
            },
            selectCreated(id){
                this.model.sid = id;                
                this.gallery.list.forEach(item=>{
                    if(item.id == id){
                        this.model.preview_url = item.preview_url;
                        this.model.image_id = item.image_id;
                    }
                })
                this.model.isShowSelect = true;
            },
            //关闭已选择
            closeCreated(){
                this.model.isShowSelect = false;
                this.model.preview_url = this.model.image_id = this.model.sid = " ";
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