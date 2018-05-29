<style scoped>
.creativetag .tag-panel {
  border: 1px solid #e8e8e8;
  border-top: transparent;
  padding: 10px;
}
</style>
<template>
    <div class="creativetag">
        <Input @on-enter="handleTageChange" v-model="tagStr" placeholder="以英文逗号分隔,最多20个标签,且每个标签长度不超过10个字符">
        <Button @click="handleTageChange" slot="append">添加</Button>
        </Input>

        <div v-if="tagList.length !== 0" class="tag-panel">
            <Tag v-if="tag !== ''" @on-close="handleClose" v-for="(tag, i) of tagList" :name="tag" :key="i" class="tag" closable>{{tag}}</Tag>
        </div>
    </div>
</template>
<script>
import Axios from '@/api/index'
export default {
    name: 'creativeTag',
    props: ["tags"],
    data() {
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
            if (this.tagStr.length > 10) {
                this.$Message.info("长度超过10个字符");
                return;
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
