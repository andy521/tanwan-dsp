
import Vue from 'vue';
import Cookies from 'js-cookie';
import Util from '@/utils/index.js';
import {otherRouter, appRouter} from '@/router/router';
import  Axios  from "@/api/index"

//框架公共stor
const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },

    mutations : {
        //设置tagList
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        //更新菜单
        updateMenulist (state) {
            let accessCode = parseInt(Cookies.get('access'));
            let menuList = [];
            appRouter.forEach((item, index) => {              
                if (item.children.length === 1) {
                    menuList.push(item);
                } else {
                    let len = menuList.push(item);
                    let childrenArr = [];
                    childrenArr = item.children.filter(child => {
                        if (child.access !== undefined) {
                            if (Util.showThisRoute(child.access, accessCode)) {
                                return child;
                            }
                        } else {
                            return child;
                        }
                    });
                    if (childrenArr === undefined || childrenArr.length === 0) {
                        menuList.splice(len - 1, 1);
                    } else {
                        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                        handledItem.children = childrenArr;
                        menuList.splice(len - 1, 1, handledItem);
                    }
                }
            })
            state.menuList = menuList;
            //console.log(menuList)
        },
        setOpenedList (state) {            

            // Axios.get('api.php',{
            //     'action' : 'sys',
            //     'opt' : 'getMenuList'
            // })
            // .then(function(res){
            //     console.log(res);
            // })
            // .catch(function(err){
            //     console.log(err);
            // });             
             

            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        clearOpenedSubmenu (state) {
            console.log(state)
            state.openedSubmenuArr.length = 0;
        },
    }
};

export default app;
