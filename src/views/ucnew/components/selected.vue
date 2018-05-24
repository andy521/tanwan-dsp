<style scoped>
.country-tree{
  height: 100%;
  zoom: 1;
  font-size: 14px;
  color: #333;
}
.country-tree .header{
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
}
.country-tree .header .selected-count>span{
  margin: 0 5px;
}
.country-tree .header .btn-clear{
  cursor: pointer;
}
.country-tree .selected-content{
  padding: 5px;
  max-height: 108px;
  overflow-y: auto;
}
.country-tree .selected-content .selected-item{
  display: inline-block;
  position: relative;
  padding: 0 20px;
  background: #eee;
  border-radius: 20px;
  height: 26px;
  line-height: 26px;
  border: 1px solid transparent;
  font-size: 13px;
}
.country-tree .selected-content .selected-item .icon-close{
  display: inline-block;
  padding: 0 2px;
  vertical-align: baseline;
  font-style: normal;
  font-size: 20px;
  cursor: pointer;
}
.color-red{
  color: #ec4f38;
}
</style>
<template>
  <div class="country-tree">
    <div class="header">
      <div class="selected-count">
        已选<span>{{selectTotal}}</span><i>/</i><span>{{allTotal}}</span>
      </div>
      <div class="btn-clear color-red" @click="handleClearAll">清除全部</div>
    </div>
    <div v-if="list.length !== 0" class="selected-content">
      <span v-if="item.checked" v-for="(item, index) in list" :key="index" class="selected-item">
        {{item.title}}
        <i @click="handleClearItem(index)" class="icon-close color-red">x</i>
      </span>
      <span v-if="!item.checked" v-for="(item, index) in list" :key="index">
        <span v-if="c.checked" v-for="(c, ic) in item.children" :key="ic" class="selected-item ">
          {{c.title}}
          <i @click="handleClearItem(index, ic)" class="icon-close color-red">x</i>
        </span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selected',
  props: {
    value: {
      type: Array,
      default: (() => [])
    },
    selectCount: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      selectTotal: 0,
      allTotal: 0,
      list: [],
      retValue: [],
      retName: []
    }
  },
  watch: {
    value(val) {
      this.list = val
      this.countAllTotal(this.list)
      this.countSelectTotal(this.list)
    },
    selectCount(val) {
      this.selectTotal = val
    }
  },
  methods: {
    countAllTotal(list) {
      let count = list.length
      list.forEach((p, ip) => {
        count += 1
        p.children.forEach((c, ic) => {
          count +=1
        })
      })
      this.allTotal = count
    },
    countSelectTotal(list) {
      let count = 0
      list.forEach((p, ip) => {
        if (p.checked) {
          count += 1
        }
        p.children.forEach((c, ic) => {
          if (c.checked) {
            count += 1
          }
        })
      })
      if (count !== 0) {
        count += list.length
      }
      this.selectTotal = count
    },
    handleClearAll() {
      if (this.provinceTreeList.length === 0) {
        return
      }
      this.provinceTreeList.forEach((p, ip) => {
        if (p.checked) {
          p.checked = false
        }
        p.children.forEach((c, ic) => {
          if (c.checked) {
            c.checked = false
            c.indeterminate = false
          }
        })
        p.indeterminate = false
      })
      this.selectTotal = 0
      this._emit(this.provinceTreeList, [], [])
    },
    handleClearItem(ip, ic) {
      if (this.provinceTreeList.length === 0) {
        return
      }
      // 情况1
      // // 只修改原值
      // if (typeof ic === 'undefined') {
      //   const len = this.provinceTreeList[ip].children.length
      //     this.provinceTreeList[ip].checked = false
      //   for (let i = 0; i < len; i++) {
      //     this.provinceTreeList[ip]['children'][i]['checked'] = false
      //   }
      // } else {
      //   this.provinceTreeList[ip]['children'][ic]['checked'] = false
      // }

      // // 返回选择值
      // const retChecked = []
      // this.provinceTreeList.forEach((p, ip) => {
      //   if (p.checked) {
      //     retChecked.push(p)
      //   } else {
      //     p.children.forEach((c, ic) => {
      //     if (c.checked) {
      //       retChecked.push(c)
      //     }
      //    })
      //   }
      // })
      // this._emit(this.provinceTreeList, this.retValue, this.retName)

      // 情况2
      // // 只修改原值
      if (typeof ic === 'undefined') {
        const len = this.provinceTreeList[ip].children.length
        this.provinceTreeList[ip].checked = false
        for (let i = 0; i < len; i++) {
          this.provinceTreeList[ip]['children'][i]['checked'] = false
        }
      } else {
        this.provinceTreeList[ip]['children'][ic]['checked'] = false
      }     

      this.handleChangeProvinceTree()
      this.countSelectTotal(this.provinceTreeList)
    }
  },
  mounted() {
    this.selectTotal = this.selectCount
    this.list = this.value
    this.countAllTotal(this.list)
    this.countSelectTotal(this.list)
  }
}
</script>
