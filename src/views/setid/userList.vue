<style>
    @import "../../styles/common.less";
</style>
<template>
    <Card :bordered="false">
        <Row v-show="showUserListTable">
            <Col span="24">
                <Input v-model="searchUserCondition.userName" placeholder="搜索用户名" style="width:150px;"></Input>
                <Select v-model="searchUserCondition.departmentSelected" placeholder="选择部门" style="width:150px;">
                    <Option v-for="(item,index) in editUserProfile.departmentList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchUserCondition.permissionGroupSelected" placeholder="选择权限组" style="width:150px;">
                    <Option v-for="(item,index) in editUserProfile.permissionGroup" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchUserCondition.statement" placeholder="选择账号状态" style="width:150px;">
                    <Option value="1">正常</Option>
                    <Option value="0">锁定</Option>
                </Select>
                <Button icon="search" @click="getUserList">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <br>
            </Col>
        </Row>
        <Row v-show="showUserListTable">
            <Col span="24">
                <Table  :columns="tableColumns" :data="tableData" :size="tableSize"></Table>
            </Col>
        </Row>
        <Row class="margin-top-10" v-show="showUserListTable">
            <Col span="10"> 表格尺寸
            <Radio-group v-model="tableSize" type="button">
                <Radio label="large">大</Radio>
                <Radio label="default">中</Radio>
                <Radio label="small">小</Radio>
            </Radio-group>
            每页显示
            <Select v-model="pageSize" style="width:80px" placement="top" transfer @on-change="getUserList(undefined)">
                <Option v-for="item in 100" :value="item" :key="item" v-if="item%20==0">{{ item }}</Option>
            </Select>
            </Col>
            <Col span="14" style="text-align: right;">
            <Page :total="recordTotalNumber" :current="page" :page-size="pageSize" ref="pages" @on-change="getUserList" show-elevator show-total></Page>
            </Col>
        </Row>
        <Row v-show="showPermissionSetting">
            <Col span="12">
                <Button type="primary" @click="commitUserPermission">提交</Button>
                <Button type="ghost" @click="backListPage">取消</Button>
            </Col>
            <Col span="12" style="text-align: right;">
                <Button icon="arrow-left-b" @click="backListPage">返回列表</Button>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <br>
            </Col>
        </Row>
        <Row v-show="showPermissionSetting">
            <Col span="24">
                <Tabs value="menu1">
                    <Tab-pane label="综合业务后台">
                        <Tree :data="menu1" @on-check-change="changeTreeData" show-checkbox></Tree>
                    </Tab-pane>
                    <Tab-pane label="手游后台">
                        <Tree :data="menu2" @on-check-change="changeTreeData" show-checkbox></Tree>
                    </Tab-pane>
                    <Tab-pane label="海外游戏后台">
                        <Tree :data="menu5" @on-check-change="changeTreeData" show-checkbox></Tree>
                    </Tab-pane>
                    <Tab-pane v-for="(item,index) in platformList" :key="index" :label="item.platformName">
                        <Tree :data="item.menu" @on-check-change="changeTreeData" show-checkbox></Tree>
                    </Tab-pane>
                </Tabs>
            </Col>
        </Row>
        <Modal v-model="editProfileDialog" :title="editUserProfile.title" ok-text="修改" cancel-text="取消" @on-ok="commitUserProfile">
            <Form ref="editUserProfile" :model="editUserProfile" :rules="editUserProfileRule" label-position="right" :label-width="110" style="width:460px">
                <Form-item label="用户名：" prop="userName">
                    <Input v-model="editUserProfile.userName" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="登录密码：" prop="password">
                    <Input v-model="editUserProfile.password" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="权限组：" prop="permissionGroupSelected">
                    <Select v-model="editUserProfile.permissionGroupSelected" placeholder="请选择">
                        <Option v-for="(item,index) in editUserProfile.permissionGroup" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="真实姓名：" prop="realName">
                    <Input v-model="editUserProfile.realName" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="性别：" prop="sex">
                    <Radio-group v-model="editUserProfile.sex">
                        <Radio label="male">男</Radio>
                        <Radio label="female">女</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="部门：" prop="departmentSelected">
                    <Select v-model="editUserProfile.departmentSelected" placeholder="请选择" @on-change="getChangedPositions">
                        <Option value="0">未设置</Option>
                        <Option v-for="(item,index) in editUserProfile.departmentList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="职位：" prop="positionSelected">
                    <Select v-model="editUserProfile.positionSelected" placeholder="请选择">
                        <Option value="0">未设置</Option>
                        <Option v-for="(item,index) in editUserProfile.positionList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="职务说明：" prop="dutyDescribe">
                    <Input v-model="editUserProfile.dutyDescribe" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="E-mail：" prop="eMail">
                    <Input v-model="editUserProfile.eMail" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="办公室内线号码：" prop="officePhone">
                    <Input v-model="editUserProfile.officePhone" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="手机号码：" prop="mobile">
                    <Input v-model="editUserProfile.mobile" placeholder="请输入"></Input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="deleteUserDialog" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定要彻底删除此用户吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteUserThoroughly">删除</Button>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import Axios from '@/api/index';
    export default {
        data() {
            return {
                //分页属性
                tableSize: "small",
                recordTotalNumber: 1, //总数量
                page: 1, //第N页
                pageSize: 20, //每页数量
                //现实/隐藏
                showUserListTable: true,
                showPermissionSetting: false,
                //表格属性
                tableColumns: [
                    {
                        title: '用户名',
                        key: 'userName'
                    },
                    {
                        title: '权限组',
                        key: 'permissionGroup'
                    },
                    {
                        title: '真实姓名',
                        key: 'realName'
                    },
                    {
                        title: '性别',
                        key: 'sex'
                    },
                    {
                        title: '部门',
                        key: 'department'
                    },
                    {
                        title: '职位',
                        key: 'position'
                    },
                    {
                        title: '手机号码',
                        key: 'mobile'
                    },
                    {
                        title: '密保SN',
                        key: 'sn'
                    },
                    {
                        title: '登录次数',
                        key: 'loginCount'
                    },
                    {
                        title: '登录时间',
                        key: 'lastLoginDate',
                        width: 150
                    },
                    {
                        title: '登录IP',
                        key: 'lastLoginIP'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 150,
                        render : (h, params) => {
                            if (this.searchUserCondition.searchDataStatement == '1') {
                                return [
                                    h("i-button", {
                                        props: {
                                            icon: "person-stalker",
                                            type: "info",
                                            size: "small"
                                        },
                                        on: {
                                            'click': () => {
                                                this.getPermissionTree(params.row.uid);
                                            }
                                        }
                                    }),
                                    h("i-button", {
                                        props: {
                                            icon: "edit",
                                            type: "success",
                                            size: "small"
                                        },
                                        class:"margin-left-10",
                                        on: {
                                            'click': () => {
                                                this.editUserProfileDialog(params.row.uid);
                                            }
                                        }
                                    }),
                                    h("i-button", {
                                        props: {
                                            icon: "trash-a",
                                            type: "error",
                                            size: "small"
                                        },
                                        class:"margin-left-10",
                                        on: {
                                            'click': () => {
                                                this.deleteUser(params.row.uid, params.row.sn);
                                            }
                                        }
                                    })
                                ];
                            } else if (this.searchUserCondition.searchDataStatement == '0') {
                                return [
                                    h("i-button", {
                                        props: {
                                            icon: "arrow-return-left",
                                            type: "success",
                                            size: "small"
                                        },
                                        on: {
                                            'click': () => {
                                                this.recoverUser(params.row.uid);
                                            }
                                        }
                                    }),
                                    h("i-button", {
                                        props: {
                                            icon: "trash-a",
                                            type: "error",
                                            size: "small"
                                        },
                                        class:"margin-left-10",
                                        on: {
                                            'click': () => {
                                                this.deleteUserAccountDialog(params.row.uid);
                                            }
                                        }
                                    })
                                ];
                            }
                        }
                    }
                ],
                tableData: [],
                menu1: [],
                menu2: [],
                menu5: [],
                platformList: [],
                //修改权限
                associate: {
                    menu1: {},
                    menu2: {},
                    menu5: {},
                    games: [],
                    groupMenu: {
                        menu1: {},
                        menu2: {},
                        menu5: {},
                        games: []
                    }
                },
                editPermission: {
                    act: undefined,
                    uid: undefined,
                    pmid: undefined,
                    menu1: [],
                    menu2: [],
                    menu5: [],
                    games: []
                },
                //编辑用户资料会话框
                editProfileDialog: false,
                editUserProfile: {
                    title: '',
                    uid: '',
                    userName: '',
                    password: '',
                    permissionGroup: [],
                    permissionGroupSelected: '0',
                    realName: '',
                    sex: '',
                    departmentList: [],
                    departmentSelected: '0',
                    positionList: [],
                    positionSelected: '',
                    dutyDescribe: '',
                    eMail: '',
                    officePhone: '',
                    mobile: '',
                },
                editUserProfileRule: {
                    userName: [
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
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
                },
                //删除用户
                deleteUserDialog: false,
                deleteUserProfile: {
                    uid: ''
                },
                //搜索用户条件
                searchUserCondition: {
                    userName: '',
                    departmentSelected: '',
                    permissionGroupSelected: '',
                    statement: '1',
                    searchDataStatement: '1'
                }
            }
        },
        mounted() {
            this.getUserList();
            this.getPermissionGroup();
            this.getDepartmentsList();
        },
        methods: {
            //恢复用户
            recoverUser (uid) {
                Axios.get('api.php?action=sys&opt=useradd&stage=recover&uid='+uid)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.getUserList(this.page);
                            this.$Message.success(res.data);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                ).catch(
                    err => {
                        console.log('请求失败' + err);
                    }
                )
            },
            //删除用户
            deleteUser (uid, userSN) {
                Axios.get('api.php?action=sys&opt=useradd&act=del&uid='+uid+'&mb_isbn='+userSN)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.getUserList(this.page);
                            this.$Message.success(res.data);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                ).catch(
                    err => {
                        console.log('请求失败' + err);
                    }
                )
            },
            //彻底删除用户
            deleteUserThoroughly () {
                Axios.get('api.php?action=sys&opt=useradd&stage=delForever&uid='+this.deleteUserProfile.uid)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.getUserList(this.page);
                            this.$Message.success(res.data);
                            this.deleteUserDialog = false;
                        } else {
                            this.$Message.error(res.msg);
                            this.deleteUserDialog = false;
                        }
                    }
                ).catch(
                    err => {
                        this.deleteUserDialog = false;
                        console.log('请求失败' + err);
                    }
                )
            },
            deleteUserAccountDialog (uid) {
                this.deleteUserProfile.uid = uid;
                this.deleteUserDialog = true;
            },
            //修改用户资料
            commitUserProfile () {
                this.$refs['editUserProfile'].validate((valid) => {
                    if (valid) {
                        Axios.post('api.php?action=sys&opt=useradd', {
                            stage: 'edit',
                            uId: this.editUserProfile.uid,
                            uName: this.editUserProfile.userName,
                            uPass: this.editUserProfile.password,
                            uGid: this.editUserProfile.permissionGroupSelected,
                            truename: this.editUserProfile.realName,
                            sex: (this.editUserProfile.sex == 'female') ? '女' : ((this.editUserProfile.sex == 'male') ? '男' : ''),
                            dept: this.editUserProfile.departmentSelected,
                            position: this.editUserProfile.positionSelected,
                            position_desc: this.editUserProfile.dutyDescribe,
                            email: this.editUserProfile.eMail,
                            office_phone: this.editUserProfile.officePhone,
                            mobile: this.editUserProfile.mobile
                        }).then(
                            res => {
                                if (res.ret == 1) {
                                    this.getUserList(this.page);
                                    this.$Message.success(res.data);
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            }
                        ).catch(
                            err => {
                                console.log('提交失败' + err)
                            }
                        )
                    } else {
                        this.$Message.error('请填写带*号信息!');
                    }
                });
            },
            //修改用户资料-会话框
            editUserProfileDialog (uid) {
                Axios.get('api.php?action=sys&opt=useradd&act=edit&uid='+uid)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.editUserProfile.title = '修改['+res.data.uData.truename+']资料';
                            this.editUserProfile.uid = uid;
                            this.editUserProfile.userName = res.data.uData.uName;
                            this.editUserProfile.password = '';
                            this.editUserProfile.permissionGroupSelected = res.data.uData.uGid;
                            this.editUserProfile.realName = res.data.uData.truename;
                            this.editUserProfile.sex = (res.data.uData.sex == '女') ? 'female' : ((res.data.uData.sex == '男') ? 'male' : '');
                            this.editUserProfile.departmentSelected = res.data.uData.dept;
                            this.editUserProfile.positionSelected = res.data.uData.position;
                            this.editUserProfile.dutyDescribe = res.data.uData.position_desc;
                            this.editUserProfile.eMail = res.data.uData.email;
                            this.editUserProfile.officePhone = res.data.uData.office_phone;
                            this.editUserProfile.mobile = res.data.uData.mobile;
                            this.editProfileDialog = true;
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
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
                                this.editUserProfile.permissionGroup.push({"value":res.data.pmData[i].pmid,"label":res.data.pmData[i].name});
                            }
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err)
                    }
                )
            },
            //获取部门列表
            getDepartmentsList() {
                Axios.post('api.php', {
                    action: 'sys',
                    opt: 'getDepartments',
                }).then(
                    res => {
                        console.log()
                        if (res.ret == 1) {
                            this.editUserProfile.departmentList = [];
                            for(var i=0;i<res.data.dpData.length;i++){
                                this.editUserProfile.departmentList.push({"value":res.data.dpData[i].id,"label":res.data.dpData[i].name});
                            }
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
            },
            getChangedPositions() {
                if (this.editUserProfile.departmentSelected != "0") {
                    Axios.post('api.php', {
                        action: 'sys',
                        opt: 'getPositions',
                        dept: this.editUserProfile.departmentSelected,
                    }).then(
                        res => {
                            if (res.ret == 1) {
                                this.editUserProfile.positionList = [];
                                for(var i=0;i<res.data.posData.length;i++){
                                    this.editUserProfile.positionList.push({"value":res.data.posData[i].id,"label":res.data.posData[i].name});
                                }
                            }
                        }
                    ).catch(
                        err => {
                            console.log('获取失败' + err);
                        }
                    )
                } else {
                    this.editUserProfile.positionList = [];
                    this.editUserProfile.positionSelected = "0";
                }
            },
            //权限修改
            commitUserPermission () {
                //console.log(this.editPermission);
                //console.log(this.associate);
                Axios.post('api.php?action=sys&opt=permission&act='+this.editPermission.act, {
                    stage: 'yes',
                    pmid: this.editPermission.pmid,
                    uid: this.editPermission.uid,
                    mids: this.mergeMids(),
                    games: this.editPermission.games
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
                        console.log('请求失败' + err);
                    }
                )
            },
            mergeMids () {
                let res = [];
                for (let k in this.editPermission) {
                    if (k.substr(0,4) == 'menu') {
                        for (let i in this.editPermission[k]) {
                            res.push(this.editPermission[k][i]);
                        }
                    }
                }
                return res;
            },
            changeTreeData (data) {
                let origin = undefined;
                let idList = {};
                data.forEach(item => {
                    if (origin == undefined) {
                        origin = item.origin;
                    }
                    let tmp = item.mark;
                    let cache = [];
                    if (typeof origin == 'object') { //platform
                        while (this.associate['games'][origin.games][tmp] != undefined) {
                            cache.push(tmp);
                            tmp = this.associate['games'][origin.games][tmp];
                        }
                    } else { //menu
                        while (this.associate[origin][tmp] != undefined) {
                            cache.push(tmp);
                            tmp = this.associate[origin][tmp];
                        }
                    }
                    idList[tmp] = undefined;
                    while ((tmp = cache.pop()) != undefined) {
                        idList[tmp] = undefined;
                    }
                });
                if (typeof origin == 'object') { //platform
                    this.editPermission['games'][origin.games] = [];
                    for (let i in idList) {
                        if (this.associate.groupMenu['games'][origin.games][i]!==true) {
                            this.editPermission['games'][origin.games].push(parseInt(i));
                        }
                    }
                } else { //menu
                    this.editPermission[origin] = [];
                    for (let i in idList) {
                        if (this.associate.groupMenu[origin][i]!==true) {
                            this.editPermission[origin].push(parseInt(i));
                        }
                    }
                }
                //console.log(this.associate);
                //console.log(this.editPermission);
            },
            //返回列表
            backListPage () {
                this.showUserListTable = true;
                this.showPermissionSetting = false;
            },
            //获取系统用户列表
            getUserList (page) {
                if (page === undefined || typeof page == 'object') {
                    this.page = 1;
                } else {
                    this.page = page;
                }
                Axios.post('api.php?action=sys&opt=userlist', {
                    act: 'search',
                    numPerPage: this.pageSize,
                    pageNum: this.page,
                    uName: this.searchUserCondition.userName,
                    dept: this.searchUserCondition.departmentSelected,
                    uGid: this.searchUserCondition.permissionGroupSelected,
                    state: this.searchUserCondition.statement
                }).then(
                    res => {
                        if (res.ret == 1) {
                            this.searchUserCondition.searchDataStatement = res.data.searchArr.state;
                            this.recordTotalNumber = res.data.searchArr.totalCount;
                            this.page = res.data.searchArr.pageNum;
                            this.pageSize = parseInt(res.data.searchArr.numPerPage);
                            this.tableData = [];
                            for(let i=0;i<res.data.uData.length;i++){
                                let userInfo = {
                                    uid: res.data.uData[i].uId,
                                    userName: res.data.uData[i].uName,
                                    permissionGroup: (res.data.pmData[res.data.uData[i].uGid])?res.data.pmData[res.data.uData[i].uGid].name:'',
                                    realName: res.data.uData[i].truename,
                                    sex: res.data.uData[i].sex,
                                    department: res.data.dpData[res.data.uData[i].dept],
                                    position: res.data.dpData[res.data.uData[i].position],
                                    mobile: res.data.uData[i].mobile,
                                    sn: res.data.uData[i].mb_isbn,
                                    loginCount: res.data.uData[i].logincount,
                                    lastLoginDate: res.data.uData[i].LastLoginDate,
                                    lastLoginIP: res.data.uData[i].LastLoginIp
                                };
                                this.tableData.push(userInfo);
                            }
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
            },
            //获取权限列表
            getPermissionTree (uid) {
                Axios.get('api.php?action=sys&opt=permission&act=user&uid='+uid)
                .then(
                    res => {
                        if (res.ret == 1) {
                            console.log(res);
                            this.editPermission.act = res.data.gData.act;
                            this.editPermission.uid = res.data.gData.uid;
                            this.editPermission.pmid = res.data.gData.pmid;
                            for (let i in res.data.menuData) {
                                this['menu'+i] = [];
                                this.buildPermissionTree(res.data.menuData[i], this['menu'+i], 'menu'+i);
                            }
                            for (let i in res.data.plat_arr) {
                                var tmp = {
                                    platformId: res.data.plat_arr[i].id,
                                    platformName: res.data.plat_arr[i].plat_name,
                                    menu: []
                                };
                                this.buildPermissionTree(res.data.game_arr[res.data.plat_arr[i].id], tmp.menu, {games: res.data.plat_arr[i].id});
                                this.platformList.push(tmp);
                            }
                            this.showUserListTable = false;
                            this.showPermissionSetting = true;
                            //console.log(this.editPermission);
                        } else {
                            this.$Message.error(res.msg);
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
            },
            //组装Tree
            buildPermissionTree (menuData, list, origin, father) {
                for (let i in menuData) {
                    let defaultSet = {
                        mark: undefined,
                        origin: origin,
                        expand: true,
                        checked: true,
                        disabled: true,
                        title: '',
                        children: []
                    };
                    if (menuData[i].acstate == 0) {
                        delete defaultSet.checked;
                        delete defaultSet.disabled;
                    } else if (menuData[i].acstate == 1) {
                        delete defaultSet.disabled;
                    }/* else if (menuData[i].acstate == 2) {
                        delete defaultSet.checked;
                        defaultSet.title = '√ ';
                    }*/
                    defaultSet.title += menuData[i].name;
                    defaultSet.mark = parseInt(menuData[i].id);
                    this.buildAssociate(origin, parseInt(menuData[i].id), father, menuData[i].acstate);
                    if (defaultSet.checked && menuData[i].acstate!=2) {
                        this.buildUserPermission(origin, parseInt(menuData[i].id));
                    }
                    list.push(defaultSet);
                    if(menuData[i].list != undefined){
                        delete defaultSet.checked;
                        this.buildPermissionTree(menuData[i].list, list[list.length-1].children, origin, menuData[i].id);
                    } else {
                        delete list[list.length-1].children;
                    }
                }
            },
            //创建节点联系表
            buildAssociate (origin, curID, faterID, type) {
                if (typeof origin == 'object') {
                    if (type == 2) {
                        if (this.associate.groupMenu.games[origin.games] == undefined) {
                            this.associate.groupMenu.games[origin.games] = {};
                        }
                        this.associate.groupMenu.games[origin.games][curID] = true;
                    }
                    if (this.associate.games[origin.games] == undefined) {
                        this.associate.games[origin.games] = {};
                    }
                    this.associate.games[origin.games][curID] = (faterID == undefined) ? faterID : parseInt(faterID);
                } else {
                    if (type == 2) {
                        this.associate.groupMenu[origin][curID] = true;
                    }
                    this.associate[origin][curID] = (faterID == undefined) ? faterID : parseInt(faterID);
                }
            },
            //创建用户目前权限列表
            buildUserPermission (origin, curID) {
                if (typeof origin == 'object') {
                    if (this.editPermission.games[origin.games] == undefined) {
                        this.editPermission.games[origin.games] = [];
                    }
                    this.editPermission.games[origin.games].push(curID);
                } else {
                    this.editPermission[origin].push(curID);
                }
            }
        }
    };
</script>