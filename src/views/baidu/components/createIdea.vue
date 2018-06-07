<style scoped>
.create {
    padding: 5px;
    margin: 5px 0;   
    border: 1px solid #f5f5f5;
    background: #fff;
}
.img {
  display: block;
  width: 100%;
}
</style>
<template>
    <div class="create">
        <div class="tit">{{title}}</div>
        <Carousel v-if="imageUrl.length > 0" v-model="slice" :dots="dots" :arrow="arrow">
            <Carousel-item v-for="(url, index) in imageUrl" :key="index">
                <img class="img" :src="url.image" />
            </Carousel-item>
        </Carousel>
        <div v-if="source.length > 0" class="notwrap">
            <Icon type="volume-medium" color="#999"></Icon> <span class="txt">{{source}}</span>
        </div>
    </div>
</template>
<script>
export default {
  name: 'createIdea',
  props: {
    title: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: Array,
      default: () => []
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      slice: 0,
      dots: 'none',
      arrow: 'never'
    }
  },
  watch: {
    imageUrl(newVal) {
      if (this.imageUrl.length > 1) {
        this.dots = 'inside'
        this.arrow = 'hover'
      } else {
        this.dots = 'none'
        this.arrow = 'never'
      }
    }
  }
}
</script>
