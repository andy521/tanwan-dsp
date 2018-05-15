<template>
    <Card dis-hover>
        <Form ref="recharge" :model="recharge" :rules="rechargeRule" label-position="right" :label-width="110" style="width:500px">
            <Form-item label="账户id" prop="account_id">
                <Select v-model="recharge.account_id" placeholder="请选择帐号">
                    <Option v-for="item in accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                </Select>
            </Form-item>
            
            <Form-item label="充值金额" prop="money">
                <Input v-model="recharge.money" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="备注" prop="mark">
                <Input v-model="recharge.mark" placeholder="请输入"></Input>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="handleSubmit('addUser')">提交</Button>
            </Form-item>
        </Form>
    </Card>
</template>
<script>
import Axios from '@/api/index';
export default {
    data() {
        return {
            accountList: [],
            media_type: "",
            recharge: {
                account_id: "",
                money: "",
                mark: ""
            },
            rechargeRule: {
                account_id: [
                    { required: true, message: '请选择账户id', trigger: 'change' },
                ],
                money: [
                    { required: true, message: '充值金额不能为空', trigger: 'blur' },
                ],
                mark: [
                    { required: true, message: '备注不能为空', trigger: 'blur' },
                ]
            }
        }
    },
    mounted() {
        this.getAccount();
        this.getMedia();
    },
    methods: {
        //获取媒体类别
        getMedia() {
            Axios.get('api.php', {
                'action': 'api',
                'opt': 'getMedia'
            }).then(
                res => {
                    if (res.ret == '1') {
                        this.media = res.data;
                    }
                }
            ).catch(
                err => { "获取帐号id" + console.log(err) }
            );
        },
        //获取帐号id
        getAccount() {
            Axios.get("api.php", {
                action: "api",
                opt: "getAccount",
                media_type: 1
            }).then(res => {
                if (res.ret == 1) {
                    this.accountList = res.data;
                }
            }).catch(err => {
                console.log("获取帐号id" + err);
            });
        },
        //提交
        handleSubmit(name) {
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
        }
    }
};
</script>
