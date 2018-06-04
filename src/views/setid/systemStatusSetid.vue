<style scoped>
.flex-item{
    flex: 0 0 450px;
    width: 450px;
}
.width-tab{
    width: 100px;
}
</style>
<template>
    <div class="systemstatussetid">
        <Card shadow>
            <div>
                <Icon type="android-person"></Icon> &nbsp;选择管理员：
                <Select v-model="currUId" style="width:200px" @on-change="handleAdsAthourSelect" placeholder="请选择管理员">
                    <Option v-for="item in adsAthour" :value="item.uId" :key="this">{{ item.uName }}</Option>
                </Select>
                <RadioGroup @on-change="switchUserAcGrant()" v-model="typeParam" class="padding-left-6">
                    <Radio v-for="(value, key, index) in typeConfig" :label="key" :key="index">{{value}}</Radio>
                </RadioGroup>
            </div>
            <div class="margin-top-20">
                <Row type="flex" align="middle">
                    <Col class="flex-item">
                        <Row type="flex" justify="space-between" align="middle">
                            <Col>全部账号</Col>
                            <Col>
                                <Input @on-enter="handleSearchAllGrantList()" v-model="allGrantSearchVal" placeholder="请输入关键词" class="width-tab"></Input>
                                <Button @click="handleSearchAllGrantList()" icon="ios-search-strong">搜索</Button>
                            </Col>
                        </Row>
                        <Table  ref="allGrantAcTable" @on-selection-change="getAllGrantSelect" :data="allGrantAcList" :columns="tableColumns" :row-class-name="rowClassName" :height="height" :loading="loading" stripe class="margin-top-10"></Table>
                    </Col>
                    <Col class="padding-left-20">
                        <Button type="primary" @click="handleAddUser" >添加 <Icon type="chevron-right"></Icon></Button><br>
                        <Button  type="primary" @click="handleRemoveUser" class="margin-top-10"><Icon type="chevron-left"></Icon> 移除</Button>

                    </Col>
                    <Col class="flex-item padding-left-20">
                        <Row type="flex" justify="space-between" align="middle">
                            <Col>所选管理员已有全部账号</Col>
                            <Col>
                                <Input @on-enter="handleSearchUserGrantList()" v-model="userGrantSearchVal" placeholder="请输入关键词" class="width-tab"></Input>
                                <Button @click="handleSearchUserGrantList()" icon="ios-search-strong">搜索</Button>
                            </Col>
                        </Row>
                        <Table ref="userGrantAcTable" @on-selection-change="removeUserGrantSelect" :data="userGrantAcList" :columns="tableColumns" :row-class-name="rowClassName" :height="height" :loading="loading" stripe class="margin-top-10"></Table>
                    </Col>
                </Row>

            </div>
            <Button type="primary" class="margin-top-20" :loading="isSubmiting" @click="submitUserAcGrant" style="width: 100px;">
                <span v-if="!isSubmiting">提交</span>
                <span v-else>提交中...</span>
            </Button>
        </Card>
    </div>
</template>

<script>
import Axios from '@/api/index'
import {deepClone} from '@/utils/DateShortcuts'
const PRESSIOM_TYPE_SEE = 'see'
const PRESSIOM_TYPE_EDIT = 'edit'
export default {
    data() {
        return {
            height: document.body.clientHeight - 250,
            isSubmiting: false, // 提交加载loading
            loading: false, // 表单加载loadin
            adsAthour: [], // 管理员列表
            typeConfig: {
                see:  '查看权限',
                edit:  '编辑权限'
            }, // 操作类型结构
            typeParam: 'see', // 操作类型，see和edit其中一个，代表意思请看备注
            currUId: '', // 当前系统账户UID
            tableColumns: [
                {
                    type: 'selection', 
                    align: 'center',
                    width: 60
                },
                {
                    key: 'inChargeName',
                    title: '负责人'
                },
                {
                    key: 'mediaTypeName',
                    title: '媒体类型'
                },
                {
                    key: 'accountId',
                    title: '账号名'
                }
            ],
            allGrantAcListOrigin: [], // 源所有管理员的所有账号
            allGrantAcList: [], // 所有管理员的所有账号
            allGrantAcListCopy: [], 
            allGrantAcSelectedList: [], // table公用的临时选中项
            userGrantAcListOrigin: [], // 源当前管理员下拥有的账号
            userGrantAcList: [], // 当前管理员下拥有的账号
            userGrantAcListCopy: [], 
            userGrantAcSelectedList: [], // table公用的临时选中项
            deleteAccountId: [], // 当前需要移除的accountId
            allGrantSearchVal: '', // allGrant搜索词汇
            userGrantSearchVal: '' // userGrant搜索词汇
        }
    },
    mounted() {
        this.getAdsAthour()
    },
    methods: {
        handleSearchUserGrantList() {
            this.userGrantAcList = this.userGrantAcListCopy.slice()
            if (searchVal === '') {
                return
            }
            const searchVal = this.userGrantSearchVal
            const userGrantAcList = this.userGrantAcList
            const ret = []
            if (userGrantAcList.length !== 0) {
                const reg = new RegExp(searchVal, 'gmi')
                userGrantAcList.forEach(item => {
                    if (reg.test(item.inChargeName) || reg.test(item.mediaTypeName) || reg.test(item.accountId)) {
                        ret.push(item)
                    }
                })
                this.userGrantAcList = ret
            }
        },
        handleSearchAllGrantList() {
            this.allGrantAcList = this.allGrantAcListCopy.slice()
            if (searchVal === '') {
                return
            }
            const searchVal = this.allGrantSearchVal
            const allGrantAcList = this.allGrantAcList
            const ret = []
            if (allGrantAcList.length !== 0) {
                const reg = new RegExp(searchVal, 'gmi')
                allGrantAcList.forEach(item => {
                    if (reg.test(item.inChargeName) || reg.test(item.mediaTypeName) || reg.test(item.accountId)) {
                        ret.push(item)
                    }
                })
                this.allGrantAcList = ret
            }
        },
        // 加载添加userGrantAcList后的数据
        handleAddUser() {
            this.userGrantAcList = this.allGrantAcSelectedList.length === 0 ? this.userGrantAcList : this.allGrantAcSelectedList
            this.userGrantAcListCopy = this.userGrantAcList.slice()
        },
        // 获取添加的userGrantAcList
        getAllGrantSelect(selectedList) {
            const userGrantAcList = this.userGrantAcList.slice()
            selectedList.forEach(selected => {
                userGrantAcList.forEach(user => {
                    if (user._checked && selected.accountId == user.accountId) {
                        selected._checked = true
                    } else {
                        selected._checked = false
                    }
                })
            })
            this.allGrantAcSelectedList = selectedList
        },
        // 加载移除userGrantAcList后的数据
        handleRemoveUser() {
            this.userGrantAcList = this.userGrantAcSelectedList.length === 0 ? this.userGrantAcList : this.userGrantAcSelectedList
            this.userGrantAcListCopy = this.userGrantAcList.slice()

            const deleteAccountId = this.deleteAccountId
            deleteAccountId.forEach(id => {
                this.allGrantAcList.forEach(all => {
                    if (all.accountId == id) {
                        all._checked = false
                    }
                })
            })   
        },
        // 获取移除后的userGrantAcList
        removeUserGrantSelect(selectedList) {
            const userGrantAcList = this.userGrantAcList
            const ret = userGrantAcList.slice()
            const deleteAccountId = []
            selectedList.forEach(selected => {
                ret.forEach((user, i) => {
                    if (selected.accountId == user.accountId) {
                        ret.splice(i, 1)
                        deleteAccountId.push(user.accountId)
                    }
                })
            })
            this.userGrantAcSelectedList = ret
            this.deleteAccountId = deleteAccountId         
        },
        //表格高亮calss
        rowClassName(row, index) {
            if (row._disabled) {
                return "table-statistics";
            }
        },
        // 管理员切换
        handleAdsAthourSelect() {
            this.switchUserAcGrant()
        },
        // 选取编辑 或 查看 状态
        switchUserAcGrant() {
            if (this.currUId == '') {
                this.$Message.info('请选择管理员')
                return
            }
            this.userAcGrantInfo()
        },
        // getAccountGrantParams(allGrantAcListOrigin, userGrantAcListOrigin) {
        //     const userGrantAcListOriginCopy = this.getGrantAcLenInfo(deepClone(userGrantAcListOrigin))

        //     if (allGrantAcListOrigin.length === userGrantAcListOrigin.length) {
        //         userGrantAcListOrigin = 'all'
        //         return
        //     }
        //     console.log(allGrantAcListOrigin.length, userGrantAcListOrigin.length)
        //     for(let sysUserId of Object.keys(userGrantAcListOrigin)) {
        //         let sysUserIdItem = userGrantAcListOrigin[sysUserId]
        //         let mediaList= sysUserIdItem.list
            
        //         if (allGrantAcListOrigin[sysUserId].length === sysUserIdItem.length) {
        //             // sysUserIdItem
        //         }

        //         // userGrantAcListOrigin.length = ++sysIdLen
        //         // if (mediaList) {
        //             //     for(let mediaType of Object.keys(mediaList)) {
        //                 //         let mediaTypeItem = mediaList[mediaType]
        //         //         mediaList.length = ++mediaTypeLen
        //         //         let accountList = mediaTypeItem.list
        //         //         if (accountList.length !== 0) {
        //             //             accountList.forEach(accountId => {
        //                 //                 ++accountIdLen
        //         //             })
        //         //             accountList.length = accountIdLen
        //         //             accountIdLen = 0
        //         //         }
        //         //     }
        //         //     mediaTypeLen = 0
        //         // }
        //     }
        //     console.log('=========', allGrantAcListOrigin, userGrantAcListOrigin)
        // },
        submitUserAcGrant() {
            const userGrantAcList = this._normalizeAccountGrant(this.userGrantAcList)
            // const accountGrantParams = this.getAccountGrantParams(this.allGrantAcListOrigin, userGrantAcList)
            this.userAcGrant(userGrantAcList)

        },
        // 获取系统账户的媒体账户权限信息
        userAcGrantInfo() {
            this.loading = true
            Axios.post('api.php', {
                action: 'sys',
                opt: 'userAcGrantInfo',
                type: this.typeParam,
                sysUserId: this.currUId
            }).then(res => {
                if (res.ret == 1) {
                    this.allGrantAcList = res.data.allGrantAcList ? this._normalizeGrantAcList(res.data.allGrantAcList) : []
                    this.allGrantAcListCopy = this.allGrantAcList.slice()
                    this.userGrantAcList = res.data.userGrantAcList ? this._normalizeGrantAcList(res.data.userGrantAcList) : []
                    this.userGrantAcListCopy = this.userGrantAcList.slice()
                    this._normalizeGrantAcSelected(this.allGrantAcList, this.userGrantAcList)
                    this.$Message.info('加载账户权限信息成功')
                    this.loading = false
                    this.allGrantAcListOrigin = this.getGrantAcLenInfo(res.data.allGrantAcList)
                }
            }).catch(
                err => {
                    console.log('获取系统账户的媒体账户权限信息' + err)
                }
            )        
        },
        // 编辑系统账户的媒体账户权限
        userAcGrant(accountGrantParams) {
            if (typeof accountGrantParams === 'undefined') {
                accountGrantParams = ''
            }
            this.isSubmiting = true
            Axios.post('api.php', {
                action: 'sys',
                opt: 'userAcGrant',
                type: this.typeParam,
                sysUserId: this.currUId,
                accountGrant: JSON.stringify(accountGrantParams)
            }).then(res => {
                if (res.ret == 1) {
                    const tip = this.typeConfig[this.typeParam]
                    this.$Message.info(`${tip}修改成功`)
                    this.isSubmiting = false
                }
            }).catch(
                err => {
                    console.log('编辑系统账户的媒体账户权限' + err)
                    this.isSubmiting = false
                }
            )            
        },
        // 获取管理员
        getAdsAthour() {
            Axios.get('api.php', {
                action: 'sys',
                opt: 'getAdsAthour'
            }).then(res => {
                if (res.ret == 1) {
                    this.adsAthour = res.data
                }
            }).catch(err => {
                console.log('获取管理员' + err)
            })
        },
        getGrantAcLenInfo(obj) {
            let sysIdLen = 0
            let mediaTypeLen = 0
            let accountIdLen = 0
            for(let sysUserId of Object.keys(obj)) {
                let sysUserIdItem = obj[sysUserId]
                let mediaList= sysUserIdItem.list
                obj.length = ++sysIdLen
                if (mediaList) {
                    for(let mediaType of Object.keys(mediaList)) {
                        let mediaTypeItem = mediaList[mediaType]
                        mediaList.length = ++mediaTypeLen
                        let accountList = mediaTypeItem.list
                        if (accountList.length !== 0) {
                            accountList.forEach(accountId => {
                                ++accountIdLen
                            })
                            accountList.length = accountIdLen
                            accountIdLen = 0
                        }
                    }
                    mediaTypeLen = 0
                }
            }
            return obj        
        },
        // 初始化accoutGrant
        _normalizeAccountGrant(userGrantAcList) {
            if (userGrantAcList.length === 0) {
                return
            }
            const accountGrant = {}
            userGrantAcList.forEach(item => {
                accountGrant[item.sysUserId] = {}
            })
            userGrantAcList.forEach(item => {
                accountGrant[item.sysUserId][item.mediaType] = []
            })
            userGrantAcList.forEach(item => {
                accountGrant[item.sysUserId][item.mediaType].push(item.accountId)        
            })
            // console.log(accountGrant)
            return accountGrant
        },
        // 初始化allGrantAcList被选项
        _normalizeGrantAcSelected(allList, userList) {
            userList.forEach(user => {
                allList.forEach(all => {
                    if (user.accountId == all.accountId) {
                        all._checked = true
                    }
                })
            })
        },
        // 初始化权限数据表
        _normalizeGrantAcList(obj) {
            if (JSON.stringify(obj) === '{}') {
                return
            }
            const ret = []
            for(let sysUserId of Object.keys(obj)) {
                let sysUserIdItem = obj[sysUserId]
                let inChargeName = sysUserIdItem.inChargeName
                let mediaList= sysUserIdItem.list
                if (mediaList) {
                    for(let mediaType of Object.keys(mediaList)) {
                        let mediaTypeItem = mediaList[mediaType]
                        let mediaTypeName = mediaTypeItem.mediaTypeName
                        let accountList = mediaTypeItem.list
                        if (accountList.length !== 0) {
                            accountList.forEach(accountId => {
                                ret.push({
                                    sysUserId: sysUserId,
                                    inChargeName: inChargeName,
                                    mediaType: mediaType,
                                    mediaTypeName: mediaTypeName,
                                    accountId: accountId,
                                    _checked: false,
                                })
                            })
                        }
                    }
                }
            }
            return ret
        }
    }
};
</script>
