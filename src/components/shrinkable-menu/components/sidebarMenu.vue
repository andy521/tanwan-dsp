<style lang="less">
@import "../styles/menu.less";
</style>


<template>

    <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu" accordion>
        <template v-for="item in menuList">
            <MenuItem v-if="item.children&&item.children.length<=1" :name="item.children[0].name">
            <Icon :type="item.children[0].icon || item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ itemTitle(item.children[0]) }}</span>
            </MenuItem>
            <Submenu v-else :name="item.name">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    <span class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem v-if="!child.children" :name="child.name">
                    <Icon :type="child.icon" :size="10"></Icon>
                    <span class="layout-text">{{ itemTitle(child) }}</span>
                    </MenuItem>
                    <Submenu v-else :name="child.name">
                        <template slot="title">
                            <Icon :type="child.icon" :size="10"></Icon>
                            <span class="layout-text">{{ itemTitle(child) }}</span>
                        </template>
                        <template v-for="subchild in child.children">
                            <MenuItem :name="subchild.name">
                            <Icon :type="subchild.icon" :size="10"></Icon>
                            <span class="layout-text">{{ itemTitle(subchild) }}</span>
                            </MenuItem>
                        </template>
                    </Submenu>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        openNames: {
            type: Array
        }
    },
    methods: {
        changeMenu(active) {
            this.$emit('on-change', active);
        },
        itemTitle(item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    updated() {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened();
            }
        });
    }

};
</script>
