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
.padding-top-30 {
  padding-top: 30px;
}
.g-flex {
  display: flex;
}
.g-flex-lt {
  width: 700px;
  flex: 0 0 700px;
  border-right: 1px solid #eee;
  .template {
    .g-flex-item{
      flex: 1;
    }
  }
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
    position: absolute;
    top: 0;
    left: 0;
    width: 600px;
    line-height: 24px;
    color: #969696;
  }
  .template {
    position: relative;
    .mask {
      // display: none;
      position: absolute;
      bottom: 0;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 1000;
      background-color: #fff;
      overflow: hidden;
      .image-view {
        height: 100%;
      }
    }
    .g-flex {
      .g-flex-item {
        position: relative;
      }
    }
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
      height: 24px;
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
      background: url("./new.jpg")no-repeat top center;
      background-size: 341px 160px;
      .image {
        position: relative;
        width: 341px;
      }
    }
    .desc {
      margin: 10px;
      overflow: hidden;
      .item {
        margin-right: 10px;
      }
    }
  }
  .phone-template2 {
    height: 300px;
    .content {
      margin: 10px 0;
      justify-content: space-around;
      align-items: center;
      height: 95px;
      .item-lt {
        flex: 1;
      }
      .item-rt {
        flex: 0 0 100px;
        width: 100px;
        .bg-image {
          max-width: 100px;
          height: 75px;
          .image {
            width: inherit;
            height: inherit;
          }
        }
      }
    }
  }
  .phone-template3 {
    height: 350px;
    .image-content {
      justify-content: space-between;
      align-items: center;
      .bg-image {
        width: 110px;
        height: 82px;
        .image {
          width: inherit;
          height: inherit;
        }
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
        返回单元列表
      </Button>
    </div>

    <div class="uc-idea-content">
      <div class="border-bottom g-belong padding-lr-30 padding-tb-20">
        <span v-if="campaignName.length > 0" class="name color-grey">所属计划：{{campaignName}}</span>
        <span v-if="adgroupName.length > 0" class="name color-grey">所属单元：{{adgroupName}}</span>
      </div>

      <div class="g-style g-flex border-bottom padding-lr-30 padding-tb-20">
        <h3 class="sub-title color-green item">创意样式</h3>
        <!-- <RadioGroup @on-change="handleChangeTemplate" v-model="creativeSetting.creativeTemplate_id">
          <Radio :label="4" :class="{'btn-green': creativeSetting.creativeTemplate_id === 4}" :disabled="isEdit" class="item">信息流大图</Radio>
          <Radio :label="5" :class="{'btn-green': creativeSetting.creativeTemplate_id === 5}" :disabled="isEdit" class="item">信息流小图</Radio>
          <Radio :label="34" :class="{'btn-green': creativeSetting.creativeTemplate_id === 34}" :disabled="isEdit" class="item">信息流三图</Radio>
        </RadioGroup> -->

        <RadioGroup @on-change="handleChangeTemplate" v-model="creativeSetting.creativeTemplate_id">
          <Radio v-if="creativeTemplates && creativeTemplates.length > 0" v-for="(template, index) in creativeTemplates" :key="index" :label="template.creativeTemplateId" :class="{'btn-green': creativeSetting.creativeTemplate_id === template.creativeTemplateId}" :disabled="isEdit" class="item">{{template.creativeTemplateName}}</Radio>
        </RadioGroup>

      </div>

      <div class="g-flex border-bottom">
        <div class="g-flex-lt">
          <div class="g-src border-bottom padding-lr-30">
            <h3 class="sub-title color-green padding-tb-20">创意样式</h3>

            <div v-for="(uploadBlock, iu) in creativeTemplatesFieldsList" v-if="creativeTemplatesFieldsList.length > 0 && creativeSetting.creativeTemplate_id === uploadBlock.creativeTemplate_id" :class="{'template-1': uploadBlock.style === 'big','template-2': uploadBlock.style === 'small','template-3': uploadBlock.style === 'three'}" :key="iu" class="template">

               <div class="g-flex">   

                <div v-for="(image, index) in uploadBlock.image" v-if="uploadBlock.image.length > 0" :key="index" class="g-flex-item">   

                    <p v-if="index == '0'" class="tip">{{image.tips}}</p>

                    <!-- 创意样式 信息流大图与信息流小图-->
                    <div v-if="uploadBlock.style === 'big'"  class="updata_img">
                        <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" >
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击或将文件拖拽到这里上传</p>
                            </div>
                        </Upload>
                        <div v-show="pic1_img" ref="imageMask" class="mask">
                            <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                            <img :src="pic1_img" alt="" class="image-view">
                        </div>
                    </div>

                    <div v-if="uploadBlock.style === 'small'"  class="updata_img">
                        <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" >
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击或将文件拖拽到这里上传</p>
                            </div>
                        </Upload>
                        <div v-show="pic2_img" ref="imageMask" class="mask">
                            <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                            <img :src="pic2_img" alt="" class="image-view">
                        </div>
                    </div>

                    <!-- 创意样式 信息流大三图-->
                    <div v-if="uploadBlock.style == 'three' && image.key=== 'pic1_img' "  class="updata_img">
                        <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess31" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" >
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击或将文件拖拽到这里上传</p>
                            </div>
                        </Upload>                                        
                        <div v-show="pic31_img" ref="imageMask" class="mask">
                            <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                            <img :src="pic31_img" alt="" class="image-view">
                        </div>
                    </div>

                    <div v-if="uploadBlock.style == 'three' && image.key=== 'pic2_img' "  class="updata_img">
                        <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess32" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" >
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击或将文件拖拽到这里上传</p>
                            </div>
                        </Upload>                                 
                        <div v-show="pic32_img" ref="imageMask" class="mask">
                            <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                            <img :src="pic32_img" alt="" class="image-view">
                        </div>
                    </div>

                    <div v-if="uploadBlock.style == 'three' && image.key=== 'pic3_img' "  class="updata_img">
                        <Upload type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess33" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" >
                        <div style="padding: 20px 0">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>点击或将文件拖拽到这里上传</p>
                            </div>
                        </Upload>                                 
                        <div v-show="pic33_img" ref="imageMask" class="mask">
                            <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                            <img :src="pic33_img" alt="" class="image-view">
                        </div>
                    </div>


                </div>
            </div>

              <!-- <div :class="{'g-flex': uploadBlock.style === 'three'}">

                <div v-for="(image, ii) in uploadBlock.image" v-if="uploadBlock.image.length > 0" :key="ii" :class="{'g-flex-item': uploadBlock.style === 'three'}">
                  <p v-if="ii < 1" class="tip">{{image.tips}}</p>
                  <Upload v-if="uploadBlock.style !== 'three'" type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" class="padding-top-30">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                  <div v-show="pic1_img &&pic1_img.length > 0" ref="imageMask" class="mask">
                    <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                    <img :src="pic1_img" alt="" class="image-view">
                  </div>
                  <div v-show="pic2_img &&pic2_img.length > 0" ref="imageMask" class="mask">
                    <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                    <img :src="pic2_img" alt="" class="image-view">
                  </div>
                  <Upload v-if="uploadBlock.style === 'three' && image.key=== 'pic1_img'" type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess31" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" class="padding-top-30">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                  <div v-show="uploadBlock.style === 'three' && pic31_img && pic31_img.length > 0" ref="imageMask" class="mask">
                    <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                    <img :src="pic31_img" alt="" class="image-view">
                  </div>
                  <Upload v-if="uploadBlock.style === 'three' && image.key=== 'pic2_img'" type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess32" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" class="padding-top-30">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                  <div v-show="uploadBlock.style === 'three' && pic32_img && pic32_img.length > 0" ref="imageMask" class="mask">
                    <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                    <img :src="pic32_img" alt="" class="image-view">
                  </div>
                  <Upload v-if="uploadBlock.style === 'three' && image.key === 'pic3_img'" type="drag" :action="actionUrl" accept="image/*" :format="['jpg','png']" :show-upload-list="false" :max-size="20" :on-success="handleSuccess33" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" class="padding-top-30">
                    <div style="padding: 20px 0">
                      <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                      <p>点击或将文件拖住到此上传</p>
                    </div>
                  </Upload>
                  <div v-show="uploadBlock.style === 'three' && pic32_img && pic32_img.length > 0" ref="imageMask" class="mask">
                    <div ref="btnClose" @click="handleCloseMask" class="btn-close">x</div>
                    <img :src="pic33_img" alt="" class="image-view">
                  </div>
                </div>

              </div> -->

            </div>

          </div>
 

          <div class="g-content padding-lr-30">
            <h3 class="sub-title color-green padding-tb-20">创意文本及URL</h3>
            <!-- <Form v-show="template.creativeTemplateId === creativeSetting.creativeTemplate_id" v-if="creativeTemplates && creativeTemplates.length > 0" v-for="(template, ip) in creativeTemplates" :key="ip" :model="creativeSetting" :label-width="126" label-position="left"> -->
            <Form v-if="template.creativeTemplateId === creativeSetting.creativeTemplate_id" v-for="(template, ip) in creativeTemplates" :key="ip" :model="creativeSetting" :label-width="126" label-position="left">
              <FormItem v-if="field.alias !== '图片'" v-for="(field, ic) in template.creativeTemplateFields" :key="ic" :label="field.alias">
                <Input @on-blur="handleField" v-model="fieldSetting[field.key]" :placeholder="field.alias" class="item-width"></Input>
                <p class="font-size-12 color-red">{{field.tips}}</p>
              </FormItem>
            </Form>

          </div>
        </div>
        <div class="phone-preview g-flex-rt padding-lr-30">
          <h3 class="sub-title color-green padding-tb-20">广告预览</h3>

          <div v-for="(preView, ip) in creativeTemplatesFieldsList" v-if="creativeTemplatesFieldsList.length > 0" :key="ip">
            <div v-if="creativeSetting.creativeTemplate_id === preView.creativeTemplate_id" v-show="preView.style === 'big'" class="bg-phone phone-template1">
              <div class="title">{{fieldSetting.title}}</div>
              <div class="bg-image">
                <img v-show="pic1_img" :src="pic1_img" alt="广告预览" class="image">
              </div>
              <div class="desc">
                <Icon type="volume-high"></Icon>
                <span class="item">推广</span>
                <span class="item">刚刚</span>
                <span class="item">{{fieldSetting.source}}</span>
              </div>
              <div class="phone-foot"></div>
            </div>

            <div v-if="creativeSetting.creativeTemplate_id === preView.creativeTemplate_id" v-show="preView.style === 'small'" class="bg-phone phone-template2">
              <div class="content g-flex border-bottom">
                <div class="item-lt">
                  <div class="title">{{fieldSetting.title}}</div>
                  <div class="desc">
                    <Icon type="volume-high"></Icon>
                    <span class="item">推广</span>
                    <span class="item">刚刚</span>
                    <span class="item">{{fieldSetting.source}}</span>
                  </div>
                </div>
                <div class="item-rt">
                  <div class="bg-image">
                    <img v-show="pic2_img" :src="pic2_img" alt="广告预览" class="image">
                  </div>
                </div>
              </div>
              <div class="phone-foot"></div>
            </div>

            <div v-if="creativeSetting.creativeTemplate_id === preView.creativeTemplate_id" v-show="preView.style === 'three'" class="bg-phone phone-template3">
              <div class="title">{{fieldSetting.title}}</div>
              <div class="image-content g-flex">
                <div class="bg-image">
                  <img v-show="pic31_img" :src="pic31_img" alt="广告预览" class="image">
                </div>
                <div class="bg-image">
                  <img v-show="pic32_img" :src="pic32_img" alt="广告预览" class="image">
                </div>
                <div class="bg-image">
                  <img v-show="pic33_img" :src="pic33_img" alt="广告预览" class="image">
                </div>
              </div>
              <div class="desc">
                <Icon type="volume-high"></Icon>
                <span class="item">推广</span>
                <span class="item">刚刚</span>
                <span class="item">{{fieldSetting.source}}</span>
              </div>
              <div class="phone-foot"></div>
            </div>
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
// import unitbyid from '../simple/unitbyid'
// import getCampaignNameList from '../simple/getCampaignNameList'
// import creativeTemplates from '../simple/creativeTemplates'
import Axios from '@/api/index'
import { deepClone } from '@/utils/DateShortcuts.js'
import util from '@/utils/index'
const ERR_OK = 1
export default {
  // 图片模板类型： 大图：big，小图：small，三图：three
  data() {
    return {
      isEdit: false, // 判断当前推广计划状态：true为编辑状态，false为新建状态
      campaignNameList: [], // 计划名称列表
      campaignName: '', // 当前计划名称
      adgroupName: '', // 当前单元名称
      currCreativeList: [], // 当前创意列表
      creativeTemplates: [], // 当前创意模板
      currCreativeTemplates: {
        adgroup_id: '',
        creativeTemplate_id: '',
        creativeTemplateName: '',
        content: {},
        image: [],
        imageSize: '',
        style: ''
      }, // 当前创意模板 的 id
      creativeTemplatesFieldsList: [], // 当前创意模板 的 fields 字段
      accountId: this.$route.query.account,
      campaignId: this.$route.query.campaign_id,
      adgroupId: this.$route.query.adgroup_id,
      creativeId: this.$route.query.creative,
      paused: 1,
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
        clickMonitorUrl: '', // 点击URL
        wildcardIds: 0,
        content: {}
      },
      fieldSetting: {
        app_name: '贪玩', // APP名称
        title: '贪玩',
        source: '贪玩', // 推广来源
        scheme_url: 'http://www.tanwan.com', // 直达链接
        target_url: 'http://www.tanwan.com', // 点击URL
        description: 'http://www.tanwan.com' // 描述
      },
      pic1_img: '',
      pic2_img: '',
      pic31_img: '',
      pic32_img: '',
      pic33_img: '',
      isTitleErr: false,
      isSourceErr: false,
      isUrlErr: false,
      isImageErr: false,
      image: {
        name: 'img',
        type: 'string',
        size: 90,
        format: '*.jpg|*.png',
        width: 640,
        height: 300
      },
      imageResp: {
        image_id1: '',
        srcImageUrl1: '',
        image_id2: '',
        srcImageUrl2: '',
        image_id31: '',
        srcImageUrl31: '',
        image_id32: '',
        srcImageUrl32: '',
        image_id33: '',
        srcImageUrl33: ''
      },
      actionUrl: ''
    }
  },
  methods: {
    handleSuccess31(filte) {
      console.log('handleSuccess31')
      if (filte.ret == '1') {
        console.log('Success', filte)
        let img = filte.data;
        this.imageResp.image_id31 = img.image_id
        this.imageResp.srcImageUrl31 = img.srcImageUrl
        this.pic31_img = img.srcImageUrl    
      }
      if (filte.ret == '-1') {
        this.$Notice.warning({
          desc: filte.msg
        })
      }
    },
    handleSuccess32(filte) {
      console.log('handleSuccess32')
      if (filte.ret == '1') {
        console.log('Success', filte)
        let img = filte.data
        this.imageResp.image_id32 = img.image_id
        this.imageResp.srcImageUrl32 = img.srcImageUrl
        this.pic32_img = img.srcImageUrl
      }
      if (filte.ret == '-1') {
        this.$Notice.warning({
          desc: filte.msg
        })
      }
    },
    handleSuccess33(filte) {
      console.log('handleSuccess33')
      if (filte.ret == '1') {
        console.log('Success', filte)
        let img = filte.data
        this.imageResp.image_id33 = img.image_id
        this.imageResp.srcImageUrl33 = img.srcImageUrl
        this.pic33_img = img.srcImageUrl
      }
      if (filte.ret == '-1') {
        this.$Notice.warning({
          desc: filte.msg
        })
      }
    },
    handleSuccess(filte) {
      if (filte.ret == '1') {
        console.log('Success', filte)
        let img = filte.data
        this.creativeTemplatesFieldsList.forEach(simple => {
          if (
            simple.creativeTemplate_id ===
            this.creativeSetting.creativeTemplate_id
          ) {
            if ('big' === simple.style) {
              console.log('big')
              this.imageResp.image_id1 = img.image_id
              this.imageResp.srcImageUrl1 = img.srcImageUrl
              this.pic1_img = img.srcImageUrl
            } else if ('small' === simple.style) {
              console.log('small')
              // this.imageResp.image_id1 = img.image_id
              // this.imageResp.srcImageUrl1 = img.srcImageUrl
              // this.pic1_img = img.srcImageUrl
              this.imageResp.image_id2 = img.image_id
              this.imageResp.srcImageUrl2 = img.srcImageUrl
              this.pic2_img = img.srcImageUrl
            }
          }
        });
        console.log('this.pic1_img', this.creativeSetting.creativeTemplate_id, this.pic1_img)
        return
      }
      if (filte.ret == '-1') {
        this.$Notice.warning({
          desc: filte.msg
        })
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件' + file.name + '格式不正确，请选择图片文件。'
      })
    },
    defaultList(list) {
      console.log('defaultList', list)
    },
    handleBeforeUpload(file) {
      console.log(
        'handleBeforeUpload',
        this.actionUrl,
        file,
        file.size,
        typeof file.size
      )
      // console.log(file)
      // console.log(this.imgSize)
      // this.$Notice.warning({
      //     title: '文件准备上传',
      //     desc: '文件 ' + file.name + ' 准备上传。'
      // })
    },
    handleProgress(event, file) {
      // this.loading = true
      // this.percent = event.percent
      // if (event.percent === 100) {
      //     this.loading = false
      // }
      //console.log(event.percent)
      // this.$Notice.info({
      //     title: '文件正在上传',
      //     desc: '文件 ' + file.name + ' 正在上传。'
      // })
    },
    handleMaxSize(file) {
      //  console.log('handleMaxSize', this.actionUrl, file.size, typeof file.size)
      // this.$Notice.warning({
      //     title: '超出文件大小限制',
      //     desc:
      //         '文件' +
      //         file.name +
      //         '太大，不能超过' +
      //         this.imgSize +
      //         'KB。'
      // })
    },
    handleError(event, file) {
      this.$Notice.error({
        title: '文件上传失败',
        desc: '文件' + file.name + '上传失败。'
      })
    },
    // 获取字符长度
    getByteLen(str) {
      let len = 0
      for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i)
        if (char.match(/[^\x00-\xff]/gi) !== null) {
          len += 2
        } else {
          len += 1
        }
      }
      return len
    },
    handleCloseMask(e) {
      switch (this.currCreativeTemplates.style) {
        case 'big':
        this.pic1_img = ''
        break
        case 'small':
        this.pic1_img = ''
        this.pic2_img = ''
        break
        case 'three':
        this.pic31_img = ''
        this.pic32_img = ''
        this.pic33_img = ''
        break
      }
      // const parCls = 'mask'
      // let currParDOM = e.target.parentNode
      // currParDOM.style.display = 'none'
    },
    handleDescription(currStr) {
      console.log('handleDescription', currStr)
    },
    handleMonitorUrl(currStr) {
      console.log('handleMonitorUrl', currStr)
      const len = [1024]
      const reg = /^(http:\/\/|https:\/\/)/
      let currLen = this.getByteLen(currStr)
      if (len[0] < currLen) {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: '点击URL字符长度不能大于1024个字符'
        })
        this.isUrlErr = true
      } else {
        this.isUrlErr = false
      }
      if (reg.test(currStr)) {
        this.isUrlErr = false
      } else {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: 'URL必须以http或https开头'
        });
        this.isUrlErr = true
      }
      this.creativeSetting.clickMonitorUrl = currStr
    },
    handleSchemeUrl(currStr) {
      console.log('handleSchemeUrl', currStr)
      const len = [1024];
      const reg = /^(http:\/\/|https:\/\/)/
      let currLen = this.getByteLen(currStr)
      if (len[0] < currLen) {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: '点击URL字符长度不能大于1024个字符'
        })
        this.isUrlErr = true
      } else {
        this.isUrlErr = false
      }
      if (reg.test(currStr)) {
        this.isUrlErr = false
      } else {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: 'URL必须以http或https开头'
        });
        this.isUrlErr = true
      }
      this.fieldSetting.scheme_url = currStr
    },
    handleSource(currStr) {
      console.log('handleSource', currStr)
      const len = [1, 16]
      let currLen = this.getByteLen(currStr)
      if (len[0] > currLen) {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: '推广来源字符长度不能低于1个字符'
        })
        this.isSourceErr = true
      } else if (len[1] < this.getByteLen(currStr)) {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: '推广来源字符长度不能大于16个字符'
        })
        this.isSourceErr = true
      } else {
        this.isSourceErr = false
      }
      this.fieldSetting.source = currStr
    },
    handleTitle(currStr) {
      const len = [10, 70]
      let currLen = this.getByteLen(currStr)
      if (len[0] > currLen) {
        this.$Notice.warning({
          title: '温馨提示：',
          desc: '标题字符长度不能低于10个字符'
        })
        this.isTitleErr = true
      } else if (len[1] < this.getByteLen(currStr)) {
        this.isTitleErr = true
      } else {
        this.isTitleErr = false
      }
      this.fieldSetting.title = currStr
    },
    handleAppName(currStr) {
      console.log('handleAppName', currStr)
    },
    handleTargetURL(currStr) {
      console.log('handleTargetURL', currStr)
    },
    handleField(e) {
      let tarName = e.target.placeholder
      let currValue = e.target.value
      switch (tarName) {
        case '标题':
          this.handleTitle(currValue)
          break
        case '推广来源':
          this.handleSource(currValue)
          break
        case '点击URL':
          this.handleTargetURL(currValue)
          break
        case '直达链接':
          this.handleSchemeUrl(currValue)
          break
        case 'APP名称':
          this.handleAppName(currValue)
          break
        case '描述':
          this.handleDescription(currValue)
          break
        case '监控URL':
          this.handleMonitorUrl(currValue)
          break
      }
    },
    initCurrCreativeTemplates(id) {
      this.creativeTemplatesFieldsList.forEach(vp => {
        if (id === vp.creativeTemplate_id) {
          this.currCreativeTemplates = vp
        }
      })
    },
    handleChangeTemplate(id) {
      console.log('id', id, typeof id, this.creativeTemplates)
      this.initCurrCreativeTemplates(id)
      console.log('currCreativeTemplates', this.currCreativeTemplates)
      this.initImageInfo(this.currCreativeTemplates)
    },
    // 初始化上传图片信息
    initImageInfo(currTemp) {
      console.log('currTemp', currTemp)
      if (!currTemp) {
        return
      }
      const imageSize = currTemp.imageSize.split('*')
      this.image.width = parseInt(imageSize[0])
      this.image.height = parseInt(imageSize[1])
      this.image.size = currTemp.image[0].size
      this.actionUrl =
        'http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=' +        
        this.accountId +
        '&target_width=' +
        this.image.width +
        '&target_height=' +
        this.image.height +
        '&sessionid=' + util.getItem('sessionid');
      console.log(
        'initImageInfo',
        this.image.width,
        this.image.height,
        this.actionUrl
      )
    },
    // 初始化创意 编辑 状态下的数据
    initEditIdea(currCreativeList) {
      this.accountId = currCreativeList.account_id
      this.adgroupId = currCreativeList.adgroup_id
      this.campaignId = currCreativeList.campaign_id
      this.creativeSetting.account_id = currCreativeList.account_id
      this.creativeSetting.adgroup_id = currCreativeList.adgroup_id
      this.creativeSetting.campaign_id = currCreativeList.campaign_id
      this.creativeSetting.videoId = currCreativeList.videoId ? this.currCreativeList.videoId : '0'
      this.creativeSetting.creativeTemplate_id = currCreativeList.creativeTemplate_id
      this.creativeSetting.clickMonitorUrl = currCreativeList.clickMonitorUrl
      this.creativeSetting.wildcardIds = currCreativeList.wildcardIds
      this.creativeSetting.appId = currCreativeList.appId
      this.creativeSetting.channelApkId = currCreativeList.channelApkId
      this.paused = currCreativeList.paused
      const content = JSON.parse(currCreativeList.content)
      this.fieldSetting.app_name = content.app_name
      this.fieldSetting.title = content.title
      this.fieldSetting.source = content.source
      this.fieldSetting.scheme_url = content.scheme_url
      this.fieldSetting.target_url = content.target_url
      this.fieldSetting.description = content.description

      this.initCurrCreativeTemplates(this.creativeSetting.creativeTemplate_id)
      console.log('currCreativeTemplates', this.currCreativeTemplates)
      this.initImageInfo(this.currCreativeTemplates)
      switch (this.currCreativeTemplates.style) {
        case 'big':
          this.pic1_img = content.pic1_img
          break
        case 'small':
          this.pic1_img = content.pic1_img
          this.pic2_img = content.pic2_img
          break
        case 'three':
          this.pic1_img = content.pic1_img
          this.pic2_img = content.pic2_img
          this.pic3_img = content.pic3_img
          break
      }
      console.log(
        '根据id获取创意内容this.currCreativeList',
        this.creativeSetting,
        this.currCreativeList
      )
    },
    // 根据id获取创意内容
    getCurrCreativeList() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getCreativeById',
        id: this.currId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            let getCurrCreativeList = res.data
            getCurrCreativeList.forEach(c => {
              if (c.creative_id === this.creativeId) {
                this.currCreativeList = c
              }
            });
            this.initEditIdea(this.currCreativeList)
          }
        })
        .catch(err => {
          console.log('获取创意内容错误：' + err)
        })
      // 本地测试
      // this.currCreativeList = unitbyid.data[0].adgroup_name
    },
    // 获取单元名称列表
    getAdgroupNameList() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getAdgroupById',
        adgroup_id: this.adgroupId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            const unit = res.data[0];
            this.adgroupName = unit.adgroup_name;
            console.log('获取单元名称列表', unit, this.adgroupName)
          }
        })
        .catch(err => {
          console.log('获取单元名称列表错误：' + err)
        })
      // 本地测试
      // this.adgroupName = unitbyid.data[0].adgroup_name
    },
    // 获取计划名称
    getCampaignName() {
      this.campaignNameList.forEach(campaign => {
        if (campaign.campaign_id === this.campaignId) {
          console.log('获取计划名称', campaign.campaign_name)
          this.campaignName = campaign.campaign_name
        }
      })
    },
    // 获取计划名称列表
    getCampaignNameList() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getCampaignNameList'
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            this.campaignNameList = res.data
            this.getCampaignName()
          }
        })
        .catch(err => {
          console.log('获取计划名称列表错误：' + err)
        })
      // 本地测试
      // this.campaignNameList = getCampaignNameList.data;
      // this.getCampaignName();
    },
    // 获取广告样式列表
    getCreativeTemplates() {
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getCreativeTemplates',
        adgroup_id: this.adgroupId,
        account_id: this.accountId
      })
        .then(res => {
          if (ERR_OK === res.ret) {
            if (res.data.length < 1) {
              location.reload()
            }
            console.log('广告样式列表===== getCreativeTemplates', res.data)
            this.creativeTemplates = res.data
            this.creativeSetting.creativeTemplate_id = res.data[0].creativeTemplateId

            res.data.forEach((vp, ip) => {
              this.creativeTemplatesFieldsList.push({
                id: vp.id,
                adgroup_id: vp.adgroup_id,
                creativeTemplate_id: vp.creativeTemplateId,
                creativeTemplateName: vp.creativeTemplateName,
                content: {},
                image: [],
                imageSize: vp.size,
                style: ''
              })
              if (vp.creativeTemplateName.indexOf('三图') > -1) {
                this.creativeTemplatesFieldsList[ip]['style'] = 'three'
              } else if (vp.creativeTemplateName.indexOf('大图') > -1) {
                this.creativeTemplatesFieldsList[ip]['style'] = 'big'
              } else if (vp.creativeTemplateName.indexOf('小图') > -1) {
                this.creativeTemplatesFieldsList[ip]['style'] = 'small'
              }
              vp.creativeTemplateFields.forEach((vc, ic) => {
                this.creativeTemplatesFieldsList[ip].content[vc.key] = ''
                if (vc.alias === '图片') {
                  this.creativeTemplatesFieldsList[ip].image.push({
                    key: vc['key'],
                    alias: vc['alias'],
                    tips: vc['tips'],
                    size: vc['size']
                  })
                }
              })
            })
            if (this.isEdit) {
              this.getCurrCreativeList()
            }
            console.log(
              '获取广告样式列表',
              this.creativeTemplates,
              this.creativeTemplatesFieldsList
            )
            this.$Message.success('获取广告样式列表数据更新成功')
          }
        })
        .catch(err => {
          console.log('获取广告样式列表错误：' + err)
        })
      // 本地测试
      // this.creativeTemplates = creativeTemplates.data;
      // this.creativeSetting.creativeTemplate_id = creativeTemplates.data[0].creativeTemplateId

      // creativeTemplates.data.forEach((vp, ip) => {
      //   this.creativeTemplatesFieldsList.push({
      //     creativeTemplate_id: vp.creativeTemplateId,
      //     creativeTemplateName: vp.creativeTemplateName,
      //     content: {},
      //     image: [],
      //     style: '',
      //     size: vp.size
      //   })
      //   if (vp.creativeTemplateName.indexOf('三图') > -1) {
      //     this.creativeTemplatesFieldsList[ip]['style'] = 'three'
      //   } else if (vp.creativeTemplateName.indexOf('大图') > -1) {
      //     this.creativeTemplatesFieldsList[ip]['style'] = 'big'
      //   } else if (vp.creativeTemplateName.indexOf('小图') > -1) {
      //     this.creativeTemplatesFieldsList[ip]['style'] = 'small'
      //   }
      //   vp.creativeTemplateFields.forEach((vc, ic) => {
      //     this.creativeTemplatesFieldsList[ip].content[vc.key] = ''
      //     if (vc.alias === '图片') {
      //       this.creativeTemplatesFieldsList[ip].image.push({
      //         key: vc['key'],
      //         alias: vc['alias'],
      //         tips: vc['tips'],
      //         size: vc['size']
      //       })
      //     }
      //   })
      // })
      // if (this.isEdit) {
      //   this.getCurrCreativeList()
      // }
      // console.log(
      //   '获取广告样式列表',
      //   this.creativeTemplates,
      //   this.creativeTemplatesFieldsList
      // )
      // this.$Message.success('获取广告样式列表数据更新成功')
    },
    getImageField(templateId) {
      let retContent = {};
      this.creativeTemplatesFieldsList.forEach(field => {
        if (field.creativeTemplate_id === templateId) {
          for (let k in field.content) {
            retContent[k] = this.fieldSetting[k]
            // 判断是否三图
            if ('three' === field.style) {
              if ('pic1_img' === k) {
                retContent[k] = this.pic31_img
              }
              if ('pic2_img' === k) {
                retContent[k] = this.pic32_img
              }
              if ('pic3_img' === k) {
                retContent[k] = this.pic33_img
              }
            } else {
              if ('pic1_img' === k) {
                retContent[k] = this.pic1_img
              }
            }
          }
        }
      })
      console.log('getImageField', retContent)
      return retContent;
    },
    // 新建创意
    addIdea() {
      let creative = deepClone(this.creativeSetting)
      Object.assign(creative.content, this.getImageField(this.creativeSetting.creativeTemplate_id))
      let addParams = Object.assign({}, creative, {
        action: 'ucAdPut',
        opt: 'addCreative',
        campaign_id: parseInt(this.$route.query.campaign_id)
      })
      console.log('新建创意参数', creative, addParams);
      Axios.post('api.php', addParams)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeId = res.data.creative_id;
            console.log('新建创意id', this.creativeId)
            this.$Message.success('新建推广创意成功')
          }
        })
        .catch(err => {
          console.log('新建推广创意错误：' + err)
        })
    },
    // 编辑创意
    updateIdea() {
      let creative = deepClone(this.creativeSetting)
      Object.assign(
        creative.content,
        this.getImageField(this.creativeSetting.creativeTemplate_id)
      )
      let updateParams = Object.assign({}, creative, {
        action: 'ucAdPut',
        opt: 'updateCreative',
        creative_id: this.creativeId,
        campaign_id: parseInt(this.creativeSetting.campaign_id),
        videoId: parseInt(this.creativeSetting.videoId),
        creativeTemplate_id: parseInt(this.creativeSetting.creativeTemplate_id),
        appId: 0,
        channelApkId: 0,
        paused: parseInt(this.paused)
      })
      console.log('编辑创意参数', updateParams)
      Axios.post('api.php', updateParams)
        .then(res => {
          if (ERR_OK === res.ret) {
            this.creativeId = res.data.creative_id
            console.log('编辑创意id', this.creativeId)
            this.$Message.success('编辑创意成功')
            this.handleGoBack()
          }
        })
        .catch(err => {
          console.log('编辑创意错误：' + err)
        })
    },
    // 返回提交创意
    handleSumbit() {
      if (this.isEdit) {
        this.updateIdea()
      } else {
        this.addIdea()
      }
    },
    // 返回上级路由
    handleGoBack() {
      this.$router.go(-1)
    },
    // 获取account信息
    getAccountInfo() {
      let query = this.$route.query;
      this.creativeSetting.account_id = query.account
      this.creativeSetting.adgroup_id = query.adgroup_id
      this.creativeSetting.campaign_id = query.campaign_id
      // console.log("getAccountInfo", this.creativeSetting, this.$route.query.id)
      if (query.edit && query.edit === '1') {
        this.isEdit = true
        this.currId = this.$route.query.id
      } else {
        this.isEdit = false
      }
    }
  },
  mounted() {
    this.actionUrl =
      'http://ads.tanwan.com/api.php?action=ucAdPut&opt=adsimg_doadd&account_id=' +        
      this.accountId +
      '&target_width=' +
      this.image.width +
      '&target_height=' +
      this.image.height +
      '&sessionid=' + util.getItem('sessionid')
  },
  created() {
    this.getAccountInfo()
    this.getCreativeTemplates()
    this.getCampaignNameList()
    this.getAdgroupNameList()
  },
  components: {}
}
</script>
