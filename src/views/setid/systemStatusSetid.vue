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
    flex: 0 0 110px;
    width: 110px;
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
                    <select-media @on-change="handleMedia"></select-media>
                    <Input @on-enter="getAccountList" v-model="searchAccount" placeholder="支持账号名短语搜索" class="width-tab"></Input>
                    <Button @click="getAccountList" icon="ios-search-strong">搜索</Button>
                </Col>
                <Col class="manger-head-bar">
                    <!-- <Button @click="handleEditPression" icon="edit">权限管理</Button> -->
                    <Poptip placement="bottom-start" v-model="isModal">
                        <Button @click="handleEditPression" icon="edit">修改权限</Button>
                        <div v-if="isModal" slot="content">
                            <Select v-model="batchStatus" placeholder="请选择权限" class="text-left">
                                <Option :value="1">开启权限</Option>
                                <Option :value="0">关闭权限</Option>
                            </Select>
                            <div class="text-right margin-top-10">
                                <Button @click="handleClose">关闭</Button>
                                <Button v-if="isModal" @click="editPression" type="primary">确认</Button>
                                <span v-else>提交中...</span>
                            </div>
                        </div>
                    </Poptip>
                </Col>
            </Row>

            <Table @on-selection-change="handleSelectionChange" :columns="columns" :size="tableSize" :data="accountList" stripe class="margin-top-10"></Table>

            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="pageSize" style="width:80px" placement="top" transfer @on-change="getAccountList()">
                    <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                <Page :current="page" :total="pageTotalNum" :page-size="pageSize" ref="pages" @on-change="getAccountList" show-elevator show-total></Page>
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

        <!-- <Modal v-model="isModal" title="权限修改" @on-ok="handleModalOk">
            <Transfer
                :data="permissionAccount"
                :target-keys="permissionAssignAccount"
                filterable
                :filter-method="filterMethod"
                @on-change="handleAccountChange">
            </Transfer>
        </Modal> -->

    </div>
</template>

<script>
import Axios from '@/api/index';
import selectAuthor from './components/check-author';
import selectMedia from './components/check-media';
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
            tableSize: 'small',
            pageTotalNum: 0, // 总数量
            pageSize: 50, // 每页数量,
            page: 1, // 第几页的数据
            batchStatus: 0, // 批量修改权限状态
            checkedIdList: [], // 选中的id列表
            searchAccount: '', // 账号名搜索
            authorList: [], // 刷选负责人
            mediaList: [], // 刷选media
            agentList: [], // 刷选agent
            accountList: [], // 表单数据
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '账号名',
                    key: 'accountName'
                },
                {
                    title: '代理',
                    key: 'agent'
                },
                {
                    title: '负责人',
                    key: 'inChargeName'
                },
                {
                    title: '职位',
                    key: 'level'
                },
                {
                    title: '媒体',
                    key: 'mediaTypeName'
                },
                {
                    title: '用户名',
                    key: 'sysUserName'
                },
                {
                    title: '编辑权限',
                    key: 'canEdit',
                    render: (h, params) => {
                        let flag = params.row.edit
                        return [
                            h('i-switch', {
                                props: {
                                    value: flag,
                                    size: 'small'
                                }
                            }),
                            h('span', {
                                class: 'iswitch-txt'
                            },  flag ? '是' : '否')
                        ]
                    }
                },
            ],

            uId: '',
            ids: [], //已配置管理员
            AdsAthour: [], //管理员
            AdsAcccountJson: [],//帐号列表
        }
    },
    mounted() {
        this.getAccountList()

        this.getAdsAthour();
        this.getAdsAcccountJson();
    },
    methods: {
        // 关闭批量修改权限
        handleClose() {
            this.isModal = false
        },
        // 表单选中项
        handleSelectionChange(checkedList) {
            if (checkedList.length === 1) {
                this.checkedIdList = [checkedList.id]
                return
            }
            const ret = []
            checkedList.forEach(checked => {
                ret.push = checked.id
            })
            this.checkedIdList = ret
        },
        // 媒体数据
        handleMedia(mediaTypeList) {
            this.mediaList = mediaTypeList
            this.getAccountList()
        },
        // 代理商数据
        handleAgent(agentList) {
            this.agentList = agentList
            this.getAccountList()            
        },
        // 负责人数据
        handleAuthor(authorList) {
            this.authorList = authorList
            this.getAccountList()            
        },
        handleEditPression() {
            if (this.checkedIdList.length === 0) {
                this.$Message.info('请勾选用户')
                this.$nextTick(() => {
                    this.isModal = false
                })
                return
            }
            this.isModal = !this.isModal
        },
        editPression() {
            Axios.post('api.php', {
            }).then(res => {
               if (res.ret === 1) {
                   this.$Message.info(res.msg)
                   this.isModal = false
               }
            }).catch(err => {
                console.log('%c批量修改错误:' + err)
            })
        },
        handleAccountChange(seleAccount) {
            this.permissionAssignAccount = seleAccount
        },
        // 搜索权限账号
        filterMethod(data, query) {
            return data.label.indexOf(query) > -1
        },
        // 获取帐户名列表
        getAccountList(page) {
            if (page == undefined) {
                this.page = 1
            } else {
                this.page = page
            }
            console.log(this.agentList, this.mediaList, this.authorList, 'sss')
            Axios.post('api.php', {
                action: 'sys',
                opt: 'accountList',
                pageNum: this.page,
                numPerPage: this.pageSize,
                accountName: this.searchAccount,
                agentName: this.agentList,
                mediaTypeId: this.mediaList,
                inChargeId: this.authorList
            }).then(res => {
               if (res.ret === 1) {
                   console.log(res)
                   this.$Message.info(res.msg)
                   this.isModal = false
               }
            }).catch(err => {
                console.log('获取权限账号名列表错误:' + err)
            })
        },
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
