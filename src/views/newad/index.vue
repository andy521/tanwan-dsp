
<style lang="less">
    @import '../../styles/common.less';
    @import './index.less';
</style>
<template>
    <div class="layout ad">
        <Layout :style="{minHeight: '100vh'}">
            <Sider width="auto" hide-trigger :style="{background: '#fff'}">              
                <Menu :theme="theme3" accordion active-name="2" @on-select="selectMun">                  
                    <MenuGroup title="推广计划">
                        <MenuItem name="1">
                            选择计划
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="广告">
                        <MenuItem name="2">
                            目标详情
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                        <MenuItem name="3">
                            定向
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                        <MenuItem name="4">
                            广告版位
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                        <MenuItem name="5">
                            排期和出价
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup title="广告创意">
                        <MenuItem name="6">
                            上传创意
                            <Icon type="ios-more-outline"></Icon>
                        </MenuItem>
                    </MenuGroup>
                </Menu>
            </Sider>
            <Layout>
                <Content :style="{padding: '0 40px 40px'}">
                    <Row>
                        <Col span="18">


                            <!-- date:'',
                            time:'',
                            style:'',
                            price:''     -->


                            <div class="ad-desc">排期与出价</div>
                            <div class="margin-top-20">
                                <Form :model="bid" label-position="top">
                                    <FormItem label="投放日期">
                                        <Row :gutter="15">
                                            <Col span="12"><DatePicker style="width:100%" v-model="bid.date" type="date" placeholder="长期投放"></DatePicker></Col>
                                            <Col span="12"><DatePicker style="width:100%" v-model="bid.date" type="daterange" placement="bottom-end" placeholder="在某日期范围内投放"></DatePicker></Col>
                                        </Row>
                                    </FormItem>
                                    <FormItem label="投放时间">
                                        <Radio v-model="bid.time">全天</Radio>
                                    </FormItem>
                                    
                                </Form>
                            </div>

                            <h3 class="ad-tit">广告创意</h3>
                            <Tabs :animated="false">
                                <TabPane v-for="tab in tabs" :key="tab" :label="'创意' + tab">
                                    创意{{ tab }} 
                                </TabPane>
                                <Button type="text" @click="CreativeTabsAdd" slot="extra">+添加创意</Button>
                            </Tabs> 
                            <div class="ad-desc">上传创意</div>
                            <div class="ad-up">
                                <Row>
                                    <Col span="12">
                                        <div class="ad-up-file">                                    
                                            <Upload
                                                multiple
                                                type="drag"
                                                action="//jsonplaceholder.typicode.com/posts/">
                                                    <div style="padding: 20px 0">
                                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                                        <p class="ad-up-size">640px*360px</p>
                                                        <p>(推荐尺寸)</p>
                                                        <p>点击或拖拽上传</p>
                                                        <p>JPG/JPEG/PNG，小于50KB</p>
                                                    </div>
                                            </Upload>
                                            <div class="controlbtn">
                                                <ButtonGroup>
                                                    <Button type="text"  @click="creativeSelect"><Icon size="26" type="ios-film-outline"></Icon> 制作视频</Button>                            
                                                    <Button type="text"  @click="creativeSelect"><Icon size="30" type="ios-filing-outline"></Icon> 从创意库选择</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <div class="ad-up-file">                                    
                                            <Upload
                                                multiple
                                                type="drag"
                                                action="//jsonplaceholder.typicode.com/posts/">
                                                    <div style="padding: 20px 0">
                                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                                        <p class="ad-up-size">640px*360px</p>
                                                        <p>(推荐尺寸)</p>
                                                        <p>点击或拖拽上传</p>
                                                        <p>JPG/JPEG/PNG，小于50KB</p>
                                                    </div>
                                            </Upload>
                                            <div class="controlbtn">
                                                <ButtonGroup>
                                                    <Button type="text"  @click="creativeSelect"><Icon size="26" type="ios-film-outline"></Icon> 制作视频</Button>                            
                                                    <Button type="text"  @click="creativeSelect"><Icon size="30" type="ios-filing-outline"></Icon> 从创意库选择</Button>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <Form :model="creativeForm" label-position="top">
                                <FormItem label="请输入广告文案">
                                    <Input v-model="creativeForm.text" :maxlength="20" placeholder="请输入广告文案(20字内)">
                                        <Select  slot="append" style="width: 70px">
                                            <Option value="city">城市</Option>
                                            <Option value="gender">性别</Option>
                                            <Option value="day">日期</Option>
                                            <Option value="week">星期</Option>
                                        </Select>
                                    </Input>
                                </FormItem>
                                <FormItem label="应用直达URL(可选)">
                                    <Input v-model="creativeForm.url" placeholder="请输入应用直达链接，指定点击广告可直达的应用内落地页">
                                        <Button slot="append" icon="more"></Button>
                                    </Input>
                                </FormItem>
                            </Form>

                            <div class="ad-desc">落地页</div>
                            <Select v-model="landing" placeholder="请选择落地页">
                                <Option v-for="item in landingList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                <div class="select-ts">没有落地页？<a href="#">请制作落地页</a></div>
                            </Select>


                        </Col>
                        <Col span="4" offset="2">
                            这里是提示吧
                        </Col>
                    </Row> 
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import timeWeek from '@/components/time-week/index.vue';
export default {
    components: {
        timeWeek
    },
    data(){
        return {
            theme3: 'light',
            //排期与出价
            bid:{
                date:'',
                time:'',
                style:'',
                price:''
            },

            //广告创意
            tabs: 1,
            ctab : [1,1,0],
            creativeSelect : false,
            creativeForm:{
                text:'',
                url:''
            },

            //落地页
            landing:'',
            landingList : [
                {
                    value: 'New York',
                    label: 'New York'
                }
            ]
        }
    },
    methods:{
        selectMun(val){
            console.log(val)
        },
        CreativeTabsAdd(){
            this.tabs ++;
        },
        creativeTabRemove(n){
            //this.ctab[n] = 0
            //this['tab' + name] = false;
            //console.log(ctab[n])
        }
    }
   
};
</script>
<style>
.week{width: 900px; background: #ccc;}
</style>