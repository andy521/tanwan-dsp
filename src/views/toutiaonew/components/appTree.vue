
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
            <div class="city_title">按分类
                <span class="clearcity" @click="AllProvince()">全选</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="item in adtags_list" @click="checkedprovince2(item)">
                    <span @click="checkedprovince(item)" v-if="item.subItems">
                        <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                        <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    </span>
                    <span v-else>
                        <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                        <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    </span>
                    {{item.name}}
                    <Icon type="chevron-right" size="10" class="more_icon" v-if="item.subItems"></Icon>
                </div>
            </div>
        </div>

        <div class="city_main" style="border-left:none;" v-if="adtags">
            <div class="city_title">{{adtags.name}}
                <span class="clearcity" @click="AllCity()">全选</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="item in adtags.subItems" @click="checkedcity(item)">
                    <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                    <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    {{item.name}}
                    <Icon type="chevron-right" size="10" class="more_icon" v-if="item.subItems"></Icon>
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
    name: "appTree",
    props: ["value"],
    data() {
        return {
            ids: [],
            searchcity: "",
            adtags_list: [],
            adtags: ""
        }
    },
    mounted() {
        this.getTag();
        this.ids = this.value;
    },
    methods: {
        //获取app行为
        getTag() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getAppType'
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_adtags(res.data.android);
                    console.log(res.data.android)
                }
            }).catch(err => {
                console.log('获取app行为' + err);
            })
        },
        //省添加checked
        ad_adtags(data) {
            data.forEach(v => {
                v.checked = false;
                this.ids.forEach(item => {
                    if (item == v.value) {
                        v.checked = true;
                    }
                })
                if (v.subItems) {
                    v.subItems.forEach(v => {
                        v.checked = false;
                        this.ids.forEach(item => {
                            if (item == v.value) {
                                v.checked = true;
                            }
                        })
                    })
                }
            })
            this.adtags_list = data;
        },
        //选择省
        checkedprovince(item) {
            item.checked = !item.checked;
            if (item.subItems) {
                item.subItems.forEach(v => {
                    v.checked = item.checked;
                });
                this.adtags = item;
            } else {
                this.adtags = "";
            }
        },
        checkedprovince2(item) {
            if (item.subItems) {
                this.adtags = item;
            } else {
                item.checked = !item.checked;
                this.adtags = "";
            }
        },
        //选全省
        AllProvince() {
            this.adtags_list.forEach(item => {
                item.checked = true;
            });
        },
        //选全市
        AllCity() {
            this.adtags.subItems.forEach(item => {
                item.checked = true;
            });
            this.citylen();
        },
        //选择城市
        checkedcity(item) {
            item.checked = !item.checked;
            this.citylen();
        },
        //城市全选，父级加1
        citylen() {
            let len = 0;
            this.adtags.subItems.forEach(item => {
                if (item.checked) {
                    len++;
                }
            });
            if (this.adtags.subItems.length == len) {
                this.adtags.checked = true;
            } else {
                this.adtags.checked = false;
            }
        },
        //删除城市
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
            this.ids=[];
            this.ad_adtags(this.adtags_list);
        }
    },
    computed: {
        checked_list() {
            let list = [], ids = [];
            this.adtags_list.forEach(v => {
                if (v.checked) {
                    list.push(v);
                } else {
                    if (v.subItems) {
                        v.subItems.forEach(v => {
                            if (v.checked) {
                                list.push(v);
                            }
                        });
                    }
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