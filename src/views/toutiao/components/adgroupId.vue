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
        <Button type="ghost">选择广告计划({{adgroup_ids.length==0?"不限":adgroup_ids.length}})
        </Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="adgroup_ids" @on-change="checkAllGroupChange">
                        <div v-for="item in adgroup_list" :key="this" class="select-list">
                            <Checkbox :label="item.adgroup_id">{{item.adgroup_name}}</Checkbox>
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
    name: "adgroupId",
    data() {
        return {
            adgroup_ids: [],
            adgroup_list: [],
            indeterminate: false,
            checkAll: false,
        };
    },
    mounted() {
        this.getadgroups();
    },
    methods: {
        //获取广告计划
        getadgroups() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getAdgroups",
                account_id: this.get_account_id
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.adgroup_list = res.data;
                        this.adgroup_ids = [];
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.adgroup_ids);
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
                this.adgroup_list.forEach(v => {
                    ids.push(v.adgroup_id)
                });
                this.adgroup_ids = ids;
            } else {
                this.adgroup_ids = [];
            }
            this.confirmids();
        },
        checkAllGroupChange(data) {
            if (data.length === this.adgroup_list.length) {
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
            this.getadcreatives();
        }
    },
    computed: {
        get_account_id() {

            return this.$store.state.user.report_account_id;
        }
    },
};
</script>