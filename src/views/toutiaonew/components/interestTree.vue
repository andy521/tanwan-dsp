<style scoped>
.city_main {
  line-height: 36px;
  border: solid 1px #dee4f5;
  width: 250px;
}
.city_title {
  background-color: #fafbfe;
  border-bottom: solid 1px #dee4f5;
  padding: 0 15px;
}
.city_box {
  height: 250px;
  overflow: auto;
}
.item {
  padding: 0 15px;
  cursor: pointer;
  height: 36px;
}
.item:hover {
  background: #f8f8f8;
}
.more_icon {
  float: right;
  line-height: 36px;
}
.icon {
  line-height: 36px;
  float: left;
  margin-right: 5px;
}
.clearcity {
  float: right;
  color: #2d8cf0;
  cursor: pointer;
}

.c-link {
  position: relative;
  color: #5cadff;
  cursor: pointer;
  margin-left: 10px;
}

.c-link input {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
</style>
<template>
    <div>
        <Row>
            <Col span="8">
            <Input v-model="search" placeholder="输入关键词，多个关键词空格分隔" @on-enter="addwords">
            <Button slot="append" @click="addwords">添加(回车键)</Button>
            </Input>
            </Col>
            <Col span="8">
            <span class="c-link" @click="win_modal=true;">导入词包</span>
            <Tooltip placement="top">
                <span class="c-link">上传关键词<input type="file" accept="txt" capture="camera" @change="readFileword" multiple="multiple"></span>
                <div slot="content" style="white-space: normal">一行一个关键词，不支持标点符号隔开，最多2000个关键词</div>
            </Tooltip>
            <span>(.TXT文件)</span>
            </Col>
        </Row>

        <div class="city_main margin-top-10">
            <div class="city_title">已选
                <span class="clearcity  margin-left-10" @click="removeAll()">全部清空</span>
                <span class="clearcity" @click="saveword()">保存为词包</span>
            </div>
            <div class="city_box">
                <div class="item" v-for="(item,index) in interest_tags">
                    {{item}}
                    <span @click="remove(index)">
                        <Icon type="close-round" size="10" class="more_icon"></Icon>
                    </span>
                </div>
            </div>
        </div>

        <Modal v-model="win_modal" title="导入兴趣词包" @on-ok="SelectWord">
            <div class="padding-10">
                <Table :columns="columns" :data="InterestWord" height="300" size="small" @on-selection-change="taCheck"></Table>
            </div>
        </Modal>

        <Modal v-model="save_win_modal" title="新建兴趣词包" @on-ok="submitWord">
            <div class="padding-10">
                <Form :model="formItem" :label-width="50">
                    <FormItem label="词包名">
                        <Input v-model="formItem.name" placeholder="输入词包名称，八个汉字以内"></Input>
                    </FormItem>
                    <FormItem label="关键词">
                        <Input v-model="formItem.interest_tags" type="textarea" :rows="5" placeholder="兴趣词一行一个，每个词不超过十个汉字"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
import Axios from "@/api/index";
export default {
    name: "interestTree",
    props: ["value"],
    data() {
        return {
            account_id: this.$route.query.account_id, //账户id
            search: "",
            InterestWord: [],
            taCheckitem: [],
            interest_tags: [],
            win_modal: false,
            save_win_modal: false,
            columns: [
                {
                    type: 'selection',
                    width: 58,
                    align: 'center'
                },
                {
                    title: '词包名',
                    key: 'tag_name'
                }
            ],
            formItem: {
                name: "",
                interest_tags: ""
            }
        }
    },
    mounted() {
        this.getInterestWord();
        this.interest_tags = this.value;
    },
    watch: {
        interest_tags() {
            this.$emit('input', this.interest_tags);
        }
    },
    methods: {
        //获定关键字包
        getInterestWord() {
            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'getInterestWord'
            }).then(res => {
                if (res.ret == 1) {
                    this.InterestWord = res.data;
                }
            }).catch(err => {
                console.log('获取关键词类表失败' + err);
            })
        },
        //添加关健字
        addwords() {
            if (this.search.length < 1 || this.search.length > 10) {
                this.$Message.info("关键词1~10个字");
                return;
            }
            let checked = false;
            //是否已存在
            this.interest_tags.forEach(v => {
                if (this.search == v) checked = true;
            })
            if (!checked) {
                this.interest_tags.push(this.search);
            }
        },
        //上传关健词
        readFileword(e) {
            var that = this;
            var tmpFile = e.target.files;
            for (var i = 0; i < tmpFile.length; i++) {
                var file = tmpFile[i];
                if (!/text\/\w+/.test(file.type)) {
                    //判断是否是txt类型
                    that.$Message.info("格式不对");
                    return false;
                }
                var reader = new FileReader();
                reader.readAsText(file, "gb2312");
                reader.onload = function (e) {
                    var fileText = e.target.result.split("\n");
                    for (var j = 0; j < fileText.length; j++) {
                        let text = fileText[j].trim();
                        //每个是否符合条件
                        if (text.length <= 10 && text.length >= 1) {
                            let checked = false;
                            //是否已存在
                            that.interest_tags.forEach(v => {
                                if (text == v) checked = true;
                            })
                            if (!checked) {
                                that.interest_tags.push(text);
                            }
                        }
                    }
                };
            }
        },
        //删除关键字全部
        removeAll() {
            this.interest_tags = [];
        },
        //删除关键字单个
        remove(index) {
            this.interest_tags.splice(index, 1);
        },
        //获取选中的id
        taCheck(row) {
            let it = [];
            row.forEach(item => {
                it.push(item);
            });
            this.taCheckitem = it;
        },
        //选中词包
        SelectWord() {
            this.taCheckitem.forEach(v => {
                v.words.forEach(v => {
                    let checked = false;
                    this.interest_tags.forEach(item => {
                        if (v.word == item) checked = true;
                    })
                    if (!checked) {
                        this.interest_tags.push(v.word);
                    }
                })
            })
        },
        //保存为词包
        saveword() {
            this.save_win_modal = true;
            this.formItem.interest_tags = this.interest_tags.join("\n");
        },
        //提交词包
        submitWord() {
            if (this.formItem.name.length <= 0 || this.formItem.name.length > 8) {
                this.$Message.info("名字1-8个字");
                return;
            }
            let interest_tags = this.formItem.interest_tags.split("\n");
            let checked = false;
            interest_tags.forEach(v => {
                if (v.length < 1 || v.length > 10) checked = true;
            })
            if (checked) {
                this.$Message.info("关键诩1~10个字");
                return;
            }

            Axios.post('api.php', {
                action: 'ttAdPut',
                opt: 'createInterestWord',
                account_id: this.account_id,
                name: this.formItem.name,
                words: interest_tags
            }).then(res => {
                if (res.ret == 1) {
                    this.$Message.info(res.msg);
                    this.getInterestWord();
                }
            }).catch(err => {
                console.log('关键词包' + err);
            })
        }
    },

}
</script>