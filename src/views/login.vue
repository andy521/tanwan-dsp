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
							<Button @click="handleSubmit" :loading="loading" type="primary" long>登录</Button>
						</FormItem>
						<FormItem class="login-tip">
                            <Checkbox v-model="form.check">记住密码</Checkbox>
                            <!-- <a href="javascript:void(0)" class="zf">找回密码</a> -->
                        </FormItem>
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
                loading:false,
				passwordType: true,
				form: {
					userName: Util.getItem('uName'),
					password: Util.getItem('uPass'),
					check: true
				}
			};
        },
		methods: {			
			handleSubmit() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {                         
                        let userinfo = { 'user' : this.form.userName, 'password' : this.form.password, 'remember' : this.form.check};

                        this.loading = true;
                        Axios.post('api.php',{
                            'uName' : userinfo.user,
                            'uPass' : userinfo.password,
                            'action' : 'sys',
                            'opt' : 'userLogin'
                        }).then(res => {
                            if (res.ret == 1) {
                                let access = res.data.data.access,
                                    page = res.data.data.lastPage,
									accessItem = []; //'setid_menu'
                                access.forEach( (item,index) => {
                                    let path = item.path.split('/'),
                                        len = path.length-1;
                                    for(let i=1; i<=len; i++){
                                        if( accessItem.indexOf(path[i]) == -1 ){
                                            accessItem.push(path[i])
                                        }
                                    }
                                });
                                
                                 //记住密码
                                if(this.form.check){
                                    Util.setItem('uPass', userinfo.password); 
                                }else{
                                    Util.removeItem('uPass');
                                }

                                Util.setItem('access', accessItem); 
                                Util.setItem('uName', this.form.userName);
                                Util.setItem('sessionid',res.data.sessionid);                                
                                page ? this.$router.push({name: page}) : this.$router.push({name: 'home_index'}) ;
                                this.$store.dispatch('UserLogin', userinfo);
                                this.loading = false;
                            }
                        }).catch(err => {
                            console.log('登录失败' + err);
                            this.loading = false;
                        })
                    }
				});
			}
		}
	};
</script>