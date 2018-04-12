<style lang="less" scoped>
@import url("../index.less");
</style>

<template>
  <div class="type-tree">
    <h4 class="title">
      <Checkbox v-model="isChecked">
        {{treeTitle}}
        <Tooltip placement="top">
          <Icon type="help-circled"></Icon>
          <div slot="content" v-html="tipTxt"></div>
        </Tooltip>
      </Checkbox>
    </h4>
    <div class="content">
      <Tree @on-check-change="handleTree" :data="treeData" checkbox></Tree>
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
      default: []
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    tipsText: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      checkbox: this.showCheckbox ? "show-checkbox" : "",
      tipTxt: ""
    };
  },
  methods: {
    handleTree(list) {
      this.isChecked = list.length > 0 ? true : false;
      this.$emit("on-change", list);
    }
  }
};
</script>
