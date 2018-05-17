<style scoped>
.transfer-tree .search-content{
  width: 450px;
}
.transfer-tree .title{
  margin: 0;
  padding: 0 12px;
  width: 100%;
  border: 1px solid #dddee1;
  border-bottom: none;
  background-color: #fafbfe;
  color: #333;
  font-size: 14px;
}
.transfer-tree .content{
  width: 100%;
  height: 243px;
  overflow-y: scroll;
  border: 1px solid #dddee1;
  box-sizing: border-box;
}
.g-flex{
  display: flex;
  position: relative;
  margin-top: 20px;
  width: 450px;
}
.g-flex-item{
  height: 280px;
}
.col-10{
  flex: 0 0 100%;
  width: 100%;
}
.col-5{
  flex: 0 0 50%;
  width: 50%;
}
.col-3{
  flex: 0 0 33.3333%;
  width: 33.3333%;
}
.transfer-tree .filter-tree-content{
  margin: 20px 0 0;
}
</style>
<template>
  <div class="transfer-tree">
    
    <div class="search-content">
      <Input v-model="search" :placeholder="searchPlaceholder" @on-blur="handlereset" @on-enter="handleSearch">
      <Button slot="append" icon="ios-search"  @click="handleSearch">搜索</Button>
      </Input>
    </div>

    <Row>
      <Col span="16">
        <div v-if="deep === 2 && provinceOrgin && provinceOrgin.length !== 0" class="g-flex">
          <div :class="{'col-10': isCol10, 'col-5': isCol5 && deep === 2}" class="g-flex-item">
            <div class="title">{{colTitle.col1}}</div>
            <div class="content">
              <!-- <Tree @on-check-change="handleProvince" :data="provinceOrgin" show-checkbox></Tree> -->
              <selec-tree @on-change="handleProvinceChange" :select-all-show="true" :data="provinceOrgin" type="province"></selec-tree>
            </div>
          </div>
          <div v-if="!isCol10" :class="{'col-5': isCol5 && deep === 2}" class="g-flex-item">
            <div class="title">{{colTitle.col1}}</div>
            <div class="content">
              <selec-tree @on-change="handleCityChange" :select-all-show="true" :data="cityOrgin" type="city"></selec-tree>
            </div>
          </div>
        </div>

        <div v-if="deep === 3" class="g-flex">
          <div class="g-flex-item"></div>
          <div class="g-flex-item"></div>
          <div class="g-flex-item"></div>
        </div>
      </Col>
      <Col span="8">
        <div class="filter-tree-content">
          <filter-tree @on-change="handleFilterChange" :value-data="valueData" :title-data="titleData"></filter-tree>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import selecTree from './selecTree';
import filterTree from './filterTree';
export default {
  name: 'transferTree',
  components: {
    selecTree,
    filterTree
  },
  props: {
    data: {
      type: Array,
      default: (() => [])
    },
    deep: {
      type: [Number,String],
      default: 2
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    searchPlaceholder: {
      type: String,
      default: '请输入搜索内容...'
    },
    colTitle: {
      type: Object,
      default: (() => ({
        col1: 'title1',
        col2: 'title2',
        col3: 'title3'
      }))
    }
  },
  data() {
    return{
      treeData: [],
      provinceOrgin: [],
      cityOrgin: [],
      countryOrgin: [],
      targetList: [], // 将要返回的数据
      search: '',
      valueData: [], // filterTree props 数据
      titleData: [], // filterTree props 数据
    }
  },
  computed: {
    isCol10() {
      if (!this.countryOrgin && this.countryOrgin.length === 'undefine') {
        return
      }
      return this.provinceOrgin.length > 0 && !this.cityOrgin.length
    },
    isCol5() {
      if (!this.countryOrgin && this.countryOrgin.length === 'undefine') {
        return
      }
      return this.provinceOrgin.length > 0 && this.cityOrgin.length > 0
    },
    isCol3() {
      if (!this.countryOrgin && this.countryOrgin.length === 'undefine') {
        return
      }
      return this.provinceOrgin.length > 0 && this.cityOrgin.length > 0 && this.countryOrgin.length > 0
    }
  },
  watch: {
    data(newVal) {
      this.treeData = newVal
      // this.provinceOrgin = this.getProvince(this.treeData)
      this.provinceOrgin = this.treeData
    }
  },
  mounted() {
    this.treeData = this.data
    this.provinceOrgin = this.treeData
  },
  methods: {
    handleFilterChange(val) {
      const value = val.value
      // if (value.length === 0) {

      // }
      // value.forEach
    },
    handleCityChange(val) {
      val.children.forEach(p => {
        if (!p.selected) {
          p.selected = true
        }
      })
      // province


      // country
      this.countryOrgin = val.children
      this.valueData = val.value
      this.titleData = val.name
      console.log('handleCityChange', val)
    },
    handleProvinceChange(val) {
      val.children.forEach(p => {
        if (!p.selected) {
          p.selected = true
        }
      })
      this.cityOrgin = val.children
      this.valueData = val.value
      this.titleData = val.name
      console.log('handleProvinceChange', val, this.valueData, this.titleData)
    },
    handlereset() {
      if (this.search === '') {
        this.panelList = this.copyList
      }
      this.filterData()
    },
    handleSearch() {
      if (this.search === '') {
        return
      }
      this.filterData()
    },
    filterData() {},
    getProvince(list) {
      console.log("list", list.length === 0)
      if (list.length === 0) {
        return
      }
      const ret = []
      list.forEach((province, ip) => {
        ret.push({})
        for(let key in province) {
          if (province.hasOwnProperty(key)) {
            if (typeof province[key] === 'object') {
              continue
            } else {
              ret[ip][key] = province[key]
            }
          }
        }
      })
      return ret
    }
  }
}
</script>
