<style >
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
  width: 110px;
}

.sel_state1 {
  text-align: left;
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

.campaign_name {
  font-size: 18px;
  margin-left: 20px;
}
.ivu-tooltip-inner {
  white-space: normal;
}
</style>

<template>
    <div class="time">
        <Card dis-hover>
            <Row>
                <Col span="18">
                <div v-if="params.campaign_name">
                    <Button type="primary" @click="back">返回</Button>
                    <span class="campaign_name">{{params.campaign_name}}</span>
                </div>
                <div v-else>
                    <!--搜索游戏列表-->
                    <search-tree @on-change="getids"></search-tree>
                    <Select v-model="MediaListModel" filterable class="sel" placeholder="请选择媒体账号" @on-change="getCampaigns">
                        <Option value="0">全部媒体账号</Option>
                        <Option v-for="item in mediaList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                    </Select>
                    <Select v-model="CampaignsListModel" multiple filterable class="sel_state1" placeholder="请选择广告" v-if="campaignslist.length>1">
                        <Option v-for="item in campaignslist" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
                    </Select>

                    <Input v-model="campaign_name" class="inp" placeholder="请输入关键字"></Input>
                    <Button type="primary" icon="search" @click="getCampaignsList()">搜索</Button>
                </div>
                </Col>
                <Col span="6" style="text-align: right;">
                <Button type="ghost" icon="log-in" @click="tologin">登陆</Button>
                <Button type="ghost" icon="ios-copy" @click="copyAd">复制广告</Button>
                <selectAccount title="新建广告" @on-change="add" mediaType="1"></selectAccount>
                </Col>
            </Row>
        </Card>
        <Card dis-hover class="margin-top-10">
            <Row>
                <Col span="16">
                <!--自定义指标-->
                <view-popti @on-change="getuncheck" action="gdtAdPut" opt="adgroups"></view-popti>
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
                    <Poptip v-model="visible1" placement="bottom-end">
                        <Button type="ghost">修改日期</Button>
                        <div class="api" slot="content">
                            <div class="tipbtn margin-top-10">
                                <Checkbox v-model="startdate">长期投放（仅设置开始时间）</Checkbox>
                            </div>
                            <div class="tipbtn margin-top-10" v-if="startdate">
                                <DatePicker type="date" :options="options1" placement="bottom-end" placeholder="请选择日期" format="yyyy/MM/dd" :value="date1"></DatePicker>
                            </div>
                            <div class="tipbtn margin-top-10" v-if="!startdate">
                                <DatePicker type="daterange" :options="options1" placement="bottom-end" placeholder="请选择日期" format="yyyy/MM/dd" :value="date2"></DatePicker>
                            </div>
                            <div class="tipbtn margin-top-10">
                                <Button type="text" size="small" @click="visible1 = false">取消</Button>
                                <Button type="primary" size="small" @click="DateChanged">确定</Button>
                            </div>
                        </div>
                    </Poptip>
                    <Button type="ghost" icon="document-text" @click="exportData()">下载报表</Button>
                </div>
                </Col>
            </Row>
            <div>
                <Table :data="newAdList" :height="height" :loading="loading" :columns="taColumns" :size="tableSize" class="margin-top-10" ref="adtable" @on-selection-change="taCheck" @on-sort-change="sortchange" :row-class-name="rowClassName" stripe></Table>
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
        <!--复制广告-->
        <Modal v-model="copyAdwin" title="复制广告" @on-ok="submitCopy">
            <div class="margin-top-10">
                <Form :model="formItem" :label-width="100">
                    <FormItem label="选择复制的计划" v-if="campaignslistform.length>1">
                        <Select v-model="formItem.campaign_id" :value="formItem.campaign_id" filterable placeholder="请选择广告">
                            <Option v-for="item in campaignslistform" :value="item.campaign_id" :key="this">{{ item.campaign_name }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import viewPopti from "./components/viewPopti.vue";
import searchTree from "@/components/select-tree/searchTree.vue";
import selectAuthor from "@/components/select-author/index.vue";
import creativity from "./components/creativity.vue";
import selectAccount from "@/components/select-account/index.vue";
export default {
    components: {
        viewPopti,
        searchTree,
        selectAuthor,
        selectAccount
    },
    data() {
        return {
            mediaType: '',
            params: this.$route.query,
            height: document.body.clientHeight - 300,
            mediaList: [], //媒体账号列表
            campaignslist: [], //推广计划列表
            campaignslistform: [], //复制推广计划列表
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
            visible1: false,
            startdate: true,
            options1: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            date1: formatDate(new Date(), "yyyy-MM-dd"),
            date2: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ],
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
                account_id: "",
                campaign_id: ""
            },
            detailswin: false,
            taColumns: [], //表头设置
            tableColumns: [
                {
                    type: "expand",
                    width: 30,
                    //fixed: "left",
                    render: (h, params) => {
                        return h(creativity, {
                            props: {
                                row: params.row,
                                uncheck: this.uncheck
                            }
                        });
                    }
                },
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
                    title: "广告名称",
                    key: "adgroup_name",
                    width: 400,
                    render: (h, params) => {
                        let value = params.row.adgroup_name;
                        return [
                            h(
                                "span",
                                {
                                    class: "namediv",
                                    on: {
                                        click: () => {
                                            let arr = deepClone(this.adList);
                                            arr.forEach((v, i) => {
                                                if (
                                                    v.adgroup_id == params.row.adgroup_id
                                                ) {
                                                    if (v._expanded) {
                                                        v._expanded = false;
                                                    } else {
                                                        v._expanded = true;
                                                    }
                                                }
                                            });
                                            this.adList = arr;
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
                                                        placeholder: "请输入广告名称"
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
                                                    opt: "adgroups_add",
                                                    do: "edit",
                                                    account_id: params.row.account_id, //*必传*
                                                    adgroup_id: params.row.adgroup_id, //传这个值就是修改当前计划 不传就是添加新的计划
                                                    adgroup_name: value
                                                }).then(res => {
                                                    if (res.ret == 1) {
                                                        this.$Message.info(res.msg);
                                                        this.getCampaignsList();
                                                    }
                                                }).catch(err => {
                                                    console.log("修改删除广告计划失败" + err);
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
                    width: 120,
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
                    key: "reg_per_click",
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
                    title: "出价",
                    key: "bid_amount",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.bid_amount) return;
                        //三位数加逗号
                        let newvalue = String(params.row.bid_amount / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return h("span", newvalue + "元");
                    }
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
                    key: "reg_imei",
                    width: 100
                },
                {
                    title: "注册设备数",
                    sortable: "custom",
                    key: "reg_dev",
                    width: 120
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
                    width: 100
                },
                {
                    title: "回本率",
                    sortable: "custom",
                    key: "roi",
                    width: 100
                },
                {
                    title: "状态",
                    sortable: "custom",
                    key: "system_status",
                    width: 110,
                    render: (h, params) => {
                        let item = "";
                        //要判断是否已获取到ads_config
                        if (this.ads_config.system_status) {
                            this.ads_config.system_status.forEach(v => {
                                if (v.val_type == params.row.system_status) {
                                    item = v;
                                }
                            });
                        }
                        if (params.row.reject_message != "null" && params.row.reject_message) {
                            return [
                                h(
                                    "span",
                                    {
                                        style: {
                                            color: item.color
                                        }
                                    },
                                    item.name
                                ),
                                h(
                                    "Tooltip",
                                    {
                                        props: {
                                            content: params.row.reject_message,
                                            placement: "top"
                                        }
                                    },
                                    [
                                        h("Icon", {
                                            props: {
                                                type: "help-circled",
                                                color: item.color
                                            }
                                        })
                                    ]
                                )
                            ];
                        } else {
                            return h(
                                "span",
                                {
                                    style: {
                                        color: item.color
                                    }
                                },
                                item.name
                            );
                        }
                    }
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
                                                opt: "adgroups_add",
                                                do: "edits",
                                                type: 1,
                                                ids: params.row.id.split(","),
                                                account_ids: params.row.account_id.split(","), //*必传*
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
                                        content:
                                            "最低额度是该推广计划的今日消耗加上50元"
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
                                                                value: params.row.daily_budget,
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
                                                            opt: "adgroups_add",
                                                            do: "edit",
                                                            account_id: params.row.account_id, //*必传*
                                                            adgroup_id: params.row.adgroup_id,
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
                                                name: "gdtad",
                                                query: {
                                                    account_id: params.row.account_id,
                                                    adgroup_id: params.row.adgroup_id,
                                                    campaign_id: params.row.campaign_id,
                                                    targeting_id: params.row.targeting_id,
                                                    product_type: params.row.product_type,
                                                    campaign_type: params.row.campaign_type,
                                                    configured_status: params.row.configured_status
                                                }
                                            });
                                        }
                                    }
                                },
                                "编辑"
                            ),
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
                                                        action: "gdtAdPut",
                                                        opt: "adgroups_add",
                                                        do: "edits",
                                                        ids: params.row.id.split(","), //必传[13,12,12]
                                                        account_ids: params.row.account_id.split(","),
                                                        type: 3, //1 修改状态  3 删除 type   
                                                    }).then(res => {
                                                        if (res.ret == 1) {
                                                            this.$Message.info(res.msg);
                                                            this.getCampaignsList();
                                                        }
                                                    }).catch(err => {
                                                        console.log("批量修改删除投放计划" + err);
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
            ]
        };
    },
    mounted() {
        if (this.params.campaign_id) {
            let id = [];
            id.push(this.params.campaign_id);
            this.CampaignsListModel = id;
        }
        this.getMedia();
        this.getCampaignsList();
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
            Axios.post("api.php", {
                action: "api",
                opt: "getAccount",
                MeidaType: "Gdt"
            }).then(res => {
                if (res.ret == 1) {
                    this.mediaList = res.data;
                }
            }).catch(err => {
                console.log("获取媒体账号" + err);
            });
        },
        //获取推广计划
        getCampaigns(id) {
            Axios.post("api.php", {
                action: "api",
                opt: "getcampaigns",
                MeidaType: "Gdt",
                account_id: id
            }).then(res => {
                if (res.ret == 1) {
                    this.campaignslist = res.data;
                    this.mediaType = 1;
                }
            }).catch(err => {
                console.log("获取推广计划" + err);
            });
        },
        //获取复制推广计划
        getCampaignsform(id) {
            Axios.post("api.php", {
                action: "api",
                opt: "getcampaigns",
                MeidaType: "Gdt",
                account_id: id
            }).then(res => {
                if (res.ret == 1) {
                    this.campaignslistform = res.data;
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
                act: "cp_adgroup",
                type: "gdt",
                account_id: this.formItem.account_id,
                campaign_id: this.formItem.campaign_id,
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
                opt: "adgroups",
                tdate: this.DateDomain[0], //开始时间
                edate: this.DateDomain[1], //结速时间
                page: this.page, //页码
                page_size: this.page_size, //每页数量
                game_id: this.GameListIds.join(","), //游戏id
                account_id: this.MediaListModel == "0" ? "" : this.MediaListModel, //媒体账号
                configured_status: this.configured_status, //过滤无数据的广告
                campaign_id: this.CampaignsListModel, //广告
                adgroup_name: this.campaign_name, //关键字
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
                        res.data.curr_page_total._disableExpand = true;
                        res.data.list.unshift(res.data.curr_page_total);
                        res.data.list.push(res.data.curr_page_total);
                    }
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                    this.adList = res.data.list;
                }
            }).catch(err => {
                this.loading = false;
                console.log("获取实时投放广告" + err);
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
                opt: "adgroups_add",
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
        //批量修改目期
        DateChanged() {
            this.visible = false;
            if (this.taCheckids.length == 0) {
                this.$Message.info("请勾选需要修改的数据");
                return;
            }
            let begin_date = "";
            let end_date = "";
            //判断是否长期投放
            if (this.startdate) {
                begin_date = this.date1;
            } else {
                begin_date = this.date2[0];
                end_date = this.date2[1];
            }
            Axios.post("api.php", {
                action: "gdtAdPut",
                opt: "adgroups_add",
                do: "edits",
                ids: this.taCheckids, //必传[13,12,12]
                account_ids: this.account_ids,
                type: 2, //1 修改状态  3 删除 type
                begin_date: begin_date, //开始投放日期
                end_date: end_date //结束投放日期
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getCampaignsList();
                }
            }).catch(err => {
                console.log("批量修改日期" + err);
            });
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
        //新增
        add(account_id) {
            this.$router.push({
                name: "gdtcampaign",
                query: { account_id: account_id }
            });
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
        //导出报表
        exportData(type) {
            this.$refs["adtable"].exportCsv({
                filename: "实时投放广告",
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
            if (this.taCheckitem.length > 0) {
                //判断是否为同一媒帐号
                let id = this.taCheckitem[0].account_id;
                let same = true;
                this.taCheckitem.forEach(v => {
                    if (id != v.account_id) {
                        same = false;
                    }
                });
                if (same) {
                    this.formItem.account_id = id;
                    this.getCampaignsform(id);
                    this.copyAdwin = true;
                } else {
                    this.$Message.info("请选择同一媒体帐号");
                }
            } else {
                this.$Message.info("请勾选要复制的广告");
            }
        }
    },
    computed: {
        //获取所有状态
        ads_config() {
            return this.$store.state.newad.ads_config;
        },
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
    }
};
</script>
