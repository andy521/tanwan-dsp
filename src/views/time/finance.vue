<style scoped>
@import "../../styles/common.less";
@import "../../styles/table.less";
.ivu-tabs {
    overflow: inherit;
}
</style>
<template>
    <Card :bordered="false" shadow>
        <Tabs value="name1" :animated="false">
            <TabPane label="资金流水" name="name1">
                <finance-journal></finance-journal>
            </TabPane>
            <TabPane label="财务信息" name="name2">
                <finance-funds></finance-funds>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
import financeJournal from "./components/financeJournal.vue";
import financeFunds from "./components/financeFunds.vue";
export default {
    components: {
        financeJournal,
        financeFunds
    }
};
</script>
