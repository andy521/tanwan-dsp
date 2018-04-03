<style scoped>
.creative h3 {
    font-size: 20px;
    font-weight: 900;
    line-height: 1;
    padding-top: 30px;
    color: #404246;
    margin-bottom: 20px;
}
.tit {
    font-size: 34px;
    font-weight: 900;
    padding-top: 37px;
    color: #404246;
}
.item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
}
.form {
    margin-top: 40px;
}
.next_btn {
    width: 300px;
    margin-top: 40px;
}
.next_btn .ivu-btn-large {
    padding: 10px 15px;
    font-size: 16px;
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
ul,
li {
    list-style: none;
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
</style>

<template>
    <div class="creative">
        <div class="tit">广告创意</div>
        <h3>上传创意</h3>
        <ul class="nav-tabs">
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
                <create-image type="image" @on-change="imgChange" :id="account_id" :templateid="id" :imgsrc="item.adcreative_elements.image_url"></create-image>
                <Input v-model="item.adcreative_elements.title" class="margin-top-10">
                <span slot="prepend">广告文案</span>
                <span slot="append">{{item.adcreative_elements.title.length}}/30</span>
                </Input>
                <Input v-model="item.adcreative_elements.corporate.corporate_name" class="margin-top-10">
                <span slot="prepend">广告主名称</span>
                <span slot="append">{{item.adcreative_elements.corporate.corporate_name.length}}/30</span>
                </Input>
            </li>
        </ul>

        <div class="next_btn">
            <Button type="primary" @click="submit" long size="large">提交</Button>
        </div>

    </div>
</template>
<script>
import createImage from "./createImage.vue";
export default {
    components: {
        createImage
        //twTab
    },
    name: "up-creative",
    props: ["id"],
    data() {
        return {
            account_id: this.$route.query.account_id,
            //创意数据
            adcreative: [
                {
                    adcreative_name: "创意1",
                    adcreative_id: "",
                    adcreative_elements: {
                        image: "",
                        title: "",
                        corporate: {
                            corporate_name: "",
                            corporate_img: ""
                        },
                        image_url: ""
                    }
                }  ,{
                    adcreative_name: "创意1",
                    adcreative_id: "",
                    adcreative_elements: {
                        image: "",
                        title: "",
                        corporate: {
                            corporate_name: "",
                            corporate_img: ""
                        },
                        image_url: ""
                    }
                }             
            ],
            //当前创意索引
            current: 0
        };
    },
    mounted() {
       
    },
    methods: {
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
                adcreative_name:
                    "创意" + (parseInt(this.adcreative.length) + 1),
                adcreative_id: "",
                adcreative_elements: {
                    image: "",
                    title: "",
                    corporate: {
                        corporate_name: "",
                        corporate_img: ""
                    },
                    image_url: ""
                }
            };
            this.adcreative.push(data);
            this.current = parseInt(this.adcreative.length) - 1;
        },
        imgChange(info) {
            this.adcreative[this.current].adcreative_elements.image =
                info.image_id;
        },
        //提交
        submit() {
            //验证数据是否正确
            // 问题
            // 传过来要修改的创意，修改规则是什么
            // 数据格式与原来规则的格式不一样
            this.$emit("on-change", this.adcreative);
        }
    },
    watch: {
        adgroup_detail() {}
    },
    computed: {
        //详情传过来的参数
        adgroup_detail() {
            let adgroup_detail = this.$store.state.newad.adgroup_detail;
            if (adgroup_detail.adcreative) {
                this.adcreative = adgroup_detail.adcreative;
            }
            return adgroup_detail;
        }
    }
};
</script>
