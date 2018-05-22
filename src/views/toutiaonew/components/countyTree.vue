
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
            <div class="city_title">省份</div>
            <div class="city_box">
                <div class="item" v-for="item in province_list" @click="checkedprovince(item)">
                    {{item.name}}
                    <Icon type="chevron-right" size="10" class="more_icon" v-if="item.cityList||item.countyList"></Icon>
                </div>
            </div>
        </div>

        <div class="city_main" style="border-left:none;" v-if="province">
            <div class="city_title">城市</div>
            <div class="city_box">
                <div class="item" v-for="item in province.cityList" @click="checkedcity(item)">
                    {{item.name}}
                    <Icon type="chevron-right" size="10" class="more_icon" v-if="item.countyList"></Icon>
                </div>
            </div>
        </div>

        <div class="city_main" style="border-left:none;" v-if="county">
            <div class="city_title">县区
                <span class="clearcity" @click="Allcounty()">全选</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="item in county.countyList" @click="checkedcounty(item)">
                    <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon" v-if="item.checked"></Icon>
                    <Icon type="android-checkbox-outline-blank" color="#dddee1" size="18" class="icon" v-else></Icon>
                    {{item.name}}
                </div>
            </div>
        </div>

        <div class="city_main" style="margin-left:20px;" v-if="checked_list.length>0">
            <div class="city_title">已选
                <span class="clearcity" @click="removeAllcounty()">全部清空</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="item in checked_list">
                    <Icon type="android-checkbox" color="#2d8cf0" size="18" class="icon"></Icon>
                    {{item.name}}
                    <span @click="removecounty(item)">
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
    name: "countyTree",
    props: ["value"],
    data() {
        return {
            ids: [],
            searchcity: "",
            province_list: [],
            province: "",
            county: ""
        }
    },
    mounted() {
        this.getProvince();
        this.ids = this.value;
    },
    methods: {
        //获取省市区
        getProvince() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getProvince'
            }).then(res => {
                if (res.ret == 1) {
                    this.ad_province(res.data)
                }
            }).catch(err => {
                console.log('获取省市列表失败' + err);
            })
        },
        //省添加checked
        ad_province(data) {
            data.forEach(v => {
                if (v.countyList) {
                    v.countyList.forEach(v => {
                        v.checked = false;
                        this.ids.forEach(item => {
                            if (item == v.value) {
                                v.checked = true;
                            }
                        })
                    })
                }
                if (v.cityList) {
                    v.cityList.forEach(v => {
                        if (v.countyList) {
                            v.countyList.forEach(v => {
                                v.checked = false;
                                this.ids.forEach(item => {
                                    if (item == v.value) {
                                        v.checked = true;
                                    }
                                })
                            })
                        }
                    })
                }
            })
            this.province_list = data;
        },
        //选择省
        checkedprovince(item) {
            if (item.cityList) {
                this.province = item;
                this.county = "";
            }
            else if (item.countyList) {
                this.county = item;
                this.province = "";
            }
            else {
                this.province = "";
                this.county = "";
            }
        },

        //选择城市
        checkedcity(item) {
            if (item.countyList) {
                this.county = item;
            }
        },

        //删除县区
        removecounty(v) {
            v.checked = false;
            if (v.countyList) {
                v.countyList.forEach(v => {
                    v.checked = false;
                })
            }
            if (v.cityList) {
                v.cityList.forEach(v => {
                    v.checked = false;
                    if (v.countyList) {
                        v.countyList.forEach(v => {
                            v.checked = false;
                        })
                    }
                })
            }
        },

        //选择县区
        checkedcounty(item) {
            item.checked = !item.checked;
        },
        //全选县区
        Allcounty() {
            this.county.countyList.forEach(v => {
                v.checked = true;
            });
        },


        //全部清空
        removeAllcounty() {
            this.ids=[];
            this.ad_province(this.province_list);
        }
    },
    computed: {
        checked_list() {
            let list = [], ids = [];
            this.province_list.forEach(v => {
                if (v.countyList) {
                    v.countyList.forEach(v => {
                        if (v.checked) {
                            list.push(v);
                        }
                    });
                }
                if (v.cityList) {
                    v.cityList.forEach(v => {
                        if (v.countyList) {
                            v.countyList.forEach(v => {
                                if (v.checked) {
                                    list.push(v);
                                }
                            });
                        }
                    });
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