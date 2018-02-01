<style lang="less">
    .newad .ivu-table-row-hover td{background-color: #f8f9fa;}
    .newad .ivu-table-row-highlight td{color: #e88e00}
    .newad .ivu-form-item-label{color: #888;}
    .newad .ivu-form-item{margin-bottom: 15px;}
    .adspace{margin:10px 0 30px;}
    .date_price{margin: 20px 0;}
    .next_btn{width: 300px; margin-top:40px;}
    .next_btn .ivu-btn-large{padding: 10px 15px; font-size: 16px;}
</style>
<template>
    <div class="newad">
        <h3 class="subtit">广告版位</h3>
        <Alert type="error" v-if="verify.select_ad"  show-icon>请选择要投放的版位</Alert>
        <div class="adspace">
            <Table :loading="adspaceLoading" :columns="columnsAdSpace" :data="adcreative_template" highlight-row  @on-row-click="rowClick" :height="400" size="small"></Table>
        </div>
        
        <h3 class="subtit">排期与出价</h3>  
        <Alert type="error" v-if="verify.dp" show-icon>{{verify.dp_txt}}</Alert>      
        <div class="date_price">
            <Form :model="datePrice" :label-width="90" :rules="rules">
                <FormItem label="投放日期：">
                    <DatePicker @on-change="changeDate" type="date" format="yyyy-MM-dd" placeholder="长期投放" style="width: 300px; margin-right:15px;"></DatePicker>
                    <DatePicker @on-change="changeDate" type="daterange" format="yyyy-MM-dd" placement="bottom-end" placeholder="在某日期范围内投放" style="width: 300px"></DatePicker>
                </FormItem>
                <FormItem label="投放时间：">

                    <Checkbox v-model="allDay">
                        <span>全天</span>                       
                    </Checkbox>
                    <span style="margin:0 15px; color:#999">/</span>


                    特定时间段：
                    <Select :disabled="allDay" @on-change="startTime" style="width:100px">
                        <Option v-for="item in timeStateList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                    </Select>
                    -
                    <Select :disabled="allDay" @on-change="endTime" style="width:100px">
                        <Option v-for="item in timeEndList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                    </Select>
                    <span style="color:#ccc">(这里还差一个功能就是要程序判断是否朋友圈)</span>
                </FormItem>
                <FormItem label="出价方式：">
                    <RadioGroup v-model="style" type="button" >
                        <Radio label="CPC" :disabled="disabled_cpc"></Radio>
                        <Radio label="CPM" :disabled="disabled_cpm"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="出价：" prop="price">
                    <Input v-model="datePrice.price" placeholder="输入价格" number style="width: 300px">
                        <span slot="append">元/点击</span>
                    </Input>
                </FormItem>
                <br/>
                <FormItem label="广告名称">
                    <Input v-model="ad_name" :maxlength="40" ><span slot="append">{{ad_name.length}}/40</span></Input>
                </FormItem>
            </Form>
        </div>    

        <div class="next_btn">
            <Button type="primary" @click="nextStep" long size="large">下一步</Button>
        </div>        

        <br>
        <br>
        <br>
        <br>
    </div>
</template>
<script>
import timeWeek from '@/components/time-week/index.vue';
export default {
    components: {
        timeWeek,
    },
    name: 'step-three',
    data(){
        return {            
            columnsAdSpace: [
                {title: '广告版位',key: 'name'},
                {title: '创意形式',key: 'means'},
                {title: '描述',key: 'des'}
            ],
            //广告版位表格Loading
            adspaceLoading : true,
            //获取到所有广告版位信息
            ad_space : [], 

            //选择广告版位
            sad:{},
            //投放日期
            date:'',
            //投放时间
            time:'',
            //出价方式
            style:'',            
            //广告名称
            ad_name:'',

            //排期与出价所有元素
            datePrice :{
                //出价
                price:'',
            },

            //出价方式
            disabled_cpc : true,
            disabled_cpm : true,

            //投放时间 - 特定时间段
            allDay:true,
            timeState :'',  //选中的开始时间
            timeStateList : [],
            timeEnd:'', //选中的结束时间
            timeEndList:[],

            //出价输入输验证
            rules: {
                price: [
                    { type:'number', message: '价格必须为数字值' } 
                ],
            },  

            //下一步操作时判断
            verify :{
                select_ad : false,
                dp : false,
                dp_txt : ''
            }                   
        }
    },
    watch : {
        //监听排期与出价输入
        datePrice:{  
            handler:function(val,oldval){  
                //console.log(val)  
            },  
            //对象内部的属性监听，也叫深度监听
            deep:true
        },
        allDay:function(val,old){
            console.log(val)
        }
    },
    computed :{        
        //获取 广告版位
        adcreative_template() {
            const temp = this.ad_space =  this.$store.state.newad.adcreative_template;
            //console.log(this.ad_space);  //这里面还有其它参数暂时没用到
            let sliceTemp = [];
            temp.forEach( (val) => {
                let obj = {},  name = val.name, t = name.split('-');
                obj.id = val.id;
                obj.name = t[0];
                obj.means = t[1];
                obj.des = t[2];
                obj.des = t[2];
                sliceTemp.push(obj)
            });
            this.adspaceLoading = false;
           return sliceTemp;
        },        
    },    
    methods:{
        //选择广告版位
        rowClick(row){
            let id = row.id;            
            this.ad_space.forEach( val =>{
                if(id == val.id){
                    //console.log(val)
                    this.sad = val;
                    this.ad_name = val.name;
                    //判断出价方式是否可选
                    val.billing_event.forEach( types => {
                        if(types == 'BILLINGEVENT_CLICK'){
                            this.disabled_cpc = false;
                            this.style = 'CPC';
                        }
                        if(types == 'BILLINGEVENT_IMPRESSION'){
                            this.disabled_cpm = false;
                        }
                    });
                }
            });
            //关闭错误提示
            if(this.verify.select_ad){
                this.verify.select_ad = false;
            }
        },
        //设置投放日期
        changeDate(val){
            this.date = val;
        },
        //特定时间段
        startTime(val){
            this.timeState = val;       
            this.setEndTime(this.timeState);
        },
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
        nextStep(){
            //console.log( this.allDay )
            if(this.allDay){
                console.log('投放时间')
            }else{

            }
            let data = {
                sid : this.sad, 
                date : this.date,
                time : this.time,
                style : this.style,
                price :  this.datePrice.price,
                name : this.ad_name
            };
            console.log(data)
            if(!this.sad.id){
                this.verify.select_ad = true;
                return false
            }
            if(this.price == ''){
                this.verify.dp = true;
                this.verify.dp_txt = "请填写价格";
                return false
            };            
            console.log("下一步") 

            //在这里把需要的数据传给父组件
            //this.$emit('on-change', data);  //父组件用on-change提交上传来的数据
        },
        //计算出时间系
        timeSeries(start,end){
            /*
            投放时间段，格式为 48 * 7 位字符串，且都为 0 和 1，以半个小时为最小粒度，从周一零点开始至周日 24 点结束。 
            0 为不投放， 1 为投放，不传此字段、全为 0 、全为 1 均视为全时段投放。朋友圈广告的投放时间需大于等于 6 小时，小于等于 10 个自然日，
            且每天投放的时段需保持一致字段长度最小 336 字节，长度最大 336 字节
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            111111000000000000111111111111111111111111111111
            */
            let day = 7, grid = 23, serice ='';
            for(let i=0;i<7;i++){
                for (let index = 0; index <= grid; index++) {
                    if(index >= start && index <= end){
                        serice += '11' 
                    }else{
                        serice += '00'  
                    }                           
                }
            }
            console.log(serice)
            return serice;
        }
    },
    mounted(){
        //设置特定时间段开始时间
        this.setStartTime(24);
        this.setEndTime(0);

        //请求广告版位
        this.$store.dispatch('getAdSpace');

        //测试计算时间系
        this.timeSeries(0,23);
    }
   
};
</script>