<style>
    @import "../../styles/common.less";
</style>
<template>
    <Card :bordered="false">
        <Row v-show="showGroupListTable">
            <Col span="24">
                <Button icon="plus-round" @click="showAddGroupDialog">添加权限组</Button>
            </Col>
        </Row>
        <Row v-show="showGroupListTable">
            <Col span="24">
            <br>
            </Col>
        </Row>
        <Row v-show="showGroupListTable">
            <Col span="24">
                <Table border :columns="tableColumns" :data="tableData" size="small" style="width:700px"></Table>
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
        <Row v-show="showPermissionSetting">
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
        <Modal v-model="editGroupDialog" :title="editGroupInfo.title" ok-text="修改" cancel-text="取消" @on-ok="editGroup" width="400">
            <Form ref="editGroupInfo" :model="editGroupInfo" :rules="editGroupRule" label-position="right" :label-width="110" style="width:340px">
                <Form-item label="权限组名称：" prop="groupName">
                    <Input v-model="editGroupInfo.groupName" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="权限组描述：" prop="groupDetail">
                    <Input v-model="editGroupInfo.groupDetail" placeholder="请输入"></Input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="deleteGroupDialog" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定要删除此权限组吗？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="deleteGroup">删除</Button>
            </div>
        </Modal>
    </Card>
</template>

<script>
    import Axios from '@/api/index';
    export default {
        data() {
            return {
                //现实/隐藏
                showGroupListTable: true,
                showPermissionSetting: false,
                //表格属性
                tableColumns: [
                    {
                        title: '权限组名称',
                        key: 'groupName'
                    },
                    {
                        title: '权限组描述',
                        key: 'groupDetail'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 150,
                        render : (h, params) => {
                            return [
                                h("i-button", {
                                    props: {
                                        icon: "navicon-round",
                                        type: "info",
                                        size: "small"
                                    },
                                    on: {
                                        'click': () => {
                                            this.getPermissionTree(params.row.groupID);
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
                                            this.showEditGroupDialog(params.row.groupID);
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
                                            this.showDeleteGroupDialog(params.row.groupID);
                                        }
                                    }
                                })
                            ];
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
                    games: []
                },
                editPermission: {
                    act: undefined,
                    pmid: undefined,
                    menu1: [],
                    menu2: [],
                    menu5: [],
                    games: []
                },
                //删除权限组
                deleteGroupDialog: false,
                deleteGroupInfo: {
                    groupID: undefined,
                },
                //编辑权限组信息
                editGroupDialog: false,
                editGroupInfo: {
                    title: '',
                    groupID: '',
                    groupName: '',
                    groupDetail: ''
                },
                editGroupRule: {
                    groupName: [
                        { required: true, message: '权限组名称不能为空', trigger: 'blur' },
                    ],
                    groupDetail: [
                        { required: true, message: '权限组描述不能为空', trigger: 'blur' },
                    ]
                },
                //添加or编辑权限组
                commitType : '',
            }
        },
        mounted() {
            this.getGroupList();
        },
        methods: {
            //添加权限组会话框
            showAddGroupDialog () {
                this.commitType = "add";
                this.editGroupDialog = true;
                this.editGroupInfo.title = "添加权限组";
                this.editGroupInfo.groupID = '';
                this.editGroupInfo.groupName = '';
                this.editGroupInfo.groupDetail = '';
            },
            //提交编辑权限组
            editGroup () {
                this.$refs['editGroupInfo'].validate((valid) => {
                    if (valid) {
                        if (this.commitType == "edit") {
                            Axios.post('api.php?action=sys&opt=pmgroup', {
                                stage: 'edit',
                                pmid: this.editGroupInfo.groupID,
                                name: this.editGroupInfo.groupName,
                                memo: this.editGroupInfo.groupDetail
                            }).then(
                                res => {
                                    if (res.ret == 1) {
                                        this.getGroupList();
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
                        } else if (this.commitType == "add") {
                            Axios.post('api.php?action=sys&opt=pmgroup', {
                                stage: 'add',
                                name: this.editGroupInfo.groupName,
                                memo: this.editGroupInfo.groupDetail,
                            }).then(
                                res => {
                                    if (res.ret == 1) {
                                        this.getGroupList();
                                        this.$Message.success(res.data);
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
                    } else {
                        this.$Message.error('请填写带*号信息!');
                    }
                });
            },
            //编辑权限组会话框
            showEditGroupDialog (gid) {
                this.commitType = "edit";
                Axios.get('api.php?action=sys&opt=pmgroup&act=edit&pmid='+gid)
                .then(
                    res => {
                        //console.log(res);
                        if (res.ret == 1) {
                            this.editGroupInfo.title = '修改['+res.data.pdata.name+']权限组信息';
                            this.editGroupInfo.groupID = gid;
                            this.editGroupInfo.groupName = res.data.pdata.name;
                            this.editGroupInfo.groupDetail = res.data.pdata.memo;
                            this.editGroupDialog = true;
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
            //删除权限组
            deleteGroup () {
                Axios.get('api.php?action=sys&opt=pmgroup&act=delete&pmid='+this.deleteGroupInfo.groupID)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.getGroupList();
                            this.$Message.success(res.data);
                            this.deleteGroupDialog = false;
                        } else {
                            this.$Message.error(res.msg);
                            this.deleteGroupDialog = false;
                        }
                    }
                ).catch(
                    err => {
                        this.deleteGroupDialog = false;
                        console.log('请求失败' + err);
                    }
                )
            },
            //删除确认会话框
            showDeleteGroupDialog (gid) {
                this.deleteGroupInfo.groupID = gid;
                this.deleteGroupDialog = true;
            },
            //获取权限组列表
            getGroupList () {
                Axios.get('api.php?action=sys&opt=pmgroup')
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.tableData = [];
                            for(let i in res.data.pmData){
                                let groupInfo = {
                                    groupID: res.data.pmData[i].pmid,
                                    groupName: res.data.pmData[i].name,
                                    groupDetail: res.data.pmData[i].memo
                                };
                                this.tableData.push(groupInfo);
                            }
                        }
                    }
                ).catch(
                    err => {
                        console.log('获取失败' + err);
                    }
                )
            },
            //权限修改
            commitUserPermission () {
                Axios.post('api.php?action=sys&opt=permission&act='+this.editPermission.act, {
                    stage: 'yes',
                    pmid: this.editPermission.pmid,
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
                        this.editPermission['games'][origin.games].push(parseInt(i));
                    }
                } else { //menu
                    this.editPermission[origin] = [];
                    for (let i in idList) {
                        this.editPermission[origin].push(parseInt(i));
                    }
                }
            },
            //获取权限列表
            getPermissionTree (pmid) {
                Axios.get('api.php?action=sys&opt=permission&act=pm&pmid='+pmid)
                .then(
                    res => {
                        if (res.ret == 1) {
                            this.editPermission.act = res.data.gData.act;
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
                            this.showGroupListTable = false;
                            this.showPermissionSetting = true;
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
                    } else if (menuData[i].acstate == 2) {
                        delete defaultSet.checked;
                        defaultSet.title = '√ ';
                    }
                    defaultSet.title += menuData[i].name;
                    defaultSet.mark = parseInt(menuData[i].id);
                    this.buildAssociate(origin, parseInt(menuData[i].id), father);
                    if (defaultSet.checked) {
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
            buildAssociate (origin, curID, faterID) {
                if (typeof origin == 'object') {
                    if (this.associate.games[origin.games] == undefined) {
                        this.associate.games[origin.games] = {};
                    }
                    this.associate.games[origin.games][curID] = (faterID == undefined) ? faterID : parseInt(faterID);
                } else {
                    this.associate[origin][curID] = (faterID == undefined) ? faterID : parseInt(faterID);
                }
            },
            //创建该权限组权限列表
            buildUserPermission (origin, curID) {
                if (typeof origin == 'object') {
                    if (this.editPermission.games[origin.games] == undefined) {
                        this.editPermission.games[origin.games] = [];
                    }
                    this.editPermission.games[origin.games].push(curID);
                } else {
                    this.editPermission[origin].push(curID);
                }
            },
            //返回列表
            backListPage () {
                this.showGroupListTable = true;
                this.showPermissionSetting = false;
            }
        }
    };
</script>