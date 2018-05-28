
import Vue from 'vue';
import Util from '@/utils/index.js';
import {otherRouter, appRouter} from '@/router/router';
import  Axios  from "@/api/index"

//框架公共stor
const app = {
    state: {
        cachePage: [],
        lang: '',
        isFullScreen: false,
        // 要展开的菜单数组
        openedSubmenuArr: [], 
        // 主题
        menuTheme: 'dark', 
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
        // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        dontCache: ['text-editor', 'artical-publish'] 
    },

    mutations : {
        //设置tagList
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },

        //更新菜单
        updateMenulist ( state, list) {
            let menuList = [],
                accessList = list || [];  
            appRouter.forEach((item, index) => { 
                if (item.children.length === 1) {
                    menuList.push(item);
                }else{
                    let len = menuList.push(item);
                    let childrenArr = [];
                    childrenArr = item.children.filter(child => {
                        if(accessList.indexOf(child.name) != -1){
                            return child;
                        }
                    });
                    if (childrenArr === undefined || childrenArr.length === 0) {
                        menuList.splice(len - 1, 1);
                    }else{
                        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
                        handledItem.children = childrenArr;
                        menuList.splice(len - 1, 1, handledItem);
                    }
                }
            });
            state.menuList = menuList;
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
            state.openedSubmenuArr.length = 0;
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
    },
    actions : {
        GetAccess( {commit}, data){
            commit('updateMenulist', data)
        }
    }
};

export default app;
