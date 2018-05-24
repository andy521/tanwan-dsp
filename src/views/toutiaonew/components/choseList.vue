<style scoped>
.panel {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  border: 1px solid #dee4f5;
  border-radius: 2px;
  overflow-y: auto;
}
.panel-item {
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  cursor: pointer;
}
.panel-item:hover {
  background-color: rgba(0, 0, 0, 0.06);
}
.type {
  color: #999;
}
</style>
<template>
    <Row class="margin-top-20">
        <Col span="12">
        <Input v-model="search" placeholder="请输入计划名称" @on-change="filterData" @on-enter="filterData">
        <Button slot="append" icon="ios-search" @click="filterData">搜索</Button>
        </Input>
        <div class="panel" :style="{maxHeight:height+'px'}">
            <div @click="checked(item)" v-for="item in campaigns_list" :key="this" class="panel-item">
                <div>{{item.campaign_name}}</div>
                <div class="type" v-for="subitem in toutiaoConfig.landing_type" v-if="item.landing_type==subitem.val_type">{{subitem.name}}</div>
            </div>
        </div>
        </Col>
    </Row>
</template>
<script>
import Axios from '@/api/index';
import toutiaoConfig from "@/utils/toutiaoConfig.json";
export default {
    name: 'choList',
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            height: document.body.clientHeight - 200,
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
                opt: 'getCampaigns'
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
