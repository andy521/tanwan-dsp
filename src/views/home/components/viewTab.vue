<style>
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

.table-statistics {
  color: #2b7ed1;
  font-weight: bold;
}
.smedia {
  display: inline-block;
  width: auto;
  min-width: 150px;
  margin: 0 10px;
}
.search_area {
  width: 200px;
  display: inline-block;
  margin-bottom: -12px;
  margin-right: 10px;
}
.name_text {
  color: #2b7ed1;
  cursor: pointer;
}
.name_text:hover {
  text-decoration: underline;
}
</style>
<template>
    <Card dis-hover shadow class="margin-top-10">
        <div slot="title" class="card-title">
            <Icon type="ios-paper"></Icon> 按账户查看

            <div class="tr">
                <div class="search_area">
                    <Input v-model="keyword" placeholder="请输入要搜索的内容" @on-enter="tableData">
                    <Button slot="append" icon="ios-search" @on-click="tableData"></Button>
                    </Input>
                </div>
                <!-- <select-author :is-linkage="true" :media-type="media_type"  @on-change="authorChange" @click.native="handleClickAuthor"></select-author> -->
                <select-author :is-linkage="true" :media-type="media_type" @on-change="authorChange"></select-author>

                <select-media class="smedia" @on-change="mediaChange"></select-media>

                <DatePicker type="daterange" :options="options" :value="date" style="width: 190px" placement="bottom-end" placeholder="请选择日期" format="yyyy-MM-dd" @on-change="changeTime" class="margin-right-10"></DatePicker>

                <Button icon="document-text" @click="exportData()">下载报表</Button>
            </div>
        </div>

        <Table stripe :size="tableSize" :columns="tcolumns" :data="tdata.list" ref="TableExport" @on-sort-change="sortChange" :row-class-name="rowClassName" height="397">
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
    </Card>
</template>
<script>
import Axios from "@/api/index";
import selectMedia from "@/components/select-media/index.vue";
import selectAuthor from "@/components/select-author/index.vue";
import { DateShortcuts, formatDate } from "@/utils/DateShortcuts.js";
export default {
    components: {
        selectMedia,
        selectAuthor
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
            author_model: [],
            author: [],
            tcolumns: [
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
                    key: "click_per",
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
                    title: "充值",
                    key: "platform",
                    width: 60,
                    render: (h, params) => {
                        if (params.row._disabled) return;
                        return h(
                            "span",
                            {
                                class: "name_text",
                                on: {
                                    click: () => {
                                        this.$Message.info('敬请期待');
                                        // this.$router.push({
                                        //     name: "ttcampaign",
                                        //     query: {
                                        //         id: params.row.id
                                        //     }
                                        // });
                                    }
                                }
                            },
                            "充值"
                        )
                    }
                }
            ]
        };
    },
    methods: {
        // handleClickAuthor() {
        // 	if (!this.media_type) {
        // 		this.$Message.warning('请先选择媒体账号');
        // 		return;
        // 	}
        // },
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
                author: this.author_model
            };
            this.$emit("on-change", param);
        },
        //分页
        changePage(val) {
            this.page = val;
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
            this.author_model = data;
            this.tableData();
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
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