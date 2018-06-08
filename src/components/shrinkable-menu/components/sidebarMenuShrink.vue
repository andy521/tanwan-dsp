<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div>
                <Dropdown v-if="item.children.length !== 1" placement="right-start" @on-click="changeMenu">
                    <Button style="width:40px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" v-if="!child.children">
                                <Icon :type="child.icon"></Icon>
                                <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                            </DropdownItem>

                            <Dropdown placement="right-start" v-if="child.children">
                                <DropdownItem>
                                    <Icon :type="child.icon"></Icon>
                                    <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                                    <Icon type="ios-arrow-right"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="subitem in child.children" :name="subitem.name" :key="subitem.name">
                                        <Icon :type="subitem.icon"></Icon>
                                        <span style="padding-left:10px;">{{ itemTitle(subitem) }}</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" @on-click="changeMenu">
                    <Button @click="changeMenu(item.children[0].name)" style="width: 40px;padding:10px 0;" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.children[0].icon || item.icon"></Icon>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <DropdownItem :name="item.children[0].name">
                            <Icon :type="item.children[0].icon || item.icon"></Icon>
                            <span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
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
    }
};
</script>
