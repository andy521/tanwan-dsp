<style lang="less">
    @import "../../styles/common.less";
    @import '../../styles/table.less';
    .ivu-card-body{padding: 10px;}
    .ivu-card-head-inner, .ivu-card-head p{height: auto}    
    .card-title-small .ivu-card-head{padding: 9px 16px 7px;}
    .card-title-small .ivu-card-head .card-title{line-height:32px;}
</style>
<template>
    <div id="home">

        <Row class-name="home-page-row1" class="margin-top-10">
            <Card dis-hover shadow class="card-title-small">
                <p slot="title" class="card-title">
                    <Icon type="ios-paper"></Icon>
                    所选账户在所选时段数据汇总
                    <ButtonGroup :style="{ float: 'right'}">
						<Button type="primary" @click="addBindId = true">新增绑定账户</Button>
					</ButtonGroup>
                </p>
                <div class="map-con">
                    <Row :gutter="10">

                        <Col :xs="24" :sm="12" :md="4" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="impression"
                                :end-val="total.impression"
                                iconType="ios-eye"
                                color="#2d8cf0"
                                intro-text="展示"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="click"
                                :end-val="total.click"
                                iconType="mouse"
                                color="#64d572"
                                intro-text="点击"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="balance_1"
                                :end-val="total.balance_1"
                                iconType="social-yen"
                                color="#f90"
                                intro-text="现金账户"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="balance_2"
                                :end-val="total.balance_2"
                                iconType="social-buffer-outline"
                                color="#f25e43"
                                intro-text="虚拟账户"
                            ></infor-card>
                        </Col>

                        <Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
                            <infor-card
                                id-name="balance_4"
                                :end-val="total.balance_4"
                                iconType="card"
                                color="#19be6b"
                                intro-text="信用账户"
                            ></infor-card>
                        </Col>
                        
                    </Row>

                </div>
            </Card>
        </Row>

        <!-- 按账户查看 - 按产品查看 -->
        <view-tab :tdata="tableData" :media="media"></view-tab>      

        <!-- 线性表格 -->
        <linear-tabel :data-echart="echart" ></linear-tabel>

        <Modal v-model="addBindId" title="新增绑定账号" @on-ok="addBindOk('formItem')" :loading="loading">
			<div class="padding-10">
				<Form :model="formItem" ref="formItem" label-position="right" :label-width="80" :rules="ruleValidate">
					<FormItem label="媒体类型">
						<Select v-model="formItem.mediaId">
							<Option v-for="item in Medialist" :value="item.mediaId" :key="this">{{ item.name }}</Option>
						</Select>
					</FormItem>
					<FormItem label="帐号ID" prop="account_id">
						<Input v-model="formItem.account_id"></Input>
					</FormItem>
					<FormItem label="账户名称" prop="account_name">
						<Input v-model="formItem.account_name"></Input>
					</FormItem>
				</Form>
			</div>
		</Modal>
    </div>    
</template>


<script>
import inforCard from './components/inforCard.vue';
import linearTabel from './components/linearTabel.vue';
import viewTab from './components/viewTab.vue';

export default {
    name: 'overview',
    components :{
        inforCard,
        linearTabel,
        viewTab
    },
    data () {
        return {
            addBindId :false,
            loading: true,
            formItem: {
                mediaId: '',
                account_id: '',
                account_name: '',
            },
            ruleValidate: {
                account_id: [{
                    required: true,
                    message: '请输入帐号ID',
                    trigger: 'blur'
                }],
                account_name: [{
                    required: true,
                    message: '请输入账户名称',
                    trigger: 'blur'
                }]
            }
        };
    },
    computed :{ // 计算属性的 getter
        total () {
            return this.$store.state.home.total;
        },
        echart(){
            return this.$store.state.home.echart;
        },
        media(){
            return this.$store.state.home.media;
        },
        tableData(){
            return this.$store.state.home.tdata;
        },
        Medialist() {
            let Media = this.$store.state.plan.Media;
            if(!Media[0]) return;
            this.formItem.mediaId = Media[0].mediaId;
            return Media;
        }
    },
    methods: {   
        //获取账户总览总数据
        getData(){            
            this.$store.dispatch('getOverview');
        },
        //获取媒体类型
        getMedia() {
            this.$store.dispatch('getMedia');
        },
        //新增绑定账户
        addBindOk(name) {
            this.loading = false;
            this.$refs[name].validate((valid) => {
                if(valid) {
                    this.loading = true;
                    Axios.post('api.php', {
                        action: 'sys',
                        opt: 'AdsAccountAdd',
                        do: 'add',
                        account_id: this.formItem.account_id,
                        account_name: this.formItem.account_name,
                        mediaId: this.formItem.mediaId
                    }).then(
                        res => {
                            this.addBindId = false;
                            if(res.ret == 1) {
                                this.$Message.info(res.msg);
                            }
                        }
                    ).catch(
                        err => {
                            console.log('新增绑定账号' + err)
                        }
                    )
                }
            })

        }
    },
    mounted(){
        this.getData();
        this.getMedia();
    }
};
</script>