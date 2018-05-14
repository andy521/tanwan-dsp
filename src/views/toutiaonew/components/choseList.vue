<style scoped>

</style>
<template>
  <div class="cholist">
     <div class="search">
        <Input v-model="search" placeholder="请输入要搜索的计划..." @on-enter="getSearch">
          <Button slot="append" icon="ios-search"  @click="getSearch"></Button>
        </Input>
      </div>
      <div class="panel">
        <div class="panel-item"></div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'choList',
  props: {
    title: String,
    data: {
      type: Array,
      default: () => {[]}
    }
  },
  data() {
    return {
      panelList: []
    }
  },
  mounted() {
    this.panelList = this.data
  },
  methods: {
    getSearch() {}
  }
}
</script>
