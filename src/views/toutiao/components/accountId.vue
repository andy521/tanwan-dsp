<style scoped>
.sel {
  position: relative;
  width: 300px;
  z-index: 1000;
}
</style>
<template>
    <Card shadow class="margin-top-10">
        <span class="red">选择账户:</span>
        <Select v-model="account_id" filterable placeholder="请选择帐号" class="sel" @on-change="setAccount();">
            <Option v-for="item in accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
        </Select>

        <Modal v-model="accountModal" title="选择新建计划帐号" @on-ok="setAccount" @on-cancel="accountModal = false">
            <div class="select">
                <Select v-model="account_id" placeholder="请选择帐号">
                    <Option v-for="item in accountList" :value="item.account_id" :key="this">{{ item.account_name }}</Option>
                </Select>
            </div>
        </Modal>
    </Card>
</template>
<script>
import Axios from "@/api/index";
export default {
    name: "accountId",
    data() {
        return {
            account_id: "",
            accountList: [],
            accountModal: false,
        };
    },
    mounted() {
        this.getAccount();
        this.get_account_id();
    },
    methods: {
        get_account_id() {
            let accountModal = this.$store.state.user.report_account_id;
            this.account_id = accountModal;
           
            if (accountModal == "") {
                this.accountModal = true;
            } else {
                this.accountModal = false;
            }
        },
        getAccount() {
            Axios.get("api.php", {
                action: "api",
                opt: "getAccount",
                media_type: 4
            }).then(res => {
                if (res.ret == 1) {
                    this.accountList = res.data;
                }
            }).catch(err => {
                console.log("获取媒体账号" + err);
            });
        },
        setAccount() {
            if (this.account_id == "") {
                this.$Message.info("请选择帐号");
                return;
            }
            this.account = this.account_id;
            this.$store.commit("REPORT_ACCOUNT_ID", this.account_id);
            this.accountModal = false;
        }
    }
};
</script>