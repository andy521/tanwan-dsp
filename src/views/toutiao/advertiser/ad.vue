<style scoped>
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.toutiaoad .ivu-poptip {
  display: inline-block;
}
.sel_state {
  text-align: left;
  width: 110px;
}
.ivu-tooltip-inner {
  white-space: normal;
}
.budget-txt {
  margin-bottom: 10px;
}
.budget-txt2 {
  color: #999;
  margin-top: 10px;
}
</style>
<template>
    <div class="toutiaoad">
        <Card dis-hover class="margin-top-10">
            <Row>
                <Col span="16">
                <Button type="primary" @click="back" v-if="campaign_id">返回</Button>
                <!--搜索游戏列表-->
                <search-tree @on-change="getids"></search-tree>
                <Input class="inp" placeholder="请输入广告计划ID或关键词" v-model="keyword" @on-enter="getCampaignsList()"></Input>
                <Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
                </Col>
                <Col span="8" style="text-align: right;">
                <Button type="ghost" icon="stats-bars" @click="Echartsmodel=!Echartsmodel;">图表</Button>
                <selectAccount title="新建广告计划" @on-change="add" mediaType="4"></selectAccount>
                </Col>
            </Row>
        </Card>
        <Card dis-hover class="margin-top-10" v-if="Echartsmodel">
            <campaign-echarts></campaign-echarts>
        </Card>
        <Card dis-hover class="margin-top-10">
            <Row>
                <Col span="20">
                <!--自定义指标-->
                <view-tip @on-change="getuncheck" :check="checkAllGroup" action="ttAdPut" opt="searchAdgroups"></view-tip>
                <Select placeholder="投放目的" v-model="landing_type" class="sel_state" @on-change="getCampaignsList()">
                    <Option value="">不限</Option>
                    <Option :value="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="item.val_type">{{item.name}}</Option>
                </Select>
                <Select placeholder="操作状态" v-model="status" class="sel_state" @on-change="getCampaignsList()">
                    <Option value="">不限</Option>
                    <Option value="AD_STATUS_ENABLE">启用</Option>
                    <Option value="AD_STATUS_DISABLE">暂停</Option>
                </Select>
                <!--选择负责人-->
                <select-author @on-change="authorChange"></select-author>
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                </Col>
                <Col span="4" style=" text-align: right;">
                <Poptip placement="bottom-end" v-model="visible">
                    <Button type="ghost" icon="edit">批量修改</Button>
                    <div class="api" slot="content">
                        <div style="text-align: left;">
                            <Select v-model="edit_status">
                                <Option value="enable">启用</Option>
                                <Option value="disable">暂停</Option>
                                <Option value="delete">删除</Option>
                            </Select>
                        </div>
                        <div class="tipbtn margin-top-10">
                            <Button type="text" size="small" @click="visible=false">取消</Button>
                            <Button type="primary" size="small" @click="editStatus()">确定</Button>
                        </div>
                    </div>
                </Poptip>
                </Col>
            </Row>
            <div>
                <Table :data="newAdList" :height="height" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="toutiaoAdTable" @on-selection-change="taCheck" @on-sort-change="sortchange" stripe :row-class-name="rowClassName"></Table>
                <Row class="margin-top-10">
                    <Col span="10"> 表格尺寸
                    <Radio-group v-model="tableSize" type="button">
                        <Radio label="large">大</Radio>
                        <Radio label="default">中</Radio>
                        <Radio label="small">小</Radio>
                    </Radio-group>
                    每页显示
                    <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getCampaignsList()">
                        <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
                    </Select>
                    </Col>
                    <Col span="14" style="text-align: right;">
                    <Page :total="total_number" :page-size="page_size" ref="pages" @on-change="getCampaignsList" show-elevator show-total></Page>
                    </Col>
                </Row>
            </div>
        </Card>
    </div>
</template>
<script>
import Axios from "@/api/index";
import selectAccount from "@/components/select-account/index.vue";
import viewTip from "../components/viewPopti.vue";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import searchTree from "@/components/select-tree/searchTree.vue";
import campaignEcharts from "../components/campaignEcharts.vue";
import selectAuthor from "@/components/select-author/index.vue";
import toutiaoConfig from '@/utils/toutiaoConfig.json';
export default {
    components: {
        selectAccount,
        viewTip,
        searchTree,
        campaignEcharts,
        selectAuthor
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            campaign_id: this.$route.query.campaign_id,
            height: document.body.clientHeight - 300,
            checkAllGroup: ["impression"], //默认选中的
            uncheck: [], //没选中的
            visible: false,
            Echartsmodel: false,
            edit_status: "", //批量状态
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            loading: false,
            taCheckids: [], //选中ids
            account_ids: [], // 选中的账号id
            options: DateShortcuts, //日期辅助功能
            status: "", //状态
            landing_type: "", //推广目的
            keyword: "", //关键字
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            author_model: [], //负责人
            game_id: "", //游戏ID
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            newAdList: []
        };
    },
    mounted() {
        this.getCampaignsList();
    },
    methods: {
        //获取选中的游戏id
        getids(gid) {
            this.game_id = "[" + gid.join(",") + "]";
            this.getCampaignsList();
        },
        //返回没有选中的
        getuncheck(val) {
            this.uncheck = val;
        },
        //获取选中的id
        taCheck(row) {
            let ids = [];
            let account_ids = [];
            row.forEach(item => {
                ids.push(item.id);
                account_ids.push(item.account_id)
            });
            this.taCheckids = ids;
            this.account_ids = account_ids
        },
        //选择负责人
        authorChange(data) {
            this.author_model = data;
            this.getCampaignsList();
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection =
                column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getCampaignsList();
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getCampaignsList();
        },
        //新增
        add(account_id) {
            this.$router.push({
                name: "ttcampaign",
                query: { account_id: account_id }
            });
        },
        //修改状态
        editStatus() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "updateAdgroupStatus",
                ids: this.taCheckids,
                account_ids: this.account_ids,
                opt_status: this.edit_status
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                        this.visible = false;
                        this.getCampaignsList(this.page);
                    }
                })
                .catch(err => {
                    console.log("修改状态失败" + err);
                });
        },
        //获取实时投放计划
        getCampaignsList(page) {
            if (page === undefined) {
                this.$refs["pages"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "searchAdgroups",
                campaign_id: this.campaign_id,
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                authors: this.author_model, //负责人
                keyword: this.keyword, //关键字
                status: this.status, //状态
                game_ids: this.game_id, //游戏id数组
                landing_type: this.landing_type, //推广目的
                orderField: this.orderField, //排序的orderField参数名
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                page: this.page, //页码
                page_size: this.page_size //每页数量
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    //添加统计
                    if (res.data.list.length > 1) {
                        res.data.curr_page_total._disabled = true;
                        res.data.list.unshift(res.data.curr_page_total);
                        res.data.list.push(res.data.curr_page_total);
                    }
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                    this.newAdList = res.data.list;
                }
            }).catch(err => {
                this.loading = false;
                console.log("今日头条广告组" + err);
            });
        },
        //返回
        back() {
            this.$router.go(-1);
        },
    },
    beforeMount() { },
    computed: {
        //设置表格头部
        taColumns() {
            const tableColumnList = [
                {
                    type: "selection",
                    width: 58,
                    key: ""
                },
                {
                    title: "广告计划",
                    key: "adgroup_name",
                    width: 280,
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", "本页统计");
                        }
                        else {
                            let value = params.row.adgroup_name;
                            return [
                                h(
                                    "span",
                                    {
                                        class: "name_text",
                                        on: {
                                            click: () => {
                                                this.$router.push({
                                                    name: "tt_creative",
                                                    query: {
                                                        adgroup_id: params.row.adgroup_id
                                                    }
                                                });
                                            }
                                        }
                                    },
                                    params.row.adgroup_name
                                ),
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
                                                            value: params.row.adgroup_name,
                                                            autofocus: true,
                                                            placeholder: "请输入广告组名称"
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
                                                        action: "ttAdPut",
                                                        opt: "updateAdgroupName",
                                                        id: params.row.id,
                                                        adgroup_name: value
                                                    }).then(res => {
                                                        if (res.ret == 1) {
                                                            this.$Message.info(res.msg);
                                                            this.getCampaignsList();
                                                        }
                                                    }).catch(err => {
                                                        console.log("修改广告计划失败" + err);
                                                    });
                                                }
                                            });
                                        }
                                    }
                                })
                            ];
                        }
                    }
                },
                {
                    title: "账户名",
                    key: "account_name",
                    width: 300
                },
                {
                    title: "开关/状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.opt_status) {
                            return;
                        } else {
                            return h("div", [
                                h("i-switch", {
                                    props: {
                                        size: "small",
                                        value: params.row.opt_status == "AD_STATUS_ENABLE" ? true : false
                                    },
                                    style: {
                                        marginRight: "10px"
                                    },
                                    on: {
                                        "on-change": value => {
                                            params.row.opt_status = value == true ? "AD_STATUS_ENABLE" : "AD_STATUS_DISABLE";
                                            Axios.post("api.php", {
                                                action: "ttAdPut",
                                                opt: "updateAdgroupStatus",
                                                ids: params.row.id.split(","),
                                                account_ids: params.row.account_id.split(","),
                                                opt_status: value == true ? "enable" : "disable"
                                            }).then(res => {
                                                if (res.ret == 1) {
                                                    this.$Message.info(res.msg);
                                                    this.getCampaignsList(this.page);
                                                }
                                            }).catch(err => {
                                                console.log("修改状态失败" + err);
                                            });
                                        }
                                    }
                                }),
                                h("span", params.row.opt_status == "AD_STATUS_ENABLE" ? "开启" : "关闭")
                            ]);
                        }
                    }
                },
                {
                    title: "预算",
                    key: "budget",
                    width: 150,
                    render: (h, params) => {
                        let value = params.row.budget;
                        if (!value) return;
                        //三位数加逗号
                        let newvalue = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return [
                            h(
                                "Tooltip",
                                {
                                    props: {
                                        placement: "top",
                                        content: "最低预算100元,单次预算修改幅度不小于100元,日修改预算不超过20次"
                                    }
                                },
                                [
                                    h("span", newvalue + "元"),
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
                                                        return [
                                                            h(
                                                                "div",
                                                                {
                                                                    class: "budget-txt"
                                                                },
                                                                "该预算设置第2天0点后自动生效"
                                                            ),
                                                            h("Input", {
                                                                props: {
                                                                    value: params.row.budget,
                                                                    autofocus: true,
                                                                    placeholder: "日消耗限额"
                                                                },
                                                                on: {
                                                                    input: val => {
                                                                        value = val;
                                                                    }
                                                                }
                                                            }),
                                                            h(
                                                                "div",
                                                                {
                                                                    class: "budget-txt2"
                                                                },
                                                                "*实际生效时间可能会延迟0-5分钟左右，在此期间不建议再人工修改。"
                                                            )
                                                        ];
                                                    },
                                                    onOk: () => {
                                                        if (value == "") {
                                                            this.$Message.info("请输入修改信息");
                                                            return;
                                                        }
                                                        Axios.post("api.php", {
                                                            action: "ttAdPut",
                                                            opt: "updateAdgroupBudget",
                                                            account_id: params.row.account_id,
                                                            adgroup_id: params.row.adgroup_id,
                                                            account_ids: params.row.account_id,
                                                            budget: value //预算
                                                        }).then(res => {
                                                            if (
                                                                res.ret == 1
                                                            ) {
                                                                this.$Message.info(res.msg);
                                                                this.getCampaignsList(this.page);
                                                            }
                                                        }).catch(err => {
                                                            console.log("修改删除投放计划失败" + err);
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                ]
                            )
                        ];
                    }
                },
                {
                    title: "出价",
                    key: "bid",
                    width: 100,
                    render: (h, params) => {
                        let value = params.row.bid;
                        if (!value) return;
                        let is_stage2bid = "0";
                        //三位数加逗号
                        let newvalue = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return [
                            h("span", newvalue + "元"),
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
                                                if (params.row.cpa_skip_first_phrase == 1) {
                                                    return [
                                                        h(
                                                            "Select",
                                                            {
                                                                props: {
                                                                    value: is_stage2bid,
                                                                    placeholder: "出价"
                                                                },
                                                                style: {
                                                                    marginBottom: "10px"
                                                                },
                                                                on: {
                                                                    "on-change": val => {
                                                                        is_stage2bid = val;
                                                                    }
                                                                }
                                                            },
                                                            [
                                                                h(
                                                                    "Option",
                                                                    {
                                                                        props: {
                                                                            value: "0"
                                                                        }
                                                                    },
                                                                    "不修改第二阶段出价"
                                                                ),
                                                                h(
                                                                    "Option",
                                                                    {
                                                                        props: {
                                                                            value: "1"
                                                                        }
                                                                    },
                                                                    "修改第二阶段出价"
                                                                )
                                                            ]
                                                        ),
                                                        h("Input", {
                                                            props: {
                                                                value: params.row.bid,
                                                                autofocus: true,
                                                                placeholder: "出价"
                                                            },
                                                            on: {
                                                                input: val => {
                                                                    value = val;
                                                                }
                                                            }
                                                        })
                                                    ];
                                                } else {
                                                    return h("Input", {
                                                        props: {
                                                            value: params.row.bid,
                                                            autofocus: true,
                                                            placeholder: "出价"
                                                        },
                                                        on: {
                                                            input: val => {
                                                                value = val;
                                                            }
                                                        }
                                                    });
                                                }
                                            },
                                            onOk: () => {
                                                if (value == "") {
                                                    this.$Message.info("请输入修改信息");
                                                    return;
                                                }
                                                Axios.post("api.php", {
                                                    action: "ttAdPut",
                                                    opt: "updateAdgroupBid",
                                                    ids: params.row.id.split(","),
                                                    account_ids: params.row.account_id.split(","),
                                                    is_stage2bid: is_stage2bid,
                                                    bid: value //预算
                                                }).then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(res.msg);
                                                        this.getCampaignsList();
                                                    }
                                                }).catch(err => {
                                                    console.log("修改出价失败" + err);
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
                    title: "总花费",
                    key: "cost",
                    width: 100
                },
                {
                    title: "展示数",
                    key: "impression",
                    width: 100
                },
                {
                    title: "点击数",
                    key: "click",
                    width: 100
                },
                {
                    title: "点击率",
                    key: "ctr",
                    width: 100
                },
                {
                    title: "平均点击单价",
                    key: "cpc",
                    width: 150
                },
                {
                    title: "千次展现费用",
                    key: "cpm",
                    width: 150
                },
                {
                    title: "激活数",
                    key: "active",
                    width: 100
                },
                {
                    title: "激活成本",
                    key: "",
                    width: 100
                },
                // {
                //     title: "激活率",
                //     key: "active_rate",
                //     width: 100
                // },
                {
                    title: "转化数",
                    key: "conversion",
                    width: 100
                },
                {
                    title: "转化成本",
                    key: "cost_per_conversion",
                    width: 100
                },
                {
                    title: "转化率",
                    key: "cvr",
                    width: 100
                },
                {
                    title: "注册数",
                    key: "reg_total",
                    width: 100
                },
                {
                    title: "注册成本",
                    key: "cost_per_reg",
                    width: 100
                },
                {
                    title: "注册率",
                    key: "reg_rate",
                    width: 100
                },
                {
                    title: "注册ARPU",
                    key: "reg_arpu",
                    width: 100
                },
                {
                    title: "活跃数",
                    key: "active",
                    width: 100
                },
                {
                    title: "活跃率",
                    key: "active_per_reg",
                    width: 100
                },
                {
                    title: "付费人数",
                    key: "pay_num",
                    width: 100
                },
                {
                    title: "付费金额",
                    key: "pay_total",
                    width: 100
                },
                {
                    title: "付费率",
                    key: "pay_per_reg",
                    width: 100
                },
                {
                    title: "回本率",
                    key: "roi",
                    width: 100
                },
                {
                    title: "播放数",
                    key: "",
                    width: 100
                },
                {
                    title: "有效播放次数",
                    key: "",
                    width: 150
                },
                {
                    title: "有效播放率",
                    key: "",
                    width: 100
                },
                {
                    title: "已选流量",
                    key: "",
                    width: 100
                },
                {
                    title: "操作",
                    key: "",
                    width: 100
                },
                {
                    title: "投放时间",
                    key: "",
                    width: 100
                },
                {
                    title: "转化类型",
                    key: "",
                    width: 100
                },
                {
                    title: "广告质量度",
                    key: "",
                    width: 100
                },
                {
                    title: "负责人",
                    key: "author",
                    width: 100
                },
                {
                    title: "操作",
                    key: "",
                    width: 130,
                    render: (h, params) => {
                        if (params.row._disabled) return;
                        return [
                            h(
                                "span",
                                {
                                    class: "edit_link",
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: "ttad",
                                                query: {
                                                    account_id: params.row.account_id,
                                                    adgroup_id: params.row.adgroup_id,
                                                    campaign_id: params.row.campaign_id,
                                                    targeting_id: params.row.targeting_id,
                                                    landing_type: params.row.landing_type
                                                }
                                            });
                                        }
                                    }
                                },
                                "编辑"
                            ),
                            // h(
                            //     "span",
                            //     {
                            //         class: "copy_link",
                            //         on: {
                            //             click: () => { }
                            //         }
                            //     },
                            //     "复制"
                            // ),
                            h(
                                "span",
                                {
                                    class: "del_link",
                                    on: {
                                        click: value => {
                                            this.$Modal.confirm({
                                                title: "操作提示",
                                                content: "<p>确认删除</p>",
                                                onOk: () => {
                                                    Axios.post("api.php", {
                                                        action: "ttAdPut",
                                                        opt: "updateAdgroupStatus",
                                                        ids: params.row.id.split(","),
                                                        account_ids: params.row.account_id.split(","),
                                                        opt_status: "delete"
                                                    }).then(res => {
                                                        if (res.ret == 1) {
                                                            this.$Message.info(res.msg);
                                                            this.getCampaignsList();
                                                        }
                                                    }).catch(err => {
                                                        console.log(
                                                            "删除失败" + err
                                                        );
                                                    });
                                                }
                                            });
                                        }
                                    }
                                },
                                "删除"
                            )
                        ];
                    }
                }
            ];
            this.uncheck.forEach(item => {
                tableColumnList.forEach((col, i) => {
                    if (col.key == item) {
                        tableColumnList.splice(i, 1);
                    }
                });
            });
            return tableColumnList;
        }
    }
};
</script>