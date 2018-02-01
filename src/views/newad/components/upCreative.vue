<template>
    <div class="creative">    
        <Input v-model="value" placeholder="Enter something..." style="width: 300px"></Input>
        {{data}}
    </div>
</template>
<script>
    export default {
        name: 'up-creative',
        props:{
            data: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                value: ''
            }
        }
    }
</script>