<style scoped>
.gdtnew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.title {
  font-size: 22px;
}
</style>
<template>
    <div class="gdtnew">
        <!-- 导行 -->
        <side-bar :step="1"></side-bar>
        <!-- 定向 -->
        <targetingDetails></targetingDetails>

        <Card dis-hover class="margin-top-10">
            <div class="padding-20">
                <div class="title">目标详情</div>
                <Row class="margin-top-20">
                    <Col span="16">
                    <Select filterable size="large" placeholder="请选择标的物id" v-model="product_refs_id" @on-change="change_product_refs_id">
                        <Option v-for="item in product_refs_ids" :value="item.product_refs_id" :key="item.product_refs_id">{{item.product_name}}</Option>
                    </Select>
                    </Col>
                </Row>
            </div>
        </Card>

    </div>
</template>
<script>
import Axios from "@/api/index";
import gdtConfig from "@/utils/gdtConfig.json";
import sideBar from "./components/sideBar.vue";
import targetingDetails from "./components/targetingDetails.vue";

export default {
    components: {
        sideBar,
        targetingDetails
    },
    data() {
        return {
            account_id: this.$route.query.account_id,
            product_type: this.$route.query.product_type,
            product_refs_id: this.$route.query.product_refs_id,
            destination_url: "",
            product_refs_ids: [],
        };
    },
    mounted() {
        this.products_info_get();
    },
    methods: {
        //获取标的物id
        products_info_get() {
            Axios.post("api.php", {
                action: "gdtAdput",
                opt: "products_info_get",
                account_id: this.account_id,
                product_type: this.product_type
            }).then(res => {
                if (res.ret == 1) {
                    this.product_refs_ids = res.data;
                }
            }).catch(err => {
                console.log("获取标的物id" + err);
            });
        },
        change_product_refs_id(val) {
            this.product_refs_ids.forEach(element => {
                if (val == element.product_refs_id) {
                    this.destination_url = JSON.parse(element.product_info).product_type_app_android_open_platform.app_property_pkg_url;
                }
            });
        },

    }
};
</script>