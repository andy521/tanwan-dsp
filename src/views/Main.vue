<style lang="less">
@import "./main.less";
</style>
<template>

    <div class="main" :class="{'main-hide-text': shrink}">

        <!-- 左侧导航 -->
        <div class="sidebar-menu-con" :style="{width: shrink?'40px':'200px', overflowY: shrink ? 'visible' : 'auto',overflowX: shrink ? 'visible' : 'hidden'}">
            <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :theme="menuTheme" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" src="../images/logo.png" key="max-logo" />
                    <img v-show="shrink" src="../images/logo-min.jpg" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <!-- 左侧导航END -->

        <!-- 头部 -->
        <div class="main-header-con" :style="{paddingLeft: shrink?'40px':'200px'}">
            <div class="main-header">

                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>

                <!-- 头部LEFT -->
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        欢迎优化师：
                        <a href="javascript:void(0)">
                            <span class="main-user-name">{{ userName }}</span>
                        </a>
                    </div>
                </div>

                <!-- 头部RIght -->
                <div class="header-avator-con">
                    <!-- 主题颜色 -->
                    <!-- <theme-switch></theme-switch> -->

                    <!-- 任务进度查询 -->
                    <copy-spet></copy-spet>

                    <!-- 用户信息 -->
                    <div class="user-dropdown-menu-con">

                        <Poptip placement="bottom-end" trigger="hover" width="400">
                            <span @click="tomsglist()">
                                <Badge :count="getMessages.read_count.no_read" style="margin-right: 20px;">
                                    <Icon type="ios-bell-outline" size="26"></Icon>
                                </Badge>
                            </span>
                            <div class="api" slot="content">
                                <table width="100%" class="msgtable" v-if="getMessages.read_count.no_read>0">
                                    <tbody>
                                        <tr v-for="item in getMessages.message" v-if="item.have_read==0" @click="details(item.id)">
                                            <td>
                                                <Icon type="email-unread" size="16" color="#e33244"></Icon>
                                                {{item.uName}}
                                            </td>
                                            <td align="right">{{item.message_time}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-else>暂无未读消息</div>

                            </div>
                        </Poptip>

                        <Button type="ghost" @click="quitLogin">退出登录</Button>
                        <!-- 全屏 -->
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>

                    </div>
                </div>

            </div>

        </div>
        <!-- 头部 -->

        <!-- main -->
        <div class="single-page-con" :style="{left: shrink?'40px':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <!-- main END -->
    </div>

</template>
<script>
//左侧导航
import shrinkableMenu from "@/components/shrinkable-menu/shrinkable-menu.vue";
import fullScreen from "@/components/fullScreen/fullScreen.vue";
import themeSwitch from "@/components/theme-switch/theme-switch.vue";
import copySpet from "@/components/copy-spet/copy-spet.vue";
import util from "@/utils/index.js";
export default {
    components: {
        shrinkableMenu,
        fullScreen,
        themeSwitch,
        copySpet
    },
    data() {
        return {
            shrink: false,
            userName: "",
            isFullScreen: false, //是否全屏
            openedSubmenuArr: []
        };
    },
    mounted() {
        this.init();
        //获取消息
        this.$store.dispatch("getMessages");
        //请求定向标签(地域)
        this.$store.dispatch("get_targeting_tags");
        //获取商业兴趣
        this.$store.dispatch("get_business_interest");
        //获取App行为
        this.$store.dispatch("get_appCategory");
    },
    computed: {
        //缓存页面
        cachePage() {
            return this.$store.state.app.cachePage;
        },
        menuList() {
            return this.$store.state.app.menuList;
        },
        menuTheme() {
            //返回导航样式
            return this.$store.state.app.menuTheme;
        }, //获取消息
        getMessages() {
            return this.$store.state.setid.MessagesData;
        }
    },
    methods: {
        init() {
            //更新菜单
            this.$store.commit("updateMenulist");
            this.userName = util.getItem("user");
            this.$store.commit("addOpenSubmenu", this.$route.name);

            //查找展开菜单
            this.$route.matched.forEach((v, i) => {
                if (i < (this.$route.matched.length - 1)) {
                    this.openedSubmenuArr.push(v.name)
                }
            });
            // let pathArr = util.setCurrentPath(this, this.$route.name);
            // if (pathArr.length >= 2) {
            //     this.$store.commit("addOpenSubmenu", pathArr[1].name);
            // }
        },
        toggleClick() {
            this.shrink = !this.shrink;
        },
        quitLogin() {
            //console.log('退出登录');
            this.$store.dispatch("LoginOut", this);
            this.$store.commit("clearOpenedSubmenu");
            this.$router.push({ name: "login" });
        },
        fullscreenChange(isFullScreen) {
            //全屏
            console.log(isFullScreen);
        },
        handleSubmenuChange(val) {
            //console.log(val)
        },
        beforePush(name) {
            //根据name值禁止点击
            // if (name === 'home_index') {
            //     return false;
            // } else {
            //     return true;
            // }
            return true;
        },
        //查看消息详情
        details(id) {
            this.$router.push({
                name: "user_msgdetails"
            });
            this.$store.dispatch("getSingleMessages", id);
        },
        //跳转消息列表
        tomsglist() {
            this.$router.push({
                name: "setid_systemmsg"
            });
        }
    }
};
</script>

<style>
.main-header-con {
  box-shadow: none;
  height: 60px;
}
.main .single-page-con {
  top: 60px;
}
</style>
