<style scoped>
.select-tree{
  width: inherit;
  height: inherit;
  font-size: 0;
}
.select-tree ul li{
  position: relative;
  list-style: none;
  margin: 2px 0;
  padding: 6px 50px 0 15px;
  white-space: nowrap;
  outline: 0;
}
.select-tree ul li:hover,.select-tree ul li.active{
    background-color: rgba(212, 212, 212, 0.23);
}
.select-tree>ul>li>span{
  display: inline-block;
  vertical-align: middle;
}
.select-tree .tree-check-box{
  display: inline-block;
  position: relative;
  margin-right: 8px;
  white-space: nowrap;
  cursor: pointer;
  line-height: 1;
  font-size: 12px;
}
.select-tree .tree-input-inner{
  display: inline-block;
  position: relative;
  width: 14px;
  height: 14px;
  cursor: pointer;
  border: 1px solid #dddee1;
  border-radius: 2px;
}
.select-tree .tree-checkbox-input{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
  opacity: 0;
}
.select-tree .tree-input-checked .tree-input-inner{
  border-color: #2d8cf0;
  background-color: #2d8cf0;
}
.select-tree .tree-checkbox-input:after {
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(0);
    transition: all .2s ease-in-out;
    box-sizing: border-box
}
.select-tree .tree-input-checked .tree-input-inner:after {
    content: "";
    display: table;
    width: 4px;
    height: 8px;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1);
    transition: all .2s ease-in-out;
}
.select-tree .icon-arrow-rt{
  position: absolute;
  right: 8px;
  top: 50%;
  margin-top: -7.5px;
  width: 15px;
  height: 15px;
}
.select-tree .tree-title{
  display: inline-block;
  margin: 0;
  padding: 0 4px;
  border-radius: 3px;
  cursor: pointer;
  vertical-align: top;
  font-size: 12px;
  color: #495060;
  transition: all .2s ease-in-out;
}
.select-tree .nodatatxt{
  padding: 6px 15px;
  font-size: 12px;
}
</style>
<template>
  <div class="select-tree">
    <div v-if="list && list.length === 0" class="nodatatxt">无数据...</div>
    <ul v-if="list && list.length !== 0">
      <li @click="handleSelectAll" v-if="selectAllShow">
        <span :class="{'tree-input-checked': isSelectAll}" class="tree-check-box">
          <span class="tree-input-inner"></span>
          <input type="checkbox" class="tree-checkbox-input">
        </span>
        <span class="tree-title">全选</span>
      </li>      
      <li @click="handleTreeItem(item)" v-for="(item, index) in list" :key="index">
        <!-- <span :class="{'tree-input-checked': item.value === currChecked || item.selected}" class="tree-check-box"> -->
        <span :class="{'tree-input-checked': item.selected}" class="tree-check-box">
          <span class="tree-input-inner"></span>
          <input @focus="handleInputFocus(item)" type="checkbox" class="tree-checkbox-input">
        </span>
        <span class="tree-title">{{item.title}}</span>
        <span v-if="item.type === type" class="icon-arrow-rt">
          <svg width="100%" height="100%" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"></path></svg>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'selectTree',
  props: {
    data: {
      type: Array,
      default: (() => [])
    },
    type: {
      type: String,
      default: ''
    },
    selectAllShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      currValue: -1,
      currValueList: [],
      currNameList: [],
      currChildren: [],
      currTitle: '',
      currType: '',
      isSelectAll: false
    }
  },
  watch: {
    data(newVal) {
      this.list = newVal
      this.isSelectAll = true
      this.selectAll(this.isSelectAll)
    }
  },
  mounted() {
    this.list = this.data
  },
  methods: {
    selectAll(flag) {
      if (this.list.length === 0) {
        return
      }
      this.currType = this.type
      if (flag) {
        this.list.forEach(val => {
          val.selected = true         
          this.currNameList.push(val.title)
          this.currValueList.push(val.value)
        })
      } else {
        this.list.forEach(val => {
          val.selected = false         
          this.currNameList = []
          this.currValueList = [] 
        })   
      }
      this.$emit('on-change', {
        currValue: this.currValue,
        value: this.currValueList,
        name: this.currNameList,
        children: this.currChildren,
        type: this.currType,
        title: this.currTitle,
        childrenLen: this.currChildren.length,
        checked: false
      })
      console.log('selectAll', this.currValueList, this.currNameList)
    },
    handleSelectAll(e) {
      e = e || window.event
      e.preventDefault()
      if (!this.isSelectAll) {
        this.isSelectAll = true
        this.selectAll(this.isSelectAll)
      } else {
        this.isSelectAll = false
        this.selectAll(this.isSelectAll)
      }
    },
    handleInputFocus(params) {
      // this.setCurrChecked(params)

      // this.$emit('on-selected', {
      //   value: [this.currValue],
      //   name: this.currNameList,
      //   children: this.currChildren,
      //   type: this.currType,
      //   checked: true
      // })
    },
    handleTreeItem(params) {
      this.setCurrChecked(params)
      this.$emit('on-change', {
        currValue: this.currValue,
        value: this.currValueList,
        name: this.currNameList,
        children: this.currChildren,
        type: this.currType,
        title: this.currTitle,
        childrenLen: this.currChildren.length,
        checked: false
      })
    },
    // 设置选中项参数
    setCurrChecked(src) {
      if (!src.value && !src.name) {
        return
      }
      const copyChildren = this.currChildren
      const type = src.type
      const checked = src.value
      const name = src.title
      const children = src.children
      // this.currChecked = checked

      if (this.currValueList.length === 0) {
        src.selected = true
        this.currType = type
        this.currValue = checked
        this.currNameList.push(name)
        this.currValueList.push(checked)
        this.currChildren = children
        return
      }

      let count = 0
      let index = -1
      this.currValueList.forEach((val, i) => {
        if (val === checked) {
          count += 1
          index = i
        }
      })

      if (count === 0) {
        src.selected = true
        this.currType = type
        this.currValue = checked
        this.currNameList.push(name)
        this.currValueList.push(checked)
        this.currChildren = children
      } else {
        src.selected = false
        this.currType = ''
        this.currValueList.splice(index, 1)
        this.currNameList.splice(index, 1)
        this.currChildren = copyChildren
      }
      console.log(this.currValueList, this.currNameList, this.currChildren)
    }
  }
}
</script>
