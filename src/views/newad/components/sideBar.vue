<style>
.sidediv {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    overflow: auto;
    background: #fff;
    border-right: solid 1px #eee;
}

.sidebox {
    padding: 20px;
}

.item {
    line-height: 50px;
    color: #333;
}

.title {
    font-size: 14px;
    font-weight: bold;
}

.content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    padding-left: 8px;
    line-height: 40px;
}

.content.on {
    color: #2d8cf0;
}

.content span {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.content i {
    width: 20px;
}

.item-wait {
    color: #999;
}
</style>

<template>
    <div class="sidediv">
        <div class="sidebox">
            <Button type="primary" @click="back">返回</Button>
        </div>
        <div class="sidebox">
            <div class="item" v-for="(item,index) in current">
                <div v-if="index > step[0]">
                    <div class="title item-wait">{{item.name}}</div>
                    <div class="item-wait" v-for="(subitem,subindex) in item.list">
                        <div class="content">
                            <span>{{subitem.name}}</span>
                        </div>
                    </div>
                </div>
                <div v-else-if="index == step[0]">
                    <div class="title">{{item.name}}</div>
                    <div v-for="(subitem,subindex) in item.list">
                        <div class="content" v-if="subindex< step[1]" @click="navigation(index,subindex)">
                            <span>{{subitem.name}}</span>
                            <i class="more">
                                <Icon type="android-done"></Icon>
                            </i>
                        </div>
                        <div class="content on" v-else-if="subindex== step[1]">
                            <span>{{subitem.name}}</span>
                            <i class="more">
                                <Icon type="more"></Icon>
                            </i>
                        </div>
                        <div class="content item-wait" v-else>
                            <span>{{subitem.name}}</span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="title">{{item.name}}</div>
                    <div v-for="(subitem,subindex) in item.list">
                        <div class="content" @click="navigation(index,subindex)">
                            <span>{{subitem.name}}</span>
                            <i class="more">
                                <Icon type="android-done"></Icon>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "sideBar",
    data() {
        return {
            current: [
                {
                    name: "推广计划",
                    list: [
                        {
                            name: "推广计划"
                        }
                    ]
                },
                {
                    name: "广告",
                    list: [
                        {
                            name: "定向"
                        },
                        {
                            name: "广告版位"
                        },
                        {
                            name: "排期和出价"
                        }
                    ]
                },
                {
                    name: "广告创意",
                    list: [
                        {
                            name: "上传创意"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        //返回
        back() {
            this.$router.go(-1);
        },
        navigation(index, subindex) {
            let step = [index, subindex];
            this.$store.commit("save_step", step);
        }
    },
    computed: {
        //步骤
        step() {
            return this.$store.state.newad.step;
        }
    }
};
</script>