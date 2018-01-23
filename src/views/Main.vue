<style lang="less">
    @import "./main.less";
</style>
<template>


    <div class="main" :class="{'main-hide-text': shrink}">

        <!-- 左侧导航 -->
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                :shrink="shrink"
                @on-change="handleSubmenuChange"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList"
            >
            <div slot="top" class="logo-con">
                <img  src="../images/logo.png" key="max-logo" />
            </div>
            </shrinkable-menu>
        </div>
        <!-- 左侧导航END -->
        

        <!-- 头部 -->
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">

                <!-- 头部LEFT -->
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        欢迎优化师：<a href="javascript:void(0)"><span class="main-user-name">{{ userName }}</span></a>
                    </div>
                </div>

                <!-- 头部RIght -->
                <div class="header-avator-con">
                    <!-- 主题颜色 -->
                    <!-- <theme-switch></theme-switch> -->

                    <!-- 用户信息 -->
                    <div class="user-dropdown-menu-con">
                        <Button type="ghost" @click="quitLogin">退出登录</Button>
                        <!-- 全屏 -->
                        <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    </div>
                </div>

            </div>

        </div>
        <!-- 头部 -->


        <!-- main -->
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
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
    import shrinkableMenu from '@/components/shrinkable-menu/shrinkable-menu.vue';
    import fullScreen from '@/components/fullScreen/fullScreen.vue';
    import themeSwitch from '@/components/theme-switch/theme-switch.vue';
    import util from '@/utils/index.js';
    import Cookies from 'js-cookie';
    export default {
        components: {
            shrinkableMenu,
            fullScreen,
            themeSwitch
        },
        data () {
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,  //是否全屏
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
            };
        },
        computed :{
            //缓存页面
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            menuList () {
                return this.$store.state.app.menuList;
            },
            menuTheme () {
                //返回导航样式
                return this.$store.state.app.menuTheme;
            }
        },

        methods : {
            init () {
                //更新菜单       
                this.$store.commit('updateMenulist');
                this.userName = Cookies.get('user');
                //console.log( this.$store.state )
                // let pathArr = util.setCurrentPath(this, this.$route.name);
                // console.log(pathArr)
                
                // if (pathArr.length >= 2) {
                //     this.$store.commit('addOpenSubmenu', pathArr[1].name);
                // }
                // let messageCount = 3;
                // this.messageCount = messageCount.toString();
                // this.checkTag(this.$route.name);
                // this.$store.commit('setMessageCount', 3);

            },
            quitLogin () {
                console.log('退出登录');                
                this.$store.dispatch('LoginOut', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({name: 'login'});
            },
            fullscreenChange (isFullScreen) {
                //全屏
                console.log(isFullScreen);
            },
            handleSubmenuChange (val) {
                //console.log(val)
            },
            beforePush (name) {
                //根据name值禁止点击
                // if (name === 'home_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
        },
        mounted () {
            this.init();
		    //console.log('初始进入--框架外层框架')
	    }
    };
</script>

<style>
.main-header-con{box-shadow:none;height: 60px;}
.main .single-page-con{top: 60px;}
.main-header .header-middle-con{left:-10px;}
</style>
