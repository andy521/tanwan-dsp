<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import  Axios  from "@/api/index"
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate( (valid) => {
                if (valid) {                    
                    let userinfo = { 'user' : this.form.userName,'password' : this.form.password }
                    Axios.post('api.php',{
                        'user_name' : userinfo.user,
                        'pas' : userinfo.password,
                    })
                    .then((res)=>{
                        //路径index.js要判断的
                        Cookies.set('user', userinfo.user);                                                            
                        this.$store.dispatch('UserLogin', userinfo);  
                        this.$router.push({ name: 'home_index' });
                    }).catch((err)=>{console.log(err)});

                }
            });
        }
    }
};
//https://github.com/q275957304/holichat/blob/master/src/reducers/modules/user/action.js
</script>