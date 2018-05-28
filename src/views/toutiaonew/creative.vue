<style>
@import "./style.less";
.location .ivu-checkbox {
  float: right;
}
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
  padding: 10px 0;
  max-height: 300px;
  overflow-y: scroll;
  position: relative;
}
.location .ivu-checkbox-group-item {
  display: block;
  padding: 7px 10px 7px 25px;
  font-size: 14px;
}
.location .sele {
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 9px;
  width: 35px;
  height: 35px;
  line-height: 35px;
  text-align: center;
}
.panel {
  position: relative;
  min-height: 240px;
}
.list {
  border: 1px solid #ddd;
  float: left;
}
.list li {
  float: left;
  margin: 1px;
  width: 228px;
}

.img {
  height: 138px;
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
}
</style>
<template>
    <div class="toutiaonew">
        <!-- 导行 -->
        <side-bar :step="2"></side-bar>
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
                                <div @click="seleTuotiao" class="sele">
                                    <Icon size="10" :type="iconType"></Icon>
                                </div>
                                <Checkbox @on-change="selectToutiao" class="ivu-checkbox-group-item" v-model="locationSelectTt">
                                    今日头条系
                                </Checkbox>
                                <Checkbox-group @on-change="locationChange" v-model="inventory_type">
                                    <Checkbox v-show="showTt" style="margin-left:10px" label="INVENTORY_FEED">头条信息流</Checkbox>
                                    <Checkbox v-show="showTt" style="margin-left:10px" label="INVENTORY_TEXT_LINK">头条详情页</Checkbox>
                                    <Checkbox label="INVENTORY_VIDEO_FEED">西瓜视频</Checkbox>
                                    <Checkbox label="INVENTORY_HOTSOON_FEED">火山小视频</Checkbox>
                                    <Checkbox label="INVENTORY_AWEME_FEED">抖音</Checkbox>
                                </Checkbox-group>
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
                                <Radio :label="item.val_type" v-for="item in toutiaoConfig.image_mode" :key="item.val_type" v-if="item.val_type=='CREATIVE_IMAGE_MODE_SMALL'||item.val_type=='CREATIVE_IMAGE_MODE_LARGE'||item.val_type=='CREATIVE_IMAGE_MODE_GROUP'||item.val_type=='CREATIVE_IMAGE_MODE_VIDEO'">{{item.name}}</Radio>
                            </RadioGroup>

                            <div class="panel margin-top-10">
                                <div class="list" v-for="(it,ind) in image" v-if="it.value==image_mode">
                                    <ul class="clear">
                                        <li v-for="(item,index) in it.imgList">
                                            <div class="img">
                                                <template v-if="item.video_id||item.video_id==''">
                                                    <img :src="item.imgUrl" v-if="item.imgUrl">
                                                    <div class="alt-upload" :class="item.imgUrl? 'alt-upload1':''">
                                                        <Button type="primary">选择视频</Button>
                                                        <p>{{item.desc}}</p>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <img :src="item.imgUrl" v-if="item.imgUrl">
                                                    <div class="alt-upload" :class="item.imgUrl? 'alt-upload1':''">
                                                        <upload-img v-model="item.image_id" :imagemode="it.value" @on-change="getimgid" :ind="ind" :index="index"></upload-img>
                                                        <p>{{item.desc}}</p>
                                                    </div>
                                                </template>
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="caption">
                                        <Input type="textarea" v-model="it.title" :autosize="{minRows: 2,maxRows: 5}" :placeholder="'请输入创意标题'+it.min+'-'+it.max+'个字符'"></Input>
                                        <span class="text-num">{{it.title.length}}/{{it.max}}</span>
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
                            <p class="red">4至20个字符,汉字占两个字符</p>
                        </Form-item>
                        <Form-item label="附加创意">
                            <Select v-model="materialData.advanced_creative_type" style="width:200px">
                                <Option v-for="item in toutiaoConfig.advanced_creative_type" :value="item.val_type" :key="item.val_type">{{ item.name }}</Option>
                            </Select>
                            <div class="margin-top-8">
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
                            fdsfdsfds
                        </Form-item>
                        <Form-item>
                            <div slot="label">
                                <Tooltip content="请提供若干准确的词语，描述您的广告主体对的产品或服务的属性。长期将非常有助于提高广告预估点击率的精准性。如金属保险的基金，可以通过基金品牌，风险的等级，金融服务等方面的描述，越全面，精准，效果越好。例如：XX基金，中高风险，股票型." placement="top">
                                    <Icon type="help-circled" size="14" color="#999"></Icon>
                                </Tooltip>
                                创意分类
                                <b class="red">*</b>
                            </div>
                            fdsfdsfds
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
                <Button type="primary" size="large" @click="submitCreative()">提交</Button>
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
export default {
    components: {
        sideBar,
        uploadImg,
        creativeDescription,
        titleDescription
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            account_id: this.$route.query.account_id,//账户id
            adgroup_id: this.$route.query.adgroup_id,//计划id


            locationSelectTt: true,
            showTt: false, //显示头条位置详情
            seleStatue: true,
            iconType: "chevron-right",

            inventory_type: ["INVENTORY_FEED", "INVENTORY_TEXT_LINK", "INVENTORY_VIDEO_FEED", "INVENTORY_HOTSOON_FEED", "INVENTORY_AWEME_FEED"],   //位置选择            


            selectModal: false,
            image_mode: "CREATIVE_IMAGE_MODE_LARGE",//图片类别


            image: [
                {
                    value: "CREATIVE_IMAGE_MODE_SMALL",
                    imgList: [
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    min: 6,
                    max: 25
                },
                {
                    value: "CREATIVE_IMAGE_MODE_LARGE",
                    imgList: [
                        { desc: '横版大图:宽高比1.78,最低尺寸1280*720,竖版图片:宽高比0.56,最低尺寸720*1280,大小500K以下', image_id: "web.business.image/201805225d0d65531f9f12c74ff892c0", imgUrl: "", }
                    ],
                    title: "",
                    min: 6,
                    max: 25
                },
                {
                    value: "CREATIVE_IMAGE_MODE_GROUP",
                    imgList: [
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", },
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", },
                        { desc: '宽高比1.52,大小500K以下最低尺寸456*300', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    min: 6,
                    max: 25
                },
                {
                    value: "CREATIVE_IMAGE_MODE_VIDEO",
                    imgList: [
                        { desc: '视频码率 >=516kbps，横版分辨率>=1280*720，大小<=1000M，竖版分辨率>=720*1280，大小<=100M', video_id: "" },
                        { desc: '需和视频同比例，大小不超过500K；横版16:9，最低尺寸1280*720，竖版9:16，最低尺寸720*1280', image_id: "", imgUrl: "", }
                    ],
                    title: "",
                    min: 6,
                    max: 25
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
                sort: "",
                tag: ""
            },

            monitorData: {  //设置广告监测
                track_url: "",
                action_track_url: "",
                video_play_track_url: "",
                video_play_done_track_url: "",
                video_play_effective_track_url: ""
            }
        };
    },
    mounted() {
        this.getCreatives();
    },
    methods: {

        //广告创意详情
        getCreatives() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getCreatives',
                id: this.id,
                adcreative_id: this.adcreative_id,

            }).then((res) => {
                if (res.ret === 1) {
                    console.log(res.data)
                }
            }).catch((err) => {
                console.error('广告创意详情', err)
            })
        },
        //图片id
        getimgid(image_id, imgUrl, ind, index) {
            this.image[ind].imgList[index].image_id = image_id;
            this.image[ind].imgList[index].imgUrl = imgUrl;
        },
        //投放目标 -- 今日头条系展示与隐藏
        seleTuotiao() {
            if (this.seleStatue) {
                this.iconType = "chevron-down";
                this.showTt = true;
            } else {
                this.iconType = "chevron-right";
                this.showTt = false;
            }
            this.seleStatue = !this.seleStatue;
        },
        //投放目标 -- 今日头条系选择
        selectToutiao(val) {
            let locat = this.inventory_type,
                i = locat.length;
            if (val) {
                locat.splice(0, 0, "INVENTORY_FEED", "INVENTORY_TEXT_LINK")
            } else {
                while (i--) {
                    if (locat[i] == "INVENTORY_FEED" || locat[i] == "INVENTORY_TEXT_LINK") {
                        locat.splice(i, 1);
                    }
                }
            };
        },
        //投放目标 change
        locationChange(val) {
            if (val.indexOf("INVENTORY_FEED") == -1 || val.indexOf("INVENTORY_TEXT_LINK") == -1) {
                this.locationSelectTt = false;
            } else {
                this.locationSelectTt = true;
            }
        },

        submitCreative() {
            let param = {
                action: "ttAdPut",
                opt: "judgeCreative",
                account_id: this.account_id,
                adgroup_id: this.adgroup_id,
                inventory_type: inventory_type,//创意投放位置

                track_url: this.monitorData.track_url,
                action_track_url: this.monitorData.action_track_url,
                video_play_track_url: this.monitorData.video_play_track_url,
                video_play_done_track_url: this.monitorData.video_play_done_track_url,
                video_play_effective_track_url: this.monitorData.video_play_effective_track_url
            }

            console.log(param)

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
    }
};
</script>
