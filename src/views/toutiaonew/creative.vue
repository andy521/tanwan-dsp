<style>
@import "./style.less";
.location .ivu-checkbox{
    float: right;
}
</style>
<style scoped>    
    .tab .ivu-tabs-bar{
        border: none;
    }
    .tab .ivu-tabs-tab{
        border: 1px solid #e8e8e8;
    }
    .location{
        border: 1px solid #e8e8e8;
        width: 320px;
    }
    .location .hd{
        background-color: #fafafa;
        border-bottom: 1px solid #e8e8e8;
        padding: 10px 16px;
        position: relative;
    }
    .location .bd{
        padding: 10px 0;
        max-height: 300px;
        overflow-y: scroll;
        position: relative;
    }
    .location .ivu-checkbox-group-item{
        display: block;
        padding: 7px 10px 7px 25px;
        font-size: 14px;        
    }
    .location .sele{
        cursor: pointer;
        position: absolute;
        left:0;
        top:9px;
        width:35px;
        height: 35px;
        line-height:35px;
        text-align: center;
    }  
</style>
<template>
    <div class="toutiaonew">
        <!-- 导行 -->
        <side-bar :step="3"></side-bar>
        <Card dis-hover>
            <div class="newtt">
                <div class="title">投放目标  <span @click="addDescModel = true" class="sm">广告位说明 <Icon  style="cursor:pointer;" type="document-text"></Icon></span></div>
                <Row class="margin-top-10" style="margin-left:120px">
                    <Col span="16">
                        <p class="gray f12">建议您选择所有可选广告位，否则会减少覆盖人数，导致广告失去部分优质展示机会</p>                        
                        <div class="margin-top-10">
                            <div class="location">
                                <div class="hd">位置选择</div>
                                <div class="bd">
                                    <div @click="seleTuotiao" class="sele"><Icon size="10" :type="iconType"></Icon></div>
                                    <Checkbox @on-change="selectToutiao" class="ivu-checkbox-group-item" v-model="locationSelectTt">
                                        今日头条系
                                    </Checkbox> 
                                    <Checkbox-group @on-change="locationChange" v-model="locationSelect">                                                                        
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

        <Card dis-hover  class="margin-top-10">
            <div class="newtt">
                <div class="title">添加创意素材  <span @click="specialModel = true" class="sm">创意标题特殊符号说明 <Icon  style="cursor:pointer;" type="document-text"></Icon></span></div>
                <Row class="margin-top-20">
                    <Col span="16">
                        <Form :label-width="120" :model="materialData">
                            <Form-item>
                                <div slot="label">
                                    <Tooltip content="火山小视频仅支持竖版视频，西瓜视频仅支持大图，横版视频，PC投放仅支持小图，大图" placement="top">
                                        <Icon type="ios-help-outline" size="18" color="#999"></Icon>
                                    </Tooltip>
                                    上传创意素材
                                    <b class="red">*</b>
                                </div>
                                <RadioGroup @on-change="currentMaterial" v-model="materialIndex" type="button" size="large">
                                    <Radio label="0">小图</Radio>
                                    <Radio label="1">大图</Radio>
                                    <Radio label="2">组图</Radio>
                                    <Radio label="3">视频</Radio>
                                </RadioGroup>
                                <div class="margin-top-20">
                                    <keep-alive> 
                                        <component :is="material"></component>
                                    </keep-alive>
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
                                <Select v-model="materialData.adjunction" style="width:200px">
                                    <Option v-for="item in adjunctionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <div class="margin-top-8">
                                    <Checkbox v-model="materialData.comment">关闭广告评论</Checkbox>  
                                </div>
                                <div>
                                    <Checkbox v-model="materialData.comment_video">关闭视频详情页落地页</Checkbox>  
                                    <Tooltip content="勾选该选项后，视频详情页中不默认弹出落地页，仅对视频广告生效" placement="top">
                                        <Icon type="ios-help-outline" size="18" color="#999"></Icon>
                                    </Tooltip>
                                </div>                                         
                            </Form-item>
                        </Form>
                    </Col>
                    <Col span="8">
                        fdsfds
                    </Col>
                </Row>
            </div>            
        </Card>

        <Card dis-hover  class="margin-top-10">
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
                                <creative-category @on-change="handleCategoryChange" :category="ad_category"></creative-category>
                            </Form-item>
                            <Form-item>
                                <div slot="label">
                                    <Tooltip content="请提供若干准确的词语，描述您的广告主体对的产品或服务的属性。长期将非常有助于提高广告预估点击率的精准性。如金属保险的基金，可以通过基金品牌，风险的等级，金融服务等方面的描述，越全面，精准，效果越好。例如：XX基金，中高风险，股票型." placement="top">                              
                                        <Icon type="ios-help-outline" size="18" ></Icon>
                                    </Tooltip>
                                    创意标签
                                    <b class="red">*</b>
                                </div>
                                <creative-tag @on-change="handleTagChange" :tags="ad_keywords"></creative-tag>
                            </Form-item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <Card dis-hover  class="margin-top-10">
            <div class="newtt">
                <div class="title">设置广告监测</div>
                <Row class="margin-top-20">
                    <Col span="16">
                        <Form :label-width="120" :model="monitorData">
                            <Form-item>
                                <div slot="label">
                                    第三方展示监控链接
                                    <Tooltip content="用于监测广告点击的效果" placement="top">                              
                                        <Icon type="ios-help-outline" size="18" ></Icon>
                                    </Tooltip>
                                </div>
                                <Input v-model="monitorData.reveal" placeholder="请输入链接"></Input>
                            </Form-item>
                            <Form-item>
                                <div slot="label">
                                    第三方点击监控链接
                                    <Tooltip content="用于监测广告的点击效果" placement="top">                              
                                        <Icon type="ios-help-outline" size="18" ></Icon>
                                    </Tooltip>
                                </div>
                                <Input v-model="monitorData.click" placeholder="请输入链接"></Input>
                            </Form-item>
                            <Form-item label="视频播放第三方监控链接">
                                <Input v-model="monitorData.playing" placeholder="请输入链接"></Input>
                            </Form-item>
                            <Form-item label="视频播完第三方监控链接">
                                <Input v-model="monitorData.playend" placeholder="请输入链接"></Input>
                            </Form-item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </Card>

        <div class="margin-top-20">
            <div class="newtt tc">
                <Button type="primary" size="large" @click="submitCreative()">提交</Button>
            </div>
        </div>

        <Modal v-model="addDescModel" width="1000px" title="广告位说明">
            <table class="table tc">
                <thead>
                    <tr>
                        <th>应用名称</th>
                        <th>选项归属</th>
                        <th>广告位名称</th>
                        <th>广告位说明</th>
                        <th>广告优势</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="5">今日头条</td>
                        <td rowspan="3">信息流</td>
                        <td>头条信息流</td>
                        <td>位于今日头条各频道刷新后的信息流内容当中</td>
                        <td>样式原生，信息流内容入口，即刷即有</td>
                    </tr>
                    <tr>
                        <td>视频相关推荐</td>
                        <td>位于视频内容页底部相关推荐信息流内容当中</td>
                        <td>样式原生，广告平均曝光时间长</td>
                    </tr>
                    <tr>
                        <td>视频后贴片</td>
                        <td>位于视频广告尾帧</td>
                        <td>与视频内容紧密连接，广告有效观看率高</td>
                    </tr>
                    <tr>
                        <td rowspan="2">详情页</td>
                        <td>头条详情页</td>
                        <td>位于原生资讯内容页底部，评论上方</td>
                        <td>支持文章分类定向，贴合用户阅读场景</td>
                    </tr>
                    <tr>
                        <td>组图详情页</td>
                        <td>位于原生组图内容最后一张图片位置</td>
                        <td>内容醒目，广告呈现力强</td>
                    </tr>
                    <tr>
                        <td>西瓜视频</td>
                        <td>西瓜视频</td>
                        <td>西瓜信息流</td>
                        <td>位于西瓜视频各频道刷新后的信息流内容当中</td>
                        <td>样式原生，信息流内容入口，即刷即有</td>
                    </tr>
                </tbody>
            </table>
            <table class="table tc margin-top-20">
                <thead>
                    <tr>
                        <th>头条信息流</th>
                        <th>视频相关推荐</th>
                        <th>视频后贴片</th>
                        <th>头条详情页</th>
                        <th>组图详情页</th>
                        <th>西瓜信息流</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/toutiao_feed_44c7133.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_recommend_160130c.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_post_f9afe09.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/toutiao_detail_b50954d.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/group_detail_f9ac6cb.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_feed_0af0836.png"></td>
                    </tr>
                </tbody>
            </table>
        </Modal>

        <Modal v-model="specialModel" width="1000px" title="创意标题特殊符号说明">
            <img width="100%" src="https://p3.pstatp.com/origin/353c0020e662a48ef2f8.png">
        </Modal>
    </div>    
</template>

<script>
import Axios from "@/api/index";
import sideBar from "./components/sideBar.vue";
import materialBigImg from "./components/materialBigImg.vue";
import materialSmallImg from "./components/materialSmallImg.vue";
import materialGroupImg from "./components/materialGroupImg.vue";
import materialVideo from "./components/materialVideo.vue";
import creativeCategory from "./components/creativeCategory.vue";
import creativeTag from "./components/creativeTag.vue";
export default {
    components: {
        sideBar,
        materialBigImg,
        materialSmallImg,
        materialGroupImg,
        materialVideo,
        creativeCategory,
        creativeTag
    },
    data() {
        return {
            // toutiaoConfig: toutiaoConfig,
            // id: this.$route.query.id, //行id
            // campaign_id: "", //广告组id
            account_id:this.$route.query.account_id, //账户id
            addDescModel:false,
            locationSelectTt:true,
            showTt :false, //显示头条位置详情
            seleStatue:true,
            iconType:'chevron-right',
            locationSelect:['INVENTORY_FEED','INVENTORY_TEXT_LINK','INVENTORY_VIDEO_FEED','INVENTORY_HOTSOON_FEED','INVENTORY_AWEME_FEED'],   //位置选择            
            specialModel:false, //创意标题特殊符号说明     
            material:'materialSmallImg', // 创意素材默认选择  
            materialIndex : '0',      
            materialData:{ //添加创意素材
                source:'',
                adjunction:'',
                comment:false,
                comment_video:true,
            },
            adjunctionList:[{value: 'ATTACHED_CREATIVE_NONE',label: '无'},{value: 'ATTACHED_CREATIVE_PHONE',label: '电话拨打'},{value: 'ATTACHED_CREATIVE_FORM',label: '表单收集'}], //附加创意类型
            sortData:{ //设置创意分类和标签
                sort:'',
                tag:''
            },
            monitorData:{  //设置广告监测
                reveal:'',
                click:'',
                playing:'',
                playend:''
            },
            ad_keywords: [], // 创意标签
            ad_category: -1 // 	创意分类
        };
    },
    mounted() {
       
    },
    methods: {
        // 创意分类 change
        handleCategoryChange(value) {
            this.ad_category = value
        },
        // 创意标签 change
        handleTagChange(tagList) {
            this.ad_keywords = tagList
        },
        //投放目标 -- 今日头条系展示与隐藏
        seleTuotiao(){
            if(this.seleStatue){
                this.iconType = 'chevron-down';
                this.showTt = true;
            }else{
                this.iconType = 'chevron-right';
                this.showTt = false;
            }
            this.seleStatue = !this.seleStatue;
            console.log(this.locationSelect)
        },
        //投放目标 -- 今日头条系选择
        selectToutiao(val){
            let locat = this.locationSelect,
                i = locat.length;
            
            if(val){
                locat.splice(0,0,'INVENTORY_FEED','INVENTORY_TEXT_LINK')
            }else{
                while(i--){
                    if( locat[i]=='INVENTORY_FEED' || locat[i]=='INVENTORY_TEXT_LINK'){
                        locat.splice(i,1);
                    }
                }
            };
            console.log(locat)
        },
        //投放目标 change
        locationChange(val){
            if(val.indexOf('INVENTORY_FEED') == -1 && val.indexOf('INVENTORY_TEXT_LINK') == -1){
                this.locationSelectTt = false;
            }else{
                this.locationSelectTt = true;
            }
        },
        currentMaterial(val){
            console.log(val)
            switch (val) {
                case "0": this.material = 'materialSmallImg'; break;
                case "1": this.material = 'materialBigImg'; break;
                case "2": this.material = 'materialGroupImg'; break;
                case "3": this.material = 'materialVideo'; break;
            }
            this.materialIndex = val;
        },
        submitCreative(){
            console.log('提交创意')
        }
    }
};
</script>
