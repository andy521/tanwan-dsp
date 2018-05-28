<style scoped>
.image-content {
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #f2f2f2;
}
.image-select-lists {
  background: #f2f2f2;
  padding: 10px 20px;
  width: 100%;
  font-family: PingFangSC-Light;
  font-size: 12px;
  color: #4d4d4d;
  margin-top: 10px;
}

.created li {
  height: 100px;
  line-height: 100px;
  width: 157px;
  background: #f5f6f8;
  cursor: pointer;
  border: 1px solid #ddd;
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
.created {
  height: 360px;
  overflow: auto;
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
.created_img img,
.select_img .simg img {
  object-fit: contain;
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
}
.panel {
  position: relative;
  min-height: 240px;
}
.btns {
  position: absolute;
  left: -120px;
  top: 0;
  bottom: 0;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-height: 230px;
  justify-content: center;
  padding-top: 10px;
}
.btns .ivu-btn-ghost {
  margin: 0 15px 10px 0;
}
.add {
  width: 56px;
  height: 51px;
  line-height: 41px;
  font-size: 26px;
}
.list {
  overflow-x: auto;
}
.image {
  float: left;
  width: 228px;
  min-height: 230px;
  padding-right: 16px;
  position: relative;
}
.imgidv {
  position: relative;
  width: 100px;
}
.select_close {
  display: inline-block;
  position: absolute;
  height: 26px;
  width: 26px;
  top: -10px;
  right: -7px;
  background: red;
  z-index: 30;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #fff;
}
.select_close .ivu-icon {
  color: #fff;
  float: left;
  margin: 6px 0 0 6px;
}
</style>
<style>
.caption textarea.ivu-input {
  border: none;
}
.caption .ivu-input:focus {
  box-shadow: none;
}
.ivu-modal-close {
  z-index: 999;
}
.alt-upload .ivu-btn {
  margin: 20px 10px 20px;
}
</style>
<template>
    <span>
        <Button @click="getImages();selectModal=true;" type="primary">选择图片</Button>
        <Modal v-model="selectModal" width="720" @on-ok="modelOk">
            <Tabs :animated="false">
                <Tab-pane label="我的图库">
                    <div v-if="imglist.length>0">
                        <ul class="created clear">
                            <li v-for="(item,index) in imglist" :key="item.image_id" :class="image_id==item.image_id? 'selected':''" @click="selectCreated(item)">
                                <div class="created_img">
                                    <img :src="item.url">
                                </div>
                                <div class="round_select">
                                    <Icon type="checkmark-round"></Icon>
                                </div>
                            </li>
                        </ul>
                        <Page v-if="total_page>1" :total="total_number" :page-size="page_size" ref="pages" size="small" @on-change="getImages()" show-elevator show-total></Page>
                    </div>
                    <div class="image-content" v-else style="margin-top:10px;">暂无图片</div>
                </Tab-pane>

                <Tab-pane label="本地上传">
                    <div class="image-content">
                        <Upload :format="accept" :show-upload-list="false" :max-size="imgSize" :action="actionUrl" :on-success="handleSuccess" :on-format-error="handleFormatError" :before-upload="handleBeforeUpload" :on-progress="handleProgress" :on-error="handleError">
                            <Button type="primary" icon="ios-upload">上传文件</Button>
                        </Upload>
                    </div>

                </Tab-pane>
            </Tabs>

            <div class="image-select-lists" v-if="imgUrl">
                <p>选择图片</p>
                <div class="margin-top-10">
                    <div class="imgidv">
                        <img :src="imgUrl" width="100%">
                        <div @click="closeCreated" class="select_close">
                            <Icon type="close-round"></Icon>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </span>
</template>

<script>
import Axios from "@/api/index";
import Util from '@/utils/index';
export default {
    name: "uploadImg",
    props: ["value", "imagemode", "ind", "index"],
    data() {
        return {
            account_id: this.$route.query.account_id,//账户id
            imglist: [],
            imgUrl: "",
            selectModal: false,
            image_id: "",

            actionUrl: "", //action 上传地址            
            accept: [], //上传格式
            imgSize: 10000, //图片大小
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
        }
    },
    mounted() {
        this.image_id = this.value;
    },
    watch: {
        value() {
            this.image_id = this.value;
        }
    },
    methods: {
        //获取获取本地图库
        getImages() {
            this.actionUrl = Util.baseURL + 'api.php?action=ttAdPut&opt=addImage&account_id=' + this.account_id + '&image_mode=' + this.imagemode + '&sessionid=' + Util.getItem('sessionid');
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getImages',
                account_id: this.account_id,
                page: this.page, //页码
                page_size: this.page_size, //每页数量
                image_mode: this.imagemode
            }).then((res) => {
                if (res.ret === 1) {
                    this.imglist = res.data.list;
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                }
            }).catch((err) => {
                console.error('本地图库', err)
            })
        },
        //选择图库图片
        selectCreated(item) {
            this.image_id = item.image_id;
            this.imgUrl = item.url;
        },
        //关闭已选择
        closeCreated() {
            this.image_id = "";
            this.imgUrl = "";
        },
        //图片上传成功            
        handleSuccess(filte) {
            this.$Message.info("文件上传成功");
            this.image_id = filte.data.image_id;
            this.imgUrl = filte.data.Url;
        },
        handleFormatError(file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请选择图片文件。'
            });
        },
        handleBeforeUpload(file) {
            // this.$Notice.warning({
            //     title: '文件准备上传',
            //     desc: '文件 ' + file.name + ' 准备上传。'
            // });
        },
        handleProgress(event, file) {
            console.log(event.percent)
            // this.$Notice.info({
            //     title: '文件正在上传',
            //     desc: '文件 ' + file.name + ' 正在上传。'
            // });

        },
        handleError(event, file) {
            this.$Message.info("文件上传失败");
        },

        modelOk() {
            this.$emit('on-change', this.image_id, this.imgUrl, this.ind, this.index);
        }
    }
}
</script>