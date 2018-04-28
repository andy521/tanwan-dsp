<style scoped>
@import "../../styles/common.less";
@import "./index.less";
</style>
<template>
    <div class="idea">
        <Card shadow class="margin-top-10">
            <Row>
                <Col span="15">
                    <Button v-show="isBack" type="primary" @click="back">返回</Button>
                    <Button type="ghost" icon="funnel" :loading="filterLoading" class="margin-left-10" @click="setFilter">筛选</Button>
                    <DatePicker type="daterange" class="margin-left-10" :options="options" placement="bottom-start" placeholder="请选择日期" format="yyyy-MM-dd" :value="DateDomain" @on-change="changeDate"></DatePicker>
                    <Input v-model="keyword" class="inp" placeholder="请输入关键字"></Input>
                    <Button icon="search" @click="getIdea()">搜索</Button>
                    <new-edit title="新建单元" class="margin-left-5"></new-edit>
                </Col>
                <Col span="9" style="text-align: right;">
                    <Button type="ghost" icon="trash-a" @click="deleteFun">删除</Button>
                    <Poptip placement="bottom-start" v-model="visible">
                        <Button type="ghost" icon="toggle-filled">修改状态</Button>
                        <div class="api" slot="content">
                            <div style="text-align: left;">
                                <Select v-model="setpaused" :value="setpaused">
                                    <Option value="0">启用</Option>
                                    <Option value="1">暂停</Option>
                                </Select>
                            </div>
                            <div class="tipbtn margin-top-10">
                                <Button type="text" size="small" @click="visible=false">取消</Button>
                                <Button type="primary" size="small" @click="setPausedFun">确定</Button>
                            </div>
                        </div>
                    </Poptip>
                    <!-- <unit-index @on-change="getIndex" :check="checkAllGroup" ></unit-index> -->
                    <idea-index @on-change="getIndex" :check="checkAllGroup"></idea-index>
                </Col>
            </Row>

            <div class="condition" v-show="filterShow">
                <a href="javascript:;" @click="deleteFilterAll" style="margin-right:10px;">清空所有条件</a>
                <Tag v-for="item in filterItem" type="border" :name="item.id" :key="item.id" closable @on-close="deleteFilter">{{item.text}}</Tag>
            </div>
            <Table :data="list" :height="height" :loading="loading" :columns="tableColumns" :size="tableSize" class="margin-top-10" ref="Vtable" @on-selection-change="taCheck" @on-sort-change="sortchange" stripe></Table>
        </Card>

        <Modal v-model="filterModal" title="筛选条件" @on-ok="filterOk" @on-cancel="filterModal = false">
            <p class="mt">推广状态</p>
            <Radio-group v-model="state">
                <Radio label="">不限</Radio>
                <Radio label="0">启动</Radio>
                <Radio label="1">暂停</Radio>
                <Radio label="4">审核中</Radio>
                <Radio label="5">不宜推广</Radio>
                <Radio label="6">样式已下线</Radio>
            </Radio-group>
            <p class="mt margin-top-20">投放数据</p>
            <div class="model-col">
                <Row>
                    <Col span="12"> 展现量:
                    <Select v-model="impression_relation" style="width:50px">
                        <Option value=">=">>=</Option>
                        <Option value="=">=</Option>
                        <Option value="<="><=</Option>
                    </Select>
                    <Input v-model="impression_value" @on-blur="setNum('impression')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12"> 消&nbsp;&nbsp;&nbsp;&nbsp;费:
                    <Select v-model="cost_relation" style="width:50px">
                        <Option value=">=">>=</Option>
                        <Option value="=">=</Option>
                        <Option value="<="><=</Option>
                    </Select>
                    <Input v-model="cost_value" @on-blur="setNum('cost')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12"> 点击量:
                    <Select v-model="click_relation" style="width:50px">
                        <Option value=">=">>=</Option>
                        <Option value="=">=</Option>
                        <Option value="<="><=</Option>
                    </Select>
                    <Input v-model="click_value" @on-blur="setNum('click')" placeholder="" style="width:110px"></Input>
                    </Col>
                    <Col span="12"> 点击率:
                    <Select v-model="ctr_relation" style="width:50px">
                        <Option value=">=">>=</Option>
                        <Option value="=">=</Option>
                        <Option value="<="><=</Option>
                    </Select>
                    <Input v-model="ctr_value" @on-blur="setNum('ctr')" placeholder="" style="width:110px"></Input>
                    </Col>
                </Row>
            </div>
            <p class="mt margin-top-20">广告样式</p>
            <Select v-model="creativeTemplate_id" style="width:200px">
                <Option v-for="item in adstyle" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </Modal>
    </div>
</template>
<script>
import Axios from "@/api/index";
import weekDate from "@/components/week-date/index.vue";
import { DateShortcuts, formatDate, deepClone } from "@/utils/DateShortcuts.js";
import createidea from "./components/createIdea.vue";
import newEdit from "./components/newEdit.vue";
import ideaIndex from "./components/ideaIndex.vue";
export default {
    components: {
        newEdit,
        createidea,
        ideaIndex,
        weekDate
    },
    data() {
        return {
            height: document.body.clientHeight - 200,
            isBack:false,
            filterLoading: false,
            loading: false,
            filterModal: false,
            keyword: "", //关键字
            DateDomain: [formatDate(new Date(), "yyyy-MM-dd"),formatDate(new Date(), "yyyy-MM-dd")], //筛选时间
            //日期辅助功能
            options: DateShortcuts,
            tableSize: "small",
            //修改状态
            setpaused: "",
            visible: false,
            //单元id
            adgroup_id: "",
            //第N页
            page: 1,
            //每页数量
            page_size: 50,
            //总数量
            total_number: 1,
            //总页数
            total_page: 1,
            //默认自定义指标选项
            checkAllGroup:['paused','state','impression','click',"ctr","cost","account_name","adgroup_name",'activation','cvr','cost_per_conversion'],
            //表头设置
            tableColumns: [],
            //数据
            list: [],
            //创意id
            creativeids: "",
            //筛选条件显示DIV
            filterShow: false,
            filterItem: [],
            //计划状态
            state: "",
            //展现量
            impression_relation: ">=",
            impression_value: "",
            //消费
            cost_relation: ">=",
            cost_value: "",
            //点击量
            click_relation: ">=",
            click_value: "",
            //点击率
            ctr_relation: ">=",
            ctr_value: "",
            //广告样式列表
            adstyle: [],
            creativeTemplate_id: ""
        };
    },
    methods: {
        //返回
        back() {
            this.$router.go(-1);
        },
        //改变日期
        changeDate(e) {
            this.DateDomain = e;
            this.getIdea();
        },
        getIdea(page) {
            if (page === undefined) {
                this.page = 1;
            } else {
                this.page = page;
            }
            let param = {
                action: "ucAdPut",
                opt: "searchCreatives",
                startDate: this.DateDomain[0], //开始时间
                endDate: this.DateDomain[1], //结速时间
                keyword: this.keyword, //模糊搜索关键词(针对计划名称、后台用户名称)
                creativeTemplate_id: this.creativeTemplate_id, //筛选-广告样式id
                state: this.state,
                "impression[relation]": this.impression_relation,
                "impression[value]": this.impression_value,
                "cost[relation]": this.cost_relation,
                "cost[value]": this.cost_value,
                "click[relation]": this.click_relation,
                "click[value]": this.click_value,
                "ctr[relation]": this.ctr_relation,
                "ctr[value]": this.ctr_value,
                adgroup_id: this.adgroup_id, //单元id
                page: this.page, //页码
                page_size: this.page_size, //每页数量
                orderField: this.orderField,
                orderDirection: this.orderDirection
            };
            Axios.post("api.php", param).then(res => {
                if (res.ret == "1") {
                    console.log(res);
                    this.loading = false;
                    this.list = res.data.list;
                    this.page = parseInt(res.data.page);
                    this.page_size = parseInt(res.data.page_size);
                    this.total_number = res.data.total_number;
                    this.total_page = res.data.total_page;
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        //排序
        sortchange(column) {
            this.orderField = column.key;
            this.orderDirection = column.order == "asc" ? "SORT_ASC" : "SORT_DESC";
            this.getIdea();
        },
        //修改状态
        setPausedFun() {
            if (this.checkId.length == "0") {
                this.$Message.info("请勾选需要修改的数据");
            return;
            }
            let param = {
                account_id: this.checkId[0],
                creativeids: "[" + this.creativeids.join(",") + "]",
                paused: this.setpaused
            };
            this.updatePaused(param);
        },
        //投放开关
        updatePaused(data) {
            let param = data;
            param.action = "ucAdPut";
            param.opt = "updateCreativePaused";
            Axios.post("api.php", param).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.data);
                    this.getIdea();
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        //获取选中的id
        taCheck(row) {
            if (row.length > 0) {
                this.operating = false;
            }
            let ids = [],
            creative = [];
            row.forEach(item => {
                ids.push(item.account_id);
                creative.push(item.creative_id);
            });
            this.checkId = ids;
            this.creativeids = creative;
        },
        setFilter() {
            this.filterLoading = true;
            Axios.post("api.php", {action: "ucAdPut",opt: "getCreativeTemplates",adgroup_id: this.adgroup_id}).then(res => {
                if (res.ret == "1") {
                    let list = res.data,
                    s = [];
                    list.forEach(item => {
                        s.push({
                            value: item.creativeTemplateId,
                            label: item.creativeTemplateName
                        });
                    });
                    this.adstyle = s;
                    this.filterLoading = false;
                    this.filterModal = true;
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        filterOk() {
            let item = [];
            if (this.state != "") {
                let t = "推广状态:";
                switch (this.state) {
                    case "0": t += "推广中"; break;
                    case "1": t += "推广暂停"; break;
                    case "2": t += "推广计划预算不足"; break;
                    case "3": t += "不在推广周期";break;
                }
                item.push({ text: t, id: "state" });
            }
            if (this.impression_value != "") {
                const t = "展现量:" + this.impression_relation + this.impression_value;
                item.push({ text: t, id: "impression" });
            }
            if (this.cost_value != "") {
                const t = "消费:" + this.cost_relation + this.cost_value;
                item.push({ text: t, id: "cost" });
            }
            if (this.click_value != "") {
                const t = "点击量:" + this.click_relation + this.click_value;
                item.push({ text: t, id: "click" });
            }
            if (this.ctr_value != "") {
                const t = "点击率:" + this.ctr_relation + this.ctr_value;
                item.push({ text: t, id: "ctr" });
            }
            if (this.creativeTemplate_id != "") {
                let t = "广告样式:";
                this.adstyle.forEach(item => {
                    if (item.value == this.creativeTemplate_id) {
                        t += item.label;
                    }
                });
                item.push({ text: t, id: "creativeTemplate" });
            }
            if (item.length > 0) {
                this.filterItem = item;
                this.filterShow = true;
                this.getIdea();
            }
        },
        deleteFilter(event, name) {
            switch (name) {
                case "state": this.state = ""; break;
                case "impression":  this.impression_value = ""; break;
                case "cost": this.cost_value = ""; break;
                case "click": this.click_value = ""; break;
                case "ctr": this.ctr_value = ""; break;
                case "creativeTemplate": this.creativeTemplate_id = ""; break;
            }
            let fitem = [];
            this.filterItem.forEach(item => {
                if (item.id != name) {
                    fitem.push(item);
                }
            });
            this.filterItem = fitem;
            if (fitem.length == 0) {
                this.filterShow = false;
            }
            this.getIdea();
        },
        deleteFilterAll() {
            this.state = this.impression_value = this.cost_value = this.click_value = this.ctr_value = this.creativeTemplate_id = "";
            this.filterShow = false;
            this.getIdea();
        },
        //删除
        deleteFun() {
            if (this.checkId.length == "0") {
                this.$Message.info("请勾选需要修改的数据");
                return;
            }
            let account = this.checkId[0],
            creative = "[" + this.creativeids.join(",") + "]";
            this.deleteData(account, creative);
        },
        deleteData(account, creative) {
            let param = {
                action: "ucAdPut",
                opt: "deleteCreative",
                do: "del",
                account_id: account,
                creativeids: creative
            };
            console.log(param);
            Axios.post("api.php", param).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getIdea();
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        //获取自定义指标
        getIndex(data){                
            this.checkAllGroup = data;                 
            this.tableColumns = this.getTableColumns();
        }, 
        getTableColumns(){
            const tableColumnList = {
                selection :{ type: "selection",width: 60,align: "center"},
                content:{
                    title: "创意",
                    key: "content",
                    width: 400,
                    render: (h, params) => {
                        return h(createidea, {
                            props: {
                                content: params.row.content
                            }
                        });
                    }
                },
                paused:{
                    title: "投放开关",
                    align: "center",
                    key: "paused",
                    width: 100,
                    render: (h, params) => {
                        if (!params.row.paused) {
                            return;
                        } else {
                            return h("div", [
                                h("i-switch", {
                                    props: {
                                        size: "small",
                                        value: params.row.paused == "0" ? true : false
                                    },
                                    on: {
                                        "on-change": value => {
                                            let paused = value ? "0" : "1";
                                            let param = {
                                            account_id: params.row.account_id,
                                            creativeids: "[" + params.row.creative_id + "]",
                                            paused: paused
                                            };
                                            this.updatePaused(param);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                },
                state:{
                    title: "推广状态",
                    key: "state",
                    width: 120,
                    render: (h, params) => {
                        let text = "";
                        switch (params.row.state) {
                            case "0": text = "推广中"; break;
                            case "1": text = "推广暂停"; break;
                            case "4": text = "审核中"; break;
                            case "5": text = "审核拒绝"; break;
                            case "6": text = "样式下线"; break;
                        }
                        return h("span", text);
                    }
                },
                impression:{
                    title: "展现量",
                    sortable: "custom",
                    key: "impression",
                    width: 120
                },
                click:{
                    title: "点击量",
                    sortable: "custom",
                    key: "click",
                    width: 120
                },
                ctr:{
                    title: "点击率",
                    sortable: "custom",
                    key: "ctr",
                    width: 120
                },
                cost:{
                    title: "消费",
                    sortable: "custom",
                    key: "cost",
                    width: 120
                },
                account_name:{
                    title: "账号",
                    sortable: "custom",
                    key: "account_name",
                    width: 120
                },
                adgroup_name:{
                    title: "单元名称",
                    sortable: "custom",
                    key: "adgroup_name",
                    width: 120
                },
                activation:{
                    title: "转化数",
                    sortable: "custom",
                    key: "activation",
                    width: 120
                },
                cvr:{
                    title: "转化率",
                    sortable: "custom",
                    key: "cvr",
                    width: 120
                },
                cpc:{
                    title: "平均点击价格",
                    sortable: "custom",
                    key: "cpc",
                    width: 120
                },
                cpm:{
                    title: "千次展现价格",
                    sortable: "custom",
                    key: "cpm",
                    width: 120
                },
                download_complete:{
                    title: "下载数",
                    sortable: "custom",
                    key: "download_complete",
                    width: 120
                },
                download_complete_rate:{
                    title: "下载率",
                    sortable: "custom",
                    key: "download_complete_rate",
                    width: 120
                },
                conversion:{
                    title: "注册设备数",
                    sortable: "custom",
                    key: "conversion",
                    width: 120
                },
                cost_per_conversion:{
                    title: "转化成本",
                    sortable: "custom",
                    key: "cost_per_conversion",
                    width: 120
                },
                adgroup_id:{
                    title: "单元id",
                    sortable: "custom",
                    key: "adgroup_id",
                    width: 120
                },
                operate:{
                    title: "操作",
                    align: "center",
                    key: "operate",
                    width: 200,
                    render: (h, params) => {
                        return [
                            h("span",{
                                class: "edit_link",
                                on: {
                                    click: () => {
                                        let query = {
                                            id: params.row.id,
                                            creative: params.row.creative_id,
                                            account: params.row.account_id,
                                            adgroup_id: params.row.adgroup_id,
                                            campaign_id: params.row.campaign_id,
                                            edit: "1"
                                        };
                                        this.$router.push({
                                            name: "ucidea",
                                            query: query
                                        });
                                    }
                                }
                            },"编辑"),
                            h("span",{
                                class: "del_link",
                                on: {
                                    click: value => {
                                        let account = params.row.account_id,
                                            creative = "[" + params.row.creative_id + "]";
                                        this.$Modal.confirm({
                                            title: "操作提示",
                                            content: "<p>确认删除</p>",
                                            onOk: () => {
                                                this.deleteData(account, creative);
                                            },
                                            onCancel: () => {}
                                        });
                                    }
                                }
                            },"删除")
                        ];
                    }
                }
            };
            //固定选项
            let data = [
                tableColumnList.selection,
                tableColumnList.content,
                tableColumnList.account_name
            ];                
            this.checkAllGroup.forEach( col => data.push(tableColumnList[col]) ); 
            data.push(tableColumnList.operate)
            return data;
        },
        //获取自定义指标
        getIndex(data){                
            this.checkAllGroup = data;                 
            this.tableColumns = this.getTableColumns();
        },  
        changeTableColumns(){
            this.tableColumns = this.getTableColumns();
        },
    },
    beforeMount() {
        let query = this.$route.query.adgroup_id;
        if (!!query) {
            this.adgroup_id = query.toString();
            this.isBack = true;
        };
        this.changeTableColumns();
        this.getIdea();
    }
};
</script>