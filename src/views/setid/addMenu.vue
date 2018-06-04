<style scoped>
    @import "../../styles/common.less";
</style>
<template>
    <Card :bordered="false" class="padding-10">
        <Tabs>
            <Tab-pane label="添加菜单">
                <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleValidate" style="width:500px">
                    <Form-item label="菜单名" prop="name">
                        <Input v-model="formItem.name" placeholder="请输入菜单名 (例如：资金流水)"></Input>
                    </Form-item>
                    <Form-item label="菜单层级路径" prop="route">
                        <Input v-model="formItem.route" placeholder="请输入菜单层级路径"></Input>
                        <p class="gray">注：这里是路由name的层级关系（tt/tt_finance/tt_funds）</p>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="handleSubmit('formItem')">提交</Button>
                        <Button type="ghost" @click="handleReset('formItem')" style="margin-left: 8px">取消</Button>
                        <Button icon="refresh" @click="refreshMenu()" style="margin-left: 8px">刷新菜单缓存</Button>
                    </Form-item>
                </Form>  
            </Tab-pane>
            <Tab-pane label="后台接口设置">
                <Row>
                    <Col span="24">
                        选择菜单：
                        <Select v-model="menu.selected" style="width:330px" @on-change="getBackendDataList">
                            <Option value="0">请选择</Option>
                            <Option v-for="(item,index) in menu.list" :value="item.value" :key="index">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row><Col span="24"><br></Col></Row>
                <Row>
                    <Col span="24">
                        <Transfer 
                            :data="backendData" 
                            :target-keys="sBackendData" 
                            :operations="['向左移动','向右移动']" 
                            :list-style="transferStyle"
                            filterable
                            @on-change="selectOpts">
                        </Transfer>
                    </Col>
                </Row>
                <Row><Col span="24"><br></Col></Row>
                <Row>
                    <Col span="24">
                        <Button type="primary" icon="compose" @click="commitPageApisSetting()">修改配置</Button>
                    </Col>
                </Row>
            </Tab-pane>
        </Tabs>
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
            },
            menu: {
                selected: '0',
                list: []
            },
            transferStyle: {
                width: '250px',
                height: '300px'
            },
            backendData: [],
            sBackendData: []
        }
    },
    mounted() {
        this.getMenuList();
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
        },
        refreshMenu() {
            // 刷新菜单缓存接口
            Axios.post('api.php', {
                action: 'sys',
                opt: 'permissionCache'
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.$Message.success(res.msg);
                    }
                }
            ).catch(err => {console.log('请求失败' + err)})
        },
        // 获取菜单列表
        getMenuList() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'getMenus',
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.menu.list = [];
                        for (let i in res.data) {
                            this.menu.list.push({"value":res.data[i].id,"label":res.data[i].title});
                        }
                    }
                }
            ).catch(
                err => {
                    console.log('获取失败' + err);
                }
            )
        },
        // 获取后台接口总列表
        getBackendDataList(menuId) {
            this.menu.selected = menuId;
            Axios.post('api.php', {
                action: 'sys',
                opt: 'getActionList',
                menuId: menuId,
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.backendData = [];
                        for (let i in res.data.list) {
                            let data = {
                                key: res.data.list[i],
                            };
                            this.backendData.push(data);
                        }
                        this.sBackendData = [];
                        for (let i in res.data.selected) {
                            this.sBackendData.push(res.data.list[i]);
                        }
                    }
                }
            ).catch(
                err => {
                    console.log('获取失败' + err);
                }
            )
        },
        // 选择后台接口权限
        selectOpts(newSelected) {
            this.sBackendData = newSelected;
        },
        // 提交页面后台端口设置修改
        commitPageApisSetting() {
            Axios.post('api.php', {
                action: 'sys',
                opt: 'editPageBackendApis',
                menuId: this.menu.selected,
                setting: this.sBackendData
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.$Message.success(res.msg);
                    } else {
                        this.$Message.error(res.msg);
                    }
                }
            ).catch(
                err => {
                    console.log('提交失败' + err);
                }
            )
        }
    }
};
</script>