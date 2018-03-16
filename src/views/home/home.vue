<style lang="less">
	@import "../../styles/common.less";
	@import '../../styles/table.less';
	.ivu-card-body {
		padding: 10px;
	}
	
	.ivu-card-head-inner,
	.ivu-card-head p {
		height: auto
	}
	
	.card-title-small .ivu-card-head {
		padding: 9px 16px 7px;
	}
	
	.card-title-small .ivu-card-head .card-title {
		line-height: 32px;
	}

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
						<infor-card id-name="impression" :end-val="total.impression" iconType="ios-eye" color="#4768f3" intro-text="展示"></infor-card>
						</Col>

						<Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
						<infor-card id-name="click" :end-val="total.click" iconType="mouse" color="#02cf80" intro-text="点击"></infor-card>
						</Col>

						<Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
						<infor-card id-name="balance_1" :end-val="total.balance_1" iconType="social-usd" color="#9859e8" intro-text="现金账户"></infor-card>
						</Col>

						<Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
						<infor-card id-name="balance_2" :end-val="total.balance_2" iconType="social-buffer" color="#ff6122" intro-text="虚拟账户"></infor-card>
						</Col>

						<Col :xs="24" :sm="12" :md="5" :style="{marginBottom: '10px'}">
						<infor-card id-name="balance_4" :end-val="total.balance_4" iconType="card" color="#15cc9e" intro-text="信用账户"></infor-card>
						</Col>

					</Row>

				</div>
			</Card>
		</Row>
		<!-- 按账户查看 - 按产品查看 -->
		<view-tab :tdata="tdata"  @on-change="getData"></view-tab>
        <div></div>
		<!-- 线性表格 -->
		<linear-tabel :datas="echart"></linear-tabel> 

		<Modal v-model="addBindId" title="选择媒体" @on-ok="addBindOk()" :loading="loading" ok-text="下一步">
			<div class="padding-10">
                <select-media  @on-change="mediaChange"></select-media>
			</div>
		</Modal>

		<Modal v-model="authwin" title="选择授权">
			<div class="padding-10">
				<center>
					<ButtonGroup size="large">
						<Button type="ghost" @click="openAuth(1)">用户数据授权</Button>
						<Button type="ghost" @click="openAuth(2)">其他数据授权</Button>
					</ButtonGroup>
				</center>
			</div>
			 <div slot="footer"></div>
		</Modal>

	</div>
</template>

<script>
    import Axios from "@/api/index"
    import util from '@/utils/index';
	import inforCard from './components/inforCard.vue';
	import linearTabel from './components/linearTabel.vue';
    import viewTab from './components/viewTab.vue';
    import selectMedia from '@/components/select-media/index.vue';

	export default {
		name: 'overview',
		components: {
			inforCard,
			linearTabel,
            viewTab,
            selectMedia
		},
		data() {
			return {
				authwin: false,
				addBindId: false,
				loading: true,
                MeidaType: '',                
                authMedia: {},
                //抽出数据
                total: {impression:0,click:0,balance_1:0,balance_2:0,balance_4:0},
                echart:[],
                tdata:{
                    page_size:0,
                    total_number:0,
                    list:[]
                },
			};
        },    
		methods: {
            //获取账户总览总数据            
			getData(param){
                Axios.get('api.php',param).then( 
                    res=>{
                         if(res.ret == '1'){
                            let data = res.data;
                            this.echart = data.echart;
                             res.data.curr_page_total._disabled = true;
				            res.data.list.push(data.curr_page_total)
                            this.tdata =data;
                            this.total = data.total;
                            //console.log(res.data)
                        }
                    }
                ).catch( 
                    err=>{ console.log('账户总览' + err) }
                );
			},
			//获取媒体类型
			mediaChange(data) {
                this.MeidaType = data;
			},
			//新增绑定账户
			addBindOk() {
                let media = this.MeidaType;
				this.loading = true;
				Axios.post('api.php', {
					action: 'sys',
					opt: 'authMedia',
					MeidaType: media,
				}).then(
					res => {
						this.loading = false;
						this.addBindId = false;
						if(res.ret == 1) {							
							this.authMedia = res.data;
							this.$Message.info(res.msg);
							this.authwin = true;
						}
					}
				).catch(
					err => {
						this.loading = false;
						console.log('新增绑定账号' + err)
					}
				)
			},
			openAuth(i) {
				window.open(this.authMedia[i])
			}

		},
		mounted() {
			this.getData();
        },
        // beforeDestroy() {    
        //     this.$destroy()
		// },
        // destroyed() {
        //     console.log('销毁完成状态')
		// }
	};
</script>