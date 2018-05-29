<style scoped>
.regions-box{
  max-width: 800px;
  zoom: 1;
  font-size: 14px;
  color: #333;
}
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
.regions-box .country-content{
  margin-top: 10px;
  padding: 10px;
}
.color-red{
  color: #ec4f38;
}
.country-border{
  border: 1px solid #eee; 
}
</style>
<template>
  <div class="regions-box">
    <div class="country-tree">
      <div class="header">
        <div class="selected-count">
          已选<span>{{selectTotal}}</span><i>/</i><span>{{allTotal}}</span>
        </div>
        <div class="btn-clear color-red" @click="handleClearAll">清除全部</div>
      </div>
      <div v-if="retName.length !== 0" class="selected-content">
        <span v-if="name" v-for="(name, i) in retName" :key="i" class="selected-item">
          {{name}}
          <i @click="handleClearItem(i, name)" class="icon-close color-red">x</i>
        </span>
      </div>
    </div>

    <div class="country-content country-border">
      <Select @on-change="handleProvinceChange" style="width:200px">
        <Option v-for="(p, ip) in countyList" :value="p.value" :key="ip">{{ p.name }}</Option>
      </Select>
      <Select @on-change="handleCityChange" style="width:200px">
        <Option v-for="(c, ic) in currCity" :value="c.value" :key="ic">{{ c.name }}</Option>
      </Select>
      <div><Checkbox v-model="isSelectAll" @on-change="handleSelectAll">全选</Checkbox></div>
      <div>
        <CheckboxGroup v-model="retValue">
          <Checkbox @click.native="handleCheckBox(county)" :true-value="county.value" v-if="currCity.length !== 0" v-for="(county, i) in currCounty" :key="i" :label="county.value"><span>{{county.name}}</span></Checkbox>
        </CheckboxGroup>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'countryTree',
  props: {
    value: {
      type: Array,
      default: (() => [])
    },
    checkedList: {
      type: Array,
      default: (() => [])
    }
  },
  data() {
    return {
      isSelectAll: false,
      countyList: [],
      currCity: [],
      currCounty: [],
      selectTotal: 0,
      allTotal: 0,
      retValue: [],
      retName: [],
      currSeleName: new Set(),
      currSeleValue: new Set()
    }
  },
  watch: {
    value(val) {
      this.countyList = val
      this.countAllTotal(this.countyList)
    },
    retValue(val, oldVal) {
      this.selectTotal = val.length
    }
  },
  methods: {
    selectAllShow(len, count) {
      if (len === count) {
        this.isSelectAll = true
      } else {
        this.isSelectAll = false
      }
    },
    countAllTotal(list) {
      let count = list.length
      list.forEach((p, ip) => {
        p.children.forEach((c, ic) => {
          c.children.forEach(() => {
            count += 1
          })
        })
      })
      this.allTotal = count
    },
    checkedItem(retValue, currCounty) {
      const len = currCounty.length
      if (len === 0) {
        return
      }
      let count = 0
      currCounty.forEach(county => {
        retValue.forEach(value => {
          if (value === county.value) {
            county.checked = true
            ++count
          } else {
            county.checked = false
          }
        })
      })

      this.selectAllShow(len, count)
    },
    handleCheckBox(val) {
      if (!val.checked) {
        val.checked = true
        this.currSeleName.add(val.name)
        this.currSeleValue.add(val.value)
      } else {
        val.checked = false
        this.currSeleName.delete(val.name)
        this.currSeleValue.delete(val.value)
      }
      this.retName = [...this.currSeleName]
      this.$emit('on-change', this.countyList, this.retValue, this.retName)
    },
    handleClearAll() {
      this.retValue = []
      this.retName = []
      this.currSeleValue.clear()
      this.currSeleName.clear()
      this.isSelectAll = false

      this.countyList.forEach((p, ip) => {
        p.children.forEach((city, ici) => {
          city.children.forEach((county, ico) => {
            county.checked = false
          })
        })
      })
      this.$emit('on-change', this.countyList, [], [])
    },
    handleClearItem(i, name) {
      this.retName.splice(i, 1)
      this.retValue.splice(i, 1)

      this.countyList.forEach((p, ip) => {
        p.children.forEach((city, ici) => {
          city.children.forEach((county, ico) => {
            if (county.name === name) {
              this.currSeleName.delete(county.name)
              this.currSeleValue.delete(county.value)
              county.checked = false
            }
          })
        })
      })
      this.$emit('on-change', this.countyList, this.retValue, this.retName)
    },
    handleSelectAll(flag) {
      if (flag) {
        this.currCounty.forEach(val => {
          this.currSeleName.add(val.name)
          this.currSeleValue.add(val.value)
          val.checked = true
        })
      } else {
        this.currCounty.forEach(val => {
          this.currSeleName.delete(val.name)
          this.currSeleValue.delete(val.value)
          val.checked = false
        })
      }

      this.retValue = [...this.currSeleValue]
      this.retName = [...this.currSeleName]
      this.$emit('on-change', this.countyList, this.retValue, this.retName)
    },
    handleCityChange(val) {
      if (this.currCity.length === 0) {
        return
      }
      this.currCity.forEach(c => {
        if (c.value === val) {
          this.currCounty = c.children
        }
      })
      this.checkedItem(this.retValue, this.currCounty)
    },
    handleProvinceChange (val) {
      if (this.countyList.length === 0) {
        return
      }
      this.countyList.forEach(p => {
        if (p.value === val) {
          this.currCity = p.children
        }
      })
    }
  },
  mounted() {
    this.countyList = this.value
    this.countAllTotal(this.countyList)
  }
}
</script>
