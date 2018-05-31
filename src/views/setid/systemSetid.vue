<style>
@import "../../styles/table.less";
.ivu-modal-confirm-body.ivu-modal-confirm-body-render{
    text-align: center;
}
</style>
<style scoped>
.width-tab{
    width: 170px;
}
.manger-head-bar:first-of-type{
    flex: 1;
    text-align: left;
}
.manger-head-bar:last-of-type{
    flex: 0 0 160px;
    width: 160px;
    text-align: right;
}
</style>

<template>
    <div class="ad">
        <Card shadow>
            <Row type="flex" justify="space-between">
                <Col class="manger-head-bar">
                    <select-agent @on-change="handleAgent"></select-agent>
                    <select-author @on-change="handleAuthor"></select-author>
                    <select-media @on-change="handleMedia" class="width-tab"></select-media>
                    <Input @on-enter="getAdsAccount" v-model="searchVal" placeholder="支持账号名短语搜索" class="width-tab"></Input>
                    <Button @click="getAdsAccount"><Icon type="ios-search-strong"></Icon> &nbsp;搜索</Button>
                </Col>
                <Col class="manger-head-bar">
                    <Button @click="handleViewAccount"><Icon type="ios-eye"></Icon> &nbsp;查看</Button>
                    <Button @click="handleEdieAccount"><Icon type="edit"></Icon> &nbsp;编辑</Button>
                </Col>
            </Row>

            <Table :columns="columns" :size="tableSize" :data="AdsAccount" stripe class="margin-top-10"></Table>

            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="pageSize" style="width:80px" placement="top" transfer @on-change="getAdsAccount()">
                    <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                <Page :current="page" :total="pageTotalNum" :page-size="pageSize" ref="pages" @on-change="getAdsAccount" show-elevator show-total></Page>
                </Col>
            </Row>

            <!-- <Select v-model="uId" style="width:200px" @on-change="getOpAccountUId" placeholder="请选择负责人">
                <Option v-for="item in AdsAthour" :value="item.uId" :key="this">{{ item.uName }}</Option>
            </Select>
            <Tree :data="newAdsAcccountJson" show-checkbox multiple class="margin-top-20" @on-check-change="handleCheckChange"></Tree>
            <Button type="primary" class="margin-top-20" :loading="loading" @click="submitform" style="width: 100px;">
                <span v-if="!loading">确定</span>
                <span v-else>提交中...</span>
            </Button> -->
        
        
        </Card>

        <Modal v-model="isModal" title="权限修改" @on-ok="handleModalOk">
            <Transfer
                :data="permissionAccount"
                :target-keys="permissionAssignAccount"
                filterable
                :filter-method="filterMethod"
                @on-change="handleAccountChange">
            </Transfer>
        </Modal>
    </div>
</template>

<script>
import Axios from '@/api/index';
import selectAuthor from '@/components/select-author';
import selectMedia from '@/components/select-media';
import selectAgent from '@/components/select-agent';
export default {
    components: {
        selectAuthor,
        selectMedia,
        selectAgent
    },
    data() {
        return {
            isModal: false,
            loading: false,
            permissionAccount: [
                { "key": "1", "label": "Content 1", "disabled": false },
                { "key": "2", "label": "Content 2", "disabled": true },
                { "key": "3", "label": "Content 3", "disabled": false }
            ],
            permissionAssignAccount: ["1","2"],
            searchVal: '', // 搜索
            authorList: [], // 刷选负责人
            mediaList: [], // 刷选media
            agentList: [], // 刷选agent
            AdsAccount: [
                {
                    account_name: 'aci',
                    agent: 'agent',
                    author: 'author',
                    position:'postion',
                    media_name: 'media_name'
                }
            ], // 表单
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '账号名',
                    key: 'account_name'
                },
                // {
                //     title: '代理',
                //     key: 'agent'
                // },
                // {
                //     title: '负责人',
                //     key: 'author'
                // },
                {
                    title: '职位',
                    key: 'position'
                },
                {
                    title: '媒体',
                    key: 'media_name'
                },
                {
                    title: '可查看',
                    key: 'show',
                    render: (h, params) => {
                        return h('span', {
                                class: 'name_text',
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '权限修改',
                                            width: 520,
                                            render: h => {
                                                return h('Transfer', {
                                                    props: {
                                                        data: [],
                                                        targetKeys: [],
                                                    },
                                                    class: ['margin-top-20', 'inline-block', 'text-left']
                                                })
                                            },
                                            onOK: () => {
                                                
                                            }
                                        })
                                    }
                                },
                            }, '编辑')
                    }
                },
                {
                    title: '可编辑',
                    key: 'edit',
                    render: (h, params) => {
                        return h('span', {
                                class: 'name_text',
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            title: '权限修改',
                                            width: 520,
                                            render: h => {
                                                return h('Transfer', {
                                                    props: {
                                                        data: [],
                                                        targetKeys: [],
                                                    },
                                                    class: ['margin-top-20', 'inline-block', 'text-left']
                                                })
                                            },
                                            onOK: () => {

                                            }
                                        })
                                    }
                                },
                            }, '编辑')
                    }
                },
            ],
            tableSize: 'small',
            pageTotalNum: 0, // 总数量
            pageSize: 50, // 每页数量,
            page: 1, // 第几页的数据

            uId: '',
            ids: [], //已配置管理员
            AdsAthour: [], //管理员
            AdsAcccountJson: [],//帐号列表
        }
    },
    mounted() {
        this.getAdsAthour();
        this.getAdsAcccountJson();
    },
    methods: {
        // 媒体数据
        handleMedia(mediaTypeList) {
            this.mediaList = mediaTypeList
            this.getAdsAccount()
        },
        // 代理商数据
        handleAgent(agentList) {
            this.agentList = agentList
            this.getAdsAccount()            
        },
        // 负责人数据
        handleAuthor(authorList) {
            this.authorList = authorList
            this.getAdsAccount()            
        },
        handleCheckChange() {},
        handleViewAccount() {},
        handleEdieAccount() {},
        handleModalOk() {

        },
        handleAccountChange(seleAccount) {
            this.permissionAssignAccount = seleAccount
        },
        // 搜索权限账号
        filterMethod(data, query) {
            return data.label.indexOf(query) > -1
        },
        getAdsAccount() {},
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