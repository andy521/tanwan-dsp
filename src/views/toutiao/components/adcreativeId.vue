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
        <Button type="ghost">选择广告创意({{adcreative_ids.length==0?"不限":adcreative_ids.length}})
        </Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="adcreative_ids" @on-change="checkAllGroupChange">
                        <div v-for="item in adcreative_list" class="select-list">
                            <Checkbox :label="item.adcreative_id">{{item.title}}</Checkbox>
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
    name: "adcreativeId",
    data() {
        return {
            adcreative_ids: [],
            adcreative_list: [],
            indeterminate: false,
            checkAll: false,
        };
    },
    mounted() {
        this.getadcreatives();
    },
    methods: {
        //广告创意列表
        getadcreatives() {
            Axios.post("api.php", {
                action: "ttAdPut",
                opt: "getCreativesByAdgroupId",
                account_id: this.get_account_id
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.adcreative_list = res.data;
                        this.adcreative_ids = [];
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.adcreative_ids);
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
                this.adcreative_list.forEach(v => {
                    ids.push(v.adcreative_id)
                });
                this.adcreative_ids = ids;
            } else {
                this.adcreative_ids = [];
            }
            this.confirmids();
        },
        checkAllGroupChange(data) {
            if (data.length === this.adcreative_list.length) {
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