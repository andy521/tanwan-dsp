<style>
	@import "../../styles/common.less";
</style>
<template>
	<Card :bordered="false">
    	<Form ref="addUser" :model="addUser" :rules="addUserRule" label-position="right" :label-width="110" style="width:500px">
	        <Form-item label="用户名：" prop="userName">
	            <Input v-model="addUser.userName" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="登录密码：" prop="password">
	            <Input v-model="addUser.password" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="权限组：" prop="permissionGroupSelected">
	            <Select v-model="addUser.permissionGroupSelected" placeholder="请选择">
	                <Option v-for="(item,index) in addUser.permissionGroup" :value="item.value" :key="index">{{ item.label }}</Option>
	            </Select>
	        </Form-item>
	        <Form-item label="真实姓名：" prop="realName">
	            <Input v-model="addUser.realName" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="性别：" prop="sex">
	            <Radio-group v-model="addUser.sex">
	                <Radio label="male">男</Radio>
	                <Radio label="female">女</Radio>
	            </Radio-group>
	        </Form-item>
	        <Form-item label="部门：" prop="departmentSelected">
	            <Select v-model="addUser.departmentSelected" placeholder="请选择" @on-change="getChangedPositions">
	            	<Option value="0">未设置</Option>
	                <Option v-for="(item,index) in addUser.departmentList" :value="item.value" :key="index">{{ item.label }}</Option>
	            </Select>
	        </Form-item>
	        <Form-item label="职位：" prop="positionSelected">
	            <Select v-model="addUser.positionSelected" placeholder="请选择">
	            	<Option value="0">未设置</Option>
	                <Option v-for="(item,index) in addUser.positionList" :value="item.value" :key="index">{{ item.label }}</Option>
	            </Select>
	        </Form-item>
	        <Form-item label="职务说明：" prop="dutyDescribe">
	            <Input v-model="addUser.dutyDescribe" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="E-mail：" prop="eMail">
	            <Input v-model="addUser.eMail" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="办公室内线号码：" prop="officePhone">
	            <Input v-model="addUser.officePhone" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="手机号码：" prop="mobile">
	            <Input v-model="addUser.mobile" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item>
	            <Button type="primary" @click="handleSubmit('addUser')">提交</Button>
    			<Button type="ghost" @click="handleReset('addUser')" style="margin-left: 8px">重置</Button>
	        </Form-item>
	    </Form>
	</Card>
</template>

<script>
	import Axios from '@/api/index';
	export default {
		data() {
			return {
                addUser: {
                    userName: '',
                    password: '',
                    permissionGroup: [],
                    permissionGroupSelected: '',
                    realName: '',
                    sex: '',
                    departmentList: [],
                    departmentSelected: "0",
                    positionList: [],
                    positionSelected: "0",
                    dutyDescribe: '',
                    eMail: '',
                    officePhone: '',
                    mobile: '',
                },
                addUserRule: {
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '初始密码不能为空', trigger: 'blur' },
                    ],
                    permissionGroupSelected: [
                        { required: true, message: '请选择权限组', trigger: 'change' },
                    ],
                    realName: [
                        { required: true, message: '真实姓名不能为空', trigger: 'blur' },
                    ],
                    sex: [
                        { required: true, message: '性别不能为空', trigger: 'blur' },
                    ],
                    /*departmentSelected: [
                        { required: true, message: '部门不能为空', trigger: 'change' },
                    ],
                    positionSelected: [
                        { required: true, message: '职位不能为空', trigger: 'change' },
                    ]*/
                }
			}
		},
		mounted() {
			this.getPermissionGroup();
			this.getDepartmentsList();
		},
		methods: {
			//获取部门列表
			getDepartmentsList() {
		    	Axios.post('api.php', {
					action: 'sys',
					opt: 'getDepartments',
				}).then(
					res => {
						if (res.ret == 1) {
							this.addUser.departmentList = [];
							for(var i=0;i<res.data.dpData.length;i++){
								this.addUser.departmentList.push({"value":res.data.dpData[i].id,"label":res.data.dpData[i].name});
							}
						}
					}
				).catch(
					err => {
						console.log('获取失败' + err);
					}
				)
		    },
			//获取所选部门下的职位列表
			getChangedPositions() {
				if (this.addUser.departmentSelected != "0") {
					Axios.post('api.php', {
						action: 'sys',
						opt: 'getPositions',
						dept: this.addUser.departmentSelected,
					}).then(
						res => {
							if (res.ret == 1) {
								this.addUser.positionList = [];
								for(var i=0;i<res.data.posData.length;i++){
									this.addUser.positionList.push({"value":res.data.posData[i].id,"label":res.data.posData[i].name});
								}
							}
						}
					).catch(
						err => {
							console.log('获取失败' + err);
						}
					)
				} else {
					this.addUser.positionList = [];
					this.addUser.positionSelected = "0";
				}
		    },
		    //获取权限组列表
		    getPermissionGroup() {
				Axios.post('api.php', {
					action: 'sys',
					opt: 'useradd',
				}).then(
					res => {
						if(res.ret == 1){
							for(var i in res.data.pmData){
								this.addUser.permissionGroup.push({"value":res.data.pmData[i].pmid,"label":res.data.pmData[i].name});
							}
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
                    	Axios.post('api.php', {
							action: 'sys',
							opt: 'useradd',
							stage: 'add',
							uName: this.addUser.userName,
							uPass: this.addUser.password,
							uGid: this.addUser.permissionGroupSelected,
							truename: this.addUser.realName,
							sex: (this.addUser.sex == 'female') ? '女' : ((this.addUser.sex == 'male') ? '男' : ''),
							dept: this.addUser.departmentSelected,
							position: this.addUser.positionSelected,
							position_desc: this.addUser.dutyDescribe,
							email: this.addUser.eMail,
							extension: 0,
							office_phone: this.addUser.officePhone,
							mobile: this.addUser.mobile,
							actionid: '',
							gamelist: '',
							accountList: '',
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