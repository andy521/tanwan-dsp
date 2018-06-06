<style scoped>
</style>
<template>
    <Select @on-change="mediaChange" placeholder="请选择媒体" clearable>
        <Option value="">不限</Option>
        <Option v-for="item in media" :value="item.media_type" :key="this">{{ item.cn }}</Option>
    </Select>
</template>
<script>
import Axios from "@/api/index"
export default {
    name: 'selectMedia',
    data() {
        return {
            media: []
        }
    },
    methods: {
        //获取全部游戏     
        getMedia() {
            Axios.post('api.php', {
                action: 'api',
                opt: 'getMedia'
            }).then(res => {
                if (res.ret == '1') {
                    this.media = res.data;
                }
            }).catch(err => {
                console.log(err)
            });
        },
        //点击树节点时触发
        mediaChange(data) {
            data = data === 0 ? '' : data
            this.$emit('on-change', data);
        }
    },
    mounted() {
        this.getMedia();
    }
}
</script>