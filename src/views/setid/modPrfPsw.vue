<style>
	@import "../../styles/common.less";
</style>
<template>
	<Card :bordered="false">
	    <Tabs type="card">
	        <Tab-pane label="修改个人资料">
	        	<Form ref="modProfile" :model="modProfile" :rules="modProfileRule" label-position="right" :label-width="110" style="width:500px">
			        <Form-item label="用户名：">
			            <span>{{ modProfile.userName }}</span>
			        </Form-item>
			        <Form-item label="真实姓名：" prop="realName">
			            <Input v-model="modProfile.realName" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="性别：" prop="sex">
			            <Radio-group v-model="modProfile.sex">
			                <Radio label="male">男</Radio>
			                <Radio label="female">女</Radio>
			            </Radio-group>
			        </Form-item>
			        <Form-item label="部门：" prop="department">
			            <Select v-model="modProfile.departmentSelected" placeholder="请选择" @on-change="getChangedPositions">
			                <Option value="0">未设置</Option>
			                <Option v-for="(item,index) in modProfile.departmentList" :value="item.value" :key="index">{{ item.label }}</Option>
			            </Select>
			        </Form-item>
			        <Form-item label="职位：" prop="position">
			            <Select v-model="modProfile.positionSelected" placeholder="请选择">
			                <Option value="0">未设置</Option>
			                <Option v-for="(item,index) in modProfile.positionList" :value="item.value" :key="index">{{ item.label }}</Option>
			            </Select>
			        </Form-item>
			        <Form-item label="职务说明：" prop="dutyDescribe">
			            <Input v-model="modProfile.dutyDescribe" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="E-mail：" prop="eMail">
			            <Input v-model="modProfile.eMail" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="呼叫分机号码：" prop="extension">
			            <Input v-model="modProfile.extension" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="办公室内线号码：" prop="officePhone">
			            <Input v-model="modProfile.officePhone" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="手机号码：" prop="mobile">
			            <Input v-model="modProfile.mobile" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item>
			            <Button type="primary" @click="handleSubmit('modProfile')">提交</Button>
            			<Button type="ghost" @click="handleReset('modProfile')" style="margin-left: 8px">重置</Button>
			        </Form-item>
			    </Form>
	        </Tab-pane>
	        <Tab-pane label="修改个人密码">
	        	<Form ref="modPassword" :model="modPassword" :rules="modPasswordRule" label-position="right" :label-width="110" style="width:500px">
			        <Form-item label="用户名：">
			            <span>{{ modPassword.userName }}</span>
			        </Form-item>
			        <Form-item label="原密码：" prop="originPassword">
			            <Input v-model="modPassword.originPassword" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="新密码：" prop="newPassword">
			            <Input v-model="modPassword.newPassword" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item label="确认密码：" prop="confirmNewPassword">
			            <Input v-model="modPassword.confirmNewPassword" placeholder="请输入"></Input>
			        </Form-item>
			        <Form-item>
			            <Button type="primary" @click="handleSubmit('modPassword')">提交</Button>
            			<Button type="ghost" @click="handleReset('modPassword')" style="margin-left: 8px">重置</Button>
			        </Form-item>
			    </Form>
			    <hr>
			    <pre>
为了保障《综合业务后台》的账号安全，遵循后台数据信息的保密原则，作以下规定：
 1、密码不能小于8个字符，必须同时包含大小写字母，数字和特殊字符；
 2、密码的有效期为30天，期至将强制执行修改；
 3、请保证账号相关信息的真实性；
 4、原则上规定每人一个账号，不可以共用，账号出现异常问题将问责账号持有人；
 5、请妥善保存好自己的密码，如有遗忘，必须走纸质申请流程重置密码。
			    </pre>
	        </Tab-pane>
	    </Tabs>
	</Card>
</template>

<script>
	import Axios from '@/api/index';
	export default {
		data() {
			const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.modPassword.confirmNewPassword !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.modPassword.validateField('confirmNewPassword');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.modPassword.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
			return {
                modProfile: {
                    userName: '',
                    realName: '',
                    sex: '',
                    departmentList: [],
                    departmentSelected: '0',
                    positionList: [],
                    positionSelected: '0',
                    dutyDescribe: '',
                    eMail: '',
                    extension: '',
                    officePhone: '',
                    mobile: '',
                },
                modProfileRule: {
                    realName: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ]
                },
                modPassword: {
                	userName: '',
                    originPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                },
                modPasswordRule: {
                    originPassword: [
                        { required: true, message: '请输入原密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    confirmNewPassword: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ]
                }
			}
		},
		mounted() {
			this.getSelfUserInfo();
		},
		methods: {
			getChangedPositions() {
				if (this.modProfile.departmentSelected != "0") {
					Axios.post('api.php', {
						action: 'sys',
						opt: 'getPositions',
						dept: this.modProfile.departmentSelected,
					}).then(
						res => {
							if (res.ret == 1) {
								this.modProfile.positionList = [];
								for(var i=0;i<res.data.posData.length;i++){
									this.modProfile.positionList.push({"value":res.data.posData[i].id,"label":res.data.posData[i].name});
								}
							}
						}
					).catch(
						err => {
							console.log('获取失败' + err);
						}
					)
				} else {
					this.modProfile.positionList = [];
					this.modProfile.positionSelected = "0";
				}
		    },
			//获取登陆用户个人信息
			getSelfUserInfo() {
				Axios.post('api.php', {
					action: 'sys',
					opt: 'editUser',
				}).then(
					res => {
						if(res.ret == 1){
							//个人资料
							this.modProfile.userName = res.data.uData.uName;
							this.modProfile.realName = res.data.uData.truename;
							this.modProfile.sex = (res.data.uData.sex == '女') ? 'female' : ((res.data.uData.sex == '男') ? 'male' : '');
							for(var i=0;i<res.data.dpData.length;i++){
								this.modProfile.departmentList.push({"value":res.data.dpData[i].id,"label":res.data.dpData[i].name});
							}
							this.modProfile.departmentSelected = res.data.uData.dept;
							for(var i=0;i<res.data.posData.length;i++){
								this.modProfile.positionList.push({"value":res.data.posData[i].id,"label":res.data.posData[i].name});
							}
							this.modProfile.positionSelected = res.data.uData.position;
							this.modProfile.dutyDescribe = res.data.uData.position_desc;
							this.modProfile.eMail = res.data.uData.email;
							this.modProfile.extension = res.data.uData.extension;
							this.modProfile.officePhone = res.data.uData.office_phone;
							this.modProfile.mobile = res.data.uData.mobile;

							//个人密码
							this.modPassword.userName = res.data.uData.uName;
						}
					}
				).catch(
					err => {
						console.log('获取失败' + err)
					}
				)
			},
			//提交
			handleSubmit (name) {
				this.$refs[name].validate((valid) => {
                    if (valid) {
                    	if (name == 'modProfile') {
	                    	Axios.post('api.php', {
								action: 'sys',
								opt: 'editUser',
								stage: 'info',
								truename: this.modProfile.realName,
								sex: (this.modProfile.sex == 'female') ? '女' : ((this.modProfile.sex == 'male') ? '男' : ''),
								dept: this.modProfile.departmentSelected,
								position: this.modProfile.positionSelected,
								position_desc: this.modProfile.dutyDescribe,
								email: this.modProfile.eMail,
								extension: this.modProfile.extension,
								office_phone: this.modProfile.officePhone,
								mobile: this.modProfile.mobile
							}).then(
								res => {
									if (res.ret == 1) {
										this.$Message.success(res.data);
									} else {
										this.$Message.error(res.msg);
									}
								}
							).catch(
								err => {
									console.log('提交失败' + err);
									this.$Message.error('提交失败！');
								}
							)
						} else if (name == 'modPassword') {
							Axios.post('api.php', {
								action: 'sys',
								opt: 'editUser',
								stage: 'pass',
								oPass: this.modPassword.originPassword,
								uPass: this.modPassword.newPassword,
								aPass: this.modPassword.confirmNewPassword,
							}).then(
								res => {
									if (res.ret == 1) {
										this.$Message.success(res.data);
									} else {
										this.$Message.error(res.msg);
									}
								}
							).catch(
								err => {
									console.log('提交失败' + err);
									this.$Message.error('提交失败！');
								}
							)
						}
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                });
            },
            //重置
            handleReset (name) {
                this.$refs[name].resetFields();
            }
		}
	};
</script>