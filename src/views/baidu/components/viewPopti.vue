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
                    媒体列
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="impression">展示数</Checkbox>
                    <Checkbox label="click">点击数</Checkbox>
                    <Checkbox label="ctr">点击率</Checkbox>
                    <Checkbox label="cpc">平均点击单价</Checkbox>
                    <Checkbox label="cpm">千次展现费用</Checkbox>
                </CheckboxGroup>
                <div class="checklist">
                    激活注册
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="active">激活数</Checkbox>
                    <!-- <Checkbox label="">激活成本</Checkbox> -->
                    <!-- <Checkbox label="active_rate">激活率</Checkbox> -->
                    <Checkbox label="conversion">转化数</Checkbox>
                    <Checkbox label="cost_per_conversion">转化成本</Checkbox>
                    <Checkbox label="cvr">转化率</Checkbox>
                    <Checkbox label="reg_total">注册数</Checkbox>
                    <Checkbox label="cost_per_reg">注册成本</Checkbox>
                    <Checkbox label="reg_rate">注册率</Checkbox>
                </CheckboxGroup>
                <div class="checklist">
                    活跃付费
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="reg_arpu">注册ARPU</Checkbox>
                    <Checkbox label="active">活跃数</Checkbox>
                    <Checkbox label="active_per_reg">活跃率</Checkbox>
                    <Checkbox label="pay_num">付费人数</Checkbox>
                    <Checkbox label="pay_total">付费金额</Checkbox>
                    <Checkbox label="pay_per_reg">付费率</Checkbox>
                    <Checkbox label="roi">回本率</Checkbox>
                </CheckboxGroup>
                <!-- <div class="checklist">
                    其他
                </div>
                <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox label="">播放数</Checkbox>
                    <Checkbox label="">有效播放次数</Checkbox>
                    <Checkbox label="">有效播放率</Checkbox>
                    <Checkbox label="">已选流量</Checkbox>
                    <Checkbox label="">操作</Checkbox>
                    <Checkbox label="">投放时间</Checkbox>
                    <Checkbox label="">转化类型</Checkbox>
                    <Checkbox label="">广告质量度</Checkbox>
                </CheckboxGroup> -->
                <div class="margin-top-20">
                    <Button type="ghost" @click="set_user_memo">保存操作</Button>
                </div>
            </div>
        </Poptip>
    </div>
</template>
<script>
import Axios from '@/api/index'
export default {
    name: 'viewTab',
    props: ['action', 'opt', 'check'],
    data() {
        return {
            indeterminate: true,
            checkAll: false,
            checkAllGroup: [], //默认选中
            checkAllGroups: [
                'impression',
                'click',
                'ctr',
                'cpc',
                'cpm',
                'active',
                'active_per_reg',
                'conversion',
                'cost_per_conversion',
                'cvr',
                'reg_total',
                'cost_per_reg',
                'reg_rate',
                'reg_arpu',
                'active',
                'pay_num',
                'pay_total',
                'pay_per_reg',
                'roi'
            ]
        }
    },
    mounted() {
        Axios.get('api.php', {
            action: 'sys',
            opt: 'get_user_memo',
            taction: this.action,
            topt: this.opt
        })
            .then(res => {              
                if (res.ret == 1) {
                    let check = res.data.split(',')
                    if (check.length === 0) {
                        this.checkAllGroup = this.check
                    } else {
                        this.checkAllGroup = check
                        this.checkChange()
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    },
    methods: {
        //保存自定义指标
        set_user_memo() {
            if (this.checkAllGroup.length === 0) {
                this.$Message.info('至少您得选择一个自定义指标吧')
                return
            }
            Axios.get('api.php', {
                action: "sys",
                opt: 'set_user_memo',
                taction: this.action,
                topt: this.opt,
                memo: this.checkAllGroup.join(',')
            })
                .then(res => {
                    if (res.ret === 1) {
                        const poptip = this.getPoptip().querySelector('.ivu-poptip-popper')
                        poptip.style.display = 'none'
                        this.$Message.info(res.msg)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //自定义指标全选
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false
            } else {
                this.checkAll = !this.checkAll
            }
            this.indeterminate = false
            if (this.checkAll) {
                this.checkAllGroup = this.checkAllGroups
            } else {
                this.checkAllGroup = []
            }
            this.checkChange()
        },
        //自定义指标
        checkAllGroupChange(data) {
            if (data.length === 28) {
                this.indeterminate = false
                this.checkAll = true
            } else if (data.length > 0) {
                this.indeterminate = true
                this.checkAll = false
            } else {
                this.indeterminate = false
                this.checkAll = false
            }
            this.checkChange()
        },
        //点击树节点时触发
        checkChange() {
            let uncheck = []
            this.checkAllGroups.forEach(item => {
                let is = true
                this.checkAllGroup.forEach(col => {
                    if (item == col) {
                        is = false
                    }
                })
                if (is) {
                    uncheck.push(item)
                }
            })
            this.$emit('on-change', uncheck)
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
}
</script>

<style>

</style>