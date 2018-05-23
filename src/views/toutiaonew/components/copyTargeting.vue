
<style scoped>
.city_main {
  line-height: 36px;
  width: 300px;
  border: solid 1px #dee4f5;
  float: left;
}
.city_title {
  background-color: #fafbfe;
  border-bottom: solid 1px #dee4f5;
  padding: 0 15px;
  height: 36px;
}
.city_box {
  height: 300px;
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
.name_text{
    font-size: 14px;
}
</style>
<template>
    <span>
        <span class="name_text"  @click="byted_modal=true" >复制已有定向</span>
        <Modal title="复制用户定向" v-model="byted_modal" :width="652" @on-ok="confirm()">
            <div class="clear">
                <div class="city_main">
                    <div class="city_title">定向名称</div>
                    <div class="city_box">
                        <div class="item" v-for="item in TargetingList" @click="getTargeting(item)">{{item.targeting_name}}</div>
                    </div>
                </div>
                <div class="city_main" style="margin-left:20px;">
                    <div class="city_title">{{targeting.targeting_name}}</div>
                    <div class="city_box">
                        <div class="padding-10 ">
                            <div class="targeting_item" v-if="targeting.targeting.district">
                        <span>地域：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.district" v-if="item.val_type==targeting.targeting.district">
                                {{item.name}}：
                            </template>
                            <template v-for="item in targeting.targeting.city">
                                <template v-for="subitem in province" v-if="item==subitem.value">
                                    {{subitem.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.gender">
                        <span>性别：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.gender" v-if="item.val_type==targeting.targeting.gender">
                                {{item.name}}
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.age">
                        <span>年龄：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.age">
                                <template v-for="subitem in targeting.targeting.age" v-if="item.val_type==subitem">
                                    {{item.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.ad_tag">
                        <span>兴趣分类：</span>
                        <span class="grey">
                            <template v-for="item in targeting.targeting.ad_tag">
                                <template v-for="subitem in ad_tag" v-if="item==subitem.value">
                                    {{subitem.name}};
                                    <template v-for="subTagsitem in subitem.subTags" v-if="item==subTagsitem.value">
                                        {{subTagsitem.name}};
                                    </template>
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.interest_tags">
                        <span>兴趣关键词：</span>
                        <span class="grey">
                            <template v-for="item in targeting.targeting.interest_tags">
                                {{item}};
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.platform">
                        <span>平台：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.platform">
                                <template v-for="subitem in targeting.targeting.platform" v-if="item.val_type==subitem">
                                    {{item.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.ac">
                        <span>网络类型：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.ac">
                                <template v-for="subitem in targeting.targeting.ac" v-if="item.val_type==subitem">
                                    {{item.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.carrier">
                        <span>运营商：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.carrier">
                                <template v-for="subitem in targeting.targeting.carrier" v-if="item.val_type==subitem">
                                    {{item.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.activate_type">
                        <span>新用户：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.activate_type">
                                <template v-for="subitem in targeting.targeting.activate_type" v-if="item.val_type==subitem">
                                    {{item.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.app_behavior_target">
                        <span>APP行为定向：</span>
                        <span class="grey">
                            <template v-for="item in toutiaoConfig.app_behavior_target" v-if="item.val_type==targeting.targeting.app_behavior_target">
                                {{item.name}};
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.app_category">
                        <span>APP行为定向分类集合：</span>
                        <span class="grey">
                            <template v-for="item in targeting.targeting.app_category">
                                <template v-for="subitem in app_category" v-if="item==subitem.value">
                                    {{subitem.name}};
                                    <template v-for="subTagsitem in subitem.subItems" v-if="item==subTagsitem.value">
                                        {{subTagsitem.name}};
                                    </template>
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.device_brand">
                        <span>受众手机品牌：</span>
                        <span class="grey">
                            <template v-for="item in targeting.targeting.device_brand">
                                <template v-for="subitem in device_brand" v-if="item==subitem.value">
                                    {{subitem.name}};
                                </template>
                            </template>
                        </span>
                    </div>

                    <div class="targeting_item" v-if="targeting.targeting.article_category">
                        <span>受众文章分类：</span>
                        <span class="grey">
                            <template v-for="item in targeting.targeting.article_category">
                                <template v-for="subitem in article_category" v-if="item==subitem.value">
                                    {{subitem.name}};
                                </template>
                            </template>
                        </span>
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </span>
</template>

<script>
import Axios from "@/api/index";
import toutiaoConfig from '@/utils/toutiaoConfig.json';
export default {
    name: "copyTargeting",
    props: ["province", "ad_tag", "app_category", "device_brand", "article_category"],
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            toutiaoConfig: toutiaoConfig,
            byted_modal: false,
            TargetingList: "",
            targeting: {
                account_id: "",
                targeting: "",
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
                action: 'ttAdPut',
                opt: 'getTargetingList',
                account_id: this.account_id,
            }).then(res => {
                if (res.ret == 1) {
                    this.TargetingList = res.data;
                }
            }).catch(err => {
                console.log('获取兴趣分类表失败' + err);
            })
        },
        //获取定向详情
        getTargeting(item) {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getTargetingList',
                targeting_id: item.targeting_id,
            }).then(res => {
                if (res.ret == 1) {
                    this.targeting = res.data;
                }
            }).catch(err => {
                console.log('获取兴趣分类表失败' + err);
            })
        },
        //确定
        confirm() {
            this.$emit("on-change", this.targeting);
        },
    }
}
</script>