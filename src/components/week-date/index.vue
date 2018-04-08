<style scoped>
.period{
    font-size: 13px;
    width: 812px;
    padding: 10px;
    margin: 0 auto;
    background: #fff;
}
.tip_bar{
    line-height: 18px;
    padding: 10px 0;
}
.tip_bar .action {
    display: inline-block;
}
.tip_bar .action span {
    display: inline-block;
    padding: 0 5px;
    cursor: pointer;
}
.tip_bar .tip {
    display: inline-block;
    float: right;
    margin-left: 20px;
}
.tip_bar .tip span {
    display: inline-block;
    height: 13px;
    margin-top: 2px;
    width: 13px;
    vertical-align: top;
    margin-right: 5px;
}
.tip_bar .tip .unselected-tip {
    background-color: #ccc;
}
.tip_bar .tip .selected-tip {
    background-color: #f7873d;
}
.period_main{
    margin-top: 15px;
    display: flex;
}
.weeks{
    padding-top: 30px;
    padding-left: 5px;
    width: 70px;
}
.weeks .ivu-checkbox-group-item{height: 30px; line-height: 30px;}
.day_list ul{
    height: 30px;
}
.day_list li{
    width: 30px;
    height: 30px;
    vertical-align: bottom;
    overflow: hidden;
    border: 1px solid #fff;
    border-width: 1px 1px 0 0;
    box-sizing: border-box;
    float: left;
}
.day_top li{
    font-size: 14px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    color: #ccc;
}
.day_top li:hover,.day_top li.selected{
    color: #f7873d;
}
.date li{
    color: #fff;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    cursor: pointer;
    background-color: #ccc;
}
.date li.cur{background-color: #f7873d;}
</style>
<template>
	<div class="period">
        <div class="tip_bar"> 
            <p class="action"> <span @click="jobs">工作日</span>| <span @click="weekend">周末</span>| <span @click="all">全部</span>| <span @click="setDate">重置</span> </p> 
            <p class="tip"><span class="unselected-tip"></span>暂停时间段</p> 
            <p class="tip"><span class="selected-tip"></span>投放时间段</p> 
        </div>
        <div class="period_main clear">
            <div class="weeks">
                <Checkbox-group v-model="week">
                    <Checkbox label="0">星期一</Checkbox>
                    <Checkbox label="1">星期二</Checkbox>
                    <Checkbox label="2">星期三</Checkbox>
                    <Checkbox label="3">星期四</Checkbox>
                    <Checkbox label="4">星期五</Checkbox>
                    <Checkbox label="5">星期六</Checkbox>
                    <Checkbox label="6">星期日</Checkbox>
                </Checkbox-group>
            </div>
            <div class="day_list">
                <ul class="day_top">
                    <li v-for="(item,index) in day" @click="setDay(index)" :class="{ 'selected': item == 1 }"><Icon type="arrow-down-c"></Icon></li>
                </ul>
                <ul v-for="(list,week) in date" :key="week" class="date">
                    <li v-for="(item,index) in list" :key="index" :class="{ 'cur': item == 1 }" @click="checkDate(week,index,item)">{{index}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
        name: 'weekDate',
        props:{
            value: {
                type: Array,
                default: []
            },
        }, 
		data() {
			return {
                week:[],
                day:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                date:[]
			}
        },
		methods: {
            //单日
            setDay(val){
                let isCheck = this.date.every( item => {
                    return item[val] > 0;
                });            
                this.date.forEach((item,index)=> {
                    if(isCheck){
                        this.$set(this.date[index], val, "0");
                        this.$set(this.day, val, "0");
                    }else{
                        this.$set(this.date[index], val, "1");
                        this.$set(this.day, val, "1");
                    }
                });
            },
            //单选
            checkDate(week,index,val){                
                console.log(week + '---' + index + '----' + val)
                if(val == "1"){
                    this.$set(this.date[week], index, "0");
                }else{
                    this.$set(this.date[week], index, "1");
                };
            },
            //工作日
            jobs(){
                for(let i=0; i<=6; i++){
                    for(let d=0; d<=23; d++){                    
                        if(i=='5' || i== '6'){
                            this.$set(this.date[i], d, "0");
                        }else{
                            this.$set(this.date[i], d, "1");
                        }
                    }
                };
                this.week = ['0','1','2','3','4'];
                this.day=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            },
            //周未
            weekend(){
                for(let i=0; i<=6; i++){
                    for(let d=0; d<=23; d++){                    
                        if(i=='5' || i== '6'){
                            this.$set(this.date[i], d, "1");
                        }else{
                            this.$set(this.date[i], d, "0");
                        }
                    }
                };
                this.week = ['5','6'];
                this.day=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            },
            //全部
            all(){
                for(let i=0; i<=6; i++){
                    for(let d=0; d<=23; d++){                    
                        this.$set(this.date[i], d, "1");
                    }
                };
                this.week = ['0','1','2','3','4','5','6'];
                this.day=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
            },
            arrayDiff(a, b){
                for(var i=0;i<b.length;i++){  
                    for(var j=0;j<a.length;j++){  
                        if(a[j]==b[i]){  
                            a.splice(j,1);
                            j=j-1;  
                        }  
                    }  
                }   
                return a; 
            },
            //设置日期
            setDate(){
                let d = [],
                    w = [];
                this.value.forEach( item => {
                    d.push(item.split(''));
                });
                d.forEach((item,index) =>{
                    let isWeek = item.every( val => {
                        return val > 0;
                    });
                    if(isWeek){
                        w.push('' + index)
                    }
                });
                this.date = d;
                this.week = w;
            }
        },
        watch: {
            week: function (n, o) {
                let news = n.length, old = o.length; 
                let newsArr = n.concat([]), oldArr = o.concat([]);
                if(news<old){
                    let less = this.arrayDiff(oldArr,newsArr)[0];
                    for(let l=0;l<=23;l++){
                        this.$set(this.date[less], l, "0");
                    }
                }else{
                    let plus = this.arrayDiff(newsArr,oldArr)[0];
                    for(let i=0;i<=23;i++){
                        this.$set(this.date[plus], i, "1");
                    }
                }
            },
            date(val){
                let value = [];
                val.forEach(item=>{
                    value.push(item.join(''))
                });
                this.$emit('input', value);
            }
        },
        beforeMount(){
            this.setDate();
        }
	}
</script>