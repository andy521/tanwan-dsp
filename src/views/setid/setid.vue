<style>
@import "../../styles/common.less";
@import "../../styles/table.less";
</style>
<template>
    <div class="ad">
        <Card shadow>
            <Table :columns="columns" :size="tableSize" :data="AdsAccount" stripe></Table>
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
                <Page :total="total_number" :page-size="page_size" ref="pages" @on-change="getAdsAccount" show-elevator show-total></Page>
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
export default {
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
                                                rebate: params.row.rebate
                                            }).then(res => {
                                                if (res.ret == 1) {
                                                    this.$Message.info(res.msg);
                                                    this.getAdsAccount();
                                                }
                                            }).catch(err => {
                                                console.log("修改账号代理商，返点比例失败" + err);
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
                                                rebate: value
                                            }).then(res => {
                                                if (res.ret == 1) {
                                                    this.$Message.info(res.msg);
                                                    this.getAdsAccount();
                                                }
                                            }).catch(err => {
                                                console.log("修改账号代理商，返点比例失败" + err);
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
        //获取账号
        getAdsAccount(page) {
            if (page === undefined) {
                this.$refs['pages'].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            var data = {
                page: this.page,
                page_size: this.page_size
            }
            this.$store.dispatch('getAdsAccount', data);
        },
        //获取管理员
        getAdsAthour() {
            this.$store.dispatch('getAdsAthour');
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
    },
    computed: {
        //获取账号
        AdsAccount() {
            let adList = this.$store.state.setid.AdsAccount
            this.total_number = adList.total_number;
            this.total_page = adList.total_page;
            return adList.list;
        },
        //获取管理员
        AdsAthour() {
            let AdsAthour = this.$store.state.setid.AdsAthour;
            if (!AdsAthour[0]) return;
            this.uId = AdsAthour[0].uId;
            return AdsAthour;
        }
    }
};
</script>