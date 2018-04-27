<style lang="less" scoped>
.infocard{
  height: 100px;
  overflow: hidden;
  .count{
    font-size: 24px;
    font-weight: 600;
  }
  .text{
    text-align:center;
    font-size:14px;
    font-weight:500;
    color:#C8C8C8;
  }
  .content{
    height: 100%;
  }
  .pointer{
    cursor: pointer;
  }
}
[v-cloak]{
  display: none;
}
.tip-txt{
  text-align: center;
  color: #C8C8C8;
  font-size: 12px;
  font-weight: normal;
}
</style>

<template>
  <Card :padding="0">
    <div class="infocard">
      <Col class="content" :style="{backgroundColor: color, color: 'white'}" span="8">
        <Row class="content" type="flex" align="middle" justify="center">
          <Icon :type="iconType" :size="iconSize" :color="iconColor"></Icon>
        </Row>
      </Col>
      <Col span="16" class="content">
        <Row type="flex" align="middle" justify="center" class="content pointer">
          <div>
            <p class="text">{{descText}}</p>
            <p :style="{textAlign: 'center', color: color, fontSize: countSize, fontWeight: countWeight}" class="count">
              <span v-cloak :id="eleId">{{countNum}}</span>
            </p>
            <p v-if="countUseNum" class="tip-txt">({{countUseNum}}元可用)</p>
          </div>
        </Row>
      </Col>
    </div>
  </Card>
</template>

<script>
import CountUp from 'countup';
export default {
  name: 'infoCard',
  props: {
    eleId: String,
    color: String,
    countSize: String,
    countWeight: String,
    countUseNum: Number,
    countNum: {
      type: Number,
      default: 0
    },
    textSize: String,
    descText: String,
    iconType: {
      type: String,
      default: 'checkmark-circled'
    },
    iconSize: {
      type: Number,
      default: 40
    },
    iconColor: {
      type: String,
      default: '#fff'
    },
    delay: {
      type: Number,
      default: 500
    },
    countUp: {
      type: Object,
      default: () => {
        return {
          startVal: 0,
          decimals: 0,
          duration: 2,
          options: {
            useEasing: true, 
            useGrouping: true, 
            separator: ',', 
            decimal: '.', 
          }
        }
      }
    }
  },
  data() {
    return {
      cu: {}
    }
  },
  watch: {
    countNum(val) {
      // this.cu.update(val);
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (!this.eleId) {
          console.warn("countUp没有绑定DOM，请设置")
          return;
        }
        this.initCountUp();
      }, this.delay);
    })
  },
  methods: {
    initCountUp() {
      let cu = {};
      this.cu =  cu = new CountUp(
      this.eleId,
      this.countUp.startVal,
      this.countNum,
      this.countUp.decimals,
      this.countUp.duration,
      this.countUp.options,
      );
      if (!cu.error) {
        cu.start();
      }
    }
  }
};
</script>
