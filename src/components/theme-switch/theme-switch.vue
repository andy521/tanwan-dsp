<template>
    <div style="display:inline-block;padding:0 6px;">
        <Dropdown trigger="click" @on-click="setTheme">
            <a href="javascript:void(0)">
                <Icon :style="{marginTop: '-2px', verticalAlign: 'middle'}" color="#495060" :size="18" type="paintbucket"></Icon>
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem v-for="(item, index) in themeList" :key="index" :name="item.name">
                    <Row type="flex" justify="center" align="middle">
                        <span style="margin-right:10px;"><Icon :size="20" :type="item.name.substr(0, 1) !== 'b' ? 'happy-outline' : 'happy'" :color="item.menu"/></span>
                        <span><Icon :size="22" type="record" :color="item.element"/></span>
                    </Row>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>

<script>
export default {
    name: 'themeSwitch',
    data () {
        return {
            themeList: [
                {
                    name: 'black_b',
                    menu: '#495060',
                    element: '#2d8cf0'
                },
                {
                    name: 'black_g',
                    menu: '#495060',
                    element: '#00a854'
                },
                {
                    name: 'black_y',
                    menu: '#495060',
                    element: '#e96500'
                },
                {
                    name: 'black_r',
                    menu: '#495060',
                    element: '#e43e31'
                },
                {
                    name: 'light_b',
                    menu: '#495060',
                    element: '#2d8cf0'
                },
                {
                    name: 'light_g',
                    menu: '#495060',
                    element: '#00a854'
                },
                {
                    name: 'light_y',
                    menu: '#495060',
                    element: '#e96500'
                },
                {
                    name: 'light_r',
                    menu: '#495060',
                    element: '#e43e31'
                }
            ]
        };
    },
    methods: {
        setTheme (themeFile) {
            let menuTheme = themeFile.substr(0, 1);
            let mainTheme = themeFile.substr(-1, 1);
            console.log('选择主题颜色' + menuTheme)
        }
    }
};
</script>
