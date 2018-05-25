
<style scoped>

</style>
<template>
    <div class="update">
        大图
    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "materialBigImg",
    data() {
        return {
            name:'zhouyunlong'
        }
    },
    mounted() {
    },
    methods: {
        pushImgs(){
            console.log('添加图片')
        }
    }
}
</script>