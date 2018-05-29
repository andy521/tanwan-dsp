<style scoped>
.filediv {
  position: relative;
}
.file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
<template>
    <div>
        <Button type="primary" :loading="loading" class="filediv">选择视频<input type="file" accept="video/*" capture="camera" @change="readFile" class="file"></Button>

    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "uploadVideo",
    props: ["size", "ind", "index"],
    data() {
        return {
            account_id: this.$route.query.account_id,//账户id
            loading: false
        }
    },
    methods: {
        //上传视频
        addVideo(url) {
            this.loading = true;
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'addVideo',
                account_id: this.account_id,
                video: url
            }).then((res) => {
                this.loading = false;
                if (res.ret == 1) {
                    this.$Message.info("视频上传成功");
                    this.$emit('on-change', res.data.video_id, res.data.Url, this.ind, this.index);
                }
            }).catch((err) => {
                this.loading = false;
                console.error('视频上传', err)
            })
        },
        readFile(e) { //上传图片路径
            var that = this;
            var tmpFile = e.target.files;
            for (var i = 0; i < tmpFile.length; i++) {
                var file = tmpFile[i]
                if (!/video\/\w+/.test(file.type)) { //判断是否是视频类型
                    that.$Message.info("视频格式不对");
                    return false;
                }
                var size = file.size / 1024 / 1024;
                if (size > that.size) {
                    that.$Message.info("视频超过限制");
                    return;
                }
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    that.addVideo(this.result);
                }
            }
        },
    }
}
</script>