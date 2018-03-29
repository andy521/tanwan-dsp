<style scoped>
.detail {
    background: #fff;
    width: 500px;
    padding: 20px;
}

.w_flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    padding: 5px 0;
}

.w_flex_hd {
    width: 6em;
    font-weight: bold;
    text-align: right;
    padding-right: 10px;
}

.w_flex_bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.w_flex_bd_div {
    padding-bottom: 5px;
}

.grey {
    color: #999;
}

.carousel_ad {
    width: 250px;
    border: solid 1px #eee;
    position: relative;
}

.carouselitem {
    position: relative;
}

.carouselbox {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
}

.carouselbox img {
    display: block;
}
.img_operation {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
}
.w_img_operation {
    padding: 5px;
    cursor: pointer;
    display: inline-block;
}

.txt {
    padding: 5px;
    word-break: break-word;
}

em {
    font-style: normal;
}

.Preview_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 99;
}

.Preview {
    position: fixed;
    width: 750px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 100;
}

.Preview_name {
    padding: 12px 24px;
    font-size: 30px;
}

.flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}

.ta {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    margin-top: -20px;
}

.ta tr td:last-child {
    width: auto;
}
</style>
<template>
    <div>
        <table class="ta">
            <tr v-for="item in adgroup_detail.adcreative">
                <td width="56">{{item.adcreative_name}}</td>
                <template v-for="subitem in checkAll">
                    <td width="120" v-if="subitem=='account_name'">{{item.adtodayArr.account_name}}</td>
                    <td width="400" v-else-if="subitem=='adgroup_name'"></td>
                    <td width="100" v-else-if="subitem=='campaign_id'">{{item.adtodayArr.campaign_id}}</td>
                    <td width="100" v-else-if="subitem=='impression'">{{item.adtodayArr.impression}}</td>
                    <td width="100" v-else-if="subitem=='click'">{{item.adtodayArr.click}}</td>
                    <td width="100" v-else-if="subitem=='click_per'">-</td>
                    <td width="110" v-else-if="subitem=='click_cost'">-</td>
                    <td width="100" v-else-if="subitem=='cost'">{{item.adtodayArr.cost}}</td>
                    <td width="100" v-else-if="subitem=='show_pv'">-</td>
                    <td width="100" v-else-if="subitem=='show_ip'">-</td>
                    <td width="100" v-else-if="subitem=='down_ip'">-</td>
                    <td width="100" v-else-if="subitem=='fetch'">-</td>
                    <td width="100" v-else-if="subitem=='fetch_per'">-</td>
                    <td width="100" v-else-if="subitem=='download'">{{item.adtodayArr.download}}</td>
                    <td width="100" v-else-if="subitem=='down_ins_per'">-</td>
                    <td width="110" v-else-if="subitem=='install'">-</td>
                    <td width="120" v-else-if="subitem=='click_install'">-</td>
                    <td width="120" v-else-if="subitem=='install_per'">-</td>
                    <td width="120" v-else-if="subitem=='download_per'">-</td>
                    <td width="100" v-else-if="subitem=='bid_amount'">-</td>
                    <td width="100" v-else-if="subitem=='reg_imei'">-</td>
                    <td width="120" v-else-if="subitem=='activation'">{{item.adtodayArr.activation}}</td>
                    <td width="130" v-else-if="subitem=='reg_imei_cost'">-</td>
                    <td width="110" v-else-if="subitem=='reg_cost'">-</td>
                    <td width="100" v-else-if="subitem=='reg_per'">-</td>
                    <td width="120" v-else-if="subitem=='reg_arpu'">-</td>
                    <td width="100" v-else-if="subitem=='login'">-</td>
                    <td width="100" v-else-if="subitem=='act_per'">-</td>
                    <td width="110" v-else-if="subitem=='pay_num'">-</td>
                    <td width="110" v-else-if="subitem=='pay_total'">-</td>
                    <td width="100" v-else-if="subitem=='pay_per'">-</td>
                    <td width="100" v-else-if="subitem=='income_per'">-</td>
                    <td width="110" v-else-if="subitem=='system_status'">
                        <template v-for="col in ads_config.system_status" v-if="col.val_type==item.system_status">
                            <span :style="{color:col.color}">{{col.name}}</span>
                            <Tooltip placement="top" v-if="item.reject_message != 'null' && item.reject_message">
                                <Icon type="help-circled" :style="{color:col.color}"></Icon>
                                <div slot="content" style="white-space: normal">{{item.reject_message}}</div>
                            </Tooltip>
                        </template>
                    </td>
                    <td width="100" v-else-if="subitem=='configured_status'">{{item.configured_status =="AD_STATUS_NORMAL"? "开启": "关闭"}}</td>
                    <td width="150" v-else-if="subitem=='daily_budget'">-</td>
                    <td width="150" v-else-if="subitem=='game_name'">-</td>
                </template>
            </tr>
        </table>

        <div class="flex">
            <div class="flex_item">
                <!--创意详情-->
                <div class="detail">
                    <div class="w_flex" v-if="adgroup_detail.adcreative.length>0">
                        <div class="w_flex_hd">创意</div>
                        <div class="w_flex_bd">
                            <Carousel class="carousel_ad" v-model="CarouselItem" arrow="always" trigger="hover" :height="250">
                                <CarouselItem class="carouselitem" v-for="item in adgroup_detail.adcreative" :key="this">
                                    <div class="carouselbox" v-if="item.adcreative_elements">
                                        <div class="txt">{{item.adcreative_name}}</div>
                                        <img :src="item.adcreative_elements.image_url" width="100%" />
                                        <div class="txt">{{item.adcreative_elements.title}}</div>
                                    </div>
                                    <div class="img_operation">
                                        <span class="w_img_operation" @click="editTargeting(1)">
                                            <Tooltip placement="bottom-end">
                                                <Icon type="android-create" size="18" color="#666"></Icon>
                                                <div slot="content">修改创意</div>
                                            </Tooltip>
                                        </span>
                                        <span class="w_img_operation" @click="funpreview(item)">
                                            <Tooltip placement="bottom-end">
                                                <Icon type="search" size="18" color="#666"></Icon>
                                                <div slot="content">放大图片</div>
                                            </Tooltip>
                                        </span>
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </div>
                    </div>
                    <div class="w_flex">
                        <div class="w_flex_hd">广告组名称</div>
                        <div class="w_flex_bd">{{adgroup_detail.adgroup_name}}</div>
                    </div>
                    <div class="w_flex">
                        <div class="w_flex_hd">广告ID</div>
                        <div class="w_flex_bd">{{adgroup_detail.adgroup_id}}</div>
                    </div>
                    <div class="w_flex">
                        <div class="w_flex_hd">投放日期</div>
                        <div class="w_flex_bd">{{adgroup_detail.begin_date}}~{{adgroup_detail.end_date}}</div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.time_series">
                        <div class="w_flex_hd">投放时间</div>
                        <div class="w_flex_bd" v-html="weektime"></div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.optimization_goal">
                        <div class="w_flex_hd">优化目标</div>
                        <div class="w_flex_bd">
                            <span v-if="item.val_type==adgroup_detail.optimization_goal" size="large" v-for="item in ads_config.optimization_goal" :key="this">{{item.name}}</span>
                        </div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.billing_event">
                        <div class="w_flex_hd">付费方式</div>
                        <div class="w_flex_bd">
                            <span v-if="item.val_type==adgroup_detail.billing_event" size="large" v-for="item in ads_config.billing_event" :key="this">{{item.name}}</span>
                        </div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.bid_amount">
                        <div class="w_flex_hd">广告出价</div>
                        <div class="w_flex_bd">{{adgroup_detail.bid_amount/100}}元/激活</div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.site_set">
                        <div class="w_flex_hd">投放平台</div>
                        <div class="w_flex_bd">
                            <span v-for="item in adgroup_detail.site_set">
                                <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.site_set" :key="this">{{subitem.name}}&nbsp;</em>
                            </span>
                        </div>
                    </div>
                    <div class="w_flex" v-if="adgroup_detail.targeting">
                        <div class="w_flex_hd">定向条件</div>
                        <div class="w_flex_bd">
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.gender">
                                <span class="grey">性别：</span>
                                <span v-if="item.val_type==adgroup_detail.targeting.gender" size="large" v-for="item in ads_config.gender" :key="this">{{item.name}}</span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.age">
                                <span class="grey">年龄：</span> {{adgroup_detail.targeting.age.toString()}}岁
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.business_interest">
                                <span class="grey">商业兴趣：</span> {{businessids}}
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.app_behavior">
                                <span class="grey">App行为：</span>{{app_category}}，距离今天{{adgroup_detail.targeting.app_behavior.time_window}}天内，该类APP的
                                <span v-for="item in ads_config.act_id_list">
                                    <em v-for="subitem in adgroup_detail.targeting.app_behavior.act_id_list" v-if="subitem==item.val_type">{{item.name}},</em>
                                </span> 用户
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.app_install_status">
                                <span class="grey">App安装：</span>
                                <span size="large" v-for="item in ads_config.app_install_status" :key="this" v-if="item.val_type==adgroup_detail.targeting.app_install_status">{{item.name}}</span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.network_type">
                                <span class="grey">联网方式：</span>
                                <span v-for="item in adgroup_detail.targeting.network_type">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.network_type" :key="this">{{subitem.name}}</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.customized_audience">
                                <span class="grey">定向用户群：</span>
                                <span v-for="item in adgroup_detail.targeting.customized_audience">{{item.name}}</span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.excluded_custom_audience">
                                <span class="grey">排除用户群：</span>
                                <span v-for="item in adgroup_detail.targeting.excluded_custom_audience">{{item.name}}</span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.education">
                                <span class="grey">婚恋状态：</span>
                                <span v-for="item in adgroup_detail.targeting.education">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.education" :key="this">{{subitem.name}}</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.living_status">
                                <span class="grey">工作状态：</span>
                                <span v-for="item in adgroup_detail.targeting.living_status">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.living_status" :key="this">{{subitem.name}}</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.keyword">
                                <span class="grey">关键词：</span>
                                <span v-for="item in adgroup_detail.targeting.keyword.words">{{item}}</span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.paying_user_type">
                                <span class="grey">付费用户：</span>
                                <span v-for="item in adgroup_detail.targeting.paying_user_type">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.paying_user_type" :key="this">{{subitem.name}}&nbsp;</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.shopping_capability">
                                <span class="grey">消费状态：</span>
                                <span v-for="item in adgroup_detail.targeting.shopping_capability">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.shopping_capability" :key="this">{{subitem.name}}&nbsp;</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.network_operator">
                                <span class="grey">消费状态：</span>
                                <span v-for="item in adgroup_detail.targeting.network_operator">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.network_operator" :key="this">{{subitem.name}}&nbsp;</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.device_price">
                                <span class="grey">设备价格：</span>
                                <span v-for="item in adgroup_detail.targeting.device_price">
                                    <em v-if="subitem.val_type==item" size="large" v-for="subitem in ads_config.device_price" :key="this">{{subitem.name}}&nbsp;</em>
                                </span>
                            </div>
                            <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.geo_location">
                                <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.geo_location.location_types">
                                    <span class="grey">地点类型：</span>
                                    <span v-for="item in ads_config.location_types">
                                        <em v-for="subitem in adgroup_detail.targeting.geo_location.location_types" v-if="subitem==item.val_type">{{item.name}}&nbsp;</em>
                                    </span>
                                </div>
                                <div class="w_flex_bd_div" v-if="adgroup_detail.targeting.geo_location.regions">
                                    <span class="grey">地域：</span>{{new_regions}}
                                </div>
                            </div>
                            <Button type="ghost" icon="edit" @click="editTargeting(0)">修改定向</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex_item" style="width: 1080px;">
                <!-- 线性表格 -->
                <echarts-tabel :datas="adgroup_detail" v-if="adgroup_detail.adcreative.length>0"></echarts-tabel>
            </div>
        </div>

        <!--创意预览-->
        <div class="Preview_bg" v-if="preview_win" @click="preview_win=false"></div>
        <div class="Preview" v-if="preview_win">
            <img :src="preview.adcreative_elements.image_url" width="100%" />
            <div class="Preview_name">{{preview.adcreative_elements.title}}</div>
        </div>
    </div>
</template>
<script>
import Axios from "@/api/index";
import echartsTabel from "./echartsTabel.vue";
import { changetime } from "@/utils/DateShortcuts.js";
export default {
    components: {
        echartsTabel
    },
    props: {
        row: Object,
        uncheck: Array
    },
    data() {
        return {
            checkAllGroups: [
                "account_name",
                "adgroup_name",
                "campaign_id",
                "impression",
                "click",
                "click_per",
                "click_cost",
                "cost",
                "show_pv",
                "show_ip",
                "down_ip",
                "fetch",
                "fetch_per",
                "download",
                "down_ins_per",
                "install",
                "click_install",
                "install_per",
                "download_per",
                "bid_amount",
                "reg_imei",
                "activation",
                "reg_imei_cost",
                "reg_cost",
                "reg_per",
                "reg_arpu",
                "login",
                "act_per",
                "pay_num",
                "pay_total",
                "pay_per",
                "income_per",
                "system_status",
                "configured_status",
                "daily_budget",
                "game_name"
            ],
            CarouselItem: 0,
            preview_win: false,
            preview: {}, //预览
            adgroup_detail: {
                adgroup_id: "",
                adcreative: [
                    {
                        adcreative_elements: {
                            corporate: {
                                corporate_img: "",
                                corporate_name: ""
                            },
                            image: "",
                            image_url: "",
                            title: ""
                        },
                        adcreative_id: "",
                        adcreative_name: "",
                        configured_status: "",
                        system_status: "",
                        reject_message: "",
                        adtodayArr: {},
                        adhourArr: []
                    }
                ],
                targeting: {
                    age: ["5~60"],
                    gender: ["FEMALE"],
                    education: [],
                    relationship_status: [],
                    living_status: [],
                    geo_location: {
                        regions: [],
                        location_types: [],
                        business_districts: []
                    },
                    app_behavior: {
                        object_type: "APP_CLASS",
                        object_id_list: [],
                        time_window: 1,
                        act_id_list: []
                    },
                    app_install_status: [],
                    customized_audience: [],
                    network_type: [],
                    business_interest: [],
                    network_operator: [],
                    device_price: [],
                    shopping_capability: [],
                    paying_user_type: [],
                    keyword: {
                        words: []
                    },
                    player_consupt: [],
                    residential_community_price: [],
                    customized_audience: [],
                    excluded_custom_audience: [],
                    description: []
                }
            }
        };
    },
    mounted() {
        Axios.post("api.php", {
            action: "gdtAdPut",
            opt: "get_adgroup_detail",
            account_id: this.row.account_id,
            adgroup_id: this.row.adgroup_id
        })
            .then(res => {
                if (res.ret == 1) {
                    this.adgroup_detail = res.data;
                }
            })
            .catch(err => {
                console.log("获取详情失败" + err);
            });
    },
    methods: {
        //编辑
        editTargeting(e) {
            this.detailswin = false;
            this.$store.commit("save_adgroup_detail", this.adgroup_detail);
            let query = {
                account_id: this.adgroup_detail.account_id,
                campaign_id: this.adgroup_detail.campaign_id,
                targeting_id: this.adgroup_detail.targeting_id,
                product_refs_id: this.adgroup_detail.product_refs_id,
                product_type: this.adgroup_detail.product_type,
                adgroup_id: this.adgroup_detail.adgroup_id,
            };
            if (e == 0) {
                this.$store.commit("save_step", [1, 0]);
            } else if (e == 1) {
                this.$store.commit("save_step", [2, 0]);
            }
            this.$router.push({
                name: "newad",
                query: query
            });
        },
        funpreview(item) {
            this.preview = item;
            this.preview_win = true;
        }
    },
    computed: {
        //选中的指标
        checkAll() {
            let check = [];
            this.checkAllGroups.forEach(item => {
                let is = true;
                this.uncheck.forEach(col => {
                    if (item == col) {
                        is = false;
                    }
                });
                if (is) {
                    check.push(item);
                }
            });
            return check;
        },
        //获取所有状态
        ads_config() {
            return this.$store.state.newad.ads_config;
        },
        //省市区转码
        new_regions() {
            let regions = this.$store.state.newad.targeting_tags;
            let ids = this.adgroup_detail.targeting.geo_location.regions;
            if (!ids) return;
            var name = [];
            ids.forEach(id => {
                for (var i in regions) {
                    var e = regions[i].list;
                    for (var j in e) {
                        var f = e[j];
                        if (f.id == id) {
                            name.push(f.name);
                        }
                    }
                }
            });
            return name.toString();
        },
        //商业兴趣转码
        businessids() {
            let business_interest = this.$store.state.newad.business_interest;
            let ids = this.adgroup_detail.targeting.business_interest;
            if (!ids) return;
            var name = [];
            ids.forEach(id => {
                for (var i in business_interest) {
                    var item1 = business_interest[i];
                    if (item1.id == id) {
                        name.push(item1.name);
                    }
                    var item2 = item1.list;
                    for (var j in item2) {
                        if (item2[j].id == id) {
                            name.push(item2[j].name);
                        }
                        for (var k in item2[j].list) {
                            var n = item2[j].list[k];
                            if (n.id == id) {
                                name.push(n.name);
                            }
                        }
                    }
                }
            });
            return name.toString();
        },
        //app行为转码
        app_category() {
            let appCategory = this.$store.state.newad.appCategory;
            let ids = this.adgroup_detail.targeting.app_behavior.object_id_list;
            if (!ids) return;
            var name = [];
            ids.forEach(id => {
                for (var i in appCategory) {
                    var item1 = appCategory[i];
                    if (item1.id == id) {
                        name.push(item1.name);
                    }
                    var item2 = item1.list;
                    for (var j in item2) {
                        if (item2[j].id == id) {
                            name.push(item2[j].name);
                        }
                        for (var k in item2[j].list) {
                            var n = item2[j].list[k];
                            if (n.id == id) {
                                name.push(n.name);
                            }
                        }
                    }
                }
            });
            return name.toString();
        },
        //投放时间转换
        weektime: function() {
            let time = this.adgroup_detail.time_series;
            return changetime(time);
        }
    }
};
</script>
