<style scoped>
.upload {
  color: #a7abb1;
  position: relative;
  line-height: 1.8;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
.uploadbg {
  display: none;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
.upload_div:hover .uploadbg {
  display: block;
}
.txtbox {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  color: #fff;
}

.upload_div {
  position: relative;
  width: 500px;
}

.gallery_area {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 40px;
  font-weight: 400;
  font-size: 14px;
  z-index: 10;
  border: 1px solid #dbdee4;
  text-align: center;
  background: #f5f6f8;
  color: #a7abb1;
}
.upload_div:hover .gallery_area {
  display: block;
}
.gallery_link {
  font-size: 16px;
  cursor: pointer;
}

.created {
  margin: 10px 0 0 10px;
}
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
.round_select {
  display: none;
  height: 26px;
  width: 26px;
  position: absolute;
  z-index: 10;
  top: 5px;
  right: 5px;
  border: 2px solid #fff;
  border-radius: 13px;
  background: #008fe4;
  cursor: pointer;
}
.created .ivu-icon {
  float: left;
  color: #fff;
  font-size: 14px;
  margin: 4px 0 0 6px;
}
.created li.selected {
  border-color: #008fe4;
}
.created li.selected .round_select {
  display: block;
}
.created li img {
  max-width: 172px;
  max-height: 129px;
}
.created_img {
  height: 100%;
}
.created_img img {
  object-fit: contain;
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
}

.creative {
  position: relative;
}
</style>
<template>
    <div class="creative">

        <div class="upload_div">
            <Upload multiple type="drag" :format="accept" :show-upload-list="false" :max-size="imgSize" :action="actionUrl" :on-success="handleSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :on-progress="handleProgress" :on-error="handleError" name="img">
                <div class="upload" :style="{backgroundImage: 'url(' + preview_url+ ')',height:500*img_size[1]/img_size[0]+ 'px'}">
                    <div class="uploadbg">
                        <div class="txtbox">
                            <div class="size">{{template.element.image.size}}(px)</div>
                            <p class="way">点击或将文件拖拽到这里上传</p>
                            <p>{{template.element.image.des}}</p>
                        </div>
                    </div>
                    <Spin v-if="loading" fix>
                        <Progress :percent="percent" :stroke-width="5"></Progress>
                        <div>正在上传</div>
                    </Spin>
                </div>
            </Upload>
            <div class="gallery_area">
                <p class="gallery_link" @click="galleryLink(1)">
                    <Icon type="ios-albums-outline"></Icon> 从图库选择</p>
            </div>
        </div>

        <Modal v-model="model.galleryModal" width="972" title="从创意库选择" :mask-closable="false" @on-ok="ok" class-name="vertical-center-modal">
            <div class="created">
                <ul class="clear">
                    <li v-for="(item,index) in gallery.list" :key="index" :class="model.sid==item.id? 'selected':''" @click="selectCreated(item.id)">
                        <div class="created_img">
                            <img :src="item.preview_url">
                        </div>
                        <div class="round_select">
                            <Icon type="checkmark-round"></Icon>
                        </div>
                    </li>
                </ul>
                <Page v-if="page>1" :total="total_number" :current="page" :page-size="page_size" size="small" show-total @on-change="galleryLink"></Page>
            </div>
        </Modal>

    </div>
</template>
<script>
//广告版位数量
import adcreative_template from "./adcreative_template.json";
import util from "@/utils/index";
import Axios from "@/api/index";
export default {
    name: "create-image",
    props: ["value", "type"],
    data() {
        return {
            account_id: this.$route.query.account_id,
            adcreative_template_id: this.$route.query.adcreative_template_id,
            adcreative_template: adcreative_template,
            //选中广告版位数据
            template: {
                id: 184,
                name: "手机QQ及浏览器",
                modus: "240×180单图(文)",
                description: "看点及兴趣部落，浏览器信息流",
                site_set: ["SITE_SET_MOBILE_INNER"],
                element: {
                    image: {
                        name: "图片",
                        type: "string",
                        required: 1,
                        size: "240*180",
                        quality: "30",
                        format: "*.jpg|*.jpeg|*.png",
                        des: "尺寸：240*180，大小：不超过30 KB，格式：*.jpg|*.jpeg|*.png"
                    },
                    title: {
                        name: "广告文案",
                        type: "string",
                        required: 1,
                        amount: [1, 20],
                        des: "字数：1~20"
                    }
                }
            },
            img_size: [640, 288], //图片尺寸
            //上传图片loading
            loading: false,
            percent: 0,
            //action 上传地址
            actionUrl: "",
            //图片大小
            imgSize: 0,
            //图片描述
            remark: "",
            image_id: "",
            preview_url: "",
            //上传格式
            accept: [],
            //图库
            model: {
                galleryModal: false,
                //选择图库图片ID
                sid: "",
                //图库预览地址
                preview_url: "",
                //图库选择图片ID
                image_id: ""
            },
            gallery: "",
            page: 1, //第N页
            page_size: 20, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
        };
    },
    mounted() {
        //上传图片的格式
        let gs = this.template.element.image.format.split("|"),
            accept = [];
        gs.forEach(e => {
            accept.push(e.split(".")[1]);
        });
        this.accept = accept;
        this.url();
    },
    watch: {
        value() {
            this.url();
        }
    },
    methods: {
        url() {
            this.adcreative_template.forEach(e => {
                if (e.id == this.adcreative_template_id) {
                    this.template = e;
                    this.img_size = this.template.element.image.size.split("*");
                }
            });

            this.image_id = this.value;
            this.getImageById();


            let size = this.template.element.image.size.split("*"),
                width = size[0],
                height = size[1];
            this.imgSize = parseInt(this.template.element.image.quality);
            this.actionUrl =
                util.baseURL +
                "api.php?action=gdtAdPut&opt=addImage&account_id=" +
                this.account_id +
                "&sessionid=" +
                util.getItem("sessionid") +
                "&target_width=" +
                width +
                "&target_height=" +
                height +
                "&remark=" +
                this.remark;
        },
        //预览图片地址
        getImageById() {
            if (!this.image_id) return;
            Axios.get("api.php", {
                action: "gdtAdPut",
                opt: "getImageById",
                account_id: this.account_id,
                image_id: this.image_id
            }).then(res => {
                this.preview_url = res.data.preview_url;
            }).catch(err => {
                console.log("获取图库片路径" + err);
            });
        },
        //图库确认
        ok() {
            this.$emit("input", this.image_id);
        },
        //图库
        galleryLink(page) {
            this.page = page;
            this.model.galleryModal = true;
            let size = this.template.element.image.size.split("*");
            Axios.get("api.php", {
                action: "gdtAdPut",
                opt: "adsimg",
                account_id: this.account_id,
                width: size[0],
                height: size[1],
                page: this.page, //页码
                page_size: this.page_size //每页数量
            }).then(res => {
                this.gallery = res.data;
                this.total_number = res.data.total_number;
                this.total_page = res.data.total_page;
            }).catch(err => {
                console.log("获取图库失败" + err);
            });
        },
        //选择图库图片
        selectCreated(id) {
            this.model.sid = id;
            this.gallery.list.forEach(item => {
                if (item.id == id) {
                    this.preview_url = item.preview_url;
                    this.image_id = item.image_id;
                    this.remark = item.remark;
                }
            });
        },
        //图片上传成功
        handleSuccess(filte) {
            //console.log(filte)
            this.$Message.info(filte.msg);
            if (filte.ret == "1") {
                this.image_id = filte.data.image_id;
                this.preview_url = filte.data.preview_url;

                this.$emit("input", this.image_id);
            }
        },
        handleFormatError(file) {
            this.$Message.info("文件格式不正确");
        },
        handleBeforeUpload(file) {
            // console.log(file)
            // console.log(this.imgSize)
            // this.$Notice.warning({
            //     title: '文件准备上传',
            //     desc: '文件 ' + file.name + ' 准备上传。'
            // });
        },
        handleProgress(event, file) {
            this.loading = true;
            this.percent = parseInt(event.percent);
            if (event.percent === 100) {
                this.loading = false;
            }
            //console.log(event.percent)
            // this.$Notice.info({
            //     title: '文件正在上传',
            //     desc: '文件 ' + file.name + ' 正在上传。'
            // });
        },
        handleMaxSize(file) {
            this.$Message.info("超出文件大小限制");
        },
        handleError(event, file) {
            this.$Message.info("文件上传失败");
        }
    }
};
</script>