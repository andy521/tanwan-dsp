<style scoped>
.filter-tree{
  position: relative;
  width: 100%;
  background-color: #fff;
  border: 1px solid #dddee1;
  border-radius: 2px;
}
.filter-tree ul{
  list-style:none;
}
.filter-tree .title{
  padding: 0 12px;
  font-size: 14px;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  color: #333;
}
.filter-tree .title .txt{
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
}
.filter-tree .title .clearall{
  float: right;
  cursor: pointer;
  color: #598fe6;
}
.filter-tree .content{
  height: 240px;
  overflow-y: auto;
}
.filter-tree .content>ul>li{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 12px 0;
  padding: 0 6px;
  background: #f8f8f8;
}
.filter-tree .content>ul>li .tit{
  vertical-align: middle;
}
.filter-tree .content>ul>li .btn-close{
  display: inline-block;
  position: relative;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.filter-tree .content>ul>li .btn-close:after{
  display: inline-block;
  content: '';
  position: absolute;
  top: 10px;
  left: 2px;
  width: 16px;
  border-top: 1px solid #333;
  transform: rotateZ(45deg);
}
.filter-tree .content>ul>li .btn-close::before{
  display: inline-block;
  content: '';
  position: absolute;
  top: 10px;
  left: 2px;
  width: 16px;
  border-top: 1px solid #333;
  transform: rotateZ(-45deg);
}
</style>
<template>
  <div v-if="valueData && valueData.length !== 0" class="filter-tree">
    <div>
      <div class="title">
        <span class="txt">已选</span>
        <span @click="handleClearAll" class="clearall">清除全部</span>
      </div>
        <div class="content">
          <ul>
            <li v-for="(tit, i) in titleList" :key="i">
              <span class="tit">{{tit}}</span>
              <span @click="handleClearItem(i)" class="btn-close"></span>
            </li>
          </ul>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'filterTree',
  props: {
    valueData: {
      type: Array,
      default: (() => [])
    },
    titleData: {
      type: Array,
      default: (() => [])
    }
  },
  data() {
    return {
      valueList: [],
      titleList: [],
    }
  },
  mounted() {
    this.valueList = this.valueData
    this.titleList = this.titleData
  },
  watch: {
    valueData(newVal) {
      this.valueList = newVal
    },
    titleData(newVal) {
      this.titleList = newVal
    }
  },
  methods: {
    handleClearItem(i) {
      this.valueList.splice(i, 1)
      this.titleList.splice(i, 1)

      this.$emit('on-change', {
        value: this.valueList,
        title: this.titleList
      })
    },
    handleClearAll() {
      this.valueList = []
      this.titleList = []

      this.$emit('on-change', {
        value: this.valueList,
        title: this.titleList
      })
    }
  }
}
</script>
