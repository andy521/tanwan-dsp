
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
                <div class="item" v-for="item in adtags_list" @click="checkedprovince(item)">
                    <span v-if="item.subTags">
                        <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                        <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    </span>
                    <span v-else>
                        <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                        <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    </span>
                    {{item.name}}
                    <Icon type="chevron-right" size="10" class="more_icon" v-if="item.subTags"></Icon>
                </div>
            </div>
        </div>

        <div class="city_main" style="margin-left:20px;" v-if="checked_list.length>0">
            <div class="city_title">已选
                <span class="clearcity" @click="removeAllcity()">全部清空</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="item in checked_list">
                    <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon"></Icon>
                    {{item.name}}
                    <span @click="removecity(item)">
                        <Icon type="close-round" size="10" class="more_icon"></Icon>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "deviceTree",
    props: ["value"],
    data() {
        return {
            ids: [],
            searchcity: "",
            adtags_list: [],
        }
    },
    mounted() {
        this.getTag();
        this.ids = this.value;
    },
    methods: {
        //获取手机品牌
        getTag() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getPhone'
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_adtags(res.data);
                }
            }).catch(err => {
                console.log('获取手机品牌' + err);
            })
        },
        //添加checked
        ad_adtags(data) {
            data.forEach(v => {
                v.checked = false;
                this.ids.forEach(item => {
                    if (item == v.value) {
                        v.checked = true;
                    }
                })
            })
            this.adtags_list = data;
        },
        //选择
        checkedprovince(item) {
            item.checked = !item.checked;
        },
        //选全
        AllProvince() {
            this.adtags_list.forEach(item => {
                item.checked = true;
            });
        },
        //删除
        removecity(v) {
            v.checked = false;
            if (v.subItems) {
                v.subItems.forEach(v => {
                    v.checked = false;
                })
            }
        },
        //全部清空
        removeAllcity() {
            this.ids = [];
            this.ad_adtags(this.adtags_list);
        }
    },
    computed: {
        checked_list() {
            let list = [], ids = [];
            this.adtags_list.forEach(v => {
                if (v.checked) {
                    list.push(v);
                }
            });
            list.forEach(v => {
                ids.push(v.value);
            })
            this.$emit('input', ids)
            return list;
        }
    }
}
</script>