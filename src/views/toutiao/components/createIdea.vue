<style scoped>
.create {
  border: 1px solid #f5f5f5;
  background: #fff;
  padding: 5px;
  margin: 5px 0;
}
.img {
  display: block;
  width: 100%;
}
</style>
<template>
    <div class="create">
        <div class="tit">{{title}}</div>
        <div class="slice">
            <Carousel v-model="slice" :dots="dots" :arrow="arrow">
                <Carousel-item v-for="(item,index) in image_info" :key="this">
                    <img class="img" :src="item.url" />
                </Carousel-item>
            </Carousel>
        </div>
        <!-- <div class="source">
            <Icon type="volume-medium" color="#999"></Icon> <span class="txt">{{source}}</span>
        </div> -->
    </div>
</template>
<script>
export default {
    name: 'createIdea',
    props: ["title", "image_info", "source"],
    data() {
        return {
            slice: 0,
        }
    },
    computed: {
        //指示器的显示时机
        dots() {
            let dots = "none";
            if (this.image_info.length > 1) {
                dots = "outside"
            }
            return dots;
        },
        //切换箭头的显示时机
        arrow() {
            let arrow = "never";
            if (this.image_info.length > 1) {
                arrow = "hover"
            }
            return arrow;
        }
    }
}
</script>