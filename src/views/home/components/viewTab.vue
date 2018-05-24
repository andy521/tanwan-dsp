<style scoped>
.ivu-tag-border,
.ivu-tag-border.ivu-tag-red {
  border: none !important;
  background: transparent !important;
}

.tab {
  border-bottom: 1px solid #dddee1;
  margin-bottom: 16px;
  height: 38px;
  line-height: 38px;
  position: relative;
}

.tab-item li {
  float: left;
  padding: 0 15px;
  margin-right: 16px;
  position: relative;
  cursor: pointer;
}

.tab-item li::after {
  content: "";
  position: absolute;
  bottom: 0;
  display: block;
  height: 2px;
  width: 100%;
  left: 0;
  background-color: transparent;
}

.tab-item li.cur {
  color: #2d8cf0;
}

.tab-item li.cur::after {
  background-color: #2d8cf0;
}

.tr {
  float: right;
  margin-top: -8px;
}

.sel_state1.ivu-select-multiple .ivu-select-selection {
  overflow: auto;
  height: 32px;
}
.smedia {
  display: inline-block;
  width: auto;
  min-width: 150px;
}

.name_text {
  color: #2b7ed1;
  cursor: pointer;
}
.name_text:hover {
  text-decoration: underline;
}
.inp {
  width: 200px;
  display: inline-block;
}
</style>
<template>
    <Card dis-hover shadow class="margin-top-10">
        <div slot="title" class="card-title">
            <Icon type="ios-paper"></Icon> 按账户查看
            <div class="tr">
                <!--选择指标-->
                <view-popti @on-change="getuncheck" action="index" opt="index"></view-popti>
                <!--选择代理商-->
                <select-agent @on-change="agentChange"></select-agent>
                <!-- <select-author :is-linkage="true" :media-type="media_type"  @on-change="authorChange" @click.native="handleClickAuthor"></select-author> -->
                <select-author :is-linkage="true" :media-type="media_type" @on-change="authorChange"></select-author>
                <select-media class="smedia" @on-change="mediaChange"></select-media>
                <DatePicker type="daterange" :options="options" :value="date" style="width: 190px" placement="bottom-end" placeholder="请选择日期" format="yyyy-MM-dd" @on-change="changeTime"></DatePicker>
                <Input v-model="keyword" placeholder="请输入要搜索的内容" @on-enter="tableData()" class="inp"></Input>
                <Button type="primary" icon="ios-search" @click="tableData()">搜索</Button>
                <Button icon="document-text" @click="exportData()">下载报表</Button>
            </div>
        </div>

        <Table stripe :size="tableSize" :columns="taColumns" :data="tdata.list" ref="TableExport" @on-sort-change="sortChange" :row-class-name="rowClassName" height="397">
            <!-- <div slot="footer"></div> -->
        </Table>
        <Row class="margin-top-10">
            <Col span="10">
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            <Select v-model="page_size" style="width:100px" placeholder="请选择" placement="top" transfer @on-change="tableData()">
                <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="parseInt(tdata.total_number)" :page-size="parseInt(tdata.page_size)" ref="pages" @on-change="tableData" show-elevator show-total></Page>
            </Col>
        </Row>

        <Modal v-model="transfer_modal" title="转帐" @on-ok="changTransfer()">
            <div class="padding-10">
                <Form :label-width="80">
                    <FormItem label="退款账号id">
                        <Select v-model="transfer.out_account_id" placeholder="请选择退款账号id">
                            <Option v-for="item in transfer.accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="加款账号id">
                        <Select v-model="transfer.in_account_id" placeholder="请选择加款账号id">
                            <Option v-for="item in transfer.accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="转账金额">
                        <Input v-model="transfer.money" placeholder="请输入转账金额(元)"></Input>
                    </FormItem>
                    <FormItem label="备注">
                        <Input v-model="transfer.mark" placeholder="请输入备注"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </Card>
</template>
<script>
import Axios from "@/api/index";
import selectMedia from "@/components/select-media/index.vue";
import selectAuthor from "@/components/select-author/index.vue";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
import viewPopti from "./viewPopti.vue";
import selectAgent from "@/components/select-agent/index.vue";
export default {
    components: {
        selectMedia,
        selectAuthor,
        viewPopti,
        selectAgent
    },
    name: "viewTab",
    props: {
        media: Array,
        tdata: Object
    },
    data() {
        return {
            num: 0,
            //keyword
            keyword: "",
            uncheck: [],
            //日期辅助功能
            options: DateShortcuts,
            //每页数量
            page: 1,
            page_size: 50,
            total_number: 1, //总数量
            total_page: 1, //总页数
            tableSize: "small",
            //媒体型
            media_type: "",
            //按时间
            date: [
                formatDate(new Date(), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ],
            //排序
            orderField: "",
            orderDirection: "SORT_ASC",
            //负责人
            author: [],
            agent: [],
            //转帐
            transfer_modal: false,
            transfer: {
                accountList: "",
                media_type: "",
                out_account_id: "",
                in_account_id: "",
                money: "",
                mark: "",
            }
        };
    },
    mounted() {
    },
    methods: {
        //退款
        changTransfer() {
            if (this.transfer.out_account_id == "") {
                this.$Message.info("请选对退款账号id");
                return;
            }
            if (this.transfer.in_account_id == "") {
                this.$Message.info("请选对加款账号id");
                return;
            }
            if (this.transfer.money == "") {
                this.$Message.info("请输入转账金额");
                return;
            }
            Axios.get("api.php", {
                action: "sys",
                opt: "accountTransfer",
                media_type: this.transfer.media_type,
                out_account_id: this.transfer.out_account_id,
                in_account_id: this.transfer.in_account_id,
                money: this.transfer.money,
                mark: this.transfer.mark,
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    if (this.transfer.media_type == 1) {
                        this.$router.push({
                            name: "time_transferAccounts"
                        });
                    }
                    if (this.transfer.media_type == 3) {
                        this.$router.push({
                            name: "uc_transferAccounts"
                        });
                    }
                    if (this.transfer.media_type == 4) {
                        this.$router.push({
                            name: "tt_transferAccounts"
                        });
                    }
                }
            }).catch(err => {
                console.log("获取媒体账号" + err);
            });
        },
        //这里的排序没有做哈哈哈
        tableData(page) {
            if (page === undefined) {
                this.$refs["pages"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            //console.log(this.media_type)
            let param = {
                keyword: this.keyword,
                media_type: this.media_type,
                tdate: this.date[0],
                edate: this.date[1],
                page: this.page,
                page_size: this.page_size,
                orderField: this.orderField,
                orderDirection: this.orderDirection, //排序的方向值SORT_ASC顺序 SORT_DESC倒序
                author: this.author,
                agent: this.agent
            };
            this.$emit("on-change", param);
        },
        //分页
        changePage(val) {
            this.page = val;
            this.tableData();
        },
        //返回没有选中的
        getuncheck(val) {
            this.uncheck = val;
        },
        //选择代理商
        agentChange(data) {
            this.agent = data;
            this.tableData();
        },
        //按时间
        changeTime(val) {
            this.date = val;
            this.tableData();
        },
        //导出表单
        exportData() {
            if (!this.tab) {
                this.$refs.TableExport.exportCsv({
                    filename: "按账户查看"
                });
            } else {
                this.$refs.TableExport.exportCsv({
                    filename: "按负责人查看"
                });
            }
        },
        //按媒体筛选
        mediaChange(val) {
            this.media_type = val;
            this.tableData();
        },
        //排序
        sortChange(column) {
            this.orderField = column.key;
            if (column.order == "asc") {
                this.orderDirection = "SORT_ASC";
            } else if (column.order == "desc") {
                this.orderDirection = "SORT_DESC";
            } else {
                this.orderField = "";
                this.orderDirection = "";
            }
            this.tableData();
        },
        //选择负责人
        authorChange(data) {
            this.author = data;
            this.tableData();
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        }
    },
    computed: {
        //设置表格头部
        taColumns() {
            const tableColumnList = [
                {
                    title: "媒体",
                    key: "media_name",
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", "本页统计");
                        } else {
                            return h("span", params.row.media_name);
                        }
                    }
                },
                {
                    title: "账户名",
                    key: "account_name",
                    sortable: "custom",
                    render: (h, params) => {
                        return h(
                            "span",
                            {
                                class: "name_text",
                                on: {
                                    click: () => {
                                        let query = {
                                            id: params.row.account_id
                                        };
                                        if (params.row.media_name == "UC") {
                                            this.$router.push({
                                                name: "uc_plan",
                                                query: query
                                            });
                                        } else {
                                            this.$router.push({
                                                name: "time_plan",
                                                query: query
                                            });
                                        }
                                    }
                                }
                            },
                            params.row.account_name
                        );
                    }
                },
                {
                    title: "代理",
                    key: "agent",
                    sortable: "custom"
                },
                {
                    title: "推广余额",
                    key: "balance",
                    sortable: "custom",
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", params.row.balance);
                        } else {
                            const text = params.row.balance;
                            const color = text < 20000 ? "green" : "";
                            return h(
                                "span",
                                {
                                    class: color
                                },
                                text
                            );
                        }
                    }
                },
                {
                    title: "消耗",
                    key: "cost",
                    sortable: "custom",
                    render: (h, params) => {
                        const cost = params.row.cost;
                        const color = cost > 20000 ? "red" : "";
                        return h(
                            "span",
                            {
                                class: color
                            },
                            cost
                        );
                    }
                },
                {
                    title: "曝光",
                    key: "impression",
                    sortable: "custom"
                },
                {
                    title: "点击数",
                    key: "click",
                    sortable: "custom"
                },
                {
                    title: "点击率",
                    key: "ctr",
                    sortable: "custom"
                },
                {
                    title: "ecpm",
                    key: "cpm",
                    sortable: "custom"
                },
                {
                    title: "注册设备数",
                    key: "activation",
                    width: 120,
                    sortable: "custom"
                },
                {
                    title: "注册成本",
                    key: "reg_cost",
                    sortable: "custom"
                },
                {
                    title: "账户ID",
                    key: "account_id",
                    sortable: "custom"
                },
                {
                    title: "负责人",
                    key: "author"
                },
                {
                    title: "日期",
                    key: "date",
                    sortable: "custom"
                },
                {
                    title: "消耗预估天数",
                    width: 125,
                    key: "over_day",
                    sortable: "custom",
                    render: (h, params) => {
                        let color = "";
                        if (params.row.over_day < 5) {
                            color = "red";
                        } else if (params.row.over_day <= 10) {
                        } else {
                            color = "green"
                        }
                        return h(
                            "span",
                            {
                                class: color
                            },
                            params.row.over_day
                        );
                    }
                },
                {
                    title: "充值与转帐",
                    key: "platform",
                    width: 100,
                    render: (h, params) => {
                        if (params.row._disabled) return;
                        let money = "", mark = "";
                        return [h("span", {
                            class: "name_text",
                            on: {
                                click: () => {
                                    this.$Modal.confirm({
                                        render: h => {
                                            return [h("Input", {
                                                props: {
                                                    value: money,
                                                    autofocus: true,
                                                    placeholder: "请输入充值金额（元）"
                                                },
                                                on: {
                                                    input: val => {
                                                        money = val;
                                                    }
                                                }
                                            }), h("Input", {
                                                props: {
                                                    value: mark,
                                                    placeholder: "请输入备注"
                                                },
                                                style: {
                                                    marginTop: "10px"
                                                },
                                                on: {
                                                    input: val => {
                                                        mark = val;
                                                    }
                                                }
                                            })];
                                        },
                                        onOk: () => {
                                            if (money == "") {
                                                this.$Message.info("请输入充值金额");
                                                return;
                                            }
                                            Axios.post("api.php", {
                                                action: "sys",
                                                opt: "accountRecharge",
                                                account_id: params.row.account_id,
                                                media_type: params.row.media_type,
                                                money: money,
                                                mark: mark
                                            }).then(res => {
                                                if (res.ret == 1) {
                                                    this.$Message.info(res.msg);
                                                    if (params.row.media_type == 1) {
                                                        this.$router.push({
                                                            name: "time_rechargeRecord"
                                                        });
                                                    }
                                                    if (params.row.media_type == 3) {
                                                        this.$router.push({
                                                            name: "uc_rechargeRecord"
                                                        });
                                                    }
                                                    if (params.row.media_type == 4) {
                                                        this.$router.push({
                                                            name: "tt_rechargeRecord"
                                                        });
                                                    }
                                                }
                                            }).catch(err => {
                                                console.log("充值失败" + err);
                                            });
                                        }
                                    });
                                }
                            }
                        }, "充值"), h("span", {
                            class: "name_text",
                            style: {
                                marginLeft: "10px"
                            },
                            on: {
                                click: () => {
                                    //获取媒体账号
                                    Axios.get("api.php", {
                                        action: "api",
                                        opt: "getAccountByAgent",
                                        media_type: params.row.media_type,
                                        agent: params.row.agent
                                    }).then(res => {
                                        if (res.ret == 1) {
                                            this.transfer.accountList = res.data;
                                            this.transfer_modal = true;
                                            this.transfer.in_account_id = params.row.account_id;
                                            this.transfer.media_type = params.row.media_type;
                                        }
                                    }).catch(err => {
                                        console.log("获取媒体账号" + err);
                                    });
                                }
                            }
                        },
                            "转帐"
                        )]
                    }
                },

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
    },

    beforeMount() {
        let setDate = DateShortcuts;
        setDate.disabledDate = date => {
            return date && date.valueOf() > Date.now() - 86400000;
        };
        this.options = setDate;
    }
};
</script>
