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
  width: 150px;
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
.creative {
  position: relative;
}
</style>
<template>
    <div class="creative">
        <div class="upload_div">
            <Upload multiple type="drag" :format="accept" :show-upload-list="false" :max-size="imgSize" :action="actionUrl" :on-success="handleSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :on-progress="handleProgress" :on-error="handleError" name="img">
                <div class="upload" :style="{backgroundImage: 'url(' + preview_url+ ')',height:150*img_size[1]/img_size[0]+ 'px'}">
                    <div class="uploadbg">
                        <div class="txtbox">
                            <p>上传商标</p>
                            <div class="size">{{img_size[0]}}*{{img_size[1]}}(px)</div>
                            <p class="way">点击或将文件拖拽到这里上传</p>
                        </div>
                    </div>
                    <Spin v-if="loading" fix>
                        <Progress :percent="percent" :stroke-width="5"></Progress>
                        <div>正在上传</div>
                    </Spin>
                </div>
            </Upload>
        </div>
    </div>
</template>
<script>
//广告版位数量
import util from "@/utils/index";
import Axios from "@/api/index";
export default {
    name: "uploadLogo",
    props: ["value"],
    data() {
        return {
            account_id: this.$route.query.account_id,
            img_size: [512, 512], //图片尺寸
            //上传图片loading
            loading: false,
            percent: 0,
            //action 上传地址
            actionUrl: "",
            //图片大小
            imgSize: 0,
            //图片描述
            image_id: "",
            preview_url: "",
            //上传格式
            accept: ["jpg", "jpeg", "png"],
        };
    },
    mounted() {
        this.url();
    },
    watch: {
        value() {
            this.url();
        }
    },
    methods: {
        url() {
            this.image_id = this.value;
            this.getImageById();
            this.actionUrl =
                util.baseURL +
                "api.php?action=gdtAdPut&opt=addImage&account_id=" +
                this.account_id +
                "&sessionid=" +
                util.getItem("sessionid") +
                "&target_width=" +
                this.img_size[0] +
                "&target_height=" +
                this.img_size[1];
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