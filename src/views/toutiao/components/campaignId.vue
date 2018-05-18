<style scoped>
.campaign {
  max-height: 200px;
  overflow: auto;
}
.select-list {
  line-height: 24px;
}
</style>
<template>
    <Poptip content="content" placement="bottom-start" trigger="hover">
        <Button type="ghost">选择广告组({{campaign_ids.length==0?"不限":campaign_ids.length}})
        </Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="campaign_ids" @on-change="checkAllGroupChange">
                        <div v-for="item in campaign_list" class="select-list">
                            <Checkbox :label="item.campaign_id">{{item.campaign_name}}</Checkbox>
                        </div>
                    </CheckboxGroup>
                </div>
            </Card>
        </div>
    </Poptip>
</template>
<script>
import Axios from "@/api/index";
export default {
    name: "campaignId",
    data() {
        return {
            campaign_ids: [],
            campaign_list: [],
            indeterminate: false,
            checkAll: false,
        };
    },
    mounted() {
        this.getCampaigns();
    },
    methods: {
        //获取广告组
        getCampaigns() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getCampaigns",
                account_id: this.get_account_id
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.campaign_list = res.data;
                        this.campaign_ids = [];
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.campaign_ids);
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                let ids = [];
                this.campaign_list.forEach(v => {
                    ids.push(v.campaign_id)
                });
                this.campaign_ids = ids;
            } else {
                this.campaign_ids = [];
            }
            this.confirmids();
        },
        checkAllGroupChange(data) {
            if (data.length === this.campaign_list.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            this.confirmids();
        }
    },
    watch: {
        get_account_id() {
            this.getCampaigns();
        }
    },
    computed: {
        get_account_id() {

            return this.$store.state.user.report_account_id;
        }
    },
};
</script>