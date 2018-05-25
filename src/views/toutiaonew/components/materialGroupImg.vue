
<style scoped>
.update{line-height: 1.42857143;}

</style>
<template>
    <div class="update">
        组图
    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "materialGroupImg",
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