<template>
    <div class="account">
        <Button :loading="loading" @click="getAccount" class="btn_name">{{ts}}</Button>

        <Modal v-model="isModal" title="选择账户" @on-ok="modalOk">
            <Select v-model="account_id">
                <Option v-for="(item,index) in accountList" :value="item.account_id" :key="item.account_id">{{ item.account_name }}</Option>
            </Select>
        </Modal>
    </div>
</template>
<script>
import Axios from "@/api/index"
export default {
    name: 'getAccount',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isModal: false,
            loading: false,
            account_id: "",
            accountList: [],
            ts: '请选择用户',
        }
    },
    methods: {
        //获取关联账号列表            
        getAccount() {
            this.loading = true;
            Axios.post('api.php', {
                action: 'api',
                opt: 'getAccount',
                media_type: 3
            }).then(res => {
                this.loading = false;
                if (res.ret == 1) {
                    this.isModal = true;
                    this.allAccount = this.accountList = res.data;
                }
            }).catch(err => {
                this.loading = false;
                console.log(err)
            });
        },
        modalOk() {
            this.accountList.forEach(e => {
                if (this.account_id == e.account_id) {
                    this.ts = e.account_name;
                }
            })
            this.$emit('on-change', this.account_id);
        }
    },
    beforeMount() {
        if (this.visible) {
            this.isModal = true;
            this.getAccount()
        };
    }
}
</script>