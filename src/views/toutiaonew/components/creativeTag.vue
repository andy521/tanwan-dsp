<style scoped>
.creativetag{}
.inp{
  flex: 1;
  min-width: 200px;
  vertical-align: middle;
}
input.ivu-input {
  border-radius: 0
}
.btn-add{
  flex: 0 0 60px;
  width: 60px;
  vertical-align: middle;
}
.btn-add button {
  border-radius: 0;
  width: 100%;
}
.creativetag .tag-panel {
  border: 1px solid #e8e8e8;
  border-top: transparent;
  padding: 10px;
}
</style>
<template>
  <div class="creativetag">
    <Row type="flex" justify="space-between">
      <Col class="inp">
        <Input @on-enter="handleTageChange" v-model="tagStr" placeholder="以英文逗号分隔,最多20个标签,且每个标签长度不超过10个字符"></Input>
      </Col>
      <Col class="btn-add">
        <Button @click="handleTageChange">添加</Button>
      </Col>
    </Row>
    <div v-if="tagList.length !== 0" class="tag-panel">
      <Tag v-if="tag !== ''" @on-close="handleClose" v-for="(tag, i) of tagList" :name="tag" :key="i" class="tag" type="border" closable>{{tag}}</Tag>
    </div>
  </div>
</template>
<script>
import Axios from '@/api/index'
export default {
  name: 'creativeTag',
  props: {
    tags: {
      type: Array,
      default: (() => [])
    }
  },
  data(){
    return {
      unqTagList: new Set(),
      tagList: [],
      tagStr: ''
    }
  },
  watch: {
    tags(newVal) {
      this.addTag(newVal)
    }
  },
  mounted() {
    this.addTag(this.tags)
  },
  methods: {
    handleClose(e, name) {
      this.deleteTag(name)
      this.$emit('on-change', this.tagList)
    },
    handleTageChange() {
      if (this.tagStr === '') {
        return this.$emit('on-change', [])
      }
      const currStrList = this.tagStr.split(',')
      this.addTag(currStrList)
      this.tagStr = ''
      this.$emit('on-change', this.tagList)
    },
    deleteTag(name) {
      if (typeof name === 'string' && name === '') {
        this.tagList = []
        this.$emit('on-change', [])
        return
      }
      if (this.unqTagList.has(name)) {
        this.unqTagList.delete(name)
      }
      this.tagList = [...this.unqTagList]
    },
    addTag(list) {
      if (list && list.length === 0) {
        return
      }
      list.forEach(val => {
        this.unqTagList.add(val)
      })
      this.tagList = [...this.unqTagList]
    }
  }
}
</script>
