<style lang="less">
@import "../../styles/common.less";
@import "../../styles/table.less";
.sel {
    width: 220px;
}
.inp {
    display: inline-block;
    width: 150px;
}
.ad .ivu-poptip {
    display: inline-block;
}
.sel_state {
    text-align: left;
    width: 110px;
}
</style>
<template>
    <div>
        <Menu :active-name="activename" mode="horizontal" @on-select="changeActivename">
            <MenuItem name="1">广告组</MenuItem>
            <MenuItem name="2">广告计划</MenuItem>
            <MenuItem name="3">创意</MenuItem>
        </Menu>
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activename: "1"
        };
    },
    mounted() {
        if (this.$route.name == "tt_campaign") {
            this.activename = '1';
        } else if (this.$route.name == "tt_ad") {
            this.activename = '2';
        } else if (this.$route.name == "tt_creative") {
            this.activename = '3';
        }
    },
    methods: {
        changeActivename(val) {
            if (val == 1) {
                this.$router.push({
                    name: "tt_campaign"
                });
            } else if (val == 2) {
                this.$router.push({
                    name: "tt_ad"
                });
            } else if (val == 3) {
                this.$router.push({
                    name: "tt_creative"
                });
            }
        }
    }
};
</script>