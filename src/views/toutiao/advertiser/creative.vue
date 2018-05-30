
<style scoped>
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.ad .ivu-poptip {
  display: inline-block;
}
.sel_state {
  text-align: left;
  width: 110px;
}
</style>
<template>
    <div>
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="20">
                <!-- <Button type="primary">返回</Button> -->
                <!--搜索游戏列表-->
                <search-tree @on-change="getids"></search-tree>
                <Input class="inp" clearable placeholder="请输入创意ID或关键词" v-model="keyword" @on-enter="getCampaignsList()"></Input>
                <Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
                </Col>
                <Col span="4" style="text-align: right;">
                <Button type="ghost" icon="stats-bars" @click="Echartsmodel=!Echartsmodel;">图表</Button>
                <new-edit title="新建广告组" @on-change="add"></new-edit>
                </Col>
            </Row>
        </Card>
        <Card shadow class="margin-top-10" v-if="Echartsmodel">
            <campaign-echarts></campaign-echarts>
        </Card>
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="20">
                <!--自定义指标-->
                <view-tip @on-change="getuncheck" :check="checkAllGroup" action="ttAdPut" opt="searchCreatives"></view-tip>
                <Select placeholder="投放目的" v-model="landing_type" class="sel_state" @on-change="getCampaignsList()">
                    <Option value="">不限</Option>
                    <Option :value="item.val_type" v-for="item in toutiaoConfig.landing_type" :key="item.val_type">{{item.name}}</Option>
                </Select>
                <Select placeholder="操作状态" v-model="opt_status" class="sel_state" @on-change="getCampaignsList()">
                    <Option value="">不限</Option>
                    <Option value="CREATIVE_STATUS_ENABLE">启用</Option>
                    <Option value="CREATIVE_STATUS_DISABLE">暂停</Option>
                </Select>
                <Select placeholder="审核状态" v-model="status" class="sel_state" @on-change="getCampaignsList()" style="width:120px">
                    <Option value="">不限</Option>
                    <Option :value="item.val_type" v-for="item in toutiaoConfig.creative_status" :key="this">{{item.name}}</Option>
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
import viewTip from "../components/viewPopti.vue";
import newEdit from "../components/newEdit.vue";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import searchTree from "@/components/select-tree/searchTree.vue";
import campaignEcharts from "../components/campaignEcharts.vue";
import selectAuthor from "@/components/select-author/index.vue";
import toutiaoConfig from "@/utils/toutiaoConfig.json";
import createidea from "../components/createIdea.vue";
export default {
    components: {
        viewTip,
        searchTree,
        campaignEcharts,
        newEdit,
        selectAuthor,
        createidea
    },
    data() {
        return {
            toutiaoConfig: toutiaoConfig,
            adgroup_id: this.$route.query.adgroup_id,
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
            options: DateShortcuts, //日期辅助功能
            status: "",//审核状态
            opt_status: "", //操作状态
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
            this.game_id = gid.join(",");
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
        //选择负责人
        authorChange(data) {
            this.author_model = data;
            this.getCampaignsList();
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection = column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
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
                name: "ttcreative",
                query: { account_id: account_id }
            });
        },
        //修改状态
        editStatus() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "updateCreativeStatus",
                ids: this.taCheckids,
                opt_status: this.edit_status
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.$Message.info(res.msg);
                        this.getCampaignsList(this.page);
                        this.visible = false;
                    }
                })
                .catch(err => {
                    console.log("修改状态失败" + err);
                });
        },
        //获取广告创意
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
                opt: "searchCreatives",
                adgroup_id: this.adgroup_id,
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                authors: this.author_model, //负责人
                keyword: this.keyword, //关键字
                status: this.status,//审核状态
                opt_status: this.opt_status, //操作状态
                game_ids: this.game_id, //游戏id数组
                landing_type: this.landing_type, //推广目的
                orderField: this.orderField, //排序的orderField参数名
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                page: this.page, //页码
                page_size: this.page_size //每页数量
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    console.log(res.data.list);
                    //添加统计
                    res.data.curr_page_total._disabled = true;
                    res.data.list.push(res.data.curr_page_total);
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                    this.newAdList = res.data.list;
                }
            }).catch(err => {
                this.loading = false;
                console.log("今日头条广告组" + err);
            });
        }
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
                    title: "创意",
                    key: "content",
                    width: 250,
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", "本页统计");
                        } else {
                            return h(createidea, {
                                props: {
                                    title: params.row.title,
                                    image_info: params.row.image_info,
                                }
                            });
                        }
                    }
                },
                {
                    title: "创意ID",
                    key: "adcreative_id",
                    width: 150
                },
                {
                    title: "广告计划",
                    key: "adgroup_name",
                    width: 200
                },
                {
                    title: "广告组",
                    key: "campaign_name",
                    width: 200
                },

                {
                    title: "账户名",
                    key: "account_id",
                    width: 120
                },
                {
                    title: "状态",
                    key: "status",
                    width: 120,
                    render: (h, params) => {
                        let creative_status;
                        this.toutiaoConfig.creative_status.forEach(v => {
                            if (params.row.status == v.val_type) {
                                creative_status = v.name;
                            }
                        });
                        return h("span", creative_status);
                    }
                },
                {
                    title: "开关",
                    key: "opt_status",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.opt_status) return;
                        return h("div", [
                            h("i-switch", {
                                props: {
                                    size: "small",
                                    value: params.row.opt_status == "CREATIVE_STATUS_ENABLE" ? true : false
                                },
                                style: {
                                    marginRight: "10px"
                                },
                                on: {
                                    "on-change": value => {
                                        params.row.opt_status = value == true ? "CREATIVE_STATUS_ENABLE" : "CREATIVE_STATUS_DISABLE";
                                        Axios.post("api.php", {
                                            action: "ttAdPut",
                                            opt: "updateCreativeStatus",
                                            ids: params.row.id.split(","),
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
                            h("span", params.row.opt_status == "CREATIVE_STATUS_ENABLE" ? "开启" : "关闭")
                        ]);
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
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "展示数",
                    key: "impression",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "点击数",
                    key: "click",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "点击率",
                    key: "ctr",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "平均点击单价",
                    key: "cpc",
                    width: 150,
                    sortable: "custom"
                },
                {
                    title: "千次展现费用",
                    key: "cpm",
                    width: 150,
                    sortable: "custom"
                },
                {
                    title: "激活数",
                    key: "active",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "激活成本",
                    key: "",
                    width: 120,
                    sortable: "custom"
                },
                // {
                //     title: "激活率",
                //     key: "active_rate",
                //     width: 100,
                //     sortable: "custom"
                // },
                {
                    title: "转化数",
                    key: "conversion",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "转化成本",
                    key: "cost_per_conversion",
                    width: 120,
                    sortable: "custom"
                },
                {
                    title: "转化率",
                    key: "cvr",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "注册数",
                    key: "reg_total",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "注册成本",
                    key: "cost_per_reg",
                    width: 120,
                    sortable: "custom"
                },
                {
                    title: "注册率",
                    key: "reg_rate",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "注册ARPU",
                    key: "reg_arpu",
                    width: 100
                },
                {
                    title: "活跃数",
                    key: "active",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "活跃率",
                    key: "active_per_reg",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "付费人数",
                    key: "pay_num",
                    width: 120,
                    sortable: "custom"
                },
                {
                    title: "付费金额",
                    key: "pay_total",
                    width: 100
                },
                {
                    title: "付费率",
                    key: "pay_per_reg",
                    width: 100,
                    sortable: "custom"
                },
                {
                    title: "回本率",
                    key: "roi",
                    width: 100,
                    sortable: "custom"
                },
                // {
                //     title: "播放数",
                //     key: "",
                //     width: 100
                // },
                // {
                //     title: "有效播放次数",
                //     key: "",
                //     width: 150
                // },
                // {
                //     title: "有效播放率",
                //     key: "",
                //     width: 100
                // },
                // {
                //     title: "已选流量",
                //     key: "",
                //     width: 100
                // },
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
                // {
                //     title: "广告质量度",
                //     key: "",
                //     width: 100
                // },
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
                        return h("span",
                            {
                                class: "edit_link",
                                on: {
                                    click: () => {
                                        this.$router.push({
                                            name: "ttcreative",
                                            query: {
                                                account_id: params.row.account_id,
                                                adgroup_id: params.row.adgroup_id,
                                                adcreative_id: params.row.adcreative_id,
                                                landing_type: params.row.landing_type,
                                                id: params.row.id
                                            }
                                        });
                                    }
                                }
                            },
                            "编辑"
                        );
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