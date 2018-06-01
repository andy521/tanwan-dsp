<style>
.adspace .ivu-table-row-highlight td {
  color: #e88e00;
}
</style>
<style scoped>
.title {
  font-size: 22px;
}
.adspace {
  position: relative;
}

.ta {
  margin-right: 210px;
  min-height: 352px;
}
.preview {
  position: absolute;
  width: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #f8f9fa;
}

.carousel-caption {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  text-align: center;
}

.carousel-caption h3 {
  color: #404246;
  padding-top: 0;
  margin-bottom: 0;
  line-height: 1.4;
  font-size: 16px;
}

.carousel {
  height: 352px;
  background-color: #6b6e7b;
  position: relative;
}

.carousel img {
  display: inline-block;
  max-width: 200px;
  max-height: 352px;
}

.tips {
  margin-top: 8px;
  color: #b9bdc2;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px;
  text-align: center;
}
</style>

<template>
    <Card dis-hover>
        <div class="padding-20">
            <div class="title">广告版位</div>
            <div id="J_edition" class="adspace margin-top-20">
                <div class="ta">
                    <Table :columns="columnsAdSpace" :data="newEition" highlight-row @on-row-click="rowClick" size="small"></Table>
                    <div class="preview" v-show="imgSrc">
                        <div class="carousel">
                            <p class="tips">(广告可能出现在以上位置)</p>
                            <img :src="imgSrc" alt="微信公众号、新闻插件底部">
                        </div>
                        <!-- <div class="carousel-caption">                        
                        <h3>微信公众号、新闻插件底部</h3>
                        <p class="tips">(广告可能出现在以上位置)</p>
                        <div class="ad-info">创意尺寸：465×230</div>
                    </div>                     -->
                    </div>
                </div>
            </div>
        </div>
    </Card>
</template>
<script>
//广告版位数量
import adcreative_template from "./adcreative_template.json";
import p65 from "@/images/adcreative/65.png";
import p148 from "@/images/adcreative/148.png";
import p184 from "@/images/adcreative/184.png";
import p210 from "@/images/adcreative/210.png";
import p471 from "@/images/adcreative/471.png";
import p473 from "@/images/adcreative/473.png";
import p486 from "@/images/adcreative/486.png";
import p487 from "@/images/adcreative/487.png";
export default {
    name: "advertisingPosition",
    props: ["id"],
    data() {
        return {
            edition: adcreative_template,//广告版位数据
            columnsAdSpace: [
                {
                    title: "广告版位",
                    key: "name"
                },
                {
                    title: "创意形式",
                    key: "modus"
                },
                {
                    title: "描述",
                    key: "description"
                }
            ],
            modify: false,//是否修改版位
            imgSrc: "",
            edit: false
        };
    },
    mounted() {

    },
    methods: {
        //选择广告版位
        rowClick(row) {
            this.getimgSrc(row.id);
            this.$emit("on-change", row.id, row.site_set);
        },
        getimgSrc(id) {
            switch (id) {
                case 65:
                    this.imgSrc = p65;
                    break;
                case 148:
                    this.imgSrc = p148;
                    break;
                case 184:
                    this.imgSrc = p184;
                    break;
                case 210:
                    this.imgSrc = p210;
                    break;
                case 471:
                    this.imgSrc = p471;
                    break;
                case 473:
                    this.imgSrc = p473;
                    break;
                case 486:
                    this.imgSrc = p486;
                    break;
                case 487:
                    this.imgSrc = p487;
                    break;
            }
        }
    },
    computed: {
        newEition() {
            this.getimgSrc(this.id);
            let edition = [];
            this.edition.forEach(e => {
                if (e.id == this.id) {
                    e._highlight = true;
                    edition.push(e);
                }
            });
            if (this.edit) {
                return edition;
            } else {
                return this.edition;
            }
        }
    }
};
</script>