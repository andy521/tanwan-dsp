<style>
@import "./style.less";
</style>
<style scoped>
.location {
  border: 1px solid #e8e8e8;
  width: 320px;
}
.location .hd {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 16px;
  position: relative;
}
.location .bd {
  max-height: 300px;
  overflow-y: scroll;
  position: relative;
  line-height: 36px;
}

.list {
  border: 1px solid #ddd;
  float: left;
}
.list li {
  float: left;
  margin: 1px;
  width: 200px;
}

.img {
  width: 100%;
  position: relative;
  display: block;
  background-color: #e8e8e8;
}

.img img {
  object-fit: contain;
  width: 100%;
  height: 100%;
}
.caption {
  height: 70px;
  padding-bottom: 20px;
  position: relative;
  padding: 4px 9px;
  color: #222;
  font-size: 14px;
}
.text-num {
  position: absolute;
  bottom: 4px;
  right: 9px;
  z-index: 10;
  background: white;
}
.alt-upload {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 12px;
  line-height: 20px;
  text-align: center;
}
.alt-upload1 {
  display: none;
}
.list li:hover .alt-upload1 {
  display: block;
  color: #fff;
}
.item {
  padding: 0 15px;
  cursor: pointer;
  display: block;
}
.item:hover {
  background: #f8f8f8;
}
</style>
<template>
    <div class="toutiaonew">
        <!-- 导行 -->
        <side-bar :step="2"></side-bar>

        <Card dis-hover v-if="!this.adcreative_id" style="margin-bottom:10px">
            <div class="newtt">
                <Row>
                    <Col span="16">
                    <Select size="large" @on-change="getAdgroupsId" filterable>
                        <Option v-for="item in adgroupsList" :value="item.adgroup_id" :key="item.adgroup_id" placeholder="请选择计划id">{{ item.adgroup_name }}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover>
            <div class="newtt">
                <div class="title">
                    <span>投放目标</span>
                    <!-- 广告位说明 -->
                    <creative-description></creative-description>
                </div>
                <Row class="margin-top-10" style="margin-left:120px">
                    <Col span="16">
                    <p class="gray f12">建议您选择所有可选广告位，否则会减少覆盖人数，导致广告失去部分优质展示机会</p>
                    <div class="margin-top-10">
                        <div class="location">
                            <div class="hd">位置选择</div>
                            <div class="bd">
                                <CheckboxGroup v-model="inventory_type">
                                    <label v-for="item in toutiaoConfig.inventory_type" :key="item.val_type" class="item">
                                        <Checkbox :label="item.val_type">{{item.name}}</Checkbox>
                                    </label>
                                </CheckboxGroup>

                            </div>
                        </div>
                    </div>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <div class="title">
                    <span>添加创意素材</span>
                    <!-- 创意标题特殊符号说明 -->
                    <title-description></title-description>
                </div>
                <Row class="margin-top-20">
                    <Col span="16">
                    <Form :label-width="120" :model="materialData">
                        <Form-item>
                            <div slot="label">
                                <Tooltip content="火山小视频仅支持竖版视频，西瓜视频仅支持大图，横版视频，PC投放仅支持小图，大图" placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                                上传创意素材
                                <b class="red">*</b>
                            </div>
                            <RadioGroup v-model="image_mode" type="button" size="large">
                                <Radio :label="item.val_type" v-for="item in toutiaoConfig.image_mode" :key="item.val_type" v-if="item.val_type!='CREATIVE_IMAGE_MODE_GIF'">{{item.name}}</Radio>
                            </RadioGroup>

                            <div class="margin-top-10">
                                <div class="list" v-for="(it,ind) in image" v-if="it.value==image_mode">
                                    <ul class="clear">
                                        <li v-for="(item,index) in it.imgList">
                                            <div class="img" :style="{height: (it.height/it.width*200)+'px'}">
                                                <template v-if="item.video_id||item.video_id==''">
                                                    <img :src="item.imgUrl" v-if="item.imgUrl!=''&&item.video_id!=''">
                                                    <div class="alt-upload" :class="item.video_id? 'alt-upload1':''">
                                                        <div class="margin-top-10">
                                                            <!-- 上传视频 -->
                                                            <uploadVideo :size="it.size" @on-change="getvideoid" :ind="ind" :index="index"></uploadVideo>
                                                            <p class="margin-top-10">{{item.desc}}</p>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <img :src="item.imgUrl" v-if="item.imgUrl!=''">
                                                    <div class="alt-upload" :class="item.imgUrl? 'alt-upload1':''">
                                                        <div class="margin-top-10">
                                                            <!-- 上传图片 -->
                                                            <upload-img v-model="item.image_id" :imagemode="it.value" @on-change="getimgid" :ind="ind" :index="index" :size="it.size" :width="it.width" :height="it.height"></upload-img>
                                                        </div>
                                                        <p class="margin-top-10">{{item.desc}}</p>
                                                    </div>
                                                </template>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="caption">
                                        <Input type="textarea" v-model="it.title" :autosize="{minRows: 2,maxRows: 5}" :placeholder="'请输入创意标题6-25个字符'"></Input>
                                        <span class="text-num">{{it.title.length}}/25</span>
                                    </div>
                                </div>
                            </div>
                        </Form-item>

                        <Form-item>
                            <div slot="label">
                                来源
                                <b class="red">*</b>
                            </div>
                            <Input v-model="materialData.source" placeholder="请输入来源"></Input>
                            <p class="red" v-show="GetCharLength(materialData.source)<4||GetCharLength(materialData.source)>20">4至20个字符,汉字占两个字符</p>
                        </Form-item>
                        <Form-item label="附加创意">
                            <Select v-model="materialData.advanced_creative_type" style="width:200px" v-if="landing_type=='LINK'">
                                <Option v-for="item in toutiaoConfig.advanced_creative_type" :value="item.val_type" :key="item.val_type">{{ item.name }}</Option>
                            </Select>
                            <div>
                                <Checkbox v-model="materialData.is_comment_disable">关闭广告评论</Checkbox>
                            </div>
                            <div>
                                <Checkbox v-model="materialData.close_video_detail">关闭视频详情页落地页</Checkbox>
                                <Tooltip content="勾选该选项后，视频详情页中不默认弹出落地页，仅对视频广告生效" placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                            </div>
                        </Form-item>

                        <Form-item label="创意展现方式">
                            <RadioGroup v-model="materialData.creative_display_mode" type="button" size="large">
                                <Radio :label="item.val_type" v-for="item in toutiaoConfig.creative_display_mode" :key="item.val_type">{{ item.name }}</Radio>
                            </RadioGroup>
                        </Form-item>

                    </Form>
                    </Col>
                    <Col span="8">
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <div class="title">设置创意分类和标签</div>
                <Row class="margin-top-20">
                    <Col span="16">
                    <Form :label-width="120" :model="sortData">
                        <Form-item>
                            <div slot="label">
                                创意分类
                                <b class="red">*</b>
                            </div>
                            <!--  创意分类 -->
                            <creativeCategory @on-change="handleCategoryChange" :category="sortData.ad_category"></creativeCategory>

                        </Form-item>
                        <Form-item>
                            <div slot="label">
                                <Tooltip content="请提供若干准确的词语，描述您的广告主体对的产品或服务的属性。长期将非常有助于提高广告预估点击率的精准性。如金属保险的基金，可以通过基金品牌，风险的等级，金融服务等方面的描述，越全面，精准，效果越好。例如：XX基金，中高风险，股票型." placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                                创意标签
                                <b class="red">*</b>
                            </div>
                            <!-- 创意标签 -->
                            <creativeTag @on-change="handleTagChange" :tags="sortData.ad_keywords"></creativeTag>
                        </Form-item>
                    </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <div class="title">设置广告监测</div>
                <Row class="margin-top-20">
                    <Col span="16">
                    <Form :label-width="170" :model="monitorData">
                        <Form-item>
                            <div slot="label">
                                第三方展示监控链接
                                <Tooltip content="用于监测广告点击的效果" placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                            </div>
                            <Input v-model="monitorData.track_url" placeholder="请输入链接"></Input>
                        </Form-item>
                        <Form-item>
                            <div slot="label">
                                第三方点击监控链接
                                <Tooltip content="用于监测广告的点击效果" placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                            </div>
                            <Input v-model="monitorData.action_track_url" placeholder="请输入链接"></Input>
                        </Form-item>
                        <Form-item label="视频播放第三方监控链接">
                            <Input v-model="monitorData.video_play_track_url" placeholder="请输入链接"></Input>
                        </Form-item>
                        <Form-item label="视频播完第三方监控链接">
                            <Input v-model="monitorData.video_play_done_track_url" placeholder="请输入链接"></Input>
                        </Form-item>
                        <Form-item label="视频有效播放第三方监控链接">
                            <Input v-model="monitorData.video_play_effective_track_url" placeholder="请输入链接"></Input>
                        </Form-item>
                    </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover class="margin-top-10">
            <div class="newtt">
                <Button type="primary" size="large" @click="submitCreative()">
                    <span  v-if="this.adcreative_id" >修改创意</span>
                    <span v-else>新增创意</span>
                </Button>
            </div>
        </Card>

    </div>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
import sideBar from "./components/sideBar.vue";
import creativeDescription from "./components/creativeDescription.vue";
import titleDescription from "./components/titleDescription.vue";
import uploadImg from './components/uploadImg.vue';
import creativeCategory from './components/creativeCategory.vue';
import creativeTag from './components/creativeTag.vue';
import uploadVideo from './components/uploadVideo.vue';
export default {
    components: {
        sideBar,
        uploadImg,
        creativeDescription,
        titleDescription,
        creativeCategory,
        creativeTag,
        uploadVideo
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id,//账户id
            adgroup_id: this.$route.query.adgroup_id,//计划id
            adcreative_id: this.$route.query.adcreative_id,//创意id
            landing_type: this.$route.query.landing_type,
            id: this.$route.query.id,
            adgroupsList: [],
            modify_time: "",
            inventory_type: [],   //位置选择      

            image_mode: "CREATIVE_IMAGE_MODE_LARGE",//图片类别
            image: [
                {
                    value: "CREATIVE_IMAGE_MODE_SMALL",
                    imgList: [
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    width: 456,
                    height: 300,
                    size: 0.5
                },
                {
                    value: "CREATIVE_IMAGE_MODE_LARGE",
                    imgList: [
                        { desc: '宽高比1.78,最低尺寸1280*720,大小500K以下', image_id: "web.business.image/201805225d0d65531f9f12c74ff892c0", imgUrl: "", }
                    ],
                    title: "",
                    width: 1280,
                    height: 720,
                    size: 0.5
                },
                {
                    value: "CREATIVE_IMAGE_MODE_GROUP",
                    imgList: [
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", },
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", },
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    width: 456,
                    height: 300,
                    size: 0.5
                },
                {
                    value: "CREATIVE_IMAGE_MODE_VIDEO",
                    imgList: [
                        { desc: '视频码率 >=516kbps，横版分辨率>=1280*720，大小<=1000M', video_id: "", imgUrl: "" },
                        { desc: '需和视频同比例，大小不超过500K；横版16:9，最低尺寸1280*720', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    width: 1280,
                    height: 720,
                    size: 1000
                },
                {
                    value: "CREATIVE_IMAGE_MODE_LARGE_VERTICAL",
                    imgList: [
                        { desc: '宽高比0.56,最低尺寸720*1280,大小500K以下', image_id: "web.business.image/201805225d0d65531f9f12c74ff892c0", imgUrl: "", }
                    ],
                    title: "",
                    width: 720,
                    height: 1280,
                    size: 0.5
                },
                {
                    value: "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL",
                    imgList: [
                        { desc: '视频码率 >=516kbps，竖版分辨率>=720*1280，大小<=100M', video_id: "", imgUrl: "" },
                        { desc: '需和视频同比例，大小不超过500K；竖版9:16，最低尺寸720*1280', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    width: 720,
                    height: 1280,
                    size: 100
                }
            ],


            materialData: { //添加创意素材
                source: "",
                advanced_creative_type: "ATTACHED_CREATIVE_NONE",
                is_comment_disable: false,//是否关闭评论
                close_video_detail: false,//是否关闭视频详情页落地页
                creative_display_mode: "CREATIVE_DISPLAY_MODE_CTR"
            },

            sortData: { //设置创意分类和标签
                ad_category: "",
                ad_keywords: []
            },

            monitorData: {  //设置广告监测
                track_url: "",
                action_track_url: "",
                video_play_track_url: "",
                video_play_done_track_url: "",
                video_play_effective_track_url: ""
            },

        };
    },
    mounted() {
        this.getCreatives();
        if (!this.adcreative_id) {
            this.getAdgroups();
        }
    },
    methods: {
        // 创意分类 change
        handleCategoryChange(value) {
            this.sortData.ad_category = value;
        },
        // 创意标签 change
        handleTagChange(tagList) {
            this.sortData.ad_keywords = tagList;
        },
        //广告创意详情
        getCreatives() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getCreatives',
                id: this.id,
                adcreative_id: this.adcreative_id,

            }).then((res) => {
                if (res.ret === 1) {
                    this.filldata(res.data.list[0]);
                }
            }).catch((err) => {
                console.error('广告创意详情', err)
            })
        },
        //广告计划称列表
        getAdgroups() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAdgroups',
                account_id: this.account_id,

            }).then((res) => {
                if (res.ret === 1) {
                    this.adgroupsList = res.data;
                }
            }).catch((err) => {
                console.error('广告计划称列表', err)
            })
        },
        //选择谋划id
        getAdgroupsId(id) {
            this.adgroup_id = id;
        },
        filldata(data) {
            this.modify_time = data.modify_time;
            // 投放目标
            this.inventory_type = data.inventory_type.split(",")
            // 添加创意素材
            this.image_mode = data.image_mode;
            this.image.forEach((e, i) => {
                if (data.image_mode == e.value) {
                    if (data.image_mode == "CREATIVE_IMAGE_MODE_VIDEO" || data.image_mode == "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL") {
                        this.image[i].title = data.title;
                        this.image[i].imgList[0].video_id = data.video_id;
                        this.image[i].imgList[0].imgUrl = data.image_info[0].url;
                        this.image[i].imgList[1].image_id = data.image_id;
                        this.image[i].imgList[1].imgUrl = data.image_info[0].url;
                    } else {
                        this.image[i].title = data.title;
                        data.image_ids.forEach((v, j) => {
                            this.image[i].imgList[j].image_id = v;
                            this.image[i].imgList[j].imgUrl = data.image_info[j].url;
                        })
                    }
                }
            })

            this.materialData.source = data.source;
            this.materialData.advanced_creative_type = data.advanced_creative_type;
            this.materialData.is_comment_disable = data.is_comment_disable == "1" ? true : false;
            this.materialData.close_video_detail = data.close_video_detail == "1" ? true : false;
            this.materialData.creative_display_mode = data.creative_display_mode;

            // 设置创意分类和标签
            this.sortData.ad_category = data.ad_category;
            this.sortData.ad_keywords = data.ad_keywords.split(",");
            // 设置广告监测
            this.monitorData.track_url = data.track_url;
            this.monitorData.action_track_url = data.action_track_url;
            this.monitorData.video_play_track_url = data.video_play_track_url;
            this.monitorData.video_play_done_track_url = data.video_play_done_track_url;
            this.monitorData.video_play_effective_track_url = data.video_play_effective_track_url;
        },
        //图片视频id
        getvideoid(video_id, Url, ind, index) {
            let item = this.image[ind].imgList[index];
            item.video_id = video_id;
        },
        //图片id
        getimgid(image_id, imgUrl, ind, index) {
            let item = this.image[ind].imgList[index]
            item.image_id = image_id;
            item.imgUrl = imgUrl;
        },



        submitCreative() {
            let param = {
                action: "ttAdPut",

                account_id: this.account_id,
                adgroup_id: this.adgroup_id,
                inventory_type: this.inventory_type,//创意投放位置

                image_mode: this.image_mode,

                source: this.materialData.source,
                advanced_creative_type: this.materialData.advanced_creative_type,
                is_comment_disable: this.materialData.is_comment_disable,
                close_video_detail: this.materialData.close_video_detail,
                creative_display_mode: this.materialData.creative_display_mode,


                ad_category: this.sortData.ad_category,
                ad_keywords: this.sortData.ad_keywords,

                track_url: this.monitorData.track_url,
                action_track_url: this.monitorData.action_track_url,
                video_play_track_url: this.monitorData.video_play_track_url,
                video_play_done_track_url: this.monitorData.video_play_done_track_url,
                video_play_effective_track_url: this.monitorData.video_play_effective_track_url
            }

            if (this.GetCharLength(this.materialData.source) < 4 || this.GetCharLength(this.materialData.source) > 20) {
                this.$Message.info("来源内容不正确");
                return;
            }
            if (this.sortData.ad_category == "") {
                this.$Message.info("请选择创意分类");
                return;
            }

            if (this.sortData.ad_keywords.length <= 0 || this.sortData.ad_keywords.length > 20) {
                this.$Message.info("请添加创意标签");
                return;
            }


            this.image.forEach((e, i) => {
                if (this.image_mode == e.value) {
                    param.title = e.title;
                    if (this.image_mode == "CREATIVE_IMAGE_MODE_VIDEO" || this.image_mode == "CREATIVE_IMAGE_MODE_VIDEO_VERTICAL") {
                        param.video_id = e.imgList[0].video_id;
                        param.image_id = e.imgList[1].image_id;
                    } else {
                        let ids = [];
                        e.imgList.forEach(v => {
                            ids.push(v.image_id);
                        })
                        param.image_ids = ids;
                    }
                }
            })


            if (this.adcreative_id) {
                param.opt = "judgeCreative";
                param.adcreative_id = this.adcreative_id;
                param.modify_time=this.modify_time
                Axios.post("api.php", param).then(res => {
                    if (res.ret == 1) {
                        this.$router.push({
                            name: "tt_creative",
                        })
                    }
                }).catch(err => {
                    console.log("创意" + err);
                })
            } else {
                param.opt = "judgeCreative";
                Axios.post("api.php", param).then(res => {
                    if (res.ret == 1) {
                        this.$router.push({
                            name: "tt_creative",
                        })
                    }
                }).catch(err => {
                    console.log("创意" + err);
                })
            }





        },
        //字符串
        GetCharLength(str) {
            var iLength = 0;
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    iLength += 2;
                } else {
                    iLength += 1;
                }
            }
            return iLength;
        }
    }
};
</script>
