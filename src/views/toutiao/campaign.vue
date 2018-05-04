
<style lang="less">
.name_text {
    color: #2b7ed1;
    cursor: pointer;
}
.name_text:hover {
    text-decoration: underline;
}
</style>
<template>
    <div class="ad">
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="18">
                <Button type="primary">返回</Button>
                <!--搜索游戏列表-->
                <search-tree @on-change="getids"></search-tree>
                <Input class="inp" placeholder="请输入广告组ID或关键词" v-model="keyword"></Input>
                <Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
                </Col>
                <Col span="6" style="text-align: right;">
                <Button type="ghost" icon="stats-bars">查看图表</Button>
                <Button type="ghost" icon="android-add">新建广告组</Button>
                </Col>
            </Row>
        </Card>
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="12">
                <!--自定义指标-->
                <view-tip @on-change="getuncheck" :check="checkAllGroup" action="ttAdPut" opt="searchCampaigns"></view-tip>
                <Select placeholder="投放目的" v-model="landing_type" class="sel_state" @on-change="getCampaignsList">
                    <Option value="">不限</Option>
                    <Option value="LINK">推广落地页</Option>
                    <Option value="APP">推广应用下载</Option>
                    <Option value="DPA">产品目录</Option>
                </Select>
                <Select placeholder="状态" v-model="status" class="sel_state" @on-change="getCampaignsList">
                    <Option value="">不限</Option>
                    <Option value="CAMPAIGN_STATUS_ENABLE">启用</Option>
                    <Option value="CAMPAIGN_STATUS_DISABLE">暂停</Option>
                </Select>
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                </Col>
                <Col span="12" style="text-align: right;">
                <Poptip placement="bottom-start" v-model="visible">
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
                <Button type="ghost">查看日志</Button>
                </Col>
            </Row>
            <div>
                <Table :data="newAdList" :height="height" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="toutiaoAdTable" @on-selection-change="taCheck" @on-sort-change="sortchange" stripe></Table>
                <Row class="margin-top-10">
                    <Col span="10"> 表格尺寸
                    <Radio-group v-model="tableSize" type="button">
                        <Radio label="large">大</Radio>
                        <Radio label="default">中</Radio>
                        <Radio label="small">小</Radio>
                    </Radio-group>
                    每页显示
                    <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getCampaignsList()">
                        <Option v-for="item in 100" :value="item" :key="item" v-if="item%25==0">{{ item }}</Option>
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
import viewTip from "./components/viewPopti.vue";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import searchTree from "@/components/select-tree/searchTree.vue";
export default {
    components: {
        viewTip,
        searchTree
    },
    data() {
        return {
            height: document.body.clientHeight - 360,
            checkAllGroup: ["impression"], //默认选中的
            uncheck: [], //没选中的
            visible: false,
            edit_status: "", //批量状态
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            loading: false,
            taCheckids: [], //选中ids
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
            row.forEach(item => {
                ids.push(item.id);
            });
            this.taCheckids = ids;
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection =
                column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getCampaignsList();
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getCampaignsList();
        },
        //修改状态
        editStatus() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "updateCampaignStatus",
                ids: this.taCheckids,
                opt_status: this.edit_status
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
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
                opt: "searchCampaigns",
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
            })
                .then(res => {
                    this.loading = false;
                    if (res.ret == 1) {
                        //console.log(res.data.list);
                        this.total_number = res.data.total_number;
                        this.total_page = res.data.total_page;
                        this.newAdList = res.data.list;
                    }
                })
                .catch(err => {
                    this.loading = false;
                    console.log("今日头条广告组" + err);
                });
        }
    },
    beforeMount() {},
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
                    title: "广告组名称",
                    key: "campaign_name",
                    width: 200,
                    render: (h, params) => {
                        let value = params.row.campaign_name;
                        return [
                            h(
                                "span",
                                {
                                    class: "name_text",
                                    on: {
                                        click: () => {
                                            let query = {
                                                id: params.row.campaign_name
                                            };
                                            // this.$router.push({
                                            //     name: "uc_plan",
                                            //     query: query
                                            // });
                                        }
                                    }
                                },
                                params.row.campaign_name
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
                                                        value:
                                                            params.row
                                                                .campaign_name,
                                                        autofocus: true,
                                                        placeholder:
                                                            "请输入广告组名称"
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
                                                    this.$Message.info(
                                                        "请输入修改信息"
                                                    );
                                                    return;
                                                }
                                                Axios.post("api.php", {
                                                    action: "ttAdPut",
                                                    opt: "updateCampaign",
                                                    account_id:params.row.account_id,
                                                    modify_time:params.row.modify_time,
                                                    campaign_id:params.row.campaign_id,
                                                    campaign_name:value,                                                  
                                                })
                                                    .then(res => {
                                                        if (res.ret == 1) {
                                                            this.$Message.info(
                                                                res.msg
                                                            );
                                                            this.getCampaignsList(
                                                                this.page
                                                            );
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log(
                                                            "修改删除广告计划失败" +
                                                                err
                                                        );
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
                    title: "账户名",
                    key: "account_id",
                    width: 120
                },
                {
                    title: "开关/状态",
                    key: "status",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.status) {
                            return;
                        } else {
                            return h("div", [
                                h("i-switch", {
                                    props: {
                                        size: "small",
                                        value:
                                            params.row.status ==
                                            "CAMPAIGN_STATUS_ENABLE"
                                                ? true
                                                : false
                                    },
                                    style: {
                                        marginRight: "10px"
                                    },
                                    on: {
                                        "on-change": value => {
                                            params.row.status =
                                                value == true
                                                    ? "CAMPAIGN_STATUS_ENABLE"
                                                    : "CAMPAIGN_STATUS_DISABLE";
                                            Axios.post("api.php", {
                                                action: "ttAdPut",
                                                opt: "updateCampaignStatus",
                                                ids: params.row.id.split(","),
                                                opt_status:
                                                    value == true
                                                        ? "enable"
                                                        : "disable"
                                            })
                                                .then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(
                                                            res.msg
                                                        );
                                                        this.getCampaignsList(
                                                            this.page
                                                        );
                                                    }
                                                })
                                                .catch(err => {
                                                    console.log(
                                                        "修改状态失败" + err
                                                    );
                                                });
                                        }
                                    }
                                }),
                                h(
                                    "span",
                                    params.row.status ==
                                    "CAMPAIGN_STATUS_ENABLE"
                                        ? "开启"
                                        : "关闭"
                                )
                            ]);
                        }
                    }
                },
                {
                    title: "预算",
                    key: "budget",
                    width: 100
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
                {
                    title: "激活率",
                    key: "active_rate",
                    width: 100
                },
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
                    key: "active_rate",
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
                    key: "pay_rate",
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