<style lang="less" scoped>
@import url("../index.less");
.type-tree {
  .content{
    padding: 10px 15px;
    width: 240px;
    height: 270px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
}
</style>

<template>
  <div class="type-tree">
    <h4 class="title">
      <Checkbox v-model="isChecked" :disabled="true">
        {{treeTitle}}
        <Tooltip v-if="tipTxt.length > 0" placement="bottom" :transfer="true">
          <Icon type="help-circled"></Icon>
          <div slot="content">
            <p v-for="(tip, index) in tipTxt" :key="index">{{tip}}</p>
          </div>
        </Tooltip>
      </Checkbox>
    </h4>
    <div class="content">
      <Tree @on-check-change="handleTree" :data="treeData" show-checkbox></Tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    treeTitle: {
      type: String,
      default: ""
    },
    treeData: {
      type: [Array, Object],
      default: (() => [])
    },
    tipsText: {
      type: Array,
      default: (() => [])
    },
    interestValue: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isChecked: false,
      tipTxt: this.tipsText
    };
  },
  methods: {
    handleTree(list) {
      this.isChecked = list.length > 0 ? true : false;
      let ret = {
        value: 0,
        list: list
      }
      if (this.interestValue > 0) {
        ret.value = this.interestValue
      }
      this.$emit('on-change', ret);
    }
  }
};
</script>
