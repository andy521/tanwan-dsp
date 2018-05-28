<template>
    <span>
        <span @click="specialModel = true" class="sm">创意标题特殊符号说明
            <Icon style="cursor:pointer;" type="document-text"></Icon>
        </span>
        <Modal v-model="specialModel" width="1000px" title="创意标题特殊符号说明">
            <img width="100%" src="https://p3.pstatp.com/origin/353c0020e662a48ef2f8.png">
        </Modal>
    </span>
</template>

<script>
export default {
    name: "titleDescription",
    data() {
        return {
            specialModel: false, //创意标题特殊符号说明  
        };
    }
};
</script>
