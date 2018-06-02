<style scoped>
.inp {
  display: inline-block;
  width: 150px;
}
</style>
<template>
    <Card dis-hover>
        <Row>
            <Col span="14">
            <!--选择负责人-->
            <select-author :is-linkage="true" :media-type="mediaType" @on-change="authorChange"></select-author>
            <!--选择代理商-->
            <select-agent @on-change="agentChange"></select-agent>
            <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
            <Input v-model="account_name" class="inp" placeholder="请输入帐户名" clearable @on-enter="getfund()"></Input>
            <Button type="primary" icon="search" @click="getfund()">搜索</Button>
            </Col>
            <Col span="10" style="text-align: right;">
            <Poptip confirm title="您确认删除选中内容吗？" placement="bottom-end" @on-ok="removeRecharge()" style="text-align: left;">
                <Button type="ghost" icon="trash-a">删除</Button>
            </Poptip>
            <Button type="ghost" icon="document-text" @click="exportData()">下载报表</Button>
            </Col>
        </Row>

        <Table @on-selection-change="handleSelectionChange" :columns="fundcolumns" :data="funddata" :loading="loading" :size="tableSize" class="margin-top-10" ref="rechargetable"></Table>

        <Row class="margin-top-10">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="page_size" style="width:80px" placement="top" transfer @on-change="getfund()">
                <Option v-for="item in 500" :value="item" :key="item" v-if="item%50==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="total_number" :page-size="page_size" ref="fundpage" @on-change="getfund" show-elevator show-total></Page>
            </Col>
        </Row>
    </Card>
</template>
<script>
import Axios from "@/api/index";
import {
    DateShortcuts,
    formatDate,
    changetime,
    deepClone
} from "@/utils/DateShortcuts.js";
import selectAuthor from "@/components/select-author/index.vue";
import selectAgent from "@/components/select-agent/index.vue";
export default {
    components: {
        selectAuthor,
        selectAgent
    },
    data() {
        return {
            loading: false,
            options: DateShortcuts, //日期辅助功能
            agent: "",
            mediaType: 1,
            edit_status: "",
            author: [],
            account_name: "",
            DateDomain: [
                formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            taCheckids: [], //选中ids
            fundcolumns: [
                {
                    type: "selection",
                    width: 58,
                    key: ""
                },
                {
                    title: "账户名",
                    key: "account_name"
                },
                {
                    title: "代理简称",
                    key: "agent"
                },
                {
                    title: "代理全称",
                    key: "agent_detail"
                },
                {
                    title: "支付方式",
                    key: "pay_type",
                    render: (h, params) => {
                        if (params.row.pay_type == 1) {
                            return h("span", {
                                style: {
                                    color: "#0c6"
                                }
                            }, "转帐加款");
                        } else {
                            return h("span", {
                                style: {
                                    color: "#f30"
                                }
                            }, "转帐退款");
                        }
                    }
                },
                {
                    title: "加款",
                    key: "add_funds"
                },
                {
                    title: "退款",
                    key: "refunds"
                },
                {
                    title: "负责人",
                    key: "author"
                },
                {
                    title: "备注",
                    key: "mark"
                },
                {
                    title: '转账时间',
                    key: 'date',
                    width: 160
                }

            ],
            funddata: [],
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1 //总页数
        };
    },
    mounted() {
        this.getfund();
    },
    methods: {
        // 批量删除
        removeRecharge() {
            if (this.taCheckids.length === 0) {
                return this.$Message.info('请勾选内容')
            }
            Axios.post('api.php', {
                action: 'sys',
                opt: 'DeleteAccountTransfer',
                ids: this.taCheckids
            }).then(res => {
                if (res.ret === 1) {
                    this.$Message.info(res.msg)
                    this.getfund(this.page)
                }
            }).catch(err => {
                console.error('删除转账记录错误', err)
            })
        },
        // 选择的所有数据
        handleSelectionChange(rows) {
            const ids = [];
            rows.forEach(item => {
                ids.push(item.id);
            });
            this.taCheckids = ids;            
        },
        //获取转帐列表
        getfund(page) {
            if (page === undefined) {
                this.$refs["fundpage"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.post("api.php", {
                action: "sys",
                opt: "accountTransferData",
                media_type: this.mediaType,
                agent: this.agent,
                author: this.author,
                account_name: this.account_name,
                start_date: this.DateDomain[0], //开始时间
                end_date: this.DateDomain[1], //结速时间
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    this.funddata = res.data.list;
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                }
            }).catch(err => {
                this.loading = false;
                console.log("获取充值列表" + err);
            });
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getfund();
        },
        //按媒体筛选
        mediaChange(val) {
            this.media_type = val;
            this.getfund();
        },
        //选择负责人
        authorChange(data) {
            this.author = data;
            this.getfund();
        },
        //选择代理商
        agentChange(data) {
            this.agent = data;
            this.getfund();
        },
        //导出报表
        exportData(type) {
            this.$refs["rechargetable"].exportCsv({
                filename: "转帐记录",
                original: false
            });
        }
    }
};
</script>
