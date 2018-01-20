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
                        优化师：****账号
                        <!-- <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav> -->
                    </div>
                </div>

                <!-- 头部RIght -->
                <div class="header-avator-con">
                    <!-- 全屏 -->
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <!-- 主题颜色 -->
                    <theme-switch></theme-switch>

                    <!-- 用户信息 -->
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <!-- <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar> -->
                        </Row>
                    </div>
                </div>

            </div>
            <!-- 历史标签 -->
            <div class="tags-con">
                备注
                <!-- <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened> -->
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
    export default {
        components: {
            shrinkableMenu,
            fullScreen,
            themeSwitch
        },
        data () {
            return {
                shrink: false, 
                userName: '周运龙',  
                isFullScreen: false,  //是否全屏
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr                
            };
        },
        computed :{
            //缓存页面
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            menuList () {
                console.log(this.$store.state.app)
                return this.$store.state.app.menuList;
            },
            menuTheme () {
                //返回导航样式
                return this.$store.state.app.menuTheme;
            }
        },

        methods : {
            init () {
                console.log('进来了')
                // let pathArr = util.setCurrentPath(this, this.$route.name);
                // console.log(pathArr)
                this.$store.commit('updateMenulist');
                // if (pathArr.length >= 2) {
                //     this.$store.commit('addOpenSubmenu', pathArr[1].name);
                // }
                // this.userName = Cookies.get('user');
                // let messageCount = 3;
                // this.messageCount = messageCount.toString();
                // this.checkTag(this.$route.name);
                // this.$store.commit('setMessageCount', 3);

            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    console.log('个人中心')
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    console.log('退出登录')
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                }
            },
            fullscreenChange (isFullScreen) {
                //全屏
                console.log(isFullScreen);
            },
            handleSubmenuChange (val) {
                // console.log(val)
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
        },
        mounted () {
            this.init();
		    console.log('初始进入--框架外层框架')
	    }
    };
</script>