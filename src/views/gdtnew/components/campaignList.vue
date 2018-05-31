<style scoped>
.city_main {
  line-height: 36px;
  width: 350px;
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
  overflow: auto;
  height: 500px;
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
    <div>
        <Input v-model="search" placeholder="请输入计划名称" @on-change="filterData" @on-enter="filterData" size="large" style="width:700px;">
        <Button slot="append" icon="ios-search" @click="filterData">搜索</Button>
        </Input>
        
        <div class="clear margin-top-10">
            <div class="city_main">
                <div class="city_title">推广计划</div>
                <div class="city_box" :style="{height:height+'px'}">
                    <div class="item" v-for="item in campaigns_list" @click="changcampaigns(item)">{{item.campaign_name}}</div>
                </div>
            </div>
            <div class="city_main" style="border-left:none;">
                <div class="city_title">{{campaign.campaign_name}}</div>
                <div class="city_box" :style="{height:height+'px'}">
                    <div class="padding-10" v-if="campaign.campaign_id">
                        <div class="targeting_item">
                            <span>日消耗限额：</span>
                            <span class="grey">
                                {{campaign.daily_budget/100}}元/天
                            </span>
                        </div>
                        <div class="targeting_item">
                            <span>计划类型：</span>
                            <span class="grey">
                                <template v-for="item in gdtConfig.campaign_type" v-if="campaign.campaign_type==item.val_type">{{item.name}}</template>
                            </span>
                        </div>
                        <div class="targeting_item">
                            <span>标的物类型：</span>
                            <span class="grey">
                                <template v-if="campaign.product_type=='UNKNOWN'">未知类型</template>
                                <template v-for="item in gdtConfig.product_type" v-if="campaign.product_type==item.val_type">{{item.name}}</template>
                            </span>
                        </div>
                        <div class="targeting_item">
                            <span>开启状态：</span>
                            <span class="grey">
                                <template v-for="item in gdtConfig.configured_status" v-if="campaign.configured_status==item.val_type">{{item.name}}</template>
                            </span>
                        </div>
                        <div class="targeting_item">
                            <span>投放速度模式：</span>
                            <span class="grey">
                                <template v-for="item in gdtConfig.speed_mode" v-if="campaign.speed_mode==item.val_type">{{item.name}}</template>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="margin-top-20">
            <Button type="primary" size="large" @click="campaignsAdd">下一步</Button>
        </div>
    </div>
</template>

<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
export default {
    name: "campaignList",
    data() {
        return {
            gdtConfig: gdtConfig,
            account_id: this.$route.query.account_id, //账户id
            height: document.body.clientHeight - 300,
            search: '',
            campaigns_list: [],
            copyList: [],
            campaign: {
                campaign_id: "",
                campaign_name: "",
                daily_budget: "",
                campaign_type: "",
                product_type: "",
                configured_status: "",
                speed_mode: ""
            }
        };
    },
    mounted() {
        this.getCampaigns();
    },
    methods: {
        //获取推广计划
        getCampaigns() {
            Axios.post("api.php", {
                action: "api",
                opt: "getcampaigns",
                MeidaType: "Gdt",
                account_id: this.account_id
            }).then(res => {
                if (res.ret == 1) {
                    this.campaigns_list = res.data;
                    this.copyList = res.data;
                }
            }).catch(err => {
                console.log("获取推广计划" + err);
            });
        },
        //下一步
        campaignsAdd() {
            if (this.campaign.campaign_id == "") {
                this.$Message.info("请填选择推广计划");
            } else {
                this.$router.push({
                    name: 'gdtad',
                    query: {
                        account_id: this.account_id,
                        campaign_id: this.campaign.campaign_id,
                        product_type: this.campaign.product_type,
                        configured_status: this.campaign.configured_status
                    }
                })
            }
        },
        //搜索
        filterData() {
            if (this.search === "") {
                this.campaigns_list = this.copyList;
                return
            }
            const all = this.copyList
            const filter = []
            const searchTxt = new RegExp(this.search, 'gmi');
            all.forEach(item => {
                if (item.campaign_name.search(searchTxt) != -1) {
                    filter.push(item)
                }
            })
            const retNull = [{ campaign_name: '无搜索结果,请重新搜索', landing_type_name: '' }]
            this.campaigns_list = filter.length < 1 ? retNull : filter
        },
        //选择推广计划
        changcampaigns(item) {
            this.campaign = item;
        }
    }
};
</script>