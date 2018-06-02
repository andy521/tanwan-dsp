<style scoped>
.campaign {
  max-height: 200px;
  overflow: auto;
}
.select-list {
  line-height: 24px;
}
</style>
<template>
    <Poptip placement="bottom-start" trigger="hover">
        <Button type="ghost">选择负责人</Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="authorIdList" @on-change="checkAllGroupChange">
                        <div v-for="item in authorList" :key="this" class="select-list">
                            <Checkbox :label="item.inChargeId">{{item.inChargeName}}</Checkbox>
                        </div>
                    </CheckboxGroup>
                </div>
            </Card>
        </div>
    </Poptip>
</template>
<script>
import Axios from "@/api/index";
export default {
    name: "selectAgent",
    data() {
        return {
            authorIdList: [],
            authorList: [],
            indeterminate: false,
            checkAll: false,
        };
    },
    mounted() {
        this.getMedia();
    },
    methods: {
        //获取代理商
        getMedia() {
            Axios.post("api.php", {
                action: "sys",
                opt: "getInCharge",
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.authorList = res.data;
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.authorIdList);
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                let ids = [];
                this.authorList.forEach(v => {
                    ids.push(v.inChargeId)
                });
                this.authorIdList = ids;
            } else {
                this.authorIdList = [];
            }
            this.confirmids();
        },
        checkAllGroupChange() {
            let data=this.authorList;
            if (data.length === this.authorIdList.length) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
            this.confirmids();
        }
    }
};
</script>
