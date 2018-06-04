<style scoped>
.bottom_line {
  border-bottom: 1px solid rgb(233, 233, 233);
  padding-bottom: 10px;
}

.poptipdiv {
  white-space: normal;
  text-align: left;
  padding: 20px;
}

.checklist {
  padding-bottom: 5px;
  padding-top: 20px;
}

.Poptiptap .ivu-poptip-body-content {
  overflow: inherit;
}
</style>

<template>
    <div style="display: inline-block;">
        <Poptip ref="poptip" placement="bottom-start" width="500" class="Poptiptap" trigger="hover">
            <Button type="ghost" icon="ios-navigate-outline" @click="handleShow">自定义指标</Button>
            <div slot="content" class="poptipdiv">
                <div class="bottom_line">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="checklist">

                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox v-for="conf of viewPoptiConfig" :key="conf.key" :label="conf.key">{{conf.name}}</Checkbox>
                </CheckboxGroup>
                <div class="margin-top-20">
                    <Button type="ghost" @click="set_user_memo">保存操作</Button>
                </div>
            </div>
        </Poptip>
    </div>
</template>
<script>
import Axios from "@/api/index";
import viewPoptiConfig from "@/utils/viewPoptiConfig.json";
export default {
    name: "viewPopti",
    props: ["action", "opt", "check"],
    data() {
        return {
            viewPoptiConfig: viewPoptiConfig,
            indeterminate: true,
            checkAll: false,
            checkAllGroup: [], //默认选中
            checkAllGroups: this.getcheckAllGroup()
        };
    },
    mounted() {
        Axios.get("api.php", {
            action: "sys",
            opt: "get_user_memo",
            taction: this.action,
            topt: this.opt
        })
            .then(res => {
                if (res.ret == 1) {
                    let check = res.data.split(",");
                    if (check.length == 0) {
                        this.checkAllGroup = this.check;
                    } else {
                        this.checkAllGroup = check;
                        this.checkChange();
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    },
    methods: {
        getcheckAllGroup() {
            const ret = []
            for(let key in viewPoptiConfig) {
                ret.push(key)
            }
            return ret
        },
        //保存自定义指标
        set_user_memo() {
            if (this.checkAllGroup.length == "0") {
                this.$Message.info("至少您得选择一个自定义指标吧");
                return;
            }
            Axios.get("api.php", {
                action: "sys",
                opt: "set_user_memo",
                taction: this.action,
                topt: this.opt,
                memo: this.checkAllGroup.join(",")
            }).then(res => {
                if (res.ret == 1) {
                    const poptip = this.getPoptip().querySelector(".ivu-poptip-popper");
                    poptip.style.display = "none";
                    this.$Message.info(res.msg);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        //自定义指标全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.checkAllGroup = this.checkAllGroups;
            } else {
                this.checkAllGroup = [];
            }
            this.checkChange();
        },
        //自定义指标
        checkAllGroupChange(data) {
            if (data.length === 6) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            this.checkChange();
        },
        //点击树节点时触发
        checkChange() {
            let uncheck = [];
            this.checkAllGroups.forEach(item => {
                let is = true;
                this.checkAllGroup.forEach(col => {
                    if (item == col) {
                        is = false;
                    }
                });
                if (is) {
                    uncheck.push(item);
                }
            });
            this.$emit("on-change", uncheck);
        },
        getPoptip() {
            return this.$refs.poptip.$el;
        },
        handleHide() {
            this.getPoptip().querySelector(".ivu-poptip-popper").style.display =
                "none";
        },
        handleShow() {
            const poptip = this.getPoptip().querySelector(".ivu-poptip-popper");
            setTimeout(() => {
                poptip.style.display = "block";
            }, 500);
            this.getPoptip().addEventListener("mouseleave", this.handleHide);
        }
    },
    beforeDestroy() {
        this.getPoptip().removeEventListener("mouseleave", this.handleHide);
    }
};
</script>

<style>
</style>