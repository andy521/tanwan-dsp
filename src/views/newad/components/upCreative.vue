<style>
.creative h3{
    font-size: 20px;
    font-weight: 900;
    line-height: 1;
    padding-top: 30px;
    color: #404246;
    margin-bottom: 20px;
}
.tit{font-size: 34px;font-weight: 900;padding-top: 37px; color: #404246;}

.cell{
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.item{-webkit-box-flex: 1;-webkit-flex: 1; flex: 1;}
.form{margin-top: 40px;}
.next_btn{width: 300px; margin-top:40px;}
.next_btn .ivu-btn-large{padding: 10px 15px; font-size: 16px;}   
</style>

<template>
    <div class="creative">    
        <div class="tit">广告创意</div>
        <h3>上传创意</h3>

        <!-- 单个图片 -->
        <div class="cell">        
            <div class="item" v-for="(item,index) in element"  v-if=" item === 'image' || item == 'image2' "> 
                <div class="img_box" v-if="item === 'image'">
                    <create-image type="image" @on-change="imgChange" :id="account" :size="template.image.size" :des="template.image.des" :quality="template.image.quality" :format="template.image.format"></create-image>
                </div>
                <div class="img_box" v-if="item === 'image2'">
                    <create-image type="image2" @on-change="imgChange" :id="account" :size="template.image2.size" :des="template.image2.des" :quality="template.image2.quality" :format="template.image2.format"></create-image>
                </div>                    
            </div>
        </div>

        <!-- 列表图片 -->
        <div class="form_img" v-for="item in element" v-if="item === 'element_story'">               
            <div class="cell">
                <div class="item" v-for="i in template.element_story.length[0]">
                    <create-image :type="'story_'+ i" @on-change="imgChange" :id="account" :size="template.element_story.child.size" :des="template.element_story.child.des" :quality="template.element_story.child.quality" :format="template.element_story.child.format"></create-image>
                </div>
            </div>
        </div> 

        <!-- 文本资料 -->
        <div class="form">
            <Alert type="error" v-if="verify.show" show-icon>{{verify.des}}</Alert>
            <Form :model="creativeForm" :label-width="90">
                <div v-for="item in element">

                    <Form-item v-if="item === 'title'" :label="template.title.name">
                        <Input v-model="title" :maxlength="template.title.amount[1]" :placeholder=" '请输入' + template.title.name  + template.title.des"><span slot="append">{{title.length}}/{{template.title.amount[1]}}</span> </Input>
                    </Form-item>

                    <Form-item v-if="item === 'button_text'" :label="template.button_text.name">
                        <Input v-model="button_text" :maxlength="template.button_text.amount[1]" :placeholder=" '请输入' + template.button_text.name  + template.button_text.des"><span slot="append">{{button_text.length}}/{{template.button_text.amount[1]}}</span> </Input>
                    </Form-item>

                    <Form-item v-if="item === 'deep_link'" :label="template.deep_link.name">
                        <Input v-model="deep_link"  :placeholder=" '请输入' + template.deep_link.name + template.deep_link.des"> </Input>
                    </Form-item>

                    <Form-item v-if="item === 'bottom_text'" :label="template.bottom_text.name">
                        <Input v-model="bottom_text"  :placeholder=" '请输入' + template.bottom_text.name"> </Input>
                    </Form-item>

                    <Form-item v-if="item === 'impression_tracking_url'" :label="template.impression_tracking_url.name">
                        <Input v-model="impression_tracking_url"  :placeholder=" '请输入' + template.impression_tracking_url.name + template.impression_tracking_url.des"> </Input>
                    </Form-item>

                    <Form-item v-if="item === 'click_tracking_url'" :label="template.click_tracking_url.name">
                        <Input v-model="click_tracking_url"  :placeholder=" '请输入' + template.click_tracking_url.name  + template.click_tracking_url.des"> </Input>
                    </Form-item>
                    
                    <Form-item v-if="item === 'description'" :label="template.description.name">
                        <Input v-model="description"  :placeholder=" '请输入' + template.description.name  + template.description.des"> </Input>
                    </Form-item>

                    <!-- corporate -->
                    <Form-item v-if="item === 'corporate'" :label="template.corporate.child.name">
                        <Input v-model="corporate.corporate_name"  :placeholder=" '请输入' + template.corporate.child.name  + template.corporate.child.des"> </Input>
                    </Form-item>

                </div>
            </Form>
        </div>


        <div class="next_btn">
            <Button type="primary" @click="submit" long size="large">提交</Button>
        </div>
         
        <br/>
        <br/>
    </div>
</template>
<script>
import createImage from './createImage.vue';
export default {
    components: {
        createImage
    },
    name: 'up-creative',
    props: {
        account: {
            type: [String, Number],
            required: true
        },
        template: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            //上传创意Form
            creativeForm:{
                input:''
            },
            //需要在页面渲染的元素，提交里根据这里面的去找值
            element:[],
            //图片路径
            image:'', 
            image2:'',           
            //广告文案
            title:'',
            //按钮文字
            button_text:'',
            //左下辅助文字
            bottom_text:'',
            //应用直达
            deep_link:'',
            //请输入曝光监测URL
            impression_tracking_url:'',
            //请输入点击监测URL
            click_tracking_url:'',
            //广告描述
            description:'',
            //商标
            corporate:{
                corporate_name:''
            },
            //组图
            element_story:[],

            //落地页URL
            destination_url:'',

            //提交时验证
            verify :{
                show : false,
                des : ''
            },

        }
    },
    watch :{
        template(data){
            this.createHtml(data); 
        }
    },
    methods:{
        createHtml(data){
            this.element=[];
            for(let i in data){
                this.element.push(i);
            }
            //console.log(data)
        },
        imgChange(data){
            if(data.type == 'image'){
                this.image = data.image_id;
            }else if(data.type == 'image2'){
                this.image2 = data.image_id;
            }else{
                let index = data.type.split('_')[1] - 1;
                this.element_story[index] = data.image_id
            }
        },
        submit(){
            //把包数据 (创意元素，不同 adcreative_template_id 要求的元素不尽相同)
            let pack = {},
                temp = this.template;  

            this.element.forEach(item => {
                console.log(item)
                //title验证
                if(item === 'title'){
                    //判断是否必填写
                    if(!!temp.title.required && this.title == ''){
                        this.verify.show = true;
                        this.verify.des = '请填写' + temp.title.name;
                        return
                    }
                    if(this.title.length < temp.title.amount[0] || this.title.length > temp.title.amount[1]){
                        this.verify.show = true;
                        this.verify.des = temp.title.name + '/' + temp.title.des;
                        return
                    }
                    pack.title = this.title;
                }else if(item === 'image'){
                    if(!!temp.image.required && this.image == ''){
                        this.verify.show = true;
                        this.verify.des = temp.image.name +'提交失败';
                        return
                    }else{
                        this.verify.show = false;
                        pack.image = this.image;
                    }                    
                }else if(item === 'image2'){
                    if(!!temp.image2.required && this.image2 == ''){
                        this.verify.show = true;
                        this.verify.des = temp.image2.name +'提交失败';
                        return
                    }else{
                        this.verify.show = false;
                        pack.image2 = this.image2;
                    }                    
                }else if(item === 'description'){
                    if(!!temp.description.required && this.description == ''){
                        this.verify.show = true;
                        this.verify.des = '请填写' + temp.description.name;
                        return
                    }else if(this.description.length < temp.description.amount[0] || this.description.length > temp.description.amount[1]){
                        this.verify.show = true;
                        this.verify.des = temp.description.name + '/' + temp.description.des;
                        return
                    }else{
                        this.verify.show = false;
                        pack.description = this.description;
                    }                    
                }else if(item === 'element_story'){
                    
                    pack.element_story = this.element_story;
                }else if(item === 'corporate'){  
                    if(!!temp.corporate.child.required && this.corporate.corporate_name == ''){
                        this.verify.show = true;
                        this.verify.des = '请填写' + temp.corporate.name;
                        return
                    }else if(this.corporate.corporate_name.length < temp.corporate.child.amount[0] || this.corporate.corporate_name.length > temp.corporate.child.amount[1]){
                        this.verify.show = true;
                        this.verify.des = temp.corporate.child.name + '/' + temp.corporate.child.des;
                    }else{
                        this.verify.show = false;
                        pack.corporate = this.corporate;
                    }
                }
            });
            
            if(!this.verify.show){
                this.$emit('on-change', pack);
            }
        }
    },
    mounted() {        
        //选择了那个广告版位的ID        
        this.createHtml(this.template); 
    }
}
</script>