<style scoped>
.new {
  display: inline-block;
}
</style>
<template>
    <div class="new">
        <Button type="ghost" icon="ios-copy" :loading="loading" @click="newsEdit">新建计划</Button>

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
        // 线上代码，上线前删掉注释
        this.$router.push({
            name: "ucplan",
            query: { account: this.account }
        });
      this.accountModal = false;
    }
  }
};
</script>