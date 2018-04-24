<style scoped>
.create{
    border: 1px solid #f5f5f5;
    background: #fff;
    padding: 10px;
    margin: 5px 0;
}
.source{
    margin-top: 8px;
    line-height: 24px;
    font-size: 16px;
    color: #bbb;
}
.txt{
    margin-left: 5px;
}
.tit{
    color: #333;
    margin: 0;
    font-size: 15px;
    max-height: 44px;
    overflow: hidden;
    line-height: 24px;
    font-weight: 400;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}
.slice{
    min-height: 20px;
}
.img{
    display: block;
    width: 100%;
}
</style>
<template>
	<div class="create">
        <div class="tit">{{title}}</div>
        <div class="slice">
            <Carousel v-model="slice" dots="none">
                <Carousel-item v-for="(item,index) in url" :key="index">
                    <img class="img" :src="item"/>
                </Carousel-item>
            </Carousel>            
        </div>
        <div class="source">
            <Icon type="volume-medium"></Icon> <span class="txt">{{source}}</span>
        </div>
    </div>
</template>
<script>
    import  Axios  from "@/api/index"
	export default {
        name: 'createIdea',  
        props: {
            content: {
                type: Object,
                default () {
                    return {};
                }
            },
        },      
		data() {
			return {
                slice:0,
                title: this.content.title,
                url:this.content.pic_imgs,
                source:this.content.source
			}
        },
		methods: {
            
        },
        beforeMount(){ 
           // console.log(this.content)
        }
	}
</script>