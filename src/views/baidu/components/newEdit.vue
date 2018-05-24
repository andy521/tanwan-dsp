<style scoped>
.new {
  display: inline-block;
}
</style>
<template>
    <div class="new">
        <Button type="ghost" icon="android-add" :loading="loading" @click="newsEdit">{{title}}</Button>

        <Modal v-model="accountModal" title="选择新建计划帐号" @on-ok="setAccount" @on-cancel=" accountModal = false">
            <div class="select">
                <Select v-model="account">
                    <Option v-for="item in accountList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        </Modal>
    </div>
</template>
<script>
import Axios from "@/api/index";
export default {
    name: "newEdit",
    props:{
        title:{
            type:String,
            default:''
        },
        toRouteName: {
            type: String,
            default: 'bdcampaign'
        },
        queryParams: {
            type: Object,
            default: (() => {})
        }
    },
    data() {
        return {
            loading: false,
            accountModal: false,
            accountList: [],
            account: ""
        };
    },
    methods: {
        newsEdit() {
            this.loading = true;
            Axios.post("api.php", { action: "ucAdPut", opt: "getAccountList" })
            .then(res => {
                if (res.ret == 1) {
                    let list = res.data,
                    s = [];
                    list.forEach(item => {
                        s.push({ value: item.account_id, label: item.account_name });
                    });
                    this.accountList = s;
                    this.loading = false;
                    this.accountModal = true;
                }
            })
            .catch(err => {
                console.log(err);
            });
        },
        setAccount() {
            if (this.account == "") {
                this.$Message.info("请选择帐号");
                return;
            }
            const query = Object.assign({
                account: this.account
            }, this.queryParams)

            this.$router.push({
                name: this.toRouteName,
                query: query
            });
            this.accountModal = false;
        }
    }
};
</script>
