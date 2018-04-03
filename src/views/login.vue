<style lang="less">
	@import './login.less';
</style>
<template>
	<div class="login" @keydown.enter="handleSubmit">
		<div class="login-con">
			<Card :bordered="false">
				<div slot="title">
					<div class="avatar"><img src="../images/avatar.jpg" alt=""></div>
					<div class="ts">登录贪玩DSP后台</div>
				</div>
				<div class="form-con">
					<Form ref="loginForm" :model="form">
						<FormItem prop="userName">
							<div class="icon"><img src="../images/person.png" alt=""></div>
							<Input v-model="form.userName" placeholder="请输入用户名"></Input>
							<i class="icon_ft" @click="form.userName=''"><img src="../images/icon_close.png" alt=""></i>
						</FormItem>
						<FormItem prop="password">
							<div class="icon"><img src="../images/locked.png" alt=""></div>
							<Input :type="passwordType?'password':'text'" v-model="form.password" placeholder="请输入密码"></Input>
							<i class="icon_ft" @click="passwordType=!passwordType"><img src="../images/icon_eye.png" alt=""></i>
						</FormItem>
						<FormItem>
							<Button @click="handleSubmit" type="primary" long>登录</Button>
						</FormItem>
						<!-- <FormItem class="login-tip">
                            <Checkbox v-model="form.check">记住登录状态</Checkbox>
                            <a href="javascript:void(0)" class="zf">找回密码</a>
                        </FormItem> -->
					</Form>

				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	import Axios from "@/api/index"
	import Util from '@/utils/index';
	export default {
		data() {
			return {
				passwordType: true,
				form: {
					userName: '',
					password: '',
					check: true
				}
			};
		},
		methods: {			
			handleSubmit() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {                         
                        let userinfo = { 'user' : this.form.userName, 'password' : this.form.password, 'remember' : this.form.check};
                        Axios.post('api.php',{
                            'uName' : userinfo.user,
                            'uPass' : userinfo.password,
                            'action' : 'sys',
                            'opt' : 'login'
                        })
                        .then((data)=>{                            
                            if(data.ret == 1){                                 
                                //权限管理
                                let action = data.data.data.actionid;
                                let access = [];
                                if(action === 'all'){
                                    access.push('all');
                                }else{
                                    action.forEach(item => {
                                        switch(item){
                                            case '999': 
                                                access.push('time_plan');
                                            break;
                                            case '1030': 
                                                access.push('time_ad') 
                                            break;
                                            case '1037': 
                                                access.splice(1,0,'channel_product','channel_media','channel_account','channel_plan','channel_ad');
                                            break;
                                            case '1034': 
                                                access.push('setid_principal');
                                            break;
                                            case '1035':
                                                access.push('setid_systemsetid');
                                            break;
                                            case '1038': 
                                                access.push('setid_systemmsg');
                                            break;
                                        }
                                    });
                                };
                                Util.setItem('user', this.form.userName );  
                                Util.setItem('sessionid',data.data.sessionid);                                       
                                Util.setItem('access', access.join(",")); 
                                this.$store.dispatch('UserLogin', userinfo);
                                
                                var action = data.data.data.action,
										opt = data.data.data.opt,
										Do = data.data.data.do;

									if(action == 'gdtAdPut' && opt == 'campaigns') { //实时投放计划
										this.$router.push({
											name: 'time_plan'
										});
									} else if(action == 'gdtAdPut' && opt == 'adgroups') { //实时投放广告
										this.$router.push({
											name: 'time_ad'
										});
									} else if(action == 'api' && opt == 'getGameTotalDay' && Do == 'products') { //产品总览
										this.$router.push({
											name: 'channel_product'
										});
									} else if(action == 'api' && opt == 'getGameTotalDay' && Do == 'mediaOverview') { //媒体总览											
										this.$router.push({
											name: 'channel_media'
										});
									} else if(action == 'api' && opt == 'getGameTotalDay' && Do == 'accountOverview') { //账户总览								
										this.$router.push({
											name: 'channel_account'
										});
									} else if(action == 'api' && opt == 'getGameTotalDay' && Do == 'planOverview') { //计划总览							
										this.$router.push({
											name: 'channel_plan'
										});
									} else if(action == 'api' && opt == 'getGameTotalDay' && Do == 'adsOverview') { //广告总览					
										this.$router.push({
											name: 'channel_ad'
										});
									} else if(action == 'sys' && opt == 'getAdsAccount') { //负责人管理
										this.$router.push({
											name: 'setid_principal'
										});
									} else if(action == 'sys' && opt == 'getAdsAcccountJson') { //系统账号管理
										this.$router.push({
											name: 'setid_systemsetid'
										});
									} else if(action == 'sys' && opt == 'get_messages') { //系统信息列表					
										this.$router.push({
											name: 'setid_systemmsg'
										});
									} else { //账户总览						
										this.$router.push({
											name: 'home_index'
										});
                                    }   
                                    //location.reload();                             
                            }

                        }).catch((err)=>{console.log(err)});
                    }
				});
			}
		}
	};
</script>