<template>
    <span>
        <span @click="addDescModel = true" class="sm">广告位说明
            <Icon style="cursor:pointer;" type="document-text"></Icon>
        </span>
        <Modal v-model="addDescModel" width="1000px" title="广告位说明">
            <table class="table tc">
                <thead>
                    <tr>
                        <th>应用名称</th>
                        <th>选项归属</th>
                        <th>广告位名称</th>
                        <th>广告位说明</th>
                        <th>广告优势</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowspan="5">今日头条</td>
                        <td rowspan="3">信息流</td>
                        <td>头条信息流</td>
                        <td>位于今日头条各频道刷新后的信息流内容当中</td>
                        <td>样式原生，信息流内容入口，即刷即有</td>
                    </tr>
                    <tr>
                        <td>视频相关推荐</td>
                        <td>位于视频内容页底部相关推荐信息流内容当中</td>
                        <td>样式原生，广告平均曝光时间长</td>
                    </tr>
                    <tr>
                        <td>视频后贴片</td>
                        <td>位于视频广告尾帧</td>
                        <td>与视频内容紧密连接，广告有效观看率高</td>
                    </tr>
                    <tr>
                        <td rowspan="2">详情页</td>
                        <td>头条详情页</td>
                        <td>位于原生资讯内容页底部，评论上方</td>
                        <td>支持文章分类定向，贴合用户阅读场景</td>
                    </tr>
                    <tr>
                        <td>组图详情页</td>
                        <td>位于原生组图内容最后一张图片位置</td>
                        <td>内容醒目，广告呈现力强</td>
                    </tr>
                    <tr>
                        <td>西瓜视频</td>
                        <td>西瓜视频</td>
                        <td>西瓜信息流</td>
                        <td>位于西瓜视频各频道刷新后的信息流内容当中</td>
                        <td>样式原生，信息流内容入口，即刷即有</td>
                    </tr>
                </tbody>
            </table>
            <table class="table tc margin-top-20">
                <thead>
                    <tr>
                        <th>头条信息流</th>
                        <th>视频相关推荐</th>
                        <th>视频后贴片</th>
                        <th>头条详情页</th>
                        <th>组图详情页</th>
                        <th>西瓜信息流</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/toutiao_feed_44c7133.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_recommend_160130c.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_post_f9afe09.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/toutiao_detail_b50954d.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/group_detail_f9ac6cb.png"></td>
                        <td><img width="140" src="//s1.pstatp.com/bytecom/resource/creative_web/static/image/video_slot_desc/video_feed_0af0836.png"></td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    </span>
</template>

<script>
export default {
    name: "creativeDescription",
    data() {
        return {
            addDescModel: false,
        };
    }
};
</script>
