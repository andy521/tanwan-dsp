<style lang="less">
    @import './infor-card.less';
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
                <Row class="height-100" type="flex" align="middle" justify="center">
                    <Icon :type="iconType" :size="iconSize"></Icon>
                </Row>
            </Col>
            <Col span="16" class="height-100">
                <Row type="flex" align="middle" justify="center" class="height-100">                   
                    <div>
                        <p :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}"><span v-cloak :id="idName">{{startVal}}</span></p>
                        <p class="infor-intro-text">{{introText}}</p>
                    </div>
                </Row>
            </Col>
        </div>
    </Card>
</template>

<script>

// <infor-card
//     id-name="user_created_count"
//     :end-val="total.balance_4"
//     iconType="card"
//     color="#19be6b"
//     intro-text="信用账户"
// ></infor-card>

import CountUp from 'countup';

export default {
    name: 'inforCard',
    props: {
        idName: String,
        endVal: Number,
        color: String,
        iconType: String,
        introText: String,
        countSize: {
            type: String,
            default: '25px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        },
        startVal: {
            type: Number,
            default: 0
        },
        decimals: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 2
        },
        delay: {
            type: Number,
            default: 500
        },
        options: {
            type: Object,
            default: () => {
                return {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.'
                };
            }
        }
    },
    data() {
        return {
            demo:{}
        };
    },
    watch: {
        endVal(val) {
            //console.log(this.demo)
            //this.demo.update(val);
        }
    },
    mounted(){
        this.$nextTick(() => {
            //Vue.nextTick(callback)`，当数据发生变化，更新后执行回调。
            //Vue.$nextTick(callback)`，当dom发生变化，更新后执行的回调。
            setTimeout(() => {
                let demo = {};
                this.demo = demo = new CountUp(
                    this.idName, //目标元素的 ID
                    this.startVal, //开始值
                    this.endVal,  //结束值
                    this.decimals, //小数位数，默认值是0
                    this.duration, // 动画延迟秒数，默认值是2；
                    this.options  //回调
                );
                if (!demo.error) {
                    demo.start();
                }
            }, this.delay);
        })
    }
};
</script>

