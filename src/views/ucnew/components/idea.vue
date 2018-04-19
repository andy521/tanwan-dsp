<style scoped lang="less">
@import url("../index.less");
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  .ivu-modal {
    top: 0;
  }
}
.uc-idea {
  box-sizing: border-box;
  background-color: #fff;
}
.uc-idea-content {
  padding: 0 20px;
  .g-belong {
    .name {
      margin-right: 60px;
    }
  }
  .g-style {
    justify-content: flex-start;
    align-items: center;
    .item {
      margin-right: 60px;
    }
    .ivu-radio-group {
      .item {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
    }
  }
}
.g-flex {
  display: flex;
}
.g-flex-lt {
  width: 700px;
  flex: 0 0 700px;
  border-right: 1px solid #eee;
  .template-3 {
    .g-flex {
      justify-content: space-between;
      .g-flex-item {
      }
    }
  }
}
.g-flex-rt {
  flex: 0 0 392px;
  width: 392px;
}
.g-src {
  position: relative;
  padding-bottom: 20px;
  .tip {
    color: #969696;
    line-height: 24px;
  }
  .mask {
    display: none;
    position: absolute;
    bottom: 0;
    top: 82px;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 1000;
    background-color: #fff;
  }
  .btn-close {
    display: inline-block;
    width: 30px;
    height: 30px;
    position: absolute;
    right: 0;
    top: 0;
    color: #ff0000;
    font-size: 20px;
    cursor: pointer;
  }
}
.btn-green {
  color: #19be6b;
  border-color: #19be6b !important;
}
// .ivu-icon-ios-cloud-upload:before {
//     color: #19be6b;
// }
// .ivu-radio-inner:after {
//     background-color: #19be6b;
// }
button.ivu-btn {
  margin: 0 10px;
  border-radius: 0;
}
.phone-preview {
  .bg-phone {
    padding: 85px 28px 0;
    width: 392px;
    height: 438.71px;
    background: url("./bg-phone.png") no-repeat center top;
    .title {
      margin-bottom: 10px;
      margin: 10px;
      font-size: 15px;
      max-height: 44px;
      overflow: hidden;
      line-height: 24px;
      font-weight: 400;
      color: #333;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
    }
    .bg-image {
      width: 341px;
      height: 160px;
      overflow: hidden;
      background:url("./new.jpg")no-repeat top center;
      background-size: 341px 160px;
      .image {
        position: relative;
        width: 341px;
      }
    }

    .desc {
      margin: 10px;
      .item {
        margin-right: 10px;
      }
    }
  }
  .phone-foot {
    height: 100px;
    overflow: hidden;
    width: 330px;
    background: url("./phone-foot.png") no-repeat top center;
    border: none;
    margin-top: 10px;
  }
}
</style>

<template>
  <div class="uc-idea">
    <div class="color-green border-bottom padding-tb-10">
      <Button slot="title" type="text" @click="handleGoBack" class="padding-left-0">
        <Icon type="chevron-left"></Icon>
        返回计划列表
      </Button>
    </div>

    <div class="uc-idea-content">
      <div class="border-bottom g-belong padding-lr-30 padding-tb-20">
        <span class="name color-grey">所属计划：{{campaignName}}</span>
        <span class="name color-grey">所属单元：{{adgroupName}}</span>
      </div>

      <div class="g-style g-flex border-bottom padding-lr-30 padding-tb-20">
        <h3 class="sub-title color-green item">创意样式</h3>
        <RadioGroup @on-change="handleChangeTemplate" v-model="creativeSetting.creativeTemplate_id">
          <Radio :label="1" :class="{'btn-green': creativeSetting.creativeTemplate_id === 1}" :disabled="isEdit" class="item">信息流大图</Radio>
          <Radio :label="2" :class="{'btn-green': creativeSetting.creativeTemplate_id === 2}" :disabled="isEdit" class="item">信息流小图</Radio>
          <Radio :label="3" :class="{'btn-green': creativeSetting.creativeTemplate_id === 3}" :disabled="isEdit" class="item">信息流三图</Radio>
        </RadioGroup>
      </div>

      <div class="g-flex border-bottom">
        <div class="g-flex-lt">
          <div class="g-src border-bottom padding-lr-30">
            <h3 class="sub-title color-green padding-tb-20">创意样式</h3>

            <div v-if="creativeSetting.creativeTemplate_id === 1" class="template-1">
              <p class="tip">jpg/png格式,尺寸640*300，图片大小不能超过90kb</p>
              <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="true" :max-size="90" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>点击或将文件拖住到此上传</p>
                </div>
              </Upload>
            </div>
            <div v-if="creativeSetting.creativeTemplate_id === 2" class="template-2">
              <p class="tip">jpg/png格式,尺寸140*105，图片大小不能超过20kb</p>
              <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
                <div style="padding: 20px 0">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>点击或将文件拖住到此上传</p>
                </div>
              </Upload>
            </div>
            <div v-if="creativeSetting.creativeTemplate_id === 3" class="template-3">
              <p class="tip">jpg/png格式,尺寸160*120，图片大小不能超过20kb</p>
              <div class="g-flex">
                <div class="g-flex-item">
                  <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                </div>
                <div class="g-flex-item">
                  <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                </div>
                <div class="g-flex-item">
                  <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                </div>
              </div>
            </div>

            <div ref="imageMask" class="mask">
              <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
              <img src="" alt="" class="image-view">
            </div>

          </div>

          <div class="g-content padding-lr-30">
            <h3 class="sub-title color-green padding-tb-20">创意文本及URL</h3>
            <Form ref="ideaSetting" :model="creativeSetting" :label-width="126" label-position="left">
              <FormItem label="标题">
                <Input @on-blur="handleTitle" v-model="creativeSetting.content.title" :maxlength="70" placeholder="标题" class="item-width"></Input>
                <p class="font-size-12 color-red">标题字符范围为10-70</p>
              </FormItem>
              <FormItem label="推广来源">
                <Input @on-blur="handleSource" v-model="creativeSetting.content.source" :maxlength="16" placeholder="推广来源" class="item-width"></Input>
                <p class="font-size-12 color-red">推广来源字符范围为1-16</p>
              </FormItem>
              <FormItem label="点击URL">
                <Input @on-blur="handleSchemeUrl" type="url" v-model="creativeSetting.content.scheme_url" :maxlength="10234" placeholder="点击URL" class="item-width"></Input>
                <p class="font-size-12 color-red">以http或https开头，长度不能大于1024个字符</p>
              </FormItem>
              <FormItem label="点击监测链接">
                <Input @on-blur="handleMonitorUrl" type="url" v-model="creativeSetting.clickMonitorUrl" :maxlength="1024" placeholder="点击监测链接" class="item-width"></Input>（可选）
                <p class="font-size-12 color-grey">请以http或https开头，长度不能大于1024个字符</p>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="phone-preview g-flex-rt padding-lr-30">
          <h3 class="sub-title color-green padding-tb-20">广告预览</h3>
          <div class="bg-phone">
            <div class="title">{{creativeSetting.content.title}}</div>
            <div class="bg-image">
              <img v-show="this.creativeSetting.content.pic1_img" :src="this.creativeSetting.content.pic1_img" alt="" class="image">
            </div>
            <div class="desc">
              <Icon type="volume-high"></Icon>
              <span class="item">推广</span>
              <span class="item">刚刚</span>
              <span class="item">{{creativeSetting.content.source}}</span>
            </div>
            <div class="phone-foot"></div>
          </div>
        </div>
      </div>

    </div>
    <div class="padding-lr-30 padding-tb-20">
      <Button @click="handleSumbit" type="primary">确认</Button>
      <Button @click="handleGoBack" type="ghost">取消</Button>
    </div>
  </div>
</template>

<script>
import Axios from "@/api/index";
import { deepClone } from "@/utils/DateShortcuts.js";
// import unitbyid from "../simple/unitbyid";
// import getCampaignNameList from "../simple/getCampaignNameList";
// import creativeTemplates from "../simple/creativeTemplates";
const ERR_OK = 1;
export default {
  data() {
    return {
      isEdit: false, // 判断当前推广计划状态：true为编辑状态，false为新建状态
      campaignNameList: [], // 计划名称列表
      campaignName: "", // 当前计划名称
      adgroupName: "", // 当前单元名称
      currCreativeList: [], // creativeTemplates
      accountId: this.$route.query.account,
      campaignId: this.$route.query.campaign_id,
      adgroupId: this.$route.query.adgroup_id,
      creativeId: this.$route.query.creative,
      currId: 0, // isEdit=true 状态下 用于获取创意内容
      // accountId: this.$route.query.account,
      // campaignId: "30433927",
      // adgroupId: this.$route.query.adgroup_id,
      creativeSetting: {
        account_id: this.$route.query.account,
        adgroup_id: this.$route.query.adgroup_id,
        campaign_id: this.$route.query.campaign_id,
        videoId: 0,
        creativeTemplate_id: 1,
        content: [],
        clickMonitorUrl: "", // 点击URL
        wildcardIds: "",
        content: {
          app_name: "", // APP名称
          title: "",
          source: "", // 推广来源
          scheme_url: "" // 直达链接
        }
      },
      pic1_img: "",
      pic2_img: "",
      pic3_img: "",
      isTitleErr: false,
      isSourceErr: false,
      isUrlErr: false,
      isImageErr: false,
      image: {
        name: "img",
        type: "string",
        size: 90,
        format: "*.jpg|*.png",
        width: 640,
        height: 300
      },
      imageResp: {
        image_id: "",
        srcImageUrl: ""
      },
      actionUrl: ""
    };
  },
  methods: {
    handleSuccess(filte) {
      console.log("handleSuccess", filte);
      if (filte.ret == "1") {
        this.info.image_id = filte.data.image_id;
        this.preview_url = filte.data.preview_url;

        console.log("Success", filte);

        return;
      }
      if (filte.ret == "-1") {
        this.$Notice.warning({
          desc: filte.msg
        });
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc: "文件 " + file.name + " 格式不正确，请选择图片文件。"
      });
    },
    defaultList(list) {
      console.log("defaultList", list);
    },
    handleBeforeUpload(file) {
      console.log(
        "handleBeforeUpload",
        this.actionUrl,
        file,
        file.size,
        typeof file.size
      );
      // console.log(file)
      // console.log(this.imgSize)
      // this.$Notice.warning({
      //     title: '文件准备上传',
      //     desc: '文件 ' + file.name + ' 准备上传。'
      // });
    },
    handleProgress(event, file) {
      // this.loading = true;
      // this.percent = event.percent;
      // if (event.percent === 100) {
      //     this.loading = false;
      // }
      //console.log(event.percent)
      // this.$Notice.info({
      //     title: '文件正在上传',
      //     desc: '文件 ' + file.name + ' 正在上传。'
      // });
    },
    handleMaxSize(file) {
      //  console.log("handleMaxSize",this.actionUrl, file.size, typeof file.size)
      // this.$Notice.warning({
      //     title: "超出文件大小限制",
      //     desc:
      //         "文件 " +
      //         file.name +
      //         " 太大，不能超过" +
      //         this.imgSize +
      //         "KB。"
      // });
    },
    handleError(event, file) {
      this.$Notice.error({
        title: "文件上传失败",
        desc: "文件 " + file.name + " 上传失败。"
      });
    },
    // 获取字符长度
    getByteLen(str) {
      let len = 0;
      for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char.match(/[^\x00-\xff]/gi) !== null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    handleCloseMask() {
      let mask = this.$refs.imageMask;
      mask.style.display = "none";
    },
    handleMonitorUrl(blur) {
      const len = [1024];
      const reg = /^(http:\/\/|https:\/\/)/;
      let currStr = blur.target.value;
      let currLen = this.getByteLen(currStr);
      if (len[0] < currLen) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "点击URL字符长度不能大于1024个字符"
        });
        this.isUrlErr = true;
      } else {
        this.isUrlErr = false;
      }
      if (reg.test(currStr)) {
        this.isUrlErr = false;
      } else {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "URL必须以http或https开头"
        });
        this.isUrlErr = true;
      }
      this.creativeSetting.clickMonitorUrl = currStr;
    },
    handleSchemeUrl(blur) {
      const len = [1024];
      const reg = /^(http:\/\/|https:\/\/)/;
      let currStr = blur.target.value;
      let currLen = this.getByteLen(currStr);
      if (len[0] < currLen) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "点击URL字符长度不能大于1024个字符"
        });
        this.isUrlErr = true;
      } else {
        this.isUrlErr = false;
      }
      if (reg.test(currStr)) {
        this.isUrlErr = false;
      } else {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "URL必须以http或https开头"
        });
        this.isUrlErr = true;
      }
      this.creativeSetting.content.scheme_url = currStr;
    },
    handleSource(blur) {
      const len = [1, 16];
      let currStr = blur.target.value;
      let currLen = this.getByteLen(currStr);
      if (len[0] > currLen) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "推广来源字符长度不能低于1个字符"
        });
        this.isSourceErr = true;
      } else if (len[1] < this.getByteLen(currStr)) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "推广来源字符长度不能大于16个字符"
        });
        this.isSourceErr = true;
      } else {
        this.isSourceErr = false;
      }
      this.creativeSetting.content.source = currStr;
    },
    handleTitle(blur) {
      const len = [10, 70];
      let currStr = blur.target.value;
      let currLen = this.getByteLen(currStr);
      if (len[0] > currLen) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "标题字符长度不能低于10个字符"
        });
        this.isTitleErr = true;
      } else if (len[1] < this.getByteLen(currStr)) {
        this.$Notice.warning({
          title: "温馨提示：",
          desc: "标题字符长度不能大于70个字符"
        });
        this.isTitleErr = true;
      } else {
        this.isTitleErr = false;
      }
      this.creativeSetting.content.title = currStr;
    },
    handleChangeTemplate(id) {
      console.log("id", id, typeof id);
      const imgSizeList = [
        { width: 640, height: 300, size: 90 },
        { width: 140, height: 105, size: 20 },
        { width: 160, height: 120, size: 20 }
      ];
      switch (id) {
        case 1:
          this.image.width = imgSizeList[0].width;
          this.image.height = imgSizeList[0].height;
          this.image.size = imgSizeList[0].size;
          this.actionUrl =
            "http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=" +
            this.accountId +
            "&target_width=" +
            this.image.width +
            "&target_height=" +
            this.image.height;
          console.log(
            "image width height",
            this.image.width,
            this.image.height,
            this.actionUrl
          );
          break;
        case 2:
          this.image.width = imgSizeList[1].width;
          this.image.height = imgSizeList[1].height;
          this.image.size = imgSizeList[1].size;
          this.actionUrl =
            "http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=" +
            this.accountId +
            "&target_width=" +
            this.image.width +
            "&target_height=" +
            this.image.height;
          console.log(
            "image width height",
            this.image.width,
            this.image.height,
            this.actionUrl
          );
          break;
        case 3:
          this.image.width = imgSizeList[2].width;
          this.image.height = imgSizeList[2].height;
          this.image.size = imgSizeList[2].size;
          this.actionUrl =
            "http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=" +
            this.accountId +
            "&target_width=" +
            this.image.width +
            "&target_height=" +
            this.image.height;
          console.log(
            "image width height",
            this.image.width,
            this.image.height,
            this.actionUrl
          );
          break;
      }
    },
    // 初始化创意 编辑 状态下的数据
    initEditIdea() {
      this.creativeSetting.account_id = this.currCreativeList.account_id;
      this.creativeSetting.adgroup_id = this.currCreativeList.adgroup_id;
      this.creativeSetting.campaign_id = this.currCreativeList.campaign_id;
      this.creativeSetting.videoId = this.currCreativeList.videoId
        ? this.currCreativeList.videoId
        : "0";
      this.creativeSetting.creativeTemplate_id = parseInt(
        this.currCreativeList.creativeTemplate_id
      );
      this.creativeSetting.clickMonitorUrl = this.currCreativeList.clickMonitorUrl;
      this.creativeSetting.wildcardIds = this.currCreativeList.wildcardIds;
      this.creativeSetting.appId = this.currCreativeList.appId;
      this.creativeSetting.channelApkId = this.currCreativeList.channelApkId;
      this.creativeSetting.paused = this.currCreativeList.paused;

      const content = JSON.parse(this.currCreativeList.content);
      this.creativeSetting.app_name = content.app_name;
      this.creativeSetting.title = content.title;
      this.creativeSetting.source = content.source;
      this.creativeSetting.scheme_url = content.scheme_url;
      if (this.creativeSetting.creativeTemplate_id === 1) {
        this.creativeSetting.content.pic1_img = content.pic1_img;
      }
      if (this.creativeSetting.creativeTemplate_id === 2) {
        this.creativeSetting.content.pic2_img = content.pic2_img;
      }
      if (this.creativeSetting.creativeTemplate_id === 3) {
        this.creativeSetting.content.pic3_img = content.pic3_img;
      }
      // for (let k in content) {
      //   if (content.hasOwnProperty(k)) {
      //     this.creativeSetting.content[k] = content[k];
      //   }
      // }
      console.log(
        this.creativeSetting,
        this.currCreativeList,
        "this.creativeSetting"
      );
    },
    // 根据id获取创意内容
    getCurrCreativeList() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCreativeById",
        id: this.currId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.currCreativeList = res.data[0];
            this.initEditIdea();
            console.log(
              "根据id获取创意内容this.currCreativeList",
              this.currCreativeList
            );
          }
        })
        .catch(err => {
          console.log("获取创意内容错误：" + err);
        });
      // 本地测试
      // this.currCreativeList = unitbyid.data[0].adgroup_name;
    },
    // 获取单元名称列表
    getAdgroupNameList() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getAdgroupById",
        adgroup_id: this.adgroupId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const unit = res.data[0];
            console.log("获取单元名称列表", unit);
            this.adgroupName = unit.adgroup_name;
          }
        })
        .catch(err => {
          console.log("获取单元名称列表错误：" + err);
        });
      // 本地测试
      // this.adgroupName = unitbyid.data[0].adgroup_name;
    },
    // 获取计划名称
    getCampaignName() {
      this.campaignNameList.forEach(campaign => {
        // console.log("campaign", campaign.campaign_id, this.campaignId)
        if (campaign.campaign_id === this.campaignId) {
          this.campaignName = campaign.campaign_name;
        }
      });
    },
    // 获取计划名称列表
    getCampaignNameList() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCampaignNameList"
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.campaignNameList = res.data;
            this.getCampaignName();
          }
        })
        .catch(err => {
          console.log("获取计划名称列表错误：" + err);
        });
      // 本地测试
      // this.campaignNameList = getCampaignNameList.data;
    },
    // 获取广告样式列表
    getCreativeTemplates() {
      Axios.post("api.php", {
        action: "ucAdPut",
        opt: "getCreativeTemplates",
        adgroup_id: this.adgroupId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeTemplates = res.data;
            // console.log(this.creativeTemplates, "creativeTemplates");
            this.$Message.success("获取广告样式列表数据更新成功");
          }
        })
        .catch(err => {
          console.log("获取广告样式列表错误：" + err);
        });
      // 本地测试
      // this.creativeTemplates = creativeTemplates.data;
    },
    getImageField(templateId) {
      switch (templateId) {
        case 1:
          return {
            pic1_img: this.pic1_img
          };
          break;
        case 2:
          return {
            pic1_img: this.pic1_img,
            pic2_img: this.pic2_img
          };
          break;
        case 3:
          return {
            pic1_img: this.pic1_img,
            pic2_img: this.pic2_img,
            pic3_img: this.pic3_img
          };
          break;
      }
    },
    // 新建创意
    addIdea() {
      Object.assign(
        this.creativeSetting.content,
        this.getImageField(this.creativeSetting.creativeTemplate_id)
      );
      let params = Object.assign({}, this.creativeSetting, {
        action: "ucAdPut",
        opt: "addCreative"
      });
      console.log("新建创意参数", params);
      Axios.post("api.php", params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeId = res.data.creative_id;
            console.log(this.creativeId, "creativeId");
            this.$Message.success("新建推广创意成功");
          }
        })
        .catch(err => {
          console.log("新建推广创意错误：" + err);
        });
    },
    // 编辑创意
    updateIdea() {
      let params = Object.assign({}, this.creativeSetting, {
        do: "edit",
        action: "ucAdPut",
        opt: "updateCreative",
        campaign_id: parseInt(this.creativeSetting.campaign_id),
        videoId: parseInt(this.creativeSetting.videoId),
        creativeTemplate_id: parseInt(this.creativeSetting.creativeTemplate_id),
        // appId: parseInt(this.creativeSetting.appId),
        // channelApkId: parseInt(this.creativeSetting.channelApkId),
        paused: parseInt(this.creativeSetting.paused)
      });
      console.log("编辑创意", params);
      Axios.post("api.php", params)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeId = res.data.creative_id;
            console.log(this.creativeId, "creativeId");
            this.$Message.success("编辑创意成功");
          }
        })
        .catch(err => {
          console.log("编辑创意错误：" + err);
        });
    },
    // 返回提交创意
    handleSumbit() {
      if (this.isEdit) {
        this.updateIdea();
      } else {
        this.addIdea();
      }
    },
    // 返回上级路由
    handleGoBack() {
      this.$router.go(-1);
    },
    // 获取account信息
    getAccountInfo() {
      let query = this.$route.query;
      this.creativeSetting.account_id = query.account;
      this.creativeSetting.adgroup_id = query.adgroup_id;
      this.creativeSetting.campaign_id = query.campaign_id;
      // console.log("getAccountInfo", this.creativeSetting, this.$route.query.id)
      if (query.edit && query.edit === "1") {
        this.isEdit = true;
        this.currId = this.$route.query.id;
      } else {
        this.isEdit = false;
      }
    }
  },
  mounted() {
    this.actionUrl =
      "http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=" +
      this.accountId +
      "&target_width=" +
      this.image.width +
      "&target_height=" +
      this.image.height;
  },
  created() {
    this.getAccountInfo();
    this.getCampaignNameList();
    this.getAdgroupNameList();
    this.getCreativeTemplates();
    this.getCurrCreativeList();
  },
  components: {}
};
</script>