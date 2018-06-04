
<style scoped>
.gdtnew {
  padding: 10px 10px 10px 210px;
  overflow: auto;
  height: 100%;
  font-size: 14px;
}
.item {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}
.form {
  margin-top: 40px;
}

.nav-tabs {
  font-size: 14px;
  margin-top: 20px;
  height: 36px;
  border-bottom: solid 1px #eee;
}
.nav-tabs li {
  float: left;
  position: relative;
  display: block;
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
  cursor: pointer;
  margin-right: 10px;
}

.nav-tabs li .close {
  margin-left: 10px;
  width: 20px;
  text-align: center;
}

.nav-tabs li.cur::after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #e88e00;
}
.nav-main {
  margin-top: 20px;
}
.imgdiv {
  position: relative;
  height: 200px;
  background: #f8f9fa;
  border: 1px solid rgba(57, 73, 103, 0.18);
}
.imgdiv img {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.w500 {
  width: 500px;
}
</style>
<template>
    <div class="gdtnew ad">

        <!-- 导行 -->
        <side-bar :step="2"></side-bar>
        <Card dis-hover>
            <div class="padding-20">
                <div class="title">上传创意</div>
                <ul class="nav-tabs margin-top-20">
                    <li v-for="(item,index) in adcreative" :key="this" @click="handleChange(index)" :class="[ index ==current  ? 'cur' : '']">
                        {{item.adcreative_name}}
                        <span class="close" v-if="index>0" @click.stop="handleRemove(index)">
                            <Icon type="android-close"></Icon>
                        </span>
                    </li>
                    <li class="nav-tabs-add" @click="addCreativity">
                        <a href="javascript:;" role="tab">+添加创意</a>
                    </li>
                </ul>
                <ul class="nav-main">
                    <li v-for="(item,index) in adcreative" v-show="index==current">
                        <create-image v-if="item.adcreative_elements.image" type="image" @on-change="imgChange" :id="adcreative_template_id" :imgsrc="item.adcreative_elements.image_url"></create-image>

                        <template v-if="item.adcreative_elements.element_story" v-for="subitem in item.adcreative_elements.element_story">
                            <create-image type="image" @on-change="imgChange" :id="adcreative_template_id" :imgsrc="item.adcreative_elements.image_url" style="margin-bottom:10px;"></create-image>
                        </template>

                        <Row>
                            <Col span="16">
                            <Input v-model="item.adcreative_name" class="margin-top-10 w500">
                            <span slot="prepend">创意名称</span>
                            <span slot="append">{{item.adcreative_name.length}}/30</span>
                            </Input>

                            <Input v-model="item.adcreative_elements.title" class="margin-top-10 w500">
                            <span slot="prepend">广告文案</span>
                            <span slot="append">{{item.adcreative_elements.title.length}}/25</span>
                            </Input>

                            <template v-if="item.adcreative_elements.corporate">
                                <Input v-model="item.adcreative_elements.corporate.corporate_name" class="margin-top-10 w500">
                                <span slot="prepend">广告主名称</span>
                                <span slot="append">{{item.adcreative_elements.corporate.corporate_name.length}}/30</span>
                                </Input>
                                <Input v-model="item.adcreative_elements.corporate.corporate_img" class="margin-top-10 w500">
                                <span slot="prepend">广告主图片</span>
                                </Input>
                            </template>

                            <Input v-model="item.adcreative_elements.button_text" class="margin-top-10 w500" v-if="item.adcreative_elements.button_text">
                            <span slot="prepend">按钮文字</span>
                            <span slot="append">{{item.adcreative_elements.button_text.length}}/40</span>
                            </Input>

                            <Input v-model="item.adcreative_elements.bottom_text" class="margin-top-10 w500" v-if="item.adcreative_elements.bottom_text">
                            <span slot="prepend">左下辅助文字</span>
                            <span slot="append">{{item.adcreative_elements.bottom_text.length}}/4</span>
                            </Input>

                            <Input v-model="item.adcreative_elements.deep_link" class="margin-top-10 w500" v-if="item.adcreative_elements.deep_link">
                            <span slot="prepend">应用直达</span>
                            </Input>

                            <Input v-model="item.adcreative_elements.impression_tracking_url" class="margin-top-10 w500" v-if="item.adcreative_elements.impression_tracking_url">
                            <span slot="prepend">请输入曝光监测URL</span>
                            </Input>

                            <Input v-model="item.adcreative_elements.click_tracking_url" class="margin-top-10 w500" v-if="item.adcreative_elements.click_tracking_url">
                            <span slot="prepend">请输入点击监测URL</span>
                            </Input>

                            </Col>
                        </Row>
                    </li>
                </ul>
            </div>
        </Card>
        <Card dis-hover class="margin-top-10">
            <div class="padding-20">
                <Button type="primary" size="large" @click="submit">确定</Button>
            </div>
        </Card>
    </div>
</template>
<script>
import Axios from "@/api/index";
import sideBar from "./components/sideBar.vue";
import createImage from "./components/createImage.vue";
import adcreative_template from "./components/adcreative_template.json";

export default {
    components: {
        sideBar,
        createImage
    },
    data() {
        return {
            account_id: this.$route.query.account_id,

            adcreative_id: this.$route.query.adcreative_id,

            adcreative_template_id: this.$route.query.adcreative_template_id,
            campaign_id: this.$route.query.campaign_id,
            site_set: this.$route.query.site_set.split(","),
            destination_url: this.$route.query.destination_url,
            product_refs_id: this.$route.query.product_refs_id,
            adcreative_template: adcreative_template,
            product_type: this.$route.query.product_type,
            //创意数据
            adcreative: [
                {
                    adcreative_name: "创意1",
                    adcreative_id: "",
                    adcreative_elements: {
                        title: "",
                        image: "",
                        button_text: "",
                        bottom_text: "",
                        deep_link: "",
                        impression_tracking_url: "",
                        click_tracking_url: "",
                        element_story: {
                            image: []
                        },
                        corporate: {
                            corporate_name: "",
                            corporate_img: ""
                        },
                        description: "",
                        image2: ""
                    }
                }
            ],
            adcreative_elements: "",
            //当前创意索引
            current: 0,
            creatives: "",//创意详情
        };
    },
    mounted() {
        if (this.adcreative_id) {
            this.getCreatives();
        }
        this.adcreative_template.forEach(e => {
            if (e.id == this.adcreative_template_id) {
                e.adcreative_elements.forEach(v => {
                    if (v.product_type == this.product_type) {
                        this.adcreative[0].adcreative_elements = v.adcreative_elements;
                        this.adcreative_elements = v.adcreative_elements;
                        console.log(this.adcreative.adcreative_elements)
                    }
                })
            }
        });
    },
    methods: {
        //创意详情
        getCreatives() {
            Axios.post("api.php", {
                action: "api",
                opt: "getCreatives",
                account_id: this.account_id,
                media_type: 1,
                adcreative_id: this.adcreative_id
            }).then(res => {
                if (res.ret == 1) {
                    console.log(res.data)
                    this.creatives = res.data;
                    this.fill_adgroup_detail(res.data);
                }
            }).catch(err => {
                console.log("获取详情失败" + err);
            });
        },

        //当前创意
        handleChange(index) {
            this.current = index;
        },
        //删除创意
        handleRemove(index) {
            this.adcreative.splice(index, 1);
            this.current = 0;
        },
        //增加创意
        addCreativity() {
            if (this.adcreative.length == 5) {
                this.$Message.info("最多创建5个创意");
                return;
            }
            let data = {
                adcreative_name: "创意" + (parseInt(this.adcreative.length) + 1),
                adcreative_id: "",
                adcreative_elements: this.adcreative_elements
            };
            this.adcreative.push(data);
            this.current = parseInt(this.adcreative.length) - 1;
        },
        imgChange(info) {
            this.adcreative[this.current].adcreative_elements.image = info.image_id;
        },
        //提交
        submit() {
            let param = {
                action: "gdtAdPut",
                opt: "adcre_add",
                account_id: this.account_id,
                campaign_id: this.campaign_id,
                product_type: this.product_type,
                product_refs_id: this.product_refs_id,
                site_set: this.site_set,
                product_type: this.product_type,
                adcreative_template_id: this.adcreative_template_id,
                destination_url: this.destination_url,
                adcreative: JSON.stringify(this.adcreative)
            };


            for (let i = 0; i < this.adcreative.length; i++) {
                if (this.adcreative[i].adcreative_name == "") {
                    this.$Message.info("创意名不能为空");
                    return
                }
                if (this.adcreative[i].adcreative_elements.title == "") {
                    this.$Message.info("广告方案不能为空");
                    return
                }
                if (this.adcreative[i].adcreative_elements.image == "") {
                    this.$Message.info("广告图片不能为空");
                    return
                }
            }




            console.log(111)

            // Axios.post("api.php", param).then(res => {
            //     if (res.ret == 1) {
            //         this.$Message.info(res.msg);
            //     }
            // }).catch(err => console.log("广告组" + err));
        }
    }
};
</script>

