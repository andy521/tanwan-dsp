<style scoped>
.g-flex{
  display: flex;
  position: relative;
  width: 450px;
}
.g-flex-item{
  height: 280px;
  overflow-y: auto;
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
    
    <Input v-model="search" placeholder="请输入要搜索的计划..." @on-blur="handlereset" @on-enter="handleSearch">
      <Button slot="append" icon="ios-search"  @click="handleSearch">搜索</Button>
    </Input>

    <div class="g-flex">
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
      default: (() => {})
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
      default: '请输入...'
    }
  },
  data() {
    return{
      treeData: [],
      search: ''
    }
  },
  mounted() {
    this.treeData = this.data
  },
  methods: {
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
    filterData() {}
  }
}
</script>
