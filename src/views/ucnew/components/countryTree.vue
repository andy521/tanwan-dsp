<style scoped>
.country-tree{
  max-width: 800px;
}
.country-tree .country-content{
  margin-top: 10px;
  padding: 10px;
}
.country-border{
  border: 1px solid #eee; 
}
</style>
<template>
  <div class="country-tree">
    <selected @on-change="handleProvinceChange" class="country-border"></selected>
    <div class="country-content country-border">
      <Select @on-change="handleProvinceChange" :loading="loading" loading-text="加载中，请稍后..." style="width:200px">
        <Option v-for="(p, ip) in countyList" :value="p.value" :key="ip">{{ p.name }}</Option>
      </Select>
      <Select @on-change="handleCityChange" :loading="loading" loading-text="加载中，请稍后..." style="width:200px">
        <Option v-for="(c, ic) in currProivnceList" :value="c.value" :key="ic">{{ c.name }}</Option>
      </Select>
      <div><Checkbox on-change="handleSelectAll">全选</Checkbox></div>
      <div>
        <CheckboxGroup v-model="selectList">
          <Checkbox v-if="currCity.length !== 0" v-for="(val, i) in currCity" :key="i" :label="val.value"><span>{{val.name}}</span></Checkbox>
        </CheckboxGroup>
      </div>
    </div>
  </div>
</template>
<script>
import selected from './selected'
export default {
  name: 'countryTree',
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
      loading: false,
      countyList: [],
      currProivnceList: [],
      currCity: [],
      selectList: []
    }
  },
  watch: {
    value(val) {
      this.countyList = val
    }
  },
  methods: {
    handleSelectAll(val) {
      console.log(val)
    },
    handleCityChange(val) {
     this.currProivnceList.forEach(p => {
        if (p.value === val) {
          this.currCity = p.children
        }
      })
    },
    handleProvinceChange (val) {
      this.countyList.forEach(p => {
        if (p.value === val) {
          this.currProivnceList = p.children
        }
      })
    }
  },
  mounted() {
    this.countyList = this.value
  }
}
</script>
