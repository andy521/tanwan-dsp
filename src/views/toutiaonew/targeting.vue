
<style scoped>
@import "./style.less";
</style>
<template>
    <div class="toutiaonew">
        <!-- 导行 -->
        <side-bar :step="1"></side-bar>

        <Card dis-hover>
            <div class="newtt">
                <Tabs :animated="false">
                    <TabPane label="创建定向">

                        <Row>
                            <Col span="19">
                            <Form :label-width="80" class="margin-top-20" onsubmit="return false;" label-position="left">
                                <FormItem>
                                    <!-- 复制定向 -->
                                    <copy-targeting @on-change="changetargeting" :province="province" :ad_tag="ad_tag" :app_category="app_category" :device_brand="device_brand" :article_category="article_category"></copy-targeting>
                                </FormItem>
                                <FormItem label="定向名字">
                                    <Input v-model="targeting_name" placeholder="请输入定向名字" size="large" style="width:300px;"></Input>
                                </FormItem>
                                <FormItem label="地域">
                                    <RadioGroup v-model="targeting.district" size="large" type="button">
                                        <Radio label="">不限</Radio>
                                        <Radio v-for="item in toutiaoConfig.district" :label="item.val_type" :key="this">{{item.name}}</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <city-tree v-model="targeting.city" v-if="targeting.district=='CITY'"></city-tree>
                                        <county-tree v-model="targeting.city" v-if="targeting.district=='COUNTY'"></county-tree>
                                    </div>
                                </FormItem>

                                <FormItem label="性别">
                                    <RadioGroup v-model="targeting.gender" size="large" type="button">
                                        <Radio v-for="item in toutiaoConfig.gender" :label="item.val_type" :key="this">{{item.name}}</Radio>
                                    </RadioGroup>
                                </FormItem>

                                <FormItem label="年龄">
                                    <RadioGroup v-model="age_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">自定义</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-model="targeting.age" size="large" v-if="age_model=='1'" class="margin-top-10">
                                        <Checkbox v-for="item in toutiaoConfig.age" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                                    </CheckboxGroup>
                                </FormItem>

                                <FormItem label="兴趣分类">
                                    <RadioGroup v-model="ad_tag_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">添加兴趣分类</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <tag-tree v-model="targeting.ad_tag" v-if="ad_tag_model=='1'"></tag-tree>
                                    </div>
                                </FormItem>

                                <FormItem label="兴趣关键词">
                                    <RadioGroup v-model="interest_tags_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">使用关健词</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <interest-tree v-model="targeting.interest_tags" v-if="interest_tags_model=='1'"></interest-tree>
                                    </div>
                                </FormItem>

                                <FormItem label="平台">
                                    <RadioGroup v-model="platform_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">自定义</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-model="targeting.platform" size="large" @on-change="changePlatform" v-if="platform_model=='1'" class="margin-top-10">
                                        <Checkbox v-for="item in toutiaoConfig.platform" :label="item.val_type" :key="this">
                                            {{item.name}}
                                            <Tooltip v-if="item.val_type === 'PC'" placement="top">
                                                <Icon type="help-circled" size="14" color="#999"></Icon>
                                                <div slot="content">
                                                    <div>PC设置提示</div>
                                                    <div>若平台选择PC定向，则其他所有受众定向设置将不生效</div>
                                                </div>
                                            </Tooltip>
                                        </Checkbox>
                                    </CheckboxGroup>
                                </FormItem>

                                <FormItem label="网络">
                                    <RadioGroup v-model="ac_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">自定义</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-model="targeting.ac" size="large" v-if="ac_model=='1'" class="margin-top-10">
                                        <Checkbox v-for="item in toutiaoConfig.ac" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                                    </CheckboxGroup>
                                </FormItem>

                                <FormItem label="运营商">
                                    <RadioGroup v-model="carrier_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">自定义</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-model="targeting.carrier" size="large" v-if="carrier_model=='1'" class="margin-top-10">
                                        <Checkbox v-for="item in toutiaoConfig.carrier" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                                    </CheckboxGroup>
                                </FormItem>

                                <FormItem>
                                    <div slot="label">
                                        <Tooltip content="新用户使用头条的时间" placement="top">
                                            <Icon type="help-circled" size="14" color="#999"></Icon>
                                        </Tooltip>
                                        新用户
                                    </div>
                                    <RadioGroup v-model="activate_type_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">自定义</Radio>
                                    </RadioGroup>
                                    <CheckboxGroup v-model="targeting.activate_type" size="large" v-if="activate_type_model=='1'" class="margin-top-10">
                                        <Checkbox v-for="item in toutiaoConfig.activate_type" :label="item.val_type" :key="this">{{item.name}}</Checkbox>
                                    </CheckboxGroup>
                                </FormItem>

                                <FormItem>
                                    <div slot="label">
                                        <Tooltip content="针对安卓用户手机中app安装与使用情况，判断用户对各类APP的兴趣与需求" placement="top">
                                            <Icon type="help-circled" size="14" color="#999"></Icon>
                                        </Tooltip>
                                        APP行为
                                    </div>
                                    <RadioGroup v-model="targeting.app_behavior_target" size="large" type="button">
                                        <Radio v-for="item in toutiaoConfig.app_behavior_target" :label="item.val_type" :key="this">{{item.name}}</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <app-tree v-model="targeting.app_category" :datas="app_category" v-if="targeting.app_behavior_target=='CATEGORY'"></app-tree>
                                    </div>
                                </FormItem>

                                <FormItem label="手机品牌" v-if="isInArray(targeting.platform,'ANDROID')||targeting.platform.length==0">
                                    <RadioGroup v-model="device_brand_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">按品牌</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <device-tree v-model="targeting.device_brand" :datas="device_brand" v-if="device_brand_model=='1'"></device-tree>
                                    </div>
                                </FormItem>
                                <FormItem>
                                    <div @click="advanced_options=!advanced_options">
                                        <span class="name_text" v-if="advanced_options">隐藏高级选项</span>
                                        <span class="name_text" v-else>显示高级选项</span>
                                    </div>
                                </FormItem>

                                <FormItem v-if="advanced_options">
                                    <div slot="label">
                                        <Tooltip content="只针对投放在详情页位置的广告生效, 不支持人群预估" placement="top">
                                            <Icon type="help-circled" size="14" color="#999"></Icon>
                                        </Tooltip>
                                        文章文类
                                    </div>
                                    <RadioGroup v-model="article_category_model" size="large" type="button">
                                        <Radio label="0">不限</Radio>
                                        <Radio label="1">文章分类</Radio>
                                    </RadioGroup>
                                    <div class="margin-top-10">
                                        <device-tree v-model="targeting.article_category" :datas="article_category" v-if="article_category_model=='1'"></device-tree>
                                    </div>
                                </FormItem>

                                <FormItem>
                                    <Button v-if="targeting_id==''" type="primary" size="large" @click="addTargeting()">保存到下一步</Button>
                                    <Button v-else type="primary" size="large" @click="updateTargeting()">修改定向到下一步</Button>
                                </FormItem>

                            </Form>
                            </Col>

                            <Col span="5">
                            <div class="city_main" style="float:right;">
                                <div class="city_title">受众信息</div>
                                <div class="city_box">
                                    <div class="padding-10 ">
                                        <div class="targeting_item" v-if="targeting.city.length>0">
                                            <span>地域：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.district" v-if="item.val_type==targeting.district">
                                                    {{item.name}}：
                                                </template>
                                                <template v-for="item in targeting.city">
                                                    <template v-for="subitem in province" v-if="item==subitem.value">
                                                        {{subitem.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.gender">
                                            <span>性别：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.gender" v-if="item.val_type==targeting.gender">
                                                    {{item.name}}
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.age.length>0&&age_model=='1'">
                                            <span>年龄：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.age">
                                                    <template v-for="subitem in targeting.age" v-if="item.val_type==subitem">
                                                        {{item.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.ad_tag.length>0&&ad_tag_model=='1'">
                                            <span>兴趣分类：</span>
                                            <span class="grey">
                                                <template v-for="item in targeting.ad_tag">
                                                    <template v-for="subitem in ad_tag">
                                                        <span v-if="item==subitem.value">
                                                            {{subitem.name}}
                                                        </span>
                                                        <template v-for="subTagsitem in subitem.subTags" v-if="item==subTagsitem.value">
                                                            {{subTagsitem.name}};
                                                        </template>
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.interest_tags.length>0&&interest_tags_model=='1'">
                                            <span>兴趣关键词：</span>
                                            <span class="grey">
                                                <template v-for="item in targeting.interest_tags">
                                                    {{item}};
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.platform.length>0&&platform_model=='1'">
                                            <span>平台：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.platform">
                                                    <template v-for="subitem in targeting.platform" v-if="item.val_type==subitem">
                                                        {{item.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.ac.length>0&&ac_model=='1'">
                                            <span>网络类型：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.ac">
                                                    <template v-for="subitem in targeting.ac" v-if="item.val_type==subitem">
                                                        {{item.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.carrier.length>0&&carrier_model=='1'">
                                            <span>运营商：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.carrier">
                                                    <template v-for="subitem in targeting.carrier" v-if="item.val_type==subitem">
                                                        {{item.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.activate_type.length>0&&activate_type_model=='1'">
                                            <span>新用户：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.activate_type">
                                                    <template v-for="subitem in targeting.activate_type" v-if="item.val_type==subitem">
                                                        {{item.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.app_behavior_target!='NONE'&&targeting.app_category.length>0">
                                            <span>APP行为定向：</span>
                                            <span class="grey">
                                                <template v-for="item in toutiaoConfig.app_behavior_target" v-if="item.val_type==targeting.app_behavior_target">
                                                    {{item.name}};
                                                </template>
                                                <template v-for="item in targeting.app_category">
                                                    <template v-for="subitem in app_category">
                                                        <template v-for="subTagsitem in subitem.subItems" v-if="item==subTagsitem.value">
                                                            {{subTagsitem.name}};
                                                        </template>
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.device_brand.length>0&&device_brand_model=='1'">
                                            <span>受众手机品牌：</span>
                                            <span class="grey">
                                                <template v-for="item in targeting.device_brand">
                                                    <template v-for="subitem in device_brand" v-if="item==subitem.value">
                                                        {{subitem.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>

                                        <div class="targeting_item" v-if="targeting.article_category.length>0&&article_category_model=='1'">
                                            <span>受众文章分类：</span>
                                            <span class="grey">
                                                <template v-for="item in targeting.article_category">
                                                    <template v-for="subitem in article_category" v-if="item==subitem.value">
                                                        {{subitem.name}};
                                                    </template>
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </Col>

                        </Row>
                    </TabPane>
                    <TabPane label="选择已有定向">
                        <!-- 定向列表 -->
                        <targeting-list @on-change="changetargeting" :province="province" :ad_tag="ad_tag" :app_category="app_category" :device_brand="device_brand" :article_category="article_category"></targeting-list>

                    </TabPane>
                </Tabs>
            </div>
        </Card>
    </div>
</template>

<script>
import Axios from '@/api/index';
import toutiaoConfig from '@/utils/toutiaoConfig.json';
import sideBar from "./components/sideBar.vue";
import cityTree from './components/cityTree.vue';
import countyTree from './components/countyTree.vue';
import tagTree from './components/tagTree.vue';
import interestTree from './components/interestTree.vue';
import appTree from './components/appTree.vue';
import deviceTree from './components/deviceTree.vue';
import copyTargeting from './components/copyTargeting.vue';
import targetingList from './components/targetingList.vue';

export default {
    components: {
        sideBar,
        cityTree,
        countyTree,
        tagTree,
        interestTree,
        appTree,
        deviceTree,
        copyTargeting,
        targetingList
    },
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            id: this.$route.query.id, //行id
            campaign_id: this.$route.query.campaign_id, //广告组id  
            landing_type: this.$route.query.landing_type,//推广目的
            toutiaoConfig: toutiaoConfig,
            province: "",//省市
            ad_tag: "",//兴趣分类
            app_category: "",//app行为
            device_brand: "",//受众手机品牌
            article_category: "",//受众文章分类  
            targeting_name: "",
            targeting_id: "",
            // 定向参数
            targeting: {
                district: "", // 地域类型
                city: [], // 地域id
                gender: 'GENDER_UNLIMITED', // 性别
                age: [], // 年龄
                ad_tag: [], // 兴趣分类
                interest_tags: [], // 兴趣关键词
                platform: [], // 平台
                ac: [], // 网络类型
                carrier: [], // 运营商
                activate_type: [],//新用户
                app_behavior_target: "NONE",//APP行为定向
                app_category: [],//APP行为定向,分类集合
                device_brand: [],//受众手机品牌
                article_category: []//受众文章分类
            },
            age_model: "0",
            ad_tag_model: "0",
            interest_tags_model: "0",
            platform_model: "0",
            ac_model: "0",
            carrier_model: "0",
            activate_type_model: "0",
            device_brand_model: "0",
            article_category_model: "0",
            advanced_options: false,//是否显示高级选项
        }
    },
    mounted() {
        if (this.id) {
        }
        this.getProvince();
        this.getTag();
        this.getAppType();
        this.getPhone();
        this.getAudienceArticle();

    },
    methods: {

        //获取省市区
        getProvince() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getProvince'
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_province(res.data);
                }
            }).catch(err => {
                console.log('获取省市列表失败' + err);
            })
        },
        //重新排区
        ad_province(data) {
            let province = [];
            data.forEach(v => {
                province.push(v);
                if (v.countyList) {
                    v.countyList.forEach(v => {
                        province.push(v);
                    })
                }
                if (v.cityList) {
                    v.cityList.forEach(v => {
                        province.push(v);
                        if (v.countyList) {
                            v.countyList.forEach(v => {
                                province.push(v);
                            })
                        }
                    })
                }
            })
            this.province = province;
        },
        //获取兴趣分类
        getTag() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getTag'
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_tag = res.data.adtags;
                }
            }).catch(err => {
                console.log('获取兴趣分类表失败' + err);
            })
        },
        //获取app行为
        getAppType() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAppType'
            }).then(res => {
                if (res.ret == 1) {
                    this.app_category = res.data.android;
                }
            }).catch(err => {
                console.log('获取app行为' + err);
            })
        },
        //获取手机品牌
        getPhone() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getPhone'
            }).then(res => {
                if (res.ret == 1) {
                    this.device_brand = res.data;
                }
            }).catch(err => {
                console.log('获取手机品牌' + err);
            })
        },
        //获取受众文章分类
        getAudienceArticle() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAudienceArticle'
            }).then(res => {
                if (res.ret == 1) {
                    this.article_category = res.data;
                }
            }).catch(err => {
                console.log('获取手机品牌' + err);
            })
        },
        //是否存在数组中
        isInArray(arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (value === arr[i]) {
                    return true;
                }
            }
            return false;
        },
        //选择平台判断是否是pc
        changePlatform(arr) {
            if (this.isInArray(arr, "PC")) {
                this.targeting.platform = ["PC"];
            }
        },
        changetargeting(targeting) {
            this.targeting_name = targeting.targeting_name;
            // this.targeting_id = targeting.targeting_id;
            if (targeting.targeting.district) {
                this.targeting.district = targeting.targeting.district; // 地域类型
            } else {
                this.targeting.district = "";
            }
            if (targeting.targeting.city) {
                this.targeting.city = targeting.targeting.city; // 地域id
            } else {
                this.targeting.city = [];
            }
            if (targeting.targeting.gender) {
                this.targeting.gender = targeting.targeting.gender; // 性别
            } else {
                this.targeting.gender = 'GENDER_UNLIMITED';
            }
            if (targeting.targeting.age) {
                this.age_model = "1";
                this.targeting.age = targeting.targeting.age; // 年龄
            } else {
                this.age_model = "0";
                this.targeting.age = [];
            }
            if (targeting.targeting.ad_tag) {
                this.ad_tag_model = "1";
                this.targeting.ad_tag = targeting.targeting.ad_tag; // 兴趣分类
            } else {
                this.ad_tag_model = "0";
                this.targeting.ad_tag = [];
            }
            if (targeting.targeting.interest_tags) {
                this.interest_tags_model = "1";
                this.targeting.interest_tags = targeting.targeting.interest_tags; // 兴趣关键词
            } else {
                this.interest_tags_model = "0";
                this.targeting.interest_tags = [];
            }
            if (targeting.targeting.platform) {
                this.platform_model = "1";
                this.targeting.platform = targeting.targeting.platform; // 平台
            } else {
                this.platform_model = "0";
                this.targeting.platform = [];
            }
            if (targeting.targeting.ac) {
                this.ac_model = "1";
                this.targeting.ac = targeting.targeting.ac; // 网络类型
            } else {
                this.ac_model = "0";
                this.targeting.ac = [];
            }
            if (targeting.targeting.carrier) {
                this.carrier_model = "1";
                this.targeting.carrier = targeting.targeting.carrier; // 运营商
            } else {
                this.carrier_model = "0";
                this.targeting.carrier = [];
            }
            if (targeting.targeting.activate_type) {
                this.activate_type_model = "1";
                this.targeting.activate_type = targeting.targeting.activate_type;//新用户
            } else {
                this.activate_type_model = "0";
                this.targeting.activate_type = [];
            }
            if (targeting.targeting.app_behavior_target) {
                this.targeting.app_behavior_target = targeting.targeting.app_behavior_target;//APP行为定向
            }
            if (targeting.targeting.app_category) {
                this.targeting.app_category = targeting.targeting.app_category;//APP行为定向,分类集合
            }
            if (targeting.targeting.device_brand) {
                this.device_brand_model = "1";
                this.targeting.device_brand = targeting.targeting.device_brand;//受众手机品牌
            } else {
                this.device_brand_model = "0";
                this.targeting.device_brand = [];
            }
            if (targeting.targeting.article_category) {
                this.article_category_model = "1";
                this.advanced_options = true;
                this.targeting.article_category = targeting.targeting.article_category//受众文章分类
            } else {
                this.article_category_model = "0";
                this.advanced_options = false;
                this.targeting.article_category = []
            }
        },
        //保存定向
        addTargeting() {
            if (this.targeting_name == "") {
                this.$Message.info("请输入定向名");
                return;
            }
            let params = {
                action: 'ttAdPut',
                opt: 'addTargeting',
                account_id: this.account_id,
                targeting_name: this.targeting_name,
                city: this.targeting.city,
                district: this.targeting.district,
                gender: this.targeting.gender,
                app_behavior_target: this.targeting.app_behavior_target,
            }
            if (this.age_model == "1") {
                params.age = this.targeting.age;
            }
            if (this.ad_tag_model == "1") {
                params.ad_tag = this.targeting.ad_tag;
            }
            if (this.interest_tags_model == "1") {
                params.interest_tags = this.targeting.interest_tags;
            }
            if (this.platform_model == "1") {
                params.platform = this.targeting.platform;
            }
            if (this.ac_model == "1") {
                params.ac = this.targeting.ac;
            }
            if (this.carrier_model == "1") {
                params.carrier = this.targeting.carrier;
            }
            if (this.activate_type_model == "1") {
                params.activate_type = this.targeting.activate_type;
            }
            if (this.device_brand_model == "1") {
                params.device_brand = this.targeting.device_brand;
            }
            if (this.article_category_model == "1") {
                params.article_category = this.targeting.article_category;
            }
            if (this.targeting.app_behavior_target != "NONE") {
                params.app_category = this.targeting.app_category;
            }

            Axios.post('api.php', params).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.$router.push({
                        name: 'ttad',
                        query: {
                            account_id: this.account_id,
                            campaign_id: this.campaign_id,
                            landing_type: this.landing_type,
                            targeting_id: res.data.targeting_id
                        }
                    })
                }
            }).catch(err => {
                console.log("新建定向" + err);
            })
        },
        //修改定向
        updateTargeting() {
            if (this.targeting_name == "") {
                this.$Message.info("请输入定向名");
                return;
            }

            let params = {
                action: 'ttAdPut',
                opt: 'updateTargeting',
                account_id: this.account_id,
                targeting_id: this.targeting_id,
                targeting_name: this.targeting_name,
                city: this.targeting.city,
                district: this.targeting.district,
                gender: this.targeting.gender,
                app_behavior_target: this.targeting.app_behavior_target,
            }
            if (this.age_model == "1") {
                params.age = this.targeting.age;
            }
            if (this.ad_tag_model == "1") {
                params.ad_tag = this.targeting.ad_tag;
            }
            if (this.interest_tags_model == "1") {
                params.interest_tags = this.targeting.interest_tags;
            }
            if (this.platform_model == "1") {
                params.platform = this.targeting.platform;
            }
            if (this.ac_model == "1") {
                params.ac = this.targeting.ac;
            }
            if (this.carrier_model == "1") {
                params.carrier = this.targeting.carrier;
            }
            if (this.activate_type_model == "1") {
                params.activate_type = this.targeting.activate_type;
            }
            if (this.device_brand_model == "1") {
                params.device_brand = this.targeting.device_brand;
            }
            if (this.article_category_model == "1") {
                params.article_category = this.targeting.article_category;
            }
            if (this.targeting.app_behavior_target != "NONE") {
                params.app_category = this.targeting.app_category;
            }

            Axios.post('api.php', params).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.$router.push({
                        name: 'ttad',
                        query: {
                            account_id: this.account_id,
                            campaign_id: this.campaign_id,
                            landing_type: this.landing_type,
                            targeting_id: this.targeting_id
                        }
                    })
                }
            }).catch(err => {
                console.log("修改定向" + err);
            })
        }
    },
    computed: {

    }

}
</script>
