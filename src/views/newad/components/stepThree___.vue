<style lang="less">
    .ivu-table-small td{cursor: pointer}
    .newad .ivu-table-row-hover td{background-color: #f8f9fa;}
    .newad .ivu-table-row-highlight td{color: #e88e00}
    .newad .ivu-form-item-label{color: #888;}
    .newad .ivu-form-item{margin-bottom: 22px;}
    .adspace{margin:10px 0 30px; position: relative;}
    .ad_table{margin-right: 210px;}
    .preview{position: absolute;width: 200px;top: 0;right: 0;bottom: 0;background-color: #f8f9fa; display: none;}
    .ad_table .preview{display: block;}
    .carousel-caption{padding-left: 20px;padding-right: 20px; margin-top: 20px; text-align: center;}
    .carousel-caption h3{color: #404246; padding-top: 0;margin-bottom: 0; line-height: 1.4;font-size: 16px;}
    .carousel{height: 358px;background-color: #6b6e7b; position: relative;}
    .carousel img {display: inline-block; max-width: 200px; max-height: 358px;}
    .tips{margin-top: 8px;color: #b9bdc2;font-size: 12px;line-height: 1; position: absolute; bottom: 0; width: 100%; background: rgba(0, 0, 0, .2); padding:8px; text-align: center;}
    .ad-info{margin-top: 27px;    color: #555;}    
    .date_price{margin: 20px 0;}
    .next_btn{width: 300px; margin-top:40px;}
    .next_btn .ivu-btn-large{padding: 10px 15px; font-size: 16px;}    
</style>
<template>
    <div class="newad">
        fdsfdsfsd
        <h3 class="subtit">广告版位</h3>
        <!-- <Alert type="error" v-if="verify.select_ad"  show-icon>请选择要投放的版位</Alert> -->
        <div class="adspace">
            <div :class="className">
                <Table :columns="columnsAdSpace" :data="edition" highlight-row  @on-row-click="rowClick" size="small"></Table>
                <div class="preview">
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
        
        <h3 class="subtit">排期与出价</h3>  
        <!-- <Alert type="error" v-if="verify.dp" show-icon>{{verify.dp_txt}}</Alert>       -->
        <div class="date_price">
            <Form ref="datePrice" :model="datePrice" :rules="ruleValidate" :label-width="90">
                <FormItem label="投放日期：" prop="dates">  
                    <Date-picker type="date" placeholder="选择日期" v-model="datePrice.date"></Date-picker>                  
                    <!-- <Date-picker :options="options" format="yyyy/MM/dd" v-model="datePrice.date" type="date" placeholder="长期投放" style="width: 300px; margin-right:15px;"></Date-picker>
                    <Date-picker :options="options" format="yyyy/MM/dd" v-model="datePrice.date" type="daterange"  placement="bottom-end" placeholder="在某日期范围内投放" style="width: 300px"></Date-picker> -->
                </FormItem>
                <FormItem label="投放时间：">
                    <div class="fl">
                        <Checkbox v-model="allDay">
                            <span>全天</span>                       
                        </Checkbox>
                        <span style="margin:0 20px; color:#999">/</span>    
                    </div>                
                    <div class="fl" v-if="allDay" @click="period">特定时间段</div>
                    <div class="fl" v-else>
                        <Select :disabled="allDay" @on-change="startTime" style="width:100px">
                            <Option v-for="item in timeStateList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                        </Select>
                        -
                        <Select :disabled="allDay" @on-change="endTime" style="width:100px">
                            <Option v-for="item in timeEndList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                        </Select>
                    </div>
                    <!-- <span style="color:#ccc">(这里还差一个功能就是要程序判断是否朋友圈)</span> -->
                    <!-- <Icon type="checkmark" /> -->
                </FormItem>                
                <FormItem label="出价方式：" prop="bidstyle"> 
                    <Select @on-change="getStyle" style="width:180px;margin-right:15px;" placeholder="请选择优化目标">
                        <Option v-for="item in goalList" :value="item.value" :key="item.id">{{ item.label }}</Option>
                    </Select>                   
                    <RadioGroup v-model="datePrice.style" type="button" >
                        <Radio label="CPC" :disabled="disabled_cpc"></Radio>
                        <Radio label="CPM" :disabled="disabled_cpm"></Radio>
                    </RadioGroup>
                    <span style="color:#ccc;">（请先选优化目录，然后才可选择出价方式）</span>
                </FormItem>
                <FormItem label="出价：" prop="price">
                    <Input v-model="datePrice.price" placeholder="输入价格" number style="width:318px" @on-blur="getPrice" icon=""></Input> <span class="input-ts">元/点击</span>
                </FormItem>
                <FormItem label="广告名称" prop="name">
                    <Input v-model="datePrice.name" placeholder="请输入广告名称" :maxlength="40" style="width: 450px"></Input> <span class="input-ts">{{datePrice.name.length}}/40</span>
                </FormItem>
                <Form-item class="next_btn">                   
                    <Button type="primary" @click="nextStep('datePrice')" long size="large">下一步</Button>
                </Form-item>
            </Form>
        </div> 

     

        <br>
        <br>
        <br>
        <br>
        <br>
       
    </div>
</template>
<script>
import timeWeek from '@/components/time-week/index.vue';
import p65  from '@/images/adcreative/65.png';
import p148 from '@/images/adcreative/148.png';
import p184 from '@/images/adcreative/184.png';
import p210 from '@/images/adcreative/210.png';
import p471 from '@/images/adcreative/471.png';
import p473 from '@/images/adcreative/473.png';
import p486 from '@/images/adcreative/486.png';
import p487 from '@/images/adcreative/487.png';
export default {
    components: {
        timeWeek,
    },
    name: 'step-three',
    props:{
        //广告版位数据
        edition: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return {
            className : '',       
            columnsAdSpace: [
                {title: '广告版位',key: 'name'},
                {title: '创意形式',key: 'modus'},
                {title: '描述',key: 'description'}
            ],
            imgSrc:'',            
            options: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            datePrice:{
                //选择广告id
                id:'',
                date:'',
                time:'',
                style:'',
                price:'',
                name:''
            },            
            //投放时间
            allDay:true,
            timeStateList:[],
            timeEndList:[],
            //出价方式
            disabled_cpc : true,
            disabled_cpm : true,
            //表单验证
            ruleValidate:{                
                name: [
                    { required: true, message: '广告名称不能为空', trigger: 'blur' }
                ],
                price: [
                    { type:'number', required: true, message: '价格必须为数字值' } 
                ],
                dates: [
                    { required: true, type: 'date', message: '请选择投放日期', trigger: 'change' }
                ],
                bidstyle : [
                    { required: true, message: '请选出价方式', trigger: 'change' }
                ]
            }
        }
    },
    watch:{
        
    },
    computed:{ 
        //优化目标   出价方式要跟据优化目标来决定   
        goalList() {
            let goalArr = [],
                goal = this.$store.state.newad.ads_config.optimization_goal;                
            for(let i in goal){
                goalArr.push({ 'id': i, 'value': goal[i].val_type, 'label' : goal[i].name })
            }
            return goalArr;
        },       
    },    
    methods:{
        //选择优化目标
        getStyle(val){
            if( val=='OPTIMIZATIONGOAL_CLICK' || val=='OPTIMIZATIONGOAL_APP_ACTIVATE' || val=='OPTIMIZATIONGOAL_APP_REGISTER' || val=='OPTIMIZATIONGOAL_PROMOTION_CLICK_KEY_PAGE' || val=='OPTIMIZATIONGOAL_ECOMMERCE_ORDER' || val=='OPTIMIZATIONGOAL_APP_PURCHASE' || val=='OPTIMIZATIONGOAL_ECOMMERCE_CHECKOUT' || val=='OPTIMIZATIONGOAL_PAGE_RESERVATION' ){
                this.disabled_cpc = false;  
                this.disabled_cpm = true;              
            }else if(val=='OPTIMIZATIONGOAL_IMPRESSION'){
                this.disabled_cpm = this.disabled_cpc = false;
            }
            this.datePrice.style = 'CPC';
        },
        //选择广告版位
        rowClick(row){
            this.className = 'ad_table';
            this.datePrice.id = row.id;
            switch(row.id){
                case  65: this.imgSrc = p65; break;
                case 148: this.imgSrc = p148; break;
                case 184: this.imgSrc = p184; break;
                case 210: this.imgSrc = p210; break;
                case 471: this.imgSrc = p471; break;
                case 473: this.imgSrc = p473; break;
                case 486: this.imgSrc = p486; break;
                case 487: this.imgSrc = p487; break;
            };
            this.datePrice.name = row.name + '/' + row.modus + '/' + row.description;
        }, 
        //出价 正则过滤非数字
        getPrice(){
            let patrn = /^\d+(\.\d+)?$/;     
            if (!patrn.exec(this.datePrice.price)){
                //this.$Message.error('请输入正确价格！');
                this.datePrice.price = '';
            }
        },
        //特定时间段
        period(){
            this.allDay  = false;
        },
        //特定时间段 - 开始时间
        startTime(val){
            this.timeState = val;       
            this.setEndTime(this.timeState);
        },
        //特定时间段 - 结束时间
        endTime(val){
            this.timeEnd = val; 
            this.setStartTime(this.timeEnd);
        },
        //设置特定时间开始时间
        setStartTime(t){
            let time = [];
            for (let i = 0; i <= 24; i++){
                let index =  i < 10 ? '0'+i : i;
                let obj = {}
                obj.value = i
                obj.label = index + ':00';
                if(i>=t){
                    obj.disabled = true;
                }else{
                    obj.disabled = false;
                }
                time.push(obj)
            }
            this.timeStateList = time;
        },
        //设置特定时间结束时间
        setEndTime(t){
            let time = [];
            for(let i=24; i>=0; i--){
                let index =  i < 10 ? '0'+i : i;
                let obj = {}
                obj.value = i
                obj.label = index + ':00';
                if(i<=t){
                    obj.disabled = true;
                }else{
                    obj.disabled = false;
                }
                time.push(obj)
            }
            this.timeEndList = time;
        },
        //设置特定时间开始时间
        setStartTime(t){
            let time = [];
            for (let i = 0; i <= 24; i++){
                let index =  i < 10 ? '0'+i : i;
                let obj = {}
                obj.value = i
                obj.label = index + ':00';
                if(i>=t){
                    obj.disabled = true;
                }else{
                    obj.disabled = false;
                }
                time.push(obj)
            }
            this.timeStateList = time;
        },
        //设置特定时间结束时间
        setEndTime(t){
            let time = [];
            for(let i=24; i>=0; i--){
                let index =  i < 10 ? '0'+i : i;
                let obj = {}
                obj.value = i
                obj.label = index + ':00';
                if(i<=t){
                    obj.disabled = true;
                }else{
                    obj.disabled = false;
                }
                time.push(obj)
            }
            this.timeEndList = time;
        },
        //下一步
        nextStep (name) {
            console.log(this.datePrice)
            if(this.datePrice.id == ''){

            };
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('提交成功!');
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },    
    },
    mounted(){
        this.setStartTime(24);
        this.setEndTime(0);      
    }   
};
</script>