<style>
    @import "../../styles/common.less";
</style>
<template>
    <Card :bordered="false">
        <Row>
            <Col span="24">
                <Input v-model="searchUserCondition.userName" placeholder="搜索用户名" style="width:150px;"></Input>
                <Input v-model="searchUserCondition.ip" placeholder="搜索IP" style="width:150px;"></Input>
                <Input v-model="searchUserCondition.keywords" placeholder="关键字" style="width:150px;"></Input>
                <Date-picker :value="searchUserCondition.date" type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px" @on-change="dateChange"></Date-picker>
                <Checkbox v-model="searchUserCondition.notTanWan">非公司IP</Checkbox>
                <Checkbox v-model="searchUserCondition.notHangZhouVPN">非杭州VPN</Checkbox>
                <Button icon="search" @click="getLogList">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <br>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table border :columns="tableColumns" :data="tableData" :size="tableSize"></Table>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="pageSize" style="width:80px" placement="top" transfer @on-change="getLogList(undefined)">
                <Option v-for="item in 100" :value="item" :key="item" v-if="item%20==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="recordTotalNumber" :current="page" :page-size="pageSize" ref="pages" @on-change="getLogList" show-elevator show-total></Page>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import Axios from '@/api/index';
    export default {
        data() {
            return {
                //分页属性
                tableSize: "small",
                recordTotalNumber: 1, //总数量
                page: 1, //第N页
                pageSize: 20, //每页数量
                //表格属性
                tableColumns: [
                    {
                        title: '登陆账号',
                        key: 'userName',
                        width: 250
                    },
                    {
                        title: '操作时间',
                        key: 'actionTime',
                        width: 250
                    },
                    {
                        title: 'IP详细',
                        key: 'ip',
                        width: 250,
                        render: (h, params) => {
                            return [
                                h(
                                    "span",
                                    {
                                        style: {
                                            color: params.row.ipColor
                                        }
                                    },
                                    params.row.ip
                                )
                            ];
                        }
                    },
                    {
                        title: '操作菜单',
                        key: 'actionMenu'
                    },
                    {
                        title: '操作详细',
                        key: 'actionDetail',
                        render: (h, params) => {
                            return [
                                h(
                                    "Tooltip",
                                    {
                                        props: {
                                            content: 'params.row.actionDetail',
                                            placement: "top-start"
                                        }
                                    },
                                    params.row.actionDetailAb
                                )
                            ];
                        }
                    }
                ],
                tableData: [],
                //搜索用户条件
                searchUserCondition: {
                    act: '',
                    userName: '',
                    ip: '',
                    keywords: '',
                    date: ["",""],
                    notTanWan: false,
                    notHangZhouVPN: false
                }
            }
        },
        mounted() {
            this.getLogList();
        },
        methods: {
            strcut (str, n) {//字符串截取 包含对中文处理
                if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
                    return str;
                } else {
                    var len = 0;
                    var tmpStr = "";
                    for (var i = 0; i < str.length; i++) {//遍历字符串
                        if (/[\u4e00-\u9fa5]/.test(str[i])) {//中文 长度为两字节
                            len += 2;
                        } else {
                            len += 1;
                        }
                        if (len > n) {
                            break;
                        } else {
                            tmpStr += str[i];
                        }
                    }
                    return tmpStr + " ...";
                }
            },
            dateChange (date) {
                this.searchUserCondition.date = date;
            },
            //获取操作日志列表
            getLogList (page) {
                if (page === undefined) {
                    this.page = 1;
                } else if (typeof page == 'object') {
                    this.page = 1;
                    this.searchUserCondition.act = 'search';
                } else {
                    this.page = page;
                }
                let postParams;
                if (this.searchUserCondition.act == 'search') {
                    postParams = {
                        numPerPage: this.pageSize,
                        pageNum: this.page,
                        act: 'search',
                        uName: this.searchUserCondition.userName,
                        ip: this.searchUserCondition.ip,
                        keywords: this.searchUserCondition.keywords
                    };
                    if (this.searchUserCondition.date[0]) {
                        postParams.sdate = this.searchUserCondition.date[0];
                    }
                    if (this.searchUserCondition.date[1]) {
                        postParams.edate = this.searchUserCondition.date[1];
                    }
                    if (this.searchUserCondition.notTanWan) {
                        postParams.noip = '1';
                    }
                    if (this.searchUserCondition.notHangZhouVPN) {
                        postParams.noip2 = '1';
                    }
                } else {
                    postParams = {
                        numPerPage: this.pageSize,
                        pageNum: this.page
                    };
                }
                //console.log(postParams);
                Axios.post('api.php?action=sys&opt=logs',postParams)
                .then(
                    res => {
                        //console.log(res);
                        if (res.ret == 1) {
                            this.recordTotalNumber = res.data.searchArr.totalCount;
                            this.page = res.data.searchArr.pageNum;
                            this.pageSize = parseInt(res.data.searchArr.numPerPage);
                            this.searchUserCondition.date = [res.data.searchArr.sdate,res.data.searchArr.edate];
                            if (res.data.searchArr.uName) {
                                this.searchUserCondition.userName = res.data.searchArr.uName;
                            }
                            if (res.data.searchArr.ip) {
                                this.searchUserCondition.ip = res.data.searchArr.ip;
                            }
                            if (res.data.searchArr.keywords) {
                                this.searchUserCondition.keywords = res.data.searchArr.keywords;
                            }
                            if (res.data.searchArr.noip == '1') {
                                this.searchUserCondition.notTanWan = true;
                            } else {
                                this.searchUserCondition.notTanWan = false;
                            }
                            if (res.data.searchArr.noip2 == '1') {
                                this.searchUserCondition.notHangZhouVPN = true;
                            } else {
                                this.searchUserCondition.notHangZhouVPN = false;
                            }
                            this.tableData = [];
                            for (let i in res.data.result) {
                                let row = {
                                    userName: res.data.result[i].uName,
                                    actionTime: res.data.result[i].logtime,
                                    ip: res.data.result[i].ip+' '+res.data.result[i].area,
                                    ipColor: res.data.result[i].color,
                                    actionMenu: (res.data.result[i].menu!='')?res.data.result[i].menu:(res.data.result[i].action+' -> '+res.data.result[i].opt+((res.data.result[i].act!='')?' -> '+res.data.result[i].act:'')),
                                    actionDetail: res.data.result[i].memo,
                                    actionDetailAb: this.strcut(res.data.result[i].memo, 20)
                                };
                                this.tableData.push(row);
                            }
                        }
                        //console.log(this.searchUserCondition);
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
            }
        }
    };
</script>