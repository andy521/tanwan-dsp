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
        <Button type="ghost">选择代理商</Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="agent_ids" @on-change="checkAllGroupChange">
                        <div v-for="item in agent_list" :key="this" class="select-list">
                            <Checkbox :label="item.agent">{{item.agent}}</Checkbox>
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
    name: "selectAgent",
    data() {
        return {
            agent_ids: [],
            agent_list: [],
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
                action: "sys",
                opt: "getAgent",
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.agent_list = res.data;
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.agent_ids);
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
                this.agent_list.forEach(v => {
                    ids.push(v.agent)
                });
                this.agent_ids = ids;
            } else {
                this.agent_ids = [];
            }
            this.confirmids();
        },
        checkAllGroupChange() {
            let data=this.agent_list;
            if (data.length === this.agent_ids.length) {
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
    }
};
</script>