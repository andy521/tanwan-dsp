<style>
@import "../../styles/common.less";
</style>
<template>
    <div class="ad">
        <Card shadow>
            <Select v-model="uId" style="width:200px" @on-change="getOpAccountUId" placeholder="请选择负责人">
                <Option v-for="item in AdsAthour" :value="item.uId" :key="this">{{ item.uName }}</Option>
            </Select>
            <Tree :data="newAdsAcccountJson" show-checkbox multiple class="margin-top-20" @on-check-change="changeTree"></Tree>
            <Button type="primary" class="margin-top-20" :loading="loading" @click="submitform" style="width: 100px;">
                <span v-if="!loading">确定</span>
                <span v-else>提交中...</span>
            </Button>
        </Card>
    </div>
</template>

<script>
import Axios from '@/api/index';
export default {
    data() {
        return {
            loading: false,
            uId: '',
            ids: [], //已配置管理员
            AdsAthour: [], //管理员
            AdsAcccountJson: []//帐号列表
        }
    },
    mounted() {
        this.getAdsAthour();
        this.getAdsAcccountJson();
    },
    methods: {
        //获取管理员
        getAdsAthour() {
            Axios.get('api.php', {
                action: 'sys',
                opt: 'getAdsAthour'
            }).then(res => {
                if (res.ret == 1) {
                    this.AdsAthour = res.data;
                }
            }).catch(err => {
                console.log('获取管理员' + err)
            })
        },
        //帐号列表json
        getAdsAcccountJson() {
            Axios.get('api.php', {
                action: 'sys',
                opt: 'getAdsAcccountJson'
            }).then(res => {
                if (res.ret == 1) {
                    this.AdsAcccountJson = res.data;
                }
            }).catch(
                err => {
                    console.log('帐号列表json' + err)
                }
            )
        },
        //获取已配置管理员
        getOpAccountUId() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'getOpAccount',
                uId: this.uId
            }).then(res => {
                if (res.ret == 1) {
                    this.ids = res.data;
                }
            }).catch(
                err => {
                    console.log('帐号列表json' + err)
                }
            )
        },
        //点击树节点时触发
        changeTree(data) {
            var ids = [];
            data.forEach(item => {
                if (!item.children) {
                    ids.push(item.label);
                }
            })
            this.ids = ids;
        },
        //确定
        submitform() {
            this.loading = true;
            Axios.post('api.php', {
                action: 'sys',
                opt: 'opAccountList',
                id: this.ids,
                uId: this.uId,
            }).then(
                res => {
                    this.loading = false;
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                    }
                }
            ).catch(
                err => {
                    this.loading = false;
                    console.log('提交失败' + err)
                }
            )
        }
    },
    computed: {
        //帐号列表json
        newAdsAcccountJson() {
            let list = this.AdsAcccountJson;
            let newlist = [];
            list.forEach(item => {
                let children = [];
                item.list.forEach(item => {
                    let checked = false;
                    this.ids.forEach(v => {
                        if (v == item.id) {
                            checked = true;
                        }
                    })
                    let newitem = {
                        title: item.account_name,
                        label: item.id,
                        checked: checked
                    }
                    children.push(newitem)
                });
                let newitem = {
                    title: item.media_name,
                    label: item.id,
                    expand: true,
                    children: children
                }
                newlist.push(newitem)
            });
            return newlist;
        }
    }
};
</script>
