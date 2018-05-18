<template>
    <div>
        <Button type="primary" @click="addBindIdwin = true">新增绑定账户</Button>
        <Modal v-model="addBindIdwin" title="选择媒体" @on-ok="addBindOk()" :loading="loading" ok-text="确定">
            <div class="padding-10">
                <Select v-model="MeidaType" @on-change="changeMeidaType">
                    <Option value="Gdt">广点通</Option>
                    <Option value="Baidu">百度</Option>
                    <Option value="Uc">UC</Option>
                    <Option value="Toutiao">头条</Option>
                </Select>
            </div>
            <div class="padding-10" v-if="MeidaType=='Gdt'">
                <center>
                    <ButtonGroup size="large">
                        <Button type="ghost" @click="openAuth(1)">用户数据授权</Button>
                        <Button type="ghost" @click="openAuth(2)">其他数据授权</Button>
                    </ButtonGroup>
                </center>
            </div>
            <div class="padding-10" v-if="MeidaType=='Toutiao'">
                <center>
                    <ButtonGroup size="large">
                        <Button type="ghost" @click="toutiaoOpenAuth">用户数据授权</Button>
                    </ButtonGroup>
                </center>
            </div>
            <div class="padding-10" v-if="MeidaType=='Baidu'">
                <Input v-model="baidu.account_name" placeholder="请输入百度的账户名称"></Input>
            </div>
            <div class="padding-10" v-if="MeidaType=='Uc'">
                <Input v-model="uc.account_id" placeholder="请输入UC账户id"></Input>
                <Input v-model="uc.userName" class="margin-top-20" placeholder="请输入UC用户名"></Input>
                <Input v-model="uc.password" type="password" class="margin-top-20" placeholder="请输UC入密码"></Input>
                <Input v-model="uc.token" class="margin-top-20" placeholder="请输入UCtoken"></Input>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index"
export default {
    name: 'bindAccount',
    data() {
        return {
            authMedia: "",
            addBindIdwin: false,
            loading: true,
            MeidaType: "",
            //uc账号
            uc: {
                account_id: "",
                userName: "",
                password: "",
                token: ""
            },
            //百度帐号
            baidu: {
                account_name: ""
            },
            toutiaoUrl: ""
        };
    },
    methods: {
        //获取广点通绑定链接
        get_authMedia() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'authMedia',
                MeidaType: this.MeidaType,
            }).then(res => {
                if (res.ret == 1) {
                    this.authMedia = res.data;
                }
            }).catch(err => {
                console.log('广点通绑定账号' + err)
            })
        },
        //获取头条绑定链接
        get_AuthorizedUrl() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAuthorizedUrl'
            }).then(res => {
                if (res.ret == 1) {
                    this.toutiaoUrl = res.data;
                }
            }).catch(err => {
                console.log("绑定头条账号" + err)
            });
        },
        //打开头条链接
        toutiaoOpenAuth() {
            window.open(this.toutiaoUrl.url);
        },
        //打开广点通链接
        openAuth(i) {
            this.addBindIdwin = false;
            window.open(this.authMedia[i]);
        },
        //改变媒体类型
        changeMeidaType() {
            if (this.MeidaType == "Gdt" && this.authMedia == "") {
                this.get_authMedia();
            }
            if (this.MeidaType == "Toutiao" && this.toutiaoUrl == "") {
                this.get_AuthorizedUrl();
            }
        },
        //确定
        addBindOk() {
            if (this.MeidaType == "Uc") {
                //绑定UC账号
                Axios.post('api.php', {
                    action: 'ucAdPut',
                    opt: 'bindAccount',
                    account_id: this.uc.account_id,
                    userName: this.uc.userName,
                    password: this.uc.password,
                    token: this.uc.token,
                }).then(res => {
                    if (res.ret == 1) {
                        this.addBindIdwin = false;
                        this.$Message.info(res.msg);
                    }
                }).catch(err => {
                    this.addBindIdwin = false;
                    console.log("绑定UC账号" + err)
                });
            } else if (this.MeidaType == "Baidu") {
                //绑定百度账号
                Axios.post('api.php', {
                    action: 'bdAdPut',
                    opt: 'bindAccount',
                    account_name: this.baidu.account_name
                }).then(res => {
                    if (res.ret == 1) {
                        this.addBindIdwin = false;
                        this.$Message.info(res.msg);
                    }
                }).catch(err => {
                    this.addBindIdwin = false;
                    console.log("绑定百度账号" + err)
                });
            } else {
                this.addBindIdwin = false;
            }
        }
    }
};
</script>

