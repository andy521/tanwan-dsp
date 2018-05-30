<template>
    <div>
        <Upload v-show="!loading" :format="['mp4','avi','mkv','flv']" accept="video/*" :show-upload-list="false" :max-size="size" :action="actionUrl" :on-success="handleSuccess" :on-exceeded-size="handleMaxSize" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :on-progress="handleProgress" :on-error="handleError" name="video">
            <Button type="primary" icon="ios-cloud-upload-outline">上传视频</Button>
        </Upload>
        <Button type="primary" v-show="loading"  :loading="loading">视频上传中({{percent}}%)</Button>
    </div>
</template>

<script>
import Axios from "@/api/index";
import util from "@/utils/index";
export default {
    name: "uploadVideo",
    props: ["size", "ind", "index"],
    data() {
        return {
            account_id: this.$route.query.account_id,//账户id
            loading: false,//上传图片loading
            percent: 0,//进度
            preview_url: "",//预览图片地址
            actionUrl: "",//action 上传地址
        }
    },
    mounted() {
        this.actionUrl =
            util.baseURL +
            "api.php?action=ttAdPut&opt=addVideo&account_id=" +
            this.account_id +
            "&sessionid=" +
            util.getItem("sessionid");
    },
    methods: {
        //图片上传成功
        handleSuccess(response, file, fileList) {
            if (response.ret == 1) {
                this.$Message.info("视频上传成功");
                this.$emit("on-change", response.data.video_id, response.data.Url, this.ind, this.index);
            }
            if (response.ret == -1) {
                this.$Message.info(response.msg);
            }
        },
        handleFormatError(file) {
            this.$Message.info("文件格式不正确")
        },
        handleBeforeUpload(file) {
            //文件准备上传
        },
        handleProgress(event, file) {
            //文件正在上传
            this.loading = true;
            this.percent = parseInt(event.percent);
            if (event.percent === 100) {
                this.loading = false;
            }
        },
        handleMaxSize(file) {
            this.$Message.info("文件太大，不能超过" + this.size + "KB。")
        },
        handleError(error, file, fileList) {
            this.$Message.info("视频上传失败");
        }
    }
}
</script>