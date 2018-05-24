
<style scoped>
.city_main {
  line-height: 36px;
  width: 250px;
  border: solid 1px #dee4f5;
  float: left;
}
.city_title {
  background-color: #fafbfe;
  border-bottom: solid 1px #dee4f5;
  padding: 0 15px;
}
.city_box {
  height: 250px;
  overflow: auto;
}
.item {
  padding: 0 15px;
  cursor: pointer;
  display: block;
}
.item:hover {
  background: #f8f8f8;
}
.more_icon {
  float: right;
  line-height: 36px;
}
.icon {
  line-height: 36px;
  float: left;
  margin-right: 5px;
}
.clearcity {
  float: right;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
<template>
    <div>
        <div class="city_main">
            <div class="city_title">手机品牌
                <span class="clearcity" @click="AllProvince()">全选</span>
            </div>
            <div class="city_box">
                <CheckboxGroup v-model="ids" @on-change="changeIds();">
                    <label class="item" v-for="item in datas">
                        <Checkbox :label="item.value" :key="this">{{item.name}}</Checkbox>
                    </label>
                </CheckboxGroup>
            </div>
        </div>
        <div class="city_main" style="margin-left:20px;" v-if="ids.length>0">
            <div class="city_title">已选
                <span class="clearcity" @click="removeAllcity()">全部清空</span>
            </div>
            <div class="city_box">
                <CheckboxGroup v-model="ids" @on-change="changeIds();">
                    <template v-for="subitem in ids">
                        <label class="item" v-for="item in datas" v-if="subitem==item.value">
                            <Checkbox :label="item.value" :key="this">{{item.name}}</Checkbox>
                            <Icon type="close-round" size="10" class="more_icon"></Icon>
                        </label>
                    </template>
                </CheckboxGroup>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "deviceTree",
    props: ["value", "datas"],
    data() {
        return {
            ids: [],
        }
    },
    mounted() {
        this.ids = this.value;
    },
    watch: {
        value() {
            this.ids = this.value;
        }
    },
    methods: {
        //选择
        changeIds() {
            this.$emit('input', this.ids);
        },
        //选全
        AllProvince() {
            let ids = [];
            this.datas.forEach(item => {
                ids.push(item.value)

            });
            this.ids = ids;
            this.$emit('input', this.ids);
        },
        //全部清空
        removeAllcity() {
            this.ids = [];
            this.$emit('input', this.ids);
        }
    }
}
</script>