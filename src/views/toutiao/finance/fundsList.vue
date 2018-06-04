<style scoped>
.tip-txt{
    width: 100%;
    color: #777;
    font-size: 12px;
}
.tip-txt p{
    display: inline-block;
    text-indent: 60px;
}
.tip-txt p:first-of-type{
    text-indent: 0;
}
</style>
<template>
<div>

    <Card shadow>
        <Row>
            <Col span="14">
                <DatePicker type="daterange" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                <Input v-model="keyword" style="display:inline-block;width:150px;margin-left:10px;" placeholder="请输入帐户名" clearable @on-enter="getfund()"></Input>
                <Button type="primary" icon="search" @click="getfund()">搜索</Button>
            </Col>
        </Row>

        <Table @on-selection-change="handleSelectionChange" :columns="fundcolumns" :data="fundsData" :loading="loading" :size="tableSize" class="margin-top-10" :row-class-name="rowClassName" @on-sort-change="sortchange"></Table>

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
            <Page :total="total_number" :page-size="page_size" ref="fundspage" @on-change="getfund" show-elevator show-total></Page>
            </Col>
        </Row>
    </Card>

    <Card>
        <div class="tip-txt margin-top-10">
            <p>数据说明：1.总支出：所有广告计划的消耗</p>
            <p>2.总存入：包括充值、赠款、返点</p>
            <p>3.总转入：广告主与代理商之间的转账收入</p>
            <p>4.总转出：广告主与代理商之间的转账支出</p>
            <p>5.日终结余：当日账户总余额，包括冻结款</p>
        </div>
        
    </Card>
</div>
</template>
<script>
import Axios from "@/api/index";
import {DateShortcuts, formatDate, changetime, deepClone} from "@/utils/DateShortcuts.js";
export default {
    data() {
        return {
            loading: false,
            options: DateShortcuts, //日期辅助功能
            DateDomain: [
                formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), "yyyy-MM-dd"),
                formatDate(new Date(), "yyyy-MM-dd")
            ], //筛选时间
            fundcolumns: [
                {
                    title: "日期",
                    sortable: "custom",
                    key: "date",
                    render: (h, params) => {
                        if (params.row._disabled) {
                            return h("span", "本页统计");
                        } else {
                            return h("span", params.row.date);
                        }
                    }
                },
                {
                    title: '账户id',
                    key: 'account_id'
                },
                {
                    title: '账号名',
                    key: 'account_name'
                },
                {
                    title: '代理',
                    key: 'agent'
                },
                {
                    title: '代理全称',
                    key: 'agent_detail'
                },
                {
                    title: "总支出",
                    sortable: "custom",
                    key: "cost"
                },
                {
                    title: "现金支出",
                    sortable: "custom",
                    key: "cash_cost"
                },
                {
                    title: "赠款支出",
                    sortable: "custom",
                    key: "reward_cost"
                },
                {
                    title: "总存入",
                    sortable: "custom",
                    key: "income"
                },
                {
                    title: "总转入",
                    sortable: "custom",
                    key: "transfer_in"
                },
                {
                    title: '总转出',
                    sortable: "custom",
                    key: 'transfer_out'
                },
                {
                    title: '日终结余',
                    sortable: "custom",
                    key: 'balance'
                },
                {
                    title: '冻结',
                    sortable: "custom",
                    key: 'frozen',
                    width: 140
                }
            ],
            fundsData: [],
            keyword:'', //模糊搜索关键词(账户id,账户名称)
            tableSize: "small",
            page: 1, //第N页
            page_size: 50, //每页数量
            total_number: 1, //总数量
            total_page: 1, //总页数
            //排序
            orderField: "",
            orderDirection: "",
        };
    },
    mounted() {
        this.getfund();
    },
    methods: {        
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
                this.$refs["fundspage"].currentPage = 1;
                this.page = 1;
            } else {
                this.page = page;
            }
            this.loading = true;
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getAccountFund",
                keyword:this.keyword,
                page_size:this.page_size,
                page:this.page,
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                orderField: this.orderField,
                orderDirection: this.orderDirection //排序的方向值SORT_ASC顺序 SORT_DESC倒序
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {                    
                    let data = res.data;
                    data.curr_page_total._disabled = true;
                    data.list.push(data.curr_page_total); 
                    this.fundsData = data.list;
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
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection =
                column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getfund();
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        }
    }
};
</script>
