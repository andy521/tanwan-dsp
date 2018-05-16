<style scoped>
.transfer-tree{
  margin-top: 20px;
}
.transfer-tree .search-content{
  width: 450px;
}
.transfer-tree .title{
  margin: 0;
  padding: 0 12px;
  width: 100%;
  border-bottom: 1px solid #dee4f5;
  background-color: #fafbfe;
  color: #333;
  font-size: 14px;
}
.transfer-tree .content{
  padding: 10px 15px;
  width: inherit;
  height: inherit;
  overflow-y: scroll;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.g-flex{
  display: flex;
  position: relative;
  margin-top: 20px;
  width: 450px;
}
.g-flex-item{
  height: 300px;
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
</style>
<template>
  <div class="transfer-tree">
    
    <div class="search-content">
      <Input v-model="search" :placeholder="searchPlaceholder" @on-blur="handlereset" @on-enter="handleSearch">
      <Button slot="append" icon="ios-search"  @click="handleSearch">搜索</Button>
      </Input>
    </div>

    <div v-if="deep === 2" class="g-flex">
      <div :class="{'col-10': isCol10}" class="g-flex-item">
        <div class="title">{{colTitle.col1}}</div>
        <div class="content">
          <Tree @on-check-change="handleProvince" :data="provinceOrgin" show-checkbox></Tree>
        </div>
      </div>
      <div class="g-flex-item"></div>
    </div>

    <div v-if="deep === 3" class="g-flex">
      <div class="g-flex-item"></div>
      <div class="g-flex-item"></div>
      <div class="g-flex-item"></div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'transferTree',
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
      search: ''
    }
  },
  computed: {
    isCol10() {
      // console.log('isCol10',this.provinceOrgin.length > 0 && !this.cityOrgin.length && !this.countryOrgin.length)
      // return this.provinceOrgin.length > 0 && !this.cityOrgin.length && !this.countryOrgin.length
    }
  },
  watch: {
    data(newVal) {
      this.treeData = newVal
      this.provinceOrgin = this.getProvince(this.treeData)
    }
  },
  mounted() {
    this.treeData = this.data
    this.provinceOrgin = this.getProvince(this.treeData)
  },
  methods: {
    handleProvince(val) {
      console.log(val)
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
