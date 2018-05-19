<style scoped>
.sidediv {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    overflow: auto;
    background: #fff;
}

.sidebox {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.item {
    line-height: 30px;
    color: #333;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    cursor: pointer;
}

.active {
    background: #f0f0f0;
}
.active .content {
    color: #2d8cf0;
}

.title {
    font-weight: bold;
}
.content {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
}
.content span {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}

.forbidden {
    color: #999;
    cursor: no-drop;
}
</style>

<template>
    <div class="sidediv">
        <div class="sidebox">
            <Button type="primary" @click="back" long>返回</Button>
        </div>
        <div class="item" v-for="(item,index) in current" v-if="index< step">
            <div class="title">{{item.name}}</div>
            <div class="content" v-for="(subitem,subindex) in item.list">
                <span>{{subitem.name}}</span>
                <i class="more">
                    <Icon type="ios-unlocked-outline"></Icon>
                </i>
            </div>
        </div>
        <div class="item active" v-for="(item,index) in current" v-if="index== step">
            <div class="title">{{item.name}}</div>
            <div class="content" v-for="(subitem,subindex) in item.list">
                <span>{{subitem.name}}</span>
                <i class="more">
                    <Icon type="ios-unlocked-outline"></Icon>
                </i>
            </div>
        </div>
        <div class="item forbidden" v-for="(item,index) in current" v-if="index> step">
            <div class="title">{{item.name}}</div>
            <div class="content" v-for="(subitem,subindex) in item.list">
                <span>{{subitem.name}}</span>
                <i class="more">
                    <Icon type="ios-locked"></Icon>
                </i>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "sideBar",
    data() {
        return {
            step: 1,
            current: [
                {
                    name: "创建广告组",
                    list: [
                        {
                            name: "推广目的"
                        }
                    ]
                },
                {
                    name: "创建广告计划",
                    list: [
                        {
                            name: "用户定向"
                        },
                        {
                            name: "投放目标"
                        },
                        {
                            name: "网页链接"
                        },
                        {
                            name: "预算与出价"
                        }
                    ]
                },
                {
                    name: "创建创意",
                    list: [
                        {
                            name: "推广位置"
                        },
                        {
                            name: "创意素材"
                        },
                        {
                            name: "创意分类和标签"
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
        }
    },
    beforeRouteUpdate (to, from, next) {
        console.log('router',to,from, next)
    }
};
</script>