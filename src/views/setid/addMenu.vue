<style scoped>
    @import "../../styles/common.less";
</style>
<template>
    <Card :bordered="false" class="padding-10">
        <Row>
            <Col span="12" offset="6">
                <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate">
                    <Form-item label="菜单名" prop="name">
                        <Input v-model="formItem.name" placeholder="请输入菜单名"></Input>
                    </Form-item>
                    <Form-item label="菜单层级路径" prop="route">
                        <Input v-model="formItem.route" placeholder="请输入菜单层级路径"></Input>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
                        <Button type="ghost" @click="handleReset('formItem')" style="margin-left: 8px">取消</Button>
                    </Form-item>
                </Form>                
            </Col>
        </Row>
    </Card>
</template>

<script>
import Axios from '@/api/index';
export default {
    data() {
        return {
            formItem:{
                name:'',
                route:''
            },
            ruleValidate: {
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                route: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if(valid){
                    //菜单添加接口
                    Axios.post('api.php', {
                        action: 'sys',
                        opt: 'addMenu',
                        name : this.formItem.name,
                        route : this.formItem.route
                    }).then(
                        res => {
                            if (res.ret == 1) {
                                this.$Message.success(res.msg);
                            }
                        }
                    ).catch(err => {console.log('获取失败' + err)})
                }
            })
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        }
    }
};
</script>