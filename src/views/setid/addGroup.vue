<style>
	@import "../../styles/common.less";
</style>
<template>
	<Card :bordered="false">
    	<Form ref="addGroup" :model="addGroup" :rules="addGroupRule" label-position="right" :label-width="110" style="width:300px">
	        <Form-item label="权限组名称：" prop="groupName">
	            <Input v-model="addGroup.groupName" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item label="权限组描述：" prop="groupDetail">
	            <Input v-model="addGroup.groupDetail" placeholder="请输入"></Input>
	        </Form-item>
	        <Form-item>
	            <Button type="primary" @click="handleSubmit('addGroup')">提交</Button>
    			<Button type="ghost" @click="handleReset('addGroup')" style="margin-left: 8px">重置</Button>
	        </Form-item>
	    </Form>
	</Card>
</template>

<script>
	import Axios from '@/api/index';
	export default {
		data() {
			return {
                addGroup: {
                    groupName: '',
                    groupDetail: ''
                },
                addGroupRule: {
                    groupName: [
                        { required: true, message: '权限组名称不能为空', trigger: 'blur' },
                    ],
                    groupDetail: [
                        { required: true, message: '权限组描述不能为空', trigger: 'blur' },
                    ]
                }
			}
		},
		methods: {
			//提交
			handleSubmit (name) {
				this.$refs[name].validate((valid) => {
                    if (valid) {
                    	Axios.post('api.php?action=sys&opt=pmgroup', {
							stage: 'add',
							name: this.addGroup.groupName,
							memo: this.addGroup.groupDetail,
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