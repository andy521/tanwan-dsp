<style>
@import "../../styles/common.less";
@import "../../styles/table.less";
.sel {
  width: 220px;
}

.time .ivu-poptip {
  display: inline-block;
}

.tipbtn {
  text-align: right;
}

.clear:after {
  content: "\20";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.ivu-table .ivu-col span {
  line-height: 24px;
}

.inp {
  display: inline-block;
  width: 150px;
}

.sel_state {
  text-align: left;
  width: 100px;
}

.sel_state1 {
  text-align: left;
  width: 300px;
}

.demo-carousel {
  width: 300px;
}

.sel_state1.ivu-select-multiple .ivu-select-selection {
  overflow: auto;
  height: 32px;
}

.namediv {
  cursor: pointer;
}

.namediv:hover {
  color: #57a3f3;
}
</style>

<template>
    <div class="time">
        <Card dis-hover>
            <Row>
                <Col span="19">
                <Button type="primary" @click="back" v-if="account_id">返回</Button>
                <!--搜索游戏列表-->
                <search-tree @on-change="getids"></search-tree>
                <Select v-model="MediaListModel" :value="MediaListModel" filterable class="sel" placeholder="请选择媒体账号" @on-change="getCampaigns">
                    <Option value="0">全部媒体账号</Option>
                    <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                </Select>
                <Select v-model="CampaignsListModel" :value="CampaignsListModel" multiple filterable class="sel_state1" placeholder="请选择广告" v-if="campaignslist.length>1">
                    <Option v-for="item in campaignslist" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
                </Select>
                <Input v-model="campaign_name" class="inp" placeholder="请输入关键字"></Input>
                <Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
                </Col>
                <Col span="5" style="text-align: right;">
                <Button type="ghost" icon="log-in" @click="tologin">登陆</Button>
                <Button type="ghost" icon="ios-copy" @click="copyAd">复制计划</Button>
                </Col>
            </Row>
        </Card>

        <Card dis-hover class="margin-top-10">
            <Row>
                <Col span="16">
                <!--自定义指标-->
                <view-popti @on-change="getuncheck" action="gdtAdPut" opt="campaigns"></view-popti>
                <!--选择负责人-->
                <select-author :is-linkage="true" :media-type="mediaType" @on-change="authorChange"></select-author>
                <!-- <select-author  :is-linkage="true" :media-type="mediaType" @on-change="authorChange" @click.native="handleClickAuthor"></select-author> -->
                <Select v-model="configured_status" class="sel_state" @on-change="getCampaignsList()" placeholder="状态">
                    <Option value="">不限</Option>
                    <Option value="AD_STATUS_NORMAL">有效</Option>
                    <Option value="AD_STATUS_SUSPEND">暂停</Option>
                </Select>
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                <Checkbox v-model="check_value" @on-change="getCampaignsList()">过滤无数据的广告</Checkbox>
                </Col>
                <Col span="8" style="text-align: right;">
                <div class="btn-group clear">
                    <Poptip confirm title="您确认删除选中内容吗？" placement="bottom-start" @on-ok="AmendCampaignsList(3)" style="text-align: left;">
                        <Button type="ghost" icon="trash-a">删除</Button>
                    </Poptip>
                    <Poptip placement="bottom-start" v-model="visible">
                        <Button type="ghost" icon="edit">修改状态</Button>
                        <div class="api" slot="content">
                            <div style="text-align: left;">
                                <Select v-model="edit_status">
                                    <Option value="AD_STATUS_NORMAL">启用</Option>
                                    <Option value="AD_STATUS_SUSPEND">暂停</Option>
                                </Select>
                            </div>
                            <div class="tipbtn margin-top-10">
                                <Button type="text" size="small" @click="visible=false">取消</Button>
                                <Button type="primary" size="small" @click="AmendCampaignsList(1)">确定</Button>
                            </div>
                        </div>
                    </Poptip>
                    <Button type="ghost" icon="document-text" @click="exportData()">下载报表</Button>
                </div>
                </Col>
            </Row>
            <div>
                <Table :data="newAdList" :height="height" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-selection-change="taCheck" @on-sort-change="sortchange" :row-class-name="rowClassName" stripe></Table>
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
                    <Page :total="total_number" :current="page" :page-size="page_size" ref="pages" @on-change="getCampaignsList" show-elevator show-total></Page>
                    </Col>
                </Row>
            </div>
        </Card>
        <!--复制广告-->
        <Modal v-model="copyAdwin" title="复制广告" @on-ok="submitCopy">
            <div class="margin-top-10">
                <Form :model="formItem" :label-width="100">
                    <FormItem label="选择复制的帐户">
                        <Select v-model="formItem.account_id" :value="formItem.account_id" filterable placeholder="请选择媒体账号">
                            <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index";
import { DateShortcuts, formatDate, deepClone } from "@/utils/DateShortcuts.js";
import viewPopti from "./components/viewPopti.vue";
import selectAuthor from "@/components/select-author/index.vue";
import searchTree from "@/components/select-tree/searchTree.vue";

export default {
    components: {
        viewPopti,
        searchTree,
        selectAuthor
    },
    data() {
        return {
            account_id: this.$route.query.account_id,
            height: document.body.clientHeight - 300,
            mediaList: [], //媒体账号列表
            campaignslist: [], //推广计划列表
            loading: false,
            adList: [], //数据列表
            GameListIds: [], //搜索返回ids
            MediaListModel: "0",
            CampaignsListModel: [],
            taCheckids: [], //选中ids
            account_ids: [],
            taCheckitem: [], //选中item
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            indeterminate: true,
            uncheck: [], //没选中的
            visible: false,
            DateDomain: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            options: DateShortcuts, //日期辅助功能
            configured_status: "", //过滤无数据的广告
            campaign_name: "", //关键字
            check_value: false,
            edit_status: "AD_STATUS_NORMAL", //批量状态
            orderField: "", //排序参数名
            orderDirection: "SORT_DESC", //排序方向
            author_model: [],
            tableSize: "small",
            copyAdwin: false,
            formItem: {
                account_id: ""
            },
            value1: 0,
            taColumns: [], //表头设置
            tableColumns: [
                {
                    type: "selection",
                    width: 58,
                    key: ""
                },
                {
                    title: "媒体账户",
                    key: "account_name",
                    width: 120,
                    render: (h, params) => {
                        if (params.row.account_name) {
                            return h("span", params.row.account_name);
                        } else {
                            return h("span", "本页统计");
                        }
                    }
                },
                {
                    title: "计划名称",
                    sortable: "custom",
                    key: "campaign_name",
                    width: 350,
                    render: (h, params) => {
                        let value = params.row.campaign_name;
                        return [
                            h(
                                "span",
                                {
                                    class: "namediv",
                                    on: {
                                        click: () => {
                                            this.$router.push({
                                                name: "time_ad",
                                                query: {
                                                    campaign_id: params.row.campaign_id,
                                                    campaign_name: params.row.campaign_name
                                                }
                                            });
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
                                                        value: params.row.campaign_name,
                                                        autofocus: true,
                                                        placeholder: "请输入计划名称"
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
                                                    action: "gdtAdPut",
                                                    opt: "campaigns_add",
                                                    do: "edit",
                                                    account_id: params.row.account_id, //*必传*
                                                    campaign_id: params.row.campaign_id, //传这个值就是修改当前计划 不传就是添加新的计划
                                                    campaign_name: value
                                                }).then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(res.msg);
                                                        this.getCampaignsList();
                                                    }
                                                }).catch(err => {
                                                    console.log("修改删除投放计划失败" + err);
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
                    title: "计划",
                    key: "campaign_id",
                    width: 100
                },
                {
                    title: "曝光",
                    sortable: "custom",
                    key: "impression",
                    width: 100
                },
                {
                    title: "点击量",
                    sortable: "custom",
                    key: "click",
                    width: 100
                },
                {
                    title: "点击率",
                    sortable: "custom",
                    key: "ctr",
                    width: 100
                },
                {
                    title: "点击均价",
                    sortable: "custom",
                    key: "cpc",
                    width: 110
                },
                {
                    title: "消耗",
                    sortable: "custom",
                    key: "cost",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.cost) return;
                        //三位数加逗号
                        let newvalue = String(params.row.cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return h("span", newvalue + "元");
                    }
                },
                {
                    title: "展示PV",
                    sortable: "custom",
                    key: "show_pv",
                    width: 100
                },
                {
                    title: "展示IP",
                    sortable: "custom",
                    key: "show_ip",
                    width: 100
                },
                {
                    title: "下载IP",
                    sortable: "custom",
                    key: "down_ip",
                    width: 100
                },
                {
                    title: "到达数",
                    sortable: "custom",
                    key: "fetch",
                    width: 100
                },
                {
                    title: "到达率",
                    sortable: "custom",
                    key: "fetch_per",
                    width: 100
                },
                {
                    title: "下载数",
                    sortable: "custom",
                    key: "download",
                    width: 100
                },
                {
                    title: "下载率",
                    sortable: "custom",
                    key: "down_ins_per",
                    width: 100
                },
                {
                    title: "激活总量",
                    sortable: "custom",
                    key: "install",
                    width: 110
                },
                {
                    title: "点击注册率",
                    sortable: "custom",
                    key: "click_install",
                    width: 120
                },
                {
                    title: "激活安装率",
                    sortable: "custom",
                    key: "reg_per_activation",
                    width: 120
                },
                {
                    title: "下载激活率",
                    sortable: "custom",
                    key: "activation_per_download",
                    width: 120
                },
                {
                    title: "注册设备数",
                    sortable: "custom",
                    key: "reg_dev",
                    width: 120
                },
                {
                    title: "注册数",
                    sortable: "custom",
                    key: "activation",
                    width: 100
                },
                {
                    title: "注册",
                    sortable: "custom",
                    key: "activation",
                    width: 100
                },
                {
                    title: "注册设备成本",
                    sortable: "custom",
                    key: "cost_per_dev",
                    width: 130
                },
                {
                    title: "注册成本",
                    sortable: "custom",
                    key: "cost_per_reg",
                    width: 110
                },
                {
                    title: "注册率",
                    sortable: "custom",
                    key: "reg_per",
                    width: 100
                },
                {
                    title: "注册ARPU",
                    sortable: "custom",
                    key: "reg_arpu",
                    width: 120
                },
                {
                    title: "活跃数",
                    sortable: "custom",
                    key: "login",
                    width: 100
                },
                {
                    title: "活跃率",
                    sortable: "custom",
                    key: "active_per_reg",
                    width: 100
                },
                {
                    title: "付费人数",
                    sortable: "custom",
                    key: "pay_num",
                    width: 110
                },
                {
                    title: "付费金额",
                    sortable: "custom",
                    key: "pay_total",
                    width: 110
                },
                {
                    title: "付费率",
                    sortable: "custom",
                    key: "pay_per_reg",
                    width: 110
                },
                {
                    title: "回本率",
                    sortable: "custom",
                    key: "roi",
                    width: 100
                },
                {
                    title: "广告开关",
                    key: "configured_status",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.configured_status) {
                            return;
                        } else {
                            return h("div", [
                                h("i-switch", {
                                    props: {
                                        size: "small",
                                        value: params.row.configured_status == "AD_STATUS_NORMAL" ? true : false
                                    },
                                    style: {
                                        marginRight: "10px"
                                    },
                                    on: {
                                        "on-change": value => {
                                            params.row.configured_status = value == true ? "AD_STATUS_NORMAL" : "AD_STATUS_SUSPEND";
                                            Axios.post("api.php", {
                                                action: "gdtAdPut",
                                                opt: "campaigns_add",
                                                do: "edit",
                                                account_id: params.row.account_id, //*必传*
                                                campaign_id: params.row.campaign_id, //传这个值就是修改当前计划 不传就是添加新的计划
                                                configured_status: params.row.configured_status //AD_STATUS_NORMAL有效AD_STATUS_SUSPEND暂停
                                            }).then(res => {
                                                if (res.ret == 1) {
                                                    this.$Message.info(res.msg);
                                                    this.getCampaignsList();
                                                }
                                            }).catch(err => {
                                                console.log("修改删除投放计划失败" + err);
                                            });
                                        }
                                    }
                                }),
                                h("span", params.row.configured_status == "AD_STATUS_NORMAL" ? "开启" : "关闭")
                            ]);
                        }
                    }
                },
                {
                    title: "日消耗限额",
                    sortable: "custom",
                    key: "daily_budget",
                    width: 150,
                    render: (h, params) => {
                        let value = params.row.daily_budget;
                        //三位数加逗号
                        let newvalue = String(value / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return [
                            h(
                                "Tooltip",
                                {
                                    props: {
                                        placement: "top",
                                        content: "最低额度是该推广计划的今日消耗加上50元"
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
                                                        return h("Input", {
                                                            props: {
                                                                value: params.row.daily_budget / 100,
                                                                autofocus: true,
                                                                placeholder: "日消耗限额"
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
                                                            action: "gdtAdPut",
                                                            opt: "campaigns_add",
                                                            do: "edit",
                                                            account_id: params.row.account_id, //*必传*
                                                            campaign_id: params.row.campaign_id, //传这个值就是修改当前计划 不传就是添加新的计划
                                                            daily_budget: value * 100 //日消耗限额
                                                        }).then(res => {
                                                            if (res.ret == 1) {
                                                                this.$Message.info(res.msg);
                                                                this.getCampaignsList();
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
                    title: "产品名称",
                    key: "game_name",
                    width: 200
                },
                {
                    title: "负责人",
                    sortable: "custom",
                    key: "author",
                    width: 110
                }
            ],
            mediaType: ''
        };
    },
    mounted() {
        if (this.account_id) {
            this.MediaListModel = this.account_id;
        }
        //返回时获取保存数据
        let planparam = this.$store.state.setid.planparam;
        if (this.$route.meta.keepAlive && planparam != "") {
            this.DateDomain = planparam.DateDomain;
            this.page = planparam.page;
            this.page_size = planparam.page_size;
            this.GameListIds = planparam.game_id;
            this.MediaListModel = planparam.account_id;
            this.configured_status = planparam.configured_status;
            this.campaign_id = planparam.campaign_id;
            this.campaign_name = planparam.campaign_name;
            this.check_value = planparam.check_value;
            this.orderField = planparam.orderField;
            this.orderDirection = planparam.orderDirection;
            this.author_model = planparam.author;
            this.getCampaignsList();
        } else {
            this.getCampaignsList();
        }
        this.getMedia();
    },
    methods: {
        //去登陆
        tologin() {
            window.open("http://e.qq.com/ads/");
        },
        //获取选中游戏id
        getids(ids) {
            this.GameListIds = ids;
            this.getCampaignsList();
        },
        //获取媒体账号
        getMedia() {
            Axios.get("api.php", {
                action: "api",
                opt: "getAccount",
                media_type: 1   // 2018-04-25修改//1代表广点能， 3代码UC
            }).then(res => {
                if (res.ret == 1) {
                    this.mediaList = res.data;
                }
            }).catch(err => {
                console.log("获取媒体账号" + err);
            });
        },
        // 获取推广计划
        getCampaigns(id) {
            Axios.get("api.php", {
                action: "api",
                opt: "getcampaigns",
                MeidaType: "Gdt",
                account_id: id
            }).then(res => {
                if (res.ret == 1) {
                    this.campaignslist = res.data;
                    this.mediaType = "1";
                }
            }).catch(err => {
                console.log("获取推广计划" + err);
            });
        },
        //提交复制
        submitCopy() {
            Axios.post("api.php", {
                action: "adData",
                opt: "tasck_add",
                act: "cp_campaigns",
                type: "gdt",
                account_id: this.formItem.account_id,
                idArr: this.taCheckids.join(",")
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                }
            }).catch(err => {
                console.log("提交计划" + err);
            });
        },
        //选择负责人
        authorChange(data) {
            this.author_model = data;
            this.getCampaignsList();
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
                action: "gdtAdPut",
                opt: "campaigns",
                tdate: this.DateDomain[0], //开始时间
                edate: this.DateDomain[1], //结速时间
                page: this.page, //页码
                page_size: this.page_size, //每页数量
                game_id: this.GameListIds.join(","), //游戏id
                account_id: this.MediaListModel == "0" ? "" : this.MediaListModel, //媒体账号
                configured_status: this.configured_status, //过滤无数据的广告
                campaign_id: this.CampaignsListModel, //广告
                campaign_name: this.campaign_name, //关键字
                check_value: this.check_value == false ? 0 : 1, //状态
                orderField: this.orderField, //排序的orderField参数名
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                author: this.author_model //负责人
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
                    this.adList = res.data.list;
                }
            }).catch(err => {
                this.loading = false;
                console.log("获取实时投放计划" + err);
            });
        },
        //批量修改删除投放计划
        AmendCampaignsList(type) {
            this.visible = false;
            if (this.taCheckids.length == 0) {
                this.$Message.info("请勾选需要修改的数据");
                return;
            }
            Axios.post("api.php", {
                action: "gdtAdPut",
                opt: "campaigns_add",
                do: "edits",
                ids: this.taCheckids, //必传[13,12,12]
                account_ids: this.account_ids,
                type: type, //1 修改状态  3 删除 type
                configured_status: this.edit_status //AD_STATUS_NORMAL  有效  AD_STATUS_SUSPEND暂停 默认不传
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getCampaignsList();
                }
            }).catch(err => {
                console.log("批量修改删除投放计划" + err);
            });
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection = column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getCampaignsList();
        },
        //获取选中的id
        taCheck(row) {
            let ids = [];
            let it = [];
            let account_ids = [];
            row.forEach(item => {
                ids.push(item.id);
                it.push(item);
                account_ids.push(item.account_id)
            });
            this.taCheckitem = it;
            this.taCheckids = ids;
            this.account_ids = account_ids;
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getCampaignsList();
        },
        //导出报表
        exportData(type) {
            this.$refs["Vtable"].exportCsv({
                filename: "实时投放计划",
                original: false
            });
        },
        //返回没有选中的
        getuncheck(val) {
            this.uncheck = val;
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        },
        //返回
        back() {
            this.$router.go(-1);
        },
        //复制
        copyAd() {
            if (this.taCheckids.length > 0) {
                this.copyAdwin = true;
            } else {
                this.$Message.info("请勾选要复制的计划");
            }
        }
    },
    computed: {
        //获取实时投放计划
        newAdList() {
            //深层复制
            let arr = deepClone(this.tableColumns);
            this.uncheck.forEach(item => {
                arr.forEach((col, i) => {
                    if (col.key == item) {
                        arr.splice(i, 1);
                    }
                });
            });
            this.taColumns = arr;
            return this.adList;
        }
    },
    //跳转时保存数据
    beforeRouteLeave(to, from, next) {
        if (to.name == "time_ad") {
            let param = {
                DateDomain: this.DateDomain, //时间
                page: this.page, //页码
                page_size: this.page_size, //每页数量
                game_id: this.GameListIds, //游戏id
                account_id: this.MediaListModel, //媒体账号
                configured_status: this.configured_status, //过滤无数据的广告
                campaign_id: this.CampaignsListModel, //广告
                campaign_name: this.campaign_name, //关键字
                check_value: this.check_value, //状态
                orderField: this.orderField, //排序的orderField参数名
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                author: this.author_model //负责人
            };
            this.$store.commit("saveplan", param);
        }
        from.meta.keepAlive = false;
        next();
    },
    beforeRouteEnter(to, from, next) {
        if (from.name == "time_ad") {
            to.meta.keepAlive = true;
        }
        next();
    }
};
</script>
