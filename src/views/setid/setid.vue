<style scoped>
.width-250 {
  width: 170px;
}
.manger-head-bar:first-of-type {
  flex: 1;
  text-align: left;
}
.manger-head-bar:last-of-type {
  flex: 0 0 110px;
  width: 110px;
  text-align: right;
}
</style>

<template>
    <div class="setid">
        <Card shadow>
            <Row type="flex" justify="space-between">
                <Col class="manger-head-bar">
                <select-agent @on-change="handleAgent"></select-agent>
                <select-author @on-change="handleAuthor"></select-author>
                <select-media @on-change="handleMedia"></select-media>
                <Input @on-enter="getAdsAccount()" v-model="searchVal" placeholder="支持账号ID或账号名称搜索" class="width-250"></Input>
                <Button @click="getAdsAccount()">
                    <Icon type="ios-search-strong"></Icon> &nbsp;搜索</Button>
                </Col>
                <Col class="manger-head-bar">
                <Button @click="handleBatchEdit">
                    <Icon type="edit"></Icon> &nbsp;批量修改</Button>
                </Col>
            </Row>

            <Table @on-selection-change="handleSelectionChange" :columns="columns" :size="tableSize" :data="AdsAccount" stripe class="margin-top-10"></Table>
            <Row class="margin-top-10">
                <Col span="10"> 表格尺寸
                <Radio-group v-model="tableSize" type="button">
                    <Radio label="large">大</Radio>
                    <Radio label="default">中</Radio>
                    <Radio label="small">小</Radio>
                </Radio-group>
                每页显示
                <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getAdsAccount()">
                    <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
                </Select>
                </Col>
                <Col span="14" style="text-align: right;">
                <Page :current="page" :total="total_number" :page-size="page_size" ref="pages" @on-change="getAdsAccount" show-elevator show-total></Page>
                </Col>
            </Row>
        </Card>

        <Modal v-model="author_modal" title="选择管理员" @on-ok="changeauthor">
            <div class="padding-10">
                <Select v-model="uId">
                    <Option v-for="item in AdsAthour" :value="item.uId" :key="this">{{ item.uName }}</Option>
                </Select>
            </div>
        </Modal>
        <Modal v-model="batch_modal" title="批量修改" @on-ok="updateAdsAccount">
            <div class="padding-10">
                <Row type="flex" align="middle">
                    <Col>修改的指标：</Col>
                    <Col class="flex-1">
                    <Select @on-change="handleBatchIndexChange" v-model="currBatchIndex.type" placeholder="请选择修改指标">
                        <Option v-for="(value, key) of batchIndex" :value="key" :key="this">{{ value.name }}</Option>
                    </Select>
                    </Col>
                </Row>
                <Row v-if="currBatchIndex.type !== ''" type="flex" align="middle" class="margin-top-20">
                    <Col>{{currBatchIndex.name}}修改为：</Col>
                    <Col class="flex-1">
                    <Input v-if="currBatchIndex.type !== 'author'" @on-change="handleModalInput" v-model="currBatchIndex.value" :placeholder="`请输入${currBatchIndex.name}内容...`"></Input>
                    <Select v-if="currBatchIndex.type === 'author'" v-model="currBatchIndex.value" placeholder="请选择负责人">
                        <Option v-for="item in AdsAthour" :value="item.uId" :key="this">{{ item.uName }}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from '@/api/index';
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
            uId: '',
            author_modal: false,
            batch_modal: false,
            row: '',
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            tableSize: 'small',
            AdsAthour: [],
            AdsAccount: [],
            checkedIdList: [], // 选中的id列表
            searchVal: '', // 搜索
            authorList: [], // 筛选负责人
            mediaList: [], // 筛选media
            agentList: [], // 筛选agent
            // 批量修改指标结构
            batchIndex: {
                agent: {
                    name: '代理商',
                    value: ''
                },
                agent_detail: {
                    name: '代理全称',
                    value: ''
                },
                author: {
                    name: '负责人',
                    value: ''
                },
                rebate: {
                    name: '返点',
                    value: ''
                }
            },
            currBatchIndex: {
                type: '',
                name: '',
                value: ''
            },
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'ID',
                    width: 60,
                    key: 'id'
                },
                {
                    title: '帐号ID',
                    key: 'account_id'
                },
                {
                    title: '帐号名',
                     width:250,
                    key: 'account_name'
                },
                {
                    title: '管理员',
                    key: 'author',
                    render: (h, params) => {
                        let value = params.row.author;
                        return [
                            h('span', params.row.author),
                            h('i-button', {
                                props: {
                                    icon: "edit",
                                    type: "text",
                                    size: "small"
                                },
                                class: ['edit'],
                                on: {
                                    click: () => {
                                        this.row = params.row;
                                        this.uId = params.row.uid;
                                        this.author_modal = true;
                                    }
                                }
                            })
                        ]
                    }
                },
                {
                    title: '媒体名',
                    key: 'media_name'
                },
                {
                    title: '代理商',
                    key: 'agent',
                    render: (h, params) => {
                        let value = params.row.agent;
                        return [
                            h("span", params.row.agent),
                            h("i-button", {
                                props: {
                                    icon: "edit",
                                    type: "text",
                                    size: "small"
                                },
                                class: ["edit"],
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            render: h => {
                                                return h("Input", {
                                                    props: {
                                                        value: params.row.agent,
                                                        autofocus: true,
                                                        placeholder: "请输入代理商"
                                                    },
                                                    on: {
                                                        input: val => {
                                                            value = val;
                                                        }
                                                    }
                                                });
                                            },
                                            onOk: () => {
                                                if (value == "") {
                                                    this.$Message.info("请输入修改信息");
                                                    return;
                                                }

                                                Axios.post("api.php", {
                                                    action: "sys",
                                                    opt: "updateAdsAccount",
                                                    ids: params.row.id.split(","),
                                                    agent: value,
                                                    rebate: params.row.rebate,
                                                    agent_detail: params.row.agent_detail
                                                }).then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(res.msg);
                                                        this.getAdsAccount();
                                                    }
                                                }).catch(err => {
                                                    console.log("修改账号代理商失败" + err);
                                                });
                                            }
                                        });
                                    }
                                }
                            })
                        ];
                    }
                },
                {
                    title: "代理全称",
                    width:250,
                    key: "agent_detail",
                    render: (h, params) => {
                        let value = params.row.agent_detail;
                        return [
                            h('span', value),
                            h('i-button', {
                                props: {
                                    icon: 'edit',
                                    type: 'text',
                                    // size: 'small'
                                },
                                class: ['edit'],
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            render: h => {
                                                return [
                                                    h('i-input', {
                                                        props: {
                                                            value: value,
                                                            autofocus: true,
                                                            placeholder: '请输入代理全称'
                                                        },
                                                        on: {
                                                            input: val => {
                                                                value = val
                                                            }
                                                        }
                                                    })
                                                ]
                                            },
                                            onOk: () => {
                                                if (value == '') {
                                                    this.$Message.info('请输入修改信息')
                                                    return
                                                }

                                                Axios.post('api.php', {
                                                    action: 'sys',
                                                    opt: 'updateAdsAccount',
                                                    ids: params.row.id.split(","),
                                                    agent: params.row.agent,
                                                    rebate: params.row.rebate,
                                                    agent_detail: value
                                                }).then(res => {
                                                    if (res.ret === 1) {
                                                        this.$Message.info(res.msg)
                                                        this.getAdsAccount()
                                                    }
                                                }).catch(err => {
                                                    console.error('修改账号代理全称失败', err)
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        ]
                    }
                },
                {
                    title: '返点比例',
                    key: 'rebate',
                    render: (h, params) => {
                        let value = params.row.rebate;
                        return [
                            h("span", params.row.rebate),
                            h("i-button", {
                                props: {
                                    icon: "edit",
                                    type: "text",
                                    size: "small"
                                },
                                class: ["edit"],
                                on: {
                                    click: () => {
                                        this.$Modal.confirm({
                                            render: h => {
                                                return h("Input", {
                                                    props: {
                                                        value: params.row.rebate,
                                                        autofocus: true,
                                                        placeholder: "请输入返点比例"
                                                    },
                                                    on: {
                                                        input: val => {
                                                            value = val;
                                                        }
                                                    }
                                                });
                                            },
                                            onOk: () => {
                                                if (value == "") {
                                                    this.$Message.info("请输入修改信息");
                                                    return;
                                                }

                                                Axios.post("api.php", {
                                                    action: "sys",
                                                    opt: "updateAdsAccount",
                                                    ids: params.row.id.split(","),
                                                    agent: params.row.agent,
                                                    rebate: value,
                                                    agent_detail: params.row.agent_detail
                                                }).then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(res.msg);
                                                        this.getAdsAccount();
                                                    }
                                                }).catch(err => {
                                                    console.log("修改账号返点比例失败" + err);
                                                });
                                            }
                                        });
                                    }
                                }
                            })
                        ];
                    }
                }
            ]
        }
    },
    mounted() {
        this.getAdsAccount();
        this.getAdsAthour();
    },
    methods: {
        handleModalInput(value) {
            const num = +value.target.value
            if (this.currBatchIndex.type === 'rebate' && isNaN(num)) {
                this.currBatchIndex.value = ''
            }
        },
        handleBatchEdit() {
            if (this.checkedIdList.length === 0) {
                this.$Message.info('请勾选用户')
                return
            }
            this.batch_modal = !this.batch_modal
        },
        // 批量修改指标
        handleBatchIndexChange(indexType) {
            const batchIndex = this.batchIndex
            for (let key in batchIndex) {
                if (key == indexType) {
                    this.currBatchIndex.name = batchIndex[key].name
                } else {
                    this.currBatchIndex.value = ''
                }
            }
        },
        // 表单选中项
        handleSelectionChange(checkedList) {
            if (checkedList.length === 1) {
                this.checkedIdList = [checkedList[0].id]
                return
            }
            const ret = []
            checkedList.forEach(checked => {
                ret.push(checked.id)
            })
            this.checkedIdList = ret
        },
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
        initAdsAccountParams() {
            const batchIndex = this.batchIndex
            const currBatchIndex = this.currBatchIndex
            for (let key in batchIndex) {
                if (key == currBatchIndex.type) {
                    batchIndex[key].value = currBatchIndex.value
                } else {
                    batchIndex[key].value = ''
                }
            }

            return {
                action: 'sys',
                opt: 'updateAdsAccount',
                ids: this.checkedIdList,
                agent: this.batchIndex.agent.value,
                agent_detail: this.batchIndex.agent_detail.value,
                rebate: +this.batchIndex.rebate.value,
                inchargeId: this.batchIndex.author.value
            }
        },
        // 批量修改指定指标
        updateAdsAccount() {
            if (this.currBatchIndex.value === '' && this.currBatchIndex.type !== 'rebate') {
                this.$Message.info(`${this.currBatchIndex.name}不能为空，请输入内容`)
                this.$nextTick(() => {
                    this.batch_modal = true
                })
                return
            }

            // const params = this.initAdsAccountParams()
            const params = {
                action: 'sys',
                opt: 'updateAdsAccount',
                ids: this.checkedIdList,
                [this.currBatchIndex.type]: this.currBatchIndex.value,            
            }
            Axios.post('api.php', params)
                .then(res => {
                    if (res.ret === 1) {
                        this.$Message.info(`修改${this.currBatchIndex.name}成功`)
                        this.getAdsAccount()
                    }
                }).catch(err => {
                    console.log('批量修改错误', err)
                })
        },
        // 修改管理员
        changeauthor() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'AdsAccountAdd',
                do: 'edit',
                id: this.row.id,
                account_id: this.row.account_id,
                account_name: this.row.account_name,
                mediaId: this.row.mediaId,
                uId: this.uId
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                        this.getAdsAccount();
                    }
                }
            ).catch(
                err => {
                    console.log('修改帐户失败' + err)
                }
            )
        },
        // 获取账号列表
        getAdsAccount(page) {
            if (page === undefined) {
                this.$refs['pages'].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            Axios.get('api.php', {
                action: 'sys',
                opt: 'getAdsAccount',
                account: this.searchVal,
                inChargeId: this.authorList,
                agentName: this.agentList,
                mediaTypeId: this.mediaList,
                page: this.page,
                page_size: this.page_size,
            }).then(res => {
                if (res.ret == 1) {
                    this.AdsAccount = res.data.list;
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                }
            }).catch(
                err => {
                    console.log('帐号列表' + err)
                }
            )
        },
        // 获取管理员
        getAdsAthour() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'getAdsAthour'
            }).then(res => {
                if (res.ret == 1) {
                    this.AdsAthour = res.data;
                }
            }).catch(err => {
                console.log('获取管理员' + err)
            })
        }
    }
};
</script>
