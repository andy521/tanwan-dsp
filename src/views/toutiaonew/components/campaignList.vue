<style scoped>
.city_main {
  line-height: 36px;
  width: 500px;
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

.type {
  float: right;
  color: #999;
}
</style>
<template>
    <div>
        <Input v-model="search" placeholder="请输入计划名称" @on-change="filterData" @on-enter="filterData" size="large" style="width:500px;">
        <Button slot="append" icon="ios-search" @click="filterData">搜索</Button>
        </Input>
        <div class="clear margin-top-10">
            <div class="city_main">
                <div class="city_title">推广计划</div>
                <div class="city_box" :style="{height:height+'px'}">
                    <div class="item" v-for="item in campaigns_list" @click="checked(item)">
                        <span>{{item.campaign_name}}</span>
                        <div class="type" v-for="subitem in toutiaoConfig.landing_type" v-if="item.landing_type==subitem.val_type">{{subitem.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Axios from '@/api/index';
import toutiaoConfig from "@/utils/toutiaoConfig.json";
export default {
    name: 'campaignList',
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            height: document.body.clientHeight - 300,
            toutiaoConfig: toutiaoConfig,
            search: '',
            campaigns_list: [],
            copyList: []
        }
    },
    mounted() {
        this.getCampaigns()
    },
    methods: {
        //选中广告组跳转
        checked(campaign) {
            this.$router.push({
                name: 'ttad',
                query: {
                    account_id: this.account_id,
                    campaign_id: campaign.campaign_id,
                    landing_type: campaign.landing_type,
                }
            })
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
        //获取广告组列表
        getCampaigns() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getCampaigns',
                account_id: this.account_id
            }).then((res) => {
                if (res.ret === 1) {
                    this.campaigns_list = res.data;
                    this.copyList = res.data;
                }
            }).catch((err) => {
                console.error('choseList组件获取广告组详情失败', err)
            })
        }
    }
}
</script>
