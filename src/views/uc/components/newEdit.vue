<style scoped>
.new {
  display: inline-block;
}
</style>
<template>
    <div class="new">
        <select-account @on-change="handleSelectAccount" :title="title"></select-account>
    </div>
</template>
<script>
import Axios from '@/api/index'
import selectAccount from '@/components/select-account/index.vue'
export default {
    name: 'newEdit',
    components: {
        selectAccount
    },
    props:{
        title:{
            type:String,
            default:''
        },
        toRouteName: {
            type: String,
            default: 'ucplan'
        },
        queryParams: {
            type: Object,
            default: (() => {})
        }
    },
    data() {
        return {
            loading: false,
            accountModal: false
        };
    },
    methods: {
        handleSelectAccount(accountId) {
            this.setAccount(accountId)
        },
        setAccount(accountId) {
            if (accountId == '') {
                this.$Message.info('')
                return
            }
            const query = Object.assign({
                account: accountId
            }, this.queryParams)

            this.$router.push({
                name: this.toRouteName,
                query: query
            })
            this.accountModal = false
        }
    }
}
</script>
