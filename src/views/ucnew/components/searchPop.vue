<style scoped>
.searchpop .content{
  padding: 28px;
  display: block;
  min-width: 120px;
}
.searchpop .desc{
  padding: 20px;
}
</style>
<template>
  <div class="searchpop">
    <Button @click="!isModal" type="primary">{{title}}</Button>
    <Modal
        v-model="isModal"
        :title="title"
        @on-ok="handleOk"
        @on-cancel="!isModal">
        <div class="content">
          <Row>
            <Col span="20">
              <Input></Input>
            </Col>
            <Col span="4">
              <Button type='ghost'>推荐</Button>
            </Col>
          </Row>
          <div class="desc">以下为您推荐{{recommendLen}}条结果，您最多可以选择{{maxSelect}}个关键词</div>
          
        </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: 'searchPop',
  props: {
    maxSelect: {
      type: Number,
      default: 150
    },
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      isModal: false,
      recommendLen: 0,
    }
  },
  mounted() {},
  methods: {
    handleOk() {}
  }
}
</script>
