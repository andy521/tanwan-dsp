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
				});
			}
		}
	};
</script>