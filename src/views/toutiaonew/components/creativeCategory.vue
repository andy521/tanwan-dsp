<style lang="less" scoped>
.m-active() {
  color: #fff;
  background-color: #48cb95;
}
.creativecategory {
  cursor: pointer;
  min-width: 400px;
  .catpanel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 360px;
    border: 1px solid #e8e8e8;
    .option1 {
      flex: 0 0 30%;
      width: 30%;
      height: inherit;
      overflow-y: auto;
      .option1-item {
        margin-bottom: 5px;
        padding: 0 10px;
        min-width: 100px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        &:hover {
          .m-active;
        }
      }
    }
    .option2 {
      flex: 0 0 70%;
      width: 70%;
      height: 100%;
      overflow-y: auto;
       background-color: #fafafa;
      .option2-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
       
        .item-lt {
          width: 38%;
          flex: 0 0 38%;
          text-align: center;
          &:hover {
            .m-active;
          }
        }
        .item-rt {
          width: 62%;
          flex: 0 0 62%;
          .item-child {
            float: left;
            list-style: none;
            width: auto;
            padding: 3px 8px;
            &:hover {
              .m-active;
            }
          }
        }
      }
    }
  }
  .active {
    .m-active;
  }
  .cls:before,
  .cls::after {
    clear: both;
    zoom: 1;
    opacity: 0;
    height: 0;
    overflow: hidden;
  }
}
</style>
<template>
    <div class="creativecategory">
        <Input @on-focus="isShow=true" v-model="currcategoryName" readonly :autofocus="false" type="text">
        <Button v-show="isShow" slot="append" icon="arrow-up-b" @click="handleShowPanel">收起</Button>
        <Button v-show="!isShow" slot="append" icon="arrow-down-b" @click="handleShowPanel">展开</Button>
        </Input>
        <div v-show="isShow" class="catpanel">
            <ul class="option1">
                <li @click="handleOptionChange(cat, null, 1)" v-for="cat in categoryList" :class="{'active': currcategoryValue === cat.value}" :key="cat.value" class="option1-item">{{cat.name}}</li>
            </ul>
            <ul class="option2">
                <li v-if="currCategoryTwoList.length !== 0" @click="handleOptionChange(cat, null, 2)" v-for="cat in currCategoryTwoList" :key="cat.value" class="option2-item">
                    <div :class="{'active': currcategoryValue === cat.value}" class="item-lt">{{cat.name}}</div>
                    <ul class="item-rt cls">
                        <li v-if="cat.subCategory.length !== 0" @click="handleOptionChange(ccat, cat.name, 3)" v-for="ccat in cat.subCategory" :key="ccat.value" :class="{'active': currcategoryValue === ccat.value}" class="item-child">{{ccat.name}}</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import Axios from '@/api/index'
export default {
    name: 'creativeCategory',
    props: ["category"],
    data() {
        return {
            isShow: false,
            categoryList: [],
            currCategoryTwoList: [],
            currcategoryName: '',
            currcategoryValue: ''
        }
    },
    watch: {
        category(newVal) {
            this.currcategoryValue = newVal
        }
    },
    mounted() {
        this.getCreativeCategory()
        this.currcategoryValue = this.category
    },
    methods: {
        normalizeName(name, deep) {
            if (name.length === '') {
                return
            }
            return name.split(',').slice(0, deep - 1)
        },
        initCurrCategoy(value) {
            let levelOneName = ''
            let levelTwoName = ''
            this.categoryList.forEach(catp => {
                if (value == catp.value) {
                    this.currcategoryName = catp.name
                    return
                } else {
                    levelOneName = catp.name
                    if (catp.subCategory) {
                        catp.subCategory.forEach(catc => {
                            if (value == catc.value) {
                                this.currcategoryName = `${levelOneName},${catc.name}`
                                this.currCategoryTwoList = catp.subCategory
                                this.isShow = true
                                return
                            } else {
                                levelTwoName = catc.name
                                if (catc.subCategory) {
                                    catc.subCategory.forEach(catcc => {
                                        if (value == catcc.value) {
                                            this.isShow = true
                                            this.currCategoryTwoList = catp.subCategory
                                            this.currcategoryName = `${levelOneName},${levelTwoName},${catcc.name}`
                                            return
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        },
        handleOptionChange(cat, threeName, type) {
            switch (type) {
                case 1:
                    if (!cat.subCategory) {
                        this.currcategoryValue = cat.value
                        this.currcategoryName = cat.name
                        this.isShow = false
                        break
                    }
                    this.currcategoryValue = cat.value
                    this.currcategoryName = cat.name
                    this.currCategoryTwoList = cat['subCategory']
                    break
                case 2:
                    if (!cat.subCategory) {
                        this.currcategoryValue = cat.value
                        this.currcategoryName += `,${cat.name}`
                        this.currcategoryName = this.normalizeName(this.currcategoryName, 2) + ',' + cat.name
                        this.isShow = false
                        break;
                    }
                    this.currCategoryThreeList = cat['subCategory']
                    break
                case 3:
                    if (!cat.subCategory) {
                        this.currcategoryValue = cat.value
                        this.currcategoryName += `,${threeName},${cat.name}`
                        this.currcategoryName = this.normalizeName(this.currcategoryName, 3) + ',' + cat.name
                        this.isShow = false
                        break;
                    }
                    this.currCategoryThreeList = cat['subCategory']
                    break
            }

            if (!this.isShow) {
                this.$emit('on-change', this.currcategoryValue)
            }
        },
        handleShowPanel() {
            this.isShow = !this.isShow
        },
        getCreativeCategory() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getCreativeCategory'
            }).then(res => {
                if (res.ret === 1) {
                    this.categoryList = res.data.category
                    if (this.category !== -1) {
                        this.initCurrCategoy(this.category)
                    }
                }
            }).catch(err => {
                console.error('获取创意分类列表错误', err)
            })
        }
    },
}
</script>
