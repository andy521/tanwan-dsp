
<style scoped>
.city_main {
  line-height: 36px;
  width: 350px;
  border: solid 1px #dee4f5;
  float: left;
  word-break: break-all;
}
.city_title {
  background-color: #fafbfe;
  border-bottom: solid 1px #dee4f5;
  padding: 0 15px;
  height: 36px;
  overflow: hidden;text-overflow: ellipsis;white-space:nowrap;
}
.city_box {
  height: 350px;
  overflow: auto;
}
.item {
  padding: 0 15px;
  cursor: pointer;
}
.item:hover {
  background: #f8f8f8;
}
.more_icon {
  float: right;
  line-height: 36px;
}
.icon {
  line-height: 36px;
  float: left;
  margin-right: 5px;
}
.clearcity {
  float: right;
  color: #2d8cf0;
  cursor: pointer;
}
.grey {
  color: #999;
}
.targeting_item {
  line-height: 20px;
  padding: 5px 0;
}
.name_text {
  font-size: 14px;
}
</style>
<template>
    <span>
        <span class="name_text" @click="byted_modal=true">复制已有定向</span>
        <Modal title="复制用户定向" v-model="byted_modal" :width="732" @on-ok="confirm()">
            <Input v-model="search" placeholder="请输入定向名称" @on-change="filterData" @on-enter="filterData" size="large">
            <Button slot="append" icon="ios-search" @click="filterData">搜索</Button>
            </Input>
            <div class="clear margin-top-10">
                <div class="city_main">
                    <div class="city_title">定向名称</div>

                    <div class="city_box">
                        <div class="item" v-for="item in TargetingList" @click="getTargeting(item)" :key="item.targeting_id">{{item.targeting_name}}</div>
                    </div>

                </div>
                <div class="city_main" style="border-left:none;">
                    <div class="city_title">{{targeting.targeting_name}}</div>
                    <div style="position: relative;">
                        <div class="city_box">
                            <div class="padding-10 ">
                                <template v-if="targeting.targeting.geo_location">
                                    <div class="targeting_item" v-if="targeting.targeting.geo_location.regions">
                                        <span>地域：</span>
                                        <span class="grey">
                                            {{new_regions}};
                                        </span>
                                    </div>
                                    <div class="targeting_item" v-if="targeting.targeting.geo_location.location_types">
                                        <span>地点类型：</span>
                                        <span class="grey">
                                            <template v-for="item in gdtConfig.location_types">
                                                <template v-for="subitem in targeting.targeting.geo_location.location_types" v-if="subitem==item.val_type">
                                                    {{item.name}};
                                                </template>
                                            </template>
                                        </span>
                                    </div>
                                </template>
                                <div class="targeting_item" v-if="targeting.targeting.age">
                                    <span>年龄：</span>
                                    <span class="grey">
                                        {{targeting.targeting.age[0]}};
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.gender">
                                    <span>性别：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.gender">
                                            <template v-for="subitem in targeting.targeting.gender" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.business_interest">
                                    <span>商业兴趣：</span>
                                    <span class="grey">
                                        {{businessids}};
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.app_behavior">
                                    <span>App行为：</span>
                                    <span class="grey">
                                        {{app_category}}
                                        <br/> 距离今天 {{targeting.targeting.app_behavior.time_window}}
                                        <template v-for="item in gdtConfig.act_id_list">
                                            <template v-for="subitem in targeting.targeting.app_behavior.act_id_list" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                        用户
                                    </span>
                                </div>

                                <div class="targeting_item" v-if="targeting.targeting.app_install_status">
                                    <span>App安装：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.app_install_status">
                                            <template v-for="subitem in targeting.targeting.app_install_status" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.network_type">
                                    <span>联网方式：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.network_type">
                                            <template v-for="subitem in targeting.targeting.network_type" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.customized_audience">
                                    <span>定向用户群：</span>
                                    <span class="grey">
                                        <template v-for="item in audiences">
                                            <template v-for="subitem in targeting.targeting.customized_audience" v-if="subitem==item.audience_id">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.excluded_custom_audience">
                                    <span>排除用户群：</span>
                                    <span class="grey">
                                        <template v-for="item in audiences">
                                            <template v-for="subitem in targeting.targeting.excluded_custom_audience" v-if="subitem==item.audience_id">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.education">
                                    <span>婚恋状态：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.education">
                                            <template v-for="subitem in targeting.targeting.education" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.living_status">
                                    <span>工作状态：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.living_status">
                                            <template v-for="subitem in targeting.targeting.living_status" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.keyword">
                                    <span>关键词：</span>
                                    <span class="grey" v-if="targeting.targeting.keyword.words">
                                        <template v-for="item in targeting.targeting.keyword.words">
                                            {{item}};
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.paying_user_type">
                                    <span>付费用户：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.paying_user_type">
                                            <template v-for="subitem in targeting.targeting.paying_user_type" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.shopping_capability">
                                    <span>消费状态：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.shopping_capability">
                                            <template v-for="subitem in targeting.targeting.shopping_capability" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.network_operator">
                                    <span>移动运营商：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.network_operator">
                                            <template v-for="subitem in targeting.targeting.network_operator" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>
                                <div class="targeting_item" v-if="targeting.targeting.device_price">
                                    <span>设备价格：</span>
                                    <span class="grey">
                                        <template v-for="item in gdtConfig.device_price">
                                            <template v-for="subitem in targeting.targeting.device_price" v-if="subitem==item.val_type">
                                                {{item.name}};
                                            </template>
                                        </template>
                                    </span>
                                </div>

                            </div>
                            <Spin size="small" fix v-if="loading"></Spin>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </span>
</template>

<script>
import Axios from "@/api/index";
import gdtConfig from '@/utils/gdtConfig.json';
export default {
    name: "copyTargeting",
    props: ["province", "appcategory", "business", "audiences"],
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            gdtConfig: gdtConfig,
            byted_modal: false,
            loading: false,
            search: "",
            TargetingList: "",
            copyList: "",
            targeting: {
                account_id: "",
                targeting: {
                    // geo_location: {
                    //     regions: [],
                    //     location_types: [],
                    //     business_districts: []
                    // },
                    // age: ["5~60"],
                    // gender: ["FEMALE"],
                    // education: [],
                    // relationship_status: [],
                    // living_status: [],
                    // app_behavior: {
                    //     object_type: "APP_CLASS",
                    //     object_id_list: [],
                    //     time_window: 1,
                    //     act_id_list: []
                    // },
                    // app_install_status: [],
                    // network_type: [],
                    // business_interest: [],
                    // network_operator: [],
                    // device_price: [],
                    // shopping_capability: [],
                    // paying_user_type: [],
                    // keyword: {
                    //     words: []
                    // },
                    // player_consupt: [],
                    // residential_community_price: [],
                    // customized_audience: [],
                    // excluded_custom_audience: [],
                    // description: []
                },
                targeting_id: "",
                targeting_name: ""
            }
        }
    },
    mounted() {
        this.getTargetingList();
    },
    methods: {
        //获取定向列表
        getTargetingList() {
            Axios.post('api.php', {
                action: 'api',
                opt: 'getTargetings',
                account_id: this.account_id,
                media_type: 1
            }).then(res => {
                if (res.ret == 1) {
                    this.TargetingList = res.data;
                    this.copyList = res.data;
                }
            }).catch(err => {
                console.log('获取定向失败' + err);
            })
        },
        //获取定向详情
        getTargeting(item) {
            this.loading = true;
            Axios.post('api.php', {
                action: 'api',
                opt: 'getTargetings',
                account_id: this.account_id,
                media_type: 1,
                targeting_id: item.targeting_id,
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    this.targeting = res.data;
                }
            }).catch(err => {
                this.loading = false;
                console.log('获取定向失败' + err);
            })
        },
        //确定
        confirm() {
            this.$emit("on-change", this.targeting);
        },
        //搜索
        filterData() {
            if (this.search === "") {
                this.TargetingList = this.copyList;
                return
            }
            const all = this.copyList
            const filter = []
            const searchTxt = new RegExp(this.search, 'gmi');
            all.forEach(item => {
                if (item.targeting_name.search(searchTxt) != -1) {
                    filter.push(item)
                }
            })
            const retNull = [{ targeting_name: '无搜索结果,请重新搜索', targeting_id: '' }]
            this.TargetingList = filter.length < 1 ? retNull : filter
        },
    },
    computed: {
        //省市区转码
        new_regions() {
            let regions = this.province;
            let ids = this.targeting.targeting.geo_location.regions;
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
            let business_interest = this.business;
            let ids = this.targeting.targeting.business_interest;
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
            let appCategory = this.appcategory;
            let ids = this.targeting.targeting.app_behavior.object_id_list;
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
    }
}
</script>