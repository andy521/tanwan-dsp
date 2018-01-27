<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false" >
                <div slot="title">
                    <div class="avatar"><img src="../images/avatar.jpg" alt=""></div>
                    <div class="ts">登录贪玩DSP后台</div>
                </div>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <div class="icon"><img src="../images/person.png" alt=""></div>
                            <Input v-model="form.userName" placeholder="请输入用户名"></Input>
                        </FormItem>
                        <FormItem prop="password">
                            <div class="icon"><img src="../images/locked.png" alt=""></div>
                            <Input type="password" v-model="form.password" placeholder="请输入密码"></Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                        <FormItem class="login-tip">
                            <Checkbox v-model="form.check">记住登录状态</Checkbox>
                            <a href="javascript:void(0)" class="zf">找回密码</a>
                        </FormItem>
                    </Form>
                    
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
                password: '',
                check:true
            },
            rules: {
                userName: [
                    { required: true, message: ' ', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: ' ', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate( (valid) => {
                if (valid) {                    
                    let userinfo = { 'user' : this.form.userName,'password' : this.form.password, 'remember' : this.form.check}
                    console.log(userinfo)
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