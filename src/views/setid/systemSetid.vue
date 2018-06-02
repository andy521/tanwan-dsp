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
                    <Input @on-enter="getAccountList()" v-model="searchAccount" placeholder="支持账号名短语搜索" class="width-tab"></Input>
                    <Button @click="getAccountList()" icon="ios-search-strong">搜索</Button>
                </Col>
                <Col class="manger-head-bar">
                    <!-- 次为使用Transfer时的需求 -->
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
                                <Button v-if="isModal" @click="mutilEditAcPermission" type="primary">确认</Button>
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
        
        </Card>

        <!-- 次为使用Transfer时的需求 -->
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
import Axios from '@/api/index'
import selectAuthor from './components/check-author'
import selectMedia from './components/check-media'
import selectAgent from '@/components/select-agent'
export default {
    components: {
        selectAuthor,
        selectMedia,
        selectAgent
    },
    data() {
        return {
            isModal: false,
            tableSize: 'small',
            pageTotalNum: 0, // 总数量
            pageSize: 50, // 每页数量,
            page: 1, // 页码
            batchStatus: 0, // 批量修改权限状态
            checkedIdList: [], // 选中的id列表
            checkedUserAccountParams: [], // 批量编辑账户权限请求参数
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
                        return [
                            h('i-switch', {
                                props: {
                                    value: params.row.canEdit,
                                    size: 'small'
                                },
                                on: {
                                    'on-change': (isFlag) => {
                                        params.row.canEdit = isFlag
                                        console.log([params.row], 'xxxxxxxxxxxx')
                                        this.handleSingleEditAcPermission([params.row], isFlag)
                                    }
                                }
                            }),
                            h('span', {
                                class: 'iswitch-txt'
                            },  params.row.canEdit ? '是' : '否')
                        ]
                    }
                },
            ]
        }
    },
    mounted() {
        this.getAccountList()
    },
    methods: {
        // 关闭批量修改权限
        handleClose() {
            this.isModal = false
        },
        // 表单选中项
        handleSelectionChange(checkedList) {
            if (checkedList.length === 1) {
                this.checkedIdList = [checkedList[0].id]
                this.checkedUserAccountParams = {
                    [checkedList[0].sysUserId]: {
                        [checkedList[0].accountId]: checkedList[0].canEdit
                    }
                }
                return
            }
            let ret = []
            const userAccountParams = {}
            checkedList.forEach(checked => {
                ret.push(0)
                userAccountParams[checked.sysUserId] = {}
                userAccountParams[checked.sysUserId][checked.accountId] = checked.canEdit
                console.log(userAccountParams)
            })


            this.checkedIdList = ret
            this.checkedUserAccountParams = userAccountParams
            console.log(this.checkedUserAccountParams, '==========')
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
        changePermission(flagParam) {
            let flag = false
            if (typeof flagParam == 'undefined') {
                flag = this.batchStatus === 1
            } else {
                flag = flagParam
            }
            const checkedUser = this.checkedUserAccountParams
            for(let kp in checkedUser) {
                for(let kc in checkedUser[kp]) {
                    checkedUser[kp][kc] = flag
                    console.log(flag, checkedUser[kp][kc])
                }
            }
        },
        handleSingleEditAcPermission(checkedList, flag) {
            this.handleSelectionChange(checkedList)
            this.changePermission(flag)
            this.mutilEditAcPermission()
        },
        // 批量编辑账户权限
        mutilEditAcPermission() {
            if (this.checkedIdList.length !== 0) {
                this.changePermission()
            }

            Axios.post('api.php', {
                action: 'sys',
                opt: 'mutilEditAcPermission',
                userAccount: JSON.stringify(this.checkedUserAccountParams)
            }).then(res => {
               if (res.ret === 1) {
                   this.$Message.info(res.msg)
                   this.isModal = false
                   this.getAccountList(this.page)
               }
            }).catch(err => {
                console.log('批量编辑账户权限错误:' + err)
            })
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
                   this.accountList = res.data.list
                   this.pageTotalNum = +res.data.page.totalCount
                   this.pageSize = +res.data.page.numPerPage
                   this.page = +res.data.page.pageNum
                   console.log(res.data.page)
               }
            }).catch(err => {
                console.log('获取权限账号名列表错误:' + err)
            })
        },
        // 次为使用Transfer时的需求
        // handleAccountChange(seleAccount) {
        //     this.permissionAssignAccount = seleAccount
        // },
        // filterMethod(data, query) {
        //     return data.label.indexOf(query) > -1
        // }
    }
}
</script>
