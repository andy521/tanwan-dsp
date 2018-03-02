<style>
	@import "../../styles/common.less";
    html, body {
        width: 100%;
        height: auto;
        background: #fff;
    }
    .ad{
        padding: 0 280px;
    }
    .ivu-menu{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
    }
    .ivu-menu-vertical .ivu-menu-item{
        padding: 14px 24px 14px 40px;
    }
</style>
<template>
    <div class="ad">
        <Menu :theme="theme" @on-select="selectMenu" :active-name="cur">
            <Menu-group title="推广计划">
                <Menu-item name="1">
                    <Icon type="android-radio-button-off"></Icon>
                    推广计划
                </Menu-item>
                <Menu-item name="2">
                    <Icon type="android-radio-button-off"></Icon>
                    推广目标
                </Menu-item>
                <Menu-item name="3">
                    <Icon type="android-radio-button-off"></Icon>
                    计划设置
                </Menu-item>
            </Menu-group>
            <Menu-group title="广告">
                <Menu-item name="4">
                    <Icon type="android-radio-button-off"></Icon>
                    广告
                </Menu-item>
                <Menu-item name="5">
                    <Icon type="android-radio-button-off"></Icon>
                    定向
                </Menu-item>
                <Menu-item name="6">
                    <Icon type="android-radio-button-off"></Icon>
                    广告版位
                </Menu-item>
                <Menu-item name="7">
                    <Icon type="android-radio-button-off"></Icon>
                    排期和出价
                </Menu-item>
            </Menu-group>
            <Menu-group title="广告创意">
                <Menu-item name="8">
                    <Icon type="android-radio-button-off"></Icon>
                    上传创意
                </Menu-item>
            </Menu-group>
        </Menu>

        <!--步骤1-->
        <!-- <step-one></step-one>  -->
        <!--步骤2-->
        <!-- <step-two></step-two>   -->

        <!--步骤3-->         
        <step-three :edition="adcreative" @on-edition="getEditionData" @on-click="threeInfo"></step-three>
        <!--上传创意--> 
        <up-creative v-if="showCreative" :account="account_id" :template="creativeTemplate"></up-creative>
    </div>
</template>

<script>
	import stepOne from './components/stepOne.vue';
    import stepTwo from './components/stepTwo.vue';
    import stepThree from './components/stepThree.vue';
    import upCreative from './components/upCreative.vue';
    //广告版位数量
    import adcreative_template from './components/adcreative_template.js';

	export default {
		components: {
			stepOne,
            stepTwo,
            stepThree,
            upCreative
		},
		data() {
			return {
                //菜单主题
                theme: 'light',
                step:[1,2,3],
                cur:'4',

                account_id:'1264278',
                //广告版位数据
                adcreative:adcreative_template,
                //显示广告创意
                showCreative:false,
                //广告创意模板
                creativeTemplate:{},
			}
		},		
		methods: {
			//第三步提交过来的信息
			threeInfo(data) {
                this.showCreative = true;
                console.log(data)
            },
            //获取广告版位信息
            getEditionData(data){ 
                console.log(data)         
                this.creativeTemplate = data;
            },            
            //选择菜单
            selectMenu(val){
                console.log(val)
            }
		},
		computed: {

        },
        mounted(){
            //获取所有状态
            this.$store.dispatch('get_ads_config');
            //滚动条
            document.onscroll = function(){  
                //console.log(getScrollTop())      
            }  
            // let edition = document.getElementById('J_edition');
            // console.log(edition.offsetTop);            
        }
    };
    function getScrollTop(){   
        var scrollTop=0;   
        if(document.documentElement&&document.documentElement.scrollTop){   
            scrollTop=document.documentElement.scrollTop;   
        }else if(document.body){   
            scrollTop=document.body.scrollTop;   
        }   
        return scrollTop;   
    } 
</script>