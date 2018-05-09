<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
.sel {
  width: 220px;
}
.inp {
  display: inline-block;
  width: 150px;
}
.ad .ivu-poptip {
  display: inline-block;
}
.sel_state {
  text-align: left;
  width: 110px;
}
.select_account{
    float: right;
}
</style>
<template>
    <div class="report">
        <Card shadow class="margin-top-10">
            <Menu mode="horizontal" active-name="advertiser" @on-select="totab">
                <MenuItem name="advertiser">账户报表</MenuItem>
                <Submenu name="">
                    <template slot="title">受众分析</template>
                    <MenuItem name="audience">帐户</MenuItem>
                    <!-- <MenuItem name="audience">广告组</MenuItem>
                    <MenuItem name="audience">广告计划</MenuItem> -->
                </Submenu>
                <MenuItem name="bid">效果广告报告</MenuItem>

                <div class="select_account">
                    <span class="red">选择账户:</span>
                    <Select v-model="account" placeholder="请选择帐号" class="sel">
                        <Option v-for="item in accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                    </Select>
                </div>
            </Menu>

            <!-- 能在组件切换过程中将状态保留在内存中，防止重复渲染DOM。 -->
            <keep-alive>
                <component :is="curent" :account="account" class="margin-top-20" v-if="account"></component>
            </keep-alive>
        </Card>

        <Modal v-model="accountModal" title="选择新建计划帐号" @on-ok="setAccount" @on-cancel=" accountModal = false">
            <div class="select">
                <Select v-model="account_id" placeholder="请选择帐号">
                    <Option v-for="item in accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                </Select>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index";
import advertiser from "./components/report/advertiser.vue";
import audience from "./components/report/audience.vue";
import bid from "./components/report/bid.vue";

export default {
    components: {
        advertiser,
        audience,
        bid
    },
    data() {
        return {
            curent: "advertiser",
            account: "",
            account_id: "",
            accountList: [],
            accountModal: true,
        };
    },
    mounted() {
        this.getAccount();
    },
    methods: {
        totab(val) {
            this.curent = val;
        },
        getAccount() {
            Axios.get("api.php", {
                action: "api",
                opt: "getAccount",
                media_type: 4
            })
                .then(res => {
                    if (res.ret == 1) {
                        this.accountList = res.data;
                    }
                })
                .catch(err => {
                    console.log("获取媒体账号" + err);
                });
        },
        setAccount() {
            if (this.account_id == "") {
                this.$Message.info("请选择帐号");
                return;
            }
            this.account = this.account_id;
            this.accountModal = false;
        }
    }
};
</script>