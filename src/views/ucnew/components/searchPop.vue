<style scoped>
.searchpop .content{
  padding: 28px;
  display: block;
  min-width: 120px;
}
.desc{
  margin: 15px 0;
  color: #aaa;
}
.text-center{
  text-align:center
}
.text-right{
  text-align:right
}
.btn-more{
  width: 60%;
}
</style>
<template>
  <div class="searchpop">
    <Button @click="isModal = !isModal" type="primary">{{title}}</Button>
    <Modal
        v-model="isModal"
        :title="title"
        @on-ok="handleOk">
        <div class="content">
          <Row>
            <Col span="20">
              <Input v-model="seeds" type="textarea" autofocus :rows="4" placeholder="输入关键词，最多输入5个，每个占一行"></Input>
            </Col>
            <Col span="4" class="text-center">
              <Button @click="handleSearch" type='ghost'>推荐</Button>
            </Col>
          </Row>
          <div class="desc">以下为您推荐{{recommendLen}}条结果，您最多可以选择{{maxNum}}个关键词</div>
          <Table></Table>
          <div class="text-center margin-top-10">
            <Button @click="handleSearchMore" type='dashed' long>显示更过</Button>
          </div>
        </div>
        <div slot="footer" class="text-right">
            <Button @click="handleOk" type='ghost'>添加</Button>
            <Button @click="handleDownload" type='ghost'>下载</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import Axios from '@/api/index'
export default {
  name: 'searchPop',
  props: {
    maxNum: {
      type: Number,
      default: 150
    },
    title: {
      type: String,
      default: '标题'
    },
    type: {
      type: String,
      default: 'word'
    }
  },
  data() {
    return {
      isModal: false,
      recommendLen: 0,
      seeds: '',
      excludes: '',
      maxSearchNum: 20,
      searchList: []
    }
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$emit('on-search', this.searchList)
    },
    handleDownload() {},
    handleSearchMore() {
      this.handleSearch()
    },
    handleSearch(maxNum) {
      if (typeof maxNum === 'undefined') {
        maxNum = this.maxSearchNum
      }
      const params = {
        type: this.type,
        maxNum: maxNum,
        seeds: this.seeds,
        excludes: this.excludes
      }
      this.getRecommend(params)
    },
    // 获取关键词推荐、站点推荐、APP 推荐结果. params包括：maxNum，excludes，seeds，type
    // type包含：app ： app推荐 ，word ： 关键词推荐 ，url ： 站点推荐
    getRecommend(params) {
      console.log(params)
      Axios.post('api.php', {
        action: 'ucAdPut',
        opt: 'getRecommend',
        account_id: this.$route.query.account,
        type: params.type,
        maxNum: params.maxNum,
        seeds: params.seeds,
        excludes: params.excludes
      })
        .then(res => {
          if (res.ret === 1) {
            this.searchList = res.data
            console.log('获取关键词推荐、站点推荐、APP 推荐结果', res.data)
          }
        })
        .catch(err => {
          console.log(`获取${this.title}错误：` + err)
        })
    }
  }
}
</script>
