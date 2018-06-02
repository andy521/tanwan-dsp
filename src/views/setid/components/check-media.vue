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
        <Button type="ghost">选择媒体</Button>
        <div slot="content">
            <Card dis-hover :bordered="false">
                <div slot="title">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <div class="campaign">
                    <CheckboxGroup v-model="mediaTypeList" @on-change="checkAllGroupChange">
                        <div v-for="item in mediaList" :key="this" class="select-list">
                            <Checkbox :label="item.mediaTypeId">{{item.mediaTypeName}}</Checkbox>
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
            mediaTypeList: [],
            mediaList: [],
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
                opt: "getMedia",
            }).then(
                res => {
                    if (res.ret == 1) {
                        this.mediaList = res.data;
                        this.indeterminate = false;
                    }
                }
            ).catch(err => { console.log(err) });
        },
        confirmids() {
            this.$emit("on-change", this.mediaTypeList);
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
                this.mediaList.forEach(v => {
                    ids.push(v.mediaTypeId)
                });
                this.mediaTypeList = ids;
            } else {
                this.mediaTypeList = [];
            }
            this.confirmids();
        },
        checkAllGroupChange() {
            let data=this.mediaList;
            if (data.length === this.mediaTypeList.length) {
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
