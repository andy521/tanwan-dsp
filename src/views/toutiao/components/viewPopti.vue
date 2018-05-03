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
				<Button type="primary" @click="handleShow">自定义指标</Button>
            <div slot="content" class="poptipdiv">
                <div class="bottom_line">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="checklist">
                    媒体列
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="configured_status">展示数</Checkbox>
                    <Checkbox label="click_cost">点击数</Checkbox>
                    <Checkbox label="click">点击率</Checkbox>
                    <Checkbox label="click_per">平均点击单价</Checkbox>
                    <Checkbox label="click_per">千次展现费用</Checkbox>
                </CheckboxGroup>               
                <div class="checklist">
                    激活注册
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="install">激活数</Checkbox>
                    <Checkbox label="click_install">激活成本</Checkbox>
                    <Checkbox label="reg_imei">激活率</Checkbox>
                    <Checkbox label="activation">转化数</Checkbox>
                    <Checkbox label="reg_per">转化成本</Checkbox>
                    <Checkbox label="reg_cost">转化率</Checkbox>
                    <Checkbox label="reg_imei_cost">注册数</Checkbox>
                    <Checkbox label="install_per">注册成本</Checkbox>
                    <Checkbox label="download_per">注册率</Checkbox>
                </CheckboxGroup>
                <div class="checklist">
                    活跃付费
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="login">注册ARPU</Checkbox>
                    <Checkbox label="act_per">活跃数</Checkbox>
                    <Checkbox label="pay_num">活跃率</Checkbox>
                    <Checkbox label="pay_total">付费人数</Checkbox>
                    <Checkbox label="pay_per">付费金额</Checkbox>
                    <Checkbox label="reg_arpu">付费率</Checkbox>
                    <Checkbox label="income_per">回本率</Checkbox>
                </CheckboxGroup>
                <div class="checklist">
                    其他
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="show_pv">播放数</Checkbox>
                    <Checkbox label="show_ip">有效播放次数</Checkbox>
                    <Checkbox label="down_ip">有效播放率</Checkbox>
                    <Checkbox label="campaign_id">已选流量</Checkbox>
                    <Checkbox label="game_name">操作</Checkbox>
                    <Checkbox label="game_name">投放时间</Checkbox>
                    <Checkbox label="game_name">转化类型</Checkbox>
                    <Checkbox label="game_name">广告质量度</Checkbox>
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
export default {
    name: "viewTab",
    props: ["action", "opt", "check"],
    data() {
        return {
            indeterminate: true,
            checkAll: false,
            checkAllGroup: [], //默认选中
            checkAllGroups: [
                "configured_status",
                "click_cost",
                "click",
                "click_per",
                "fetch",
                "fetch_per",
                "down_ins_per",
                "download",
                "install",
                "click_install",
                "reg_imei",
                "activation",
                "reg_per",
                "reg_cost",
                "reg_imei_cost",
                "install_per",
                "download_per",
                "login",
                "act_per",
                "pay_num",
                "pay_total",
                "pay_per",
                "reg_arpu",
                "income_per",
                "show_pv",
                "show_ip",
                "down_ip",
                "campaign_id",
                "game_name"
            ]
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
            })
                .then(res => {
                    if (res.ret == 1) {
												const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
												poptip.style.display = 'none'
                        this.$Message.info(res.msg);
                    }
                })
                .catch(err => {
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
            if (data.length === 28) {
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
						return this.$refs.poptip.$el
				},
				handleHide() {
						this.getPoptip().querySelector('.ivu-poptip-popper').style.display = 'none'
				},
				handleShow() {
						const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
						setTimeout(() => {
								poptip.style.display = 'block'
						}, 500)
						this.getPoptip().addEventListener('mouseleave', this.handleHide)
				}
			},
			beforeDestroy() {
					this.getPoptip().removeEventListener('mouseleave', this.handleHide)
			}
};
</script>

<style>

</style>