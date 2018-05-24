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
.regions-box {
  padding: 10px;
  max-width: 800px;
  border: 1px solid #eee;
}
.scroll-y{
  max-height: 400px;
  overflow-y: scroll;
}
</style>
<template>
  <div>
    <div class="regions-box">
      <div class="country-tree">
        <div class="header">
          <div class="selected-count">
            已选<span>{{selectTotal}}</span><i>/</i><span>{{allTotal}}</span>
          </div>
          <div class="btn-clear color-red" @click="handleClearAll">清除全部</div>
        </div>
        <div v-if="provinceTreeList.length !== 0" class="selected-content">
          <span v-if="item.checked" v-for="(item, index) in provinceTreeList" :key="index" class="selected-item">
            {{item.title}}
            <i @click="handleClearItem(index)" class="icon-close color-red">x</i>
          </span>
          <span v-if="!item.checked" v-for="(item, index) in provinceTreeList" :key="index">
            <span v-if="c.checked" v-for="(c, ic) in item.children" :key="ic" class="selected-item ">
              {{c.title}}
              <i @click="handleClearItem(index, ic)" class="icon-close color-red">x</i>
            </span>
          </span>
        </div>
      </div>    
      <div class="scroll-y">
        <Tree @on-check-change="handleChangeProvinceTree" :data="provinceTreeList" show-checkbox></Tree>
      </div>
    </div>
  </div>
</template>
<script>
import selected from './selected'
export default {
  name: 'ProvinceTree',
  components: {
    selected
  },
  props: {
    value: {
      type: Array,
      default: (() => [])
    }
  },
  data() {
    return {
      provinceTreeList: [],
      selectTotal: 0,
      allTotal: 0,
      retValue: [],
      retName: []
    }
  },
  watch: {
    value(val) {
      this.provinceTreeList = val
      this.countAllTotal(this.provinceTreeList)
      this.countSelectTotal(this.provinceTreeList)
    }
  },
  mounted() {
    this.provinceTreeList = this.value
    this.countAllTotal(this.provinceTreeList)
    this.countSelectTotal(this.provinceTreeList)
  },
  methods: {
    // selected
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
    },
    // tree
    handleChangeProvinceTree(provinceList) {
      let retName = []
      let retValue = []

      // 情况1
      // const len = provinceList.length
      // provinceList.forEach((city, index) => {
      //   retName.push(city.title)
      //   retValue.push(city.value)
      // })

      // 情况2
      let len = 0
      this.provinceTreeList.forEach((p, ip) => {
        if (p.checked && !p.indeterminate) {
          retValue.push(p.value)
          retName.push(p.title)
          ++len
        } else if (!p.checked && p.indeterminate) {
          let cName = []
          p.children.forEach((c, ic) => {
            if (c.checked) {
              retValue.push(c.value)
              cName.push(c.title)
              ++len
            }
          })
          retName[ip] = `${p.title}(${cName.join('、')})`
        }
      })

      this.selectTotal = len
      this.retValue = retValue
      this.retName = retName

      this._emit(this.provinceTreeList, this.retValue, this.retName)
    },
    _emit(list, checkedIdList, checkNameList) {
      this.$emit('on-change', list, checkedIdList, checkNameList)
    }
  }
}
</script>
