<style lang="less">
    @import './index.css';
</style>
<template>
    <div class="duration-area">
        <div class="duration">
            <ul class="header">
                <li class="pull-left info">星期\时间</li>
                <li class="pull-left time">
                    <div class="num">00:00 - 12:00</div>
                    <ul class="detail clearfix">
                        <li class="digital pull-left">0</li>
                        <li class="digital pull-left">1</li>
                        <li class="digital pull-left">2</li>
                        <li class="digital pull-left">3</li>
                        <li class="digital pull-left">4</li>
                        <li class="digital pull-left">5</li>
                        <li class="digital pull-left">6</li>
                        <li class="digital pull-left">7</li>
                        <li class="digital pull-left">8</li>
                        <li class="digital pull-left">9</li>
                        <li class="digital pull-left">10</li>
                        <li class="digital pull-left last">11</li>
                    </ul>
                </li>
                <li class="pull-left time">
                    <div class="num">12:00 - 24:00</div>
                    <ul class="detail clearfix">
                        <li class="digital pull-left">12</li>
                        <li class="digital pull-left">13</li>
                        <li class="digital pull-left">14</li>
                        <li class="digital pull-left">15</li>
                        <li class="digital pull-left">16</li>
                        <li class="digital pull-left">17</li>
                        <li class="digital pull-left">18</li>
                        <li class="digital pull-left">19</li>
                        <li class="digital pull-left">20</li>
                        <li class="digital pull-left">21</li>
                        <li class="digital pull-left">22</li>
                        <li class="digital pull-left last">23</li>
                    </ul>
                </li>
            </ul>
            <div class="content">
                <!-- <div class="tiemtip">fdsfds</div> -->
                <ul class="pull-left week"><li class="day">星期一</li><li class="day">星期二</li><li class="day">星期三</li><li class="day">星期四</li><li class="day">星期五</li><li class="day">星期六</li><li class="day">星期日</li></ul>
                <ul class="boxzone">
                    <li class="box " data-id="10050"></li>
                    <li class="box " data-id="10100"></li>
                    <li class="box " data-id="10150"></li>
                    <li class="box " data-id="10200"></li>
                    <li class="box " data-id="10250"></li>
                    <li class="box " data-id="10300"></li>
                    <li class="box " data-id="10350"></li>
                    <li class="box " data-id="10400"></li>
                    <li class="box " data-id="10450"></li>
                    <li class="box " data-id="10500"></li>
                    <li class="box " data-id="10550"></li>
                    <li class="box " data-id="10600"></li>
                    <li class="box " data-id="10650"></li>
                    <li class="box " data-id="10700"></li>
                    <li class="box " data-id="10750"></li>
                    <li class="box " data-id="10800"></li>
                    <li class="box " data-id="10850"></li>
                    <li class="box " data-id="10900"></li>
                    <li class="box " data-id="10950"></li>
                    <li class="box " data-id="11000"></li><li class="box " data-id="11050"></li><li class="box " data-id="11100"></li><li class="box " data-id="11150"></li>
                    <li class="box " data-id="11200"></li><li class="box " data-id="11250"></li><li class="box " data-id="11300"></li><li class="box " data-id="11350"></li>
                    <li class="box " data-id="11400"></li><li class="box " data-id="11450"></li><li class="box " data-id="11500"></li><li class="box " data-id="11550"></li>
                    <li class="box " data-id="11600"></li><li class="box " data-id="11650"></li><li class="box " data-id="11700"></li><li class="box " data-id="11750"></li>
                    <li class="box " data-id="11800"></li><li class="box " data-id="11850"></li><li class="box " data-id="11900"></li><li class="box " data-id="11950"></li>
                    <li class="box " data-id="12000"></li><li class="box " data-id="12050"></li><li class="box " data-id="12100"></li><li class="box " data-id="12150"></li>
                    <li class="box " data-id="12200"></li><li class="box " data-id="12250"></li><li class="box " data-id="12300"></li><li class="box " data-id="12350"></li>
                    <li class="box " data-id="12400"></li><li class="box " data-id="20050"></li><li class="box " data-id="20100"></li><li class="box " data-id="20150"></li>
                    <li class="box " data-id="20200"></li><li class="box " data-id="20250"></li><li class="box " data-id="20300"></li><li class="box " data-id="20350"></li>
                    <li class="box " data-id="20400"></li><li class="box " data-id="20450"></li><li class="box " data-id="20500"></li><li class="box " data-id="20550"></li>
                    <li class="box " data-id="20600"></li><li class="box " data-id="20650"></li><li class="box " data-id="20700"></li><li class="box " data-id="20750"></li>
                    <li class="box " data-id="20800"></li><li class="box " data-id="20850"></li><li class="box " data-id="20900"></li><li class="box " data-id="20950"></li>
                    <li class="box " data-id="21000"></li><li class="box " data-id="21050"></li><li class="box " data-id="21100"></li><li class="box " data-id="21150"></li>
                    <li class="box " data-id="21200"></li><li class="box " data-id="21250"></li><li class="box " data-id="21300"></li><li class="box " data-id="21350"></li>
                    <li class="box " data-id="21400"></li><li class="box " data-id="21450"></li><li class="box " data-id="21500"></li><li class="box " data-id="21550"></li>
                    <li class="box " data-id="21600"></li><li class="box " data-id="21650"></li><li class="box " data-id="21700"></li><li class="box " data-id="21750"></li>
                    <li class="box " data-id="21800"></li><li class="box " data-id="21850"></li><li class="box " data-id="21900"></li><li class="box " data-id="21950"></li>
                    <li class="box " data-id="22000"></li><li class="box " data-id="22050"></li><li class="box " data-id="22100"></li><li class="box " data-id="22150"></li>
                    <li class="box " data-id="22200"></li><li class="box " data-id="22250"></li><li class="box " data-id="22300"></li><li class="box " data-id="22350"></li>
                    <li class="box " data-id="22400"></li><li class="box " data-id="30050"></li><li class="box " data-id="30100"></li><li class="box " data-id="30150"></li>
                    <li class="box " data-id="30200"></li><li class="box " data-id="30250"></li><li class="box " data-id="30300"></li><li class="box " data-id="30350"></li>
                    <li class="box " data-id="30400"></li><li class="box " data-id="30450"></li><li class="box " data-id="30500"></li><li class="box " data-id="30550"></li>
                    <li class="box " data-id="30600"></li><li class="box " data-id="30650"></li><li class="box " data-id="30700"></li><li class="box " data-id="30750"></li>
                    <li class="box " data-id="30800"></li><li class="box " data-id="30850"></li><li class="box " data-id="30900"></li><li class="box " data-id="30950"></li>
                    <li class="box " data-id="31000"></li><li class="box " data-id="31050"></li><li class="box " data-id="31100"></li><li class="box " data-id="31150"></li>
                    <li class="box " data-id="31200"></li><li class="box " data-id="31250"></li><li class="box " data-id="31300"></li><li class="box " data-id="31350"></li>
                    <li class="box " data-id="31400"></li><li class="box " data-id="31450"></li><li class="box " data-id="31500"></li><li class="box " data-id="31550"></li>
                    <li class="box " data-id="31600"></li><li class="box " data-id="31650"></li><li class="box " data-id="31700"></li><li class="box " data-id="31750"></li>
                    <li class="box " data-id="31800"></li><li class="box " data-id="31850"></li><li class="box " data-id="31900"></li><li class="box " data-id="31950"></li>
                    <li class="box " data-id="32000"></li><li class="box " data-id="32050"></li><li class="box " data-id="32100"></li><li class="box " data-id="32150"></li>
                    <li class="box " data-id="32200"></li><li class="box " data-id="32250"></li><li class="box " data-id="32300"></li><li class="box " data-id="32350"></li>
                    <li class="box " data-id="32400"></li><li class="box " data-id="40050"></li><li class="box " data-id="40100"></li><li class="box " data-id="40150"></li>
                    <li class="box " data-id="40200"></li><li class="box " data-id="40250"></li><li class="box " data-id="40300"></li><li class="box " data-id="40350"></li>
                    <li class="box " data-id="40400"></li><li class="box " data-id="40450"></li><li class="box " data-id="40500"></li><li class="box " data-id="40550"></li>
                    <li class="box " data-id="40600"></li><li class="box " data-id="40650"></li><li class="box " data-id="40700"></li><li class="box " data-id="40750"></li>
                    <li class="box " data-id="40800"></li><li class="box " data-id="40850"></li><li class="box " data-id="40900"></li><li class="box " data-id="40950"></li>
                    <li class="box " data-id="41000"></li><li class="box " data-id="41050"></li><li class="box " data-id="41100"></li><li class="box " data-id="41150"></li>
                    <li class="box " data-id="41200"></li><li class="box " data-id="41250"></li><li class="box " data-id="41300"></li><li class="box " data-id="41350"></li>
                    <li class="box " data-id="41400"></li><li class="box " data-id="41450"></li><li class="box " data-id="41500"></li><li class="box " data-id="41550"></li>
                    <li class="box " data-id="41600"></li><li class="box " data-id="41650"></li><li class="box " data-id="41700"></li><li class="box " data-id="41750"></li>
                    <li class="box " data-id="41800"></li><li class="box " data-id="41850"></li><li class="box " data-id="41900"></li><li class="box " data-id="41950"></li>
                    <li class="box " data-id="42000"></li><li class="box " data-id="42050"></li><li class="box " data-id="42100"></li><li class="box " data-id="42150"></li>
                    <li class="box " data-id="42200"></li><li class="box " data-id="42250"></li><li class="box " data-id="42300"></li><li class="box " data-id="42350"></li>
                    <li class="box " data-id="42400"></li><li class="box " data-id="50050"></li><li class="box " data-id="50100"></li><li class="box " data-id="50150"></li>
                    <li class="box " data-id="50200"></li><li class="box " data-id="50250"></li><li class="box " data-id="50300"></li><li class="box " data-id="50350"></li>
                    <li class="box " data-id="50400"></li><li class="box " data-id="50450"></li><li class="box " data-id="50500"></li><li class="box " data-id="50550"></li>
                    <li class="box " data-id="50600"></li><li class="box " data-id="50650"></li><li class="box " data-id="50700"></li><li class="box " data-id="50750"></li>
                    <li class="box " data-id="50800"></li><li class="box " data-id="50850"></li><li class="box " data-id="50900"></li><li class="box " data-id="50950"></li>
                    <li class="box " data-id="51000"></li><li class="box " data-id="51050"></li><li class="box " data-id="51100"></li><li class="box " data-id="51150"></li>
                    <li class="box " data-id="51200"></li><li class="box " data-id="51250"></li><li class="box " data-id="51300"></li><li class="box " data-id="51350"></li>
                    <li class="box " data-id="51400"></li><li class="box " data-id="51450"></li><li class="box " data-id="51500"></li><li class="box " data-id="51550"></li>
                    <li class="box " data-id="51600"></li><li class="box " data-id="51650"></li><li class="box " data-id="51700"></li><li class="box " data-id="51750"></li>
                    <li class="box " data-id="51800"></li><li class="box " data-id="51850"></li><li class="box " data-id="51900"></li><li class="box " data-id="51950"></li>
                    <li class="box " data-id="52000"></li><li class="box " data-id="52050"></li><li class="box " data-id="52100"></li><li class="box " data-id="52150"></li>
                    <li class="box " data-id="52200"></li><li class="box " data-id="52250"></li><li class="box " data-id="52300"></li><li class="box " data-id="52350"></li>
                    <li class="box " data-id="52400"></li><li class="box " data-id="60050"></li><li class="box " data-id="60100"></li><li class="box " data-id="60150"></li>
                    <li class="box " data-id="60200"></li><li class="box " data-id="60250"></li><li class="box " data-id="60300"></li><li class="box " data-id="60350"></li>
                    <li class="box " data-id="60400"></li><li class="box " data-id="60450"></li><li class="box " data-id="60500"></li><li class="box " data-id="60550"></li>
                    <li class="box " data-id="60600"></li><li class="box " data-id="60650"></li><li class="box " data-id="60700"></li><li class="box " data-id="60750"></li>
                    <li class="box " data-id="60800"></li><li class="box " data-id="60850"></li><li class="box " data-id="60900"></li><li class="box " data-id="60950"></li>
                    <li class="box " data-id="61000"></li><li class="box " data-id="61050"></li><li class="box " data-id="61100"></li><li class="box " data-id="61150"></li>
                    <li class="box " data-id="61200"></li><li class="box " data-id="61250"></li><li class="box " data-id="61300"></li><li class="box " data-id="61350"></li>
                    <li class="box " data-id="61400"></li><li class="box " data-id="61450"></li><li class="box " data-id="61500"></li><li class="box " data-id="61550"></li>
                    <li class="box " data-id="61600"></li><li class="box " data-id="61650"></li><li class="box " data-id="61700"></li><li class="box " data-id="61750"></li>
                    <li class="box " data-id="61800"></li><li class="box " data-id="61850"></li><li class="box " data-id="61900"></li><li class="box " data-id="61950"></li>
                    <li class="box " data-id="62000"></li><li class="box " data-id="62050"></li><li class="box " data-id="62100"></li><li class="box " data-id="62150"></li>
                    <li class="box " data-id="62200"></li><li class="box " data-id="62250"></li><li class="box " data-id="62300"></li><li class="box " data-id="62350"></li>
                    <li class="box " data-id="62400"></li><li class="box " data-id="70050"></li><li class="box " data-id="70100"></li><li class="box " data-id="70150"></li>
                    <li class="box " data-id="70200"></li><li class="box " data-id="70250"></li><li class="box " data-id="70300"></li><li class="box " data-id="70350"></li>
                    <li class="box " data-id="70400"></li><li class="box " data-id="70450"></li><li class="box " data-id="70500"></li><li class="box " data-id="70550"></li>
                    <li class="box " data-id="70600"></li><li class="box " data-id="70650"></li><li class="box " data-id="70700"></li><li class="box " data-id="70750"></li>
                    <li class="box " data-id="70800"></li><li class="box " data-id="70850"></li><li class="box " data-id="70900"></li><li class="box " data-id="70950"></li>
                    <li class="box " data-id="71000"></li><li class="box " data-id="71050"></li><li class="box " data-id="71100"></li><li class="box " data-id="71150"></li>
                    <li class="box " data-id="71200"></li><li class="box " data-id="71250"></li><li class="box " data-id="71300"></li><li class="box " data-id="71350"></li>
                    <li class="box " data-id="71400"></li><li class="box " data-id="71450"></li>
                    <li class="box " data-id="71500"></li><li class="box " data-id="71550"></li><li class="box " data-id="71600"></li><li class="box " data-id="71650"></li>
                    <li class="box " data-id="71700"></li><li class="box " data-id="71750"></li><li class="box " data-id="71800"></li><li class="box " data-id="71850"></li>
                    <li class="box " data-id="71900"></li><li class="box " data-id="71950"></li><li class="box " data-id="72000"></li><li class="box " data-id="72050"></li>
                    <li class="box " data-id="72100"></li><li class="box " data-id="72150"></li><li class="box " data-id="72200"></li><li class="box " data-id="72250"></li>
                    <li class="box " data-id="72300"></li><li class="box " data-id="72350"></li><li class="box " data-id="72400"></li>
                </ul>
            </div>
        </div>
        <div class="duration-tipline">
            <span class="color-box"></span>
            <span>未选</span>
            <span class="color-box color-blue"></span>
            <span>已选</span>
            <span class="weektip">可拖动鼠标选择时间段</span>
            <a class="emptied" style="cursor: pointer;">清空</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'time-week',
    props: {
        //game : Array
    },
    
}
</script>