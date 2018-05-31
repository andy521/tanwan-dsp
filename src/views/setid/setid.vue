<style scoped>
.width-250{
    width: 250px;
}
</style>

<template>
    <div class="ad">
        <Card shadow>
            <div>
                <select-agent @on-change="handleAgent"></select-agent>
                <select-author @on-change="handleAuthor"></select-author>
                <select-media @on-change="handleMedia" class="width-250"></select-media>
                <Input @on-enter="getAdsAccount" v-model="searchVal" placeholder="请输入账号ID或账号名称搜索" class="width-250"></Input>
                <Button @click="getAdsAccount"><Icon type="ios-search-strong"></Icon> &nbsp;搜索</Button>
            </div>
            <Table :columns="columns" :size="tableSize" :data="AdsAccount" stripe class="margin-top-10"></Table>
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
            uId: '',
            author_modal: false,
            row: '',
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            tableSize: 'small',
            AdsAthour: [],
            AdsAccount: [],
            searchVal: '', // 搜索
            authorList: [], // 刷选负责人
            mediaList: [], // 刷选media
            agentList: [], // 刷选agent
            columns: [{
                title: 'ID',
                key: 'id'
            },
            {
                title: '帐号ID',
                key: 'account_id'
            },
            {
                title: '帐号名',
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
                                                    this.getAdsAccount(this.page);
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
                                        render: h=> {
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
                                            }).then( res => {
                                                if (res.ret === 1) {
                                                    this.$Message.info(res.msg)
                                                    this.getAdsAccount(this.page)
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
                                                    this.getAdsAccount(this.page);
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
        //获取账号
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
                page: this.page,
                page_size: this.page_size,
                authors: this.authorList,
                agents: this.agentList,
                media_types: this.mediaList,
                word: this.searchVal
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
        //获取管理员
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
        },
        //修改管理员
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
        }
    }
};
</script>