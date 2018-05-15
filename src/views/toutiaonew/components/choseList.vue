<style lang="less">
.cholist {
  width: 600px;
  .search {
    width: 400px;
  }
  .panel{
    margin-top: 18px;
    width: 480px;
    height: 400px;
    font-size: 14px;
    color: #333;
    border: 1px solid #dee4f5;
    border-radius: 2px;
    overflow-y: auto;
    .panel-item{
      display: flex;
      justify-content: space-between;
      height: 36px;
      line-height: 36px;
      padding: 0 12px;
      cursor: pointer;
      &:hover {
       background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
}

</style>
<template>
  <div class="cholist">
    <div class="search">
      <Input v-model="search" placeholder="请输入要搜索的计划..." @on-blur="handlereset" @on-enter="handleSearch">
        <Button slot="append" icon="ios-search"  @click="handleSearch">搜索</Button>
      </Input>
    </div>
    <div class="panel">
      <div @click="handleSele(campaign)" v-for="(campaign, index) in panelList" :key="index" class="panel-item">
        <div class="name">{{campaign.campaign_name}}</div>
        <div class="type">{{campaign.landing_type_name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from '@/api/index'
export default {
  name: 'choList',
  data() {
    return {
      search: '',
      panelList: [],
      copyList: []
    }
  },
  mounted() {
    this.getCampaigns()
  },
  methods: {
    handleSele(campaign) {
      this.$emit('on-change', campaign.campaign_id)
    },
    filterData() {
      const all = this.copyList
      const filter = []
      const searchTxt = new RegExp(this.search, 'gmi')
      all.forEach(item => {
        if (item.campaign_name.search(searchTxt) != -1) {
          filter.push(item)
        }
      })
      const retNull = [{campaign_name: '无搜索结果,请重新搜索', landing_type_name: '-'}]
      this.panelList = filter.length < 1 ? retNull : filter
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
    normalizeData(list) {
      const landingType = {
        LINK: '推广落地页',
        APP: '推广应用下载',
        DPA: '产品目录'
      }
      const ret = []
      list.forEach((item) => {
        if (item.campaign_name && item.landing_type) {
          ret.push({
            campaign_id: item.campaign_id,
            campaign_name: item.campaign_name,
            landing_type: item.landing_type,
            landing_type_name: landingType[item.landing_type]
          })
        }
      })
      return ret
    },
    getCampaigns() {
      Axios.post('api.php', {
        action: 'ttAdPut',
        opt: 'getCampaigns'
      }).then((res) => {
        if (res.ret === 1) {
          this.panelList = this.copyList = this.normalizeData(res.data)
        }
      }).catch((err) => {
        console.error('choseList组件获取广告组详情失败', err)
      })
    }
  }
}
</script>
