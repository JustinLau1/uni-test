<template>
    <view class="content">
        <!-- <view class="tabs"> -->
        <!-- <view class="status_bar">这里是状态栏</view> -->
        <cu-custom bgImage="linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.6))" :isBack="false" :isShadown="false">
            <block slot="backText"></block>
            <block slot="content">{{companyName}}</block>
        </cu-custom>
        <scroll-view class="nav-area" scroll-x :scroll-left="navScrollLeft">
            <view class="scroller" :style="{ width: navItemWidth * navList.length + 'px' }">
                <view class="scroller-wrapper">
                    <!-- <view class="scroller-item" v-for="(tab, index) in navList" :key="index" :style="{ width: navItemWidth + 'px' }" -->
                    <view class="scroller-item" v-for="(tab, index) in navList" :key="index" :style="{ width: navItemWidth + 'px' }"
                        :class="{ active: index === changeIndex }" @tap="tapNav(index)">{{ tab.name }}</view>
                    <!-- :class="{ active: index === switchIndex }" @tap="tapNav(index)">{{ tab.name }}</view> -->
                </view>
                <view class="scroller-bar">
                    <view class="active-bar" :style="{ width: navItemWidth + 'px', left: activeBarLeft + 'px' }">
                        <view></view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- <view class="line-h" /> -->
        <view class="swiper-area">
            <!-- <pulldown-refresher ref="pulldownRefresher" @pulldownRefresh="refresh"> -->
            <!-- <swiper :current="switchIndex" :duration="567" @transition="transition" @change="change" @animationfinish="animationfinish"> -->
            <!-- <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="567" @transition="transition" -->
            <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="567" @transition="transition"
                @change="change" @animationfinish="animationfinish">
                <!-- <swiper-item v-for="(item, index) in navList" :key="index">
                        <scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }">
                            <image v-for="src in lists[index]" :src="src" :key="src"></image>
                        </scroll-view>
                    </swiper-item> -->
                <!-- <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1"> -->

                <!-- <swiper-item class="content1" v-for=" (item, index) in navList" :key="index">
                    <list class="list" :style="{ height: scrollViewHeight, width: screenWidth }">
                        <yy-refresh :refresh-text="refreshText" @refresh="refresh" ref="refreshStatus"></yy-refresh>
                        <scroll-view scroll-y :style="{ height: scrollViewHeight + 'px'}">
                            <cell v-for="src in lists[index]" :key="src">
                                <image :src="src"></image>
                            </cell>
                        </scroll-view>
                        <yy-load-more :loading-text="loadingText" @loadMore="loadMore" ref="loadMoreStatus"></yy-load-more>
                    </list>
                </swiper-item> -->

                <!-- <swiper-item class="swiper-item" v-for="(tab,index) in navList" :key="index">
                    <list class="scroll-v list" :style="{ height: scrollViewHeight, width: screenWidth }"
                        enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(index)">
                        <refresh class="refresh" @refresh="onrefresh(index)" @pullingdown="onpullingdown" :display="tab.refreshing ? 'show' : 'hide'">
                            <div class="refresh-view">
                                <image class="refresh-icon" :src="refreshIcon" :style="{width: (tab.refreshing || pulling) ? 0: '30px'}"
                                    :class="{'refresh-icon-active': tab.refreshFlag}"></image>
                                <loading-indicator class="loading-icon" animating="true" v-if="tab.refreshing"></loading-indicator>
                                <text class="loading-text">{{tab.refreshText}}</text>
                            </div>
                        </refresh>
                        <cell v-for="src in lists[index]" :key="src">
                            <image :src="src"></image>
                        </cell>
                        <cell class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
                            <text class="loading-more-text">{{tab.loadingText}}</text>
                        </cell>
                    </list>
                </swiper-item> -->

                <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">
                    <list class="scroll-v list" :style="{ height: scrollViewHeight, width: screenWidth }"
                        enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(index1)">
                        <refresh class="refresh" @refresh="onrefresh(index1)" @pullingdown="onpullingdown" :display="tab.refreshing ? 'show' : 'hide'">
                            <div class="refresh-view">
                                <image class="refresh-icon" :src="refreshIcon" :style="{width: (tab.refreshing || pulling) ? 0: '30px'}"
                                    :class="{'refresh-icon-active': tab.refreshFlag}"></image>
                                <loading-indicator class="loading-icon" animating="true" v-if="tab.refreshing"></loading-indicator>
                                <text class="loading-text">{{tab.refreshText}}</text>
                            </div>
                        </refresh>
                        <cell v-for="(newsitem,index2) in tab.data" :key="newsitem.id">
                            <media-item :options="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></media-item>
                        </cell>
                        <cell class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
                            <text class="loading-more-text">{{tab.loadingText}}</text>
                        </cell>
                    </list>
                </swiper-item>
            </swiper>
            <!-- </pulldown-refresher> -->
            <!-- <view class="loading-more" v-if="tab.isLoading || tab.data.length > 4"> -->
            <!--    <view class="loading-more" v-if="isLoading">
                <text class="loading-more-text">加载更多...</text>
            </view> -->
        </view>
    </view>
</template>

<script>
    import yyRefresh from '@/components/yy-refresh/yy-refresh.nvue';
    import yyLoadMore from '@/components/yy-refresh/yy-load-more.vue';
    import mediaItem from '../template/tabbar/news-item.nvue';
    // import pulldownRefresher from '../../components/pulldown-refresher.vue'

    // 缓存每页最多
    const MAX_CACHE_DATA = 100;
    // 缓存页签数量
    const MAX_CACHE_PAGE = 3;
    const newsData = {
        data0: {
            "datetime": "40分钟前",
            "article_type": 0,
            "title": "uni-app行业峰会频频亮相，开发者反响热烈!",
            "source": "DCloud",
            "comment_count": 639
        },
        data1: {
            "datetime": "一天前",
            "article_type": 1,
            "title": "DCloud完成B2轮融资，uni-app震撼发布!",
            "image_url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90",
            "source": "DCloud",
            "comment_count": 11395
        },
        data2: {
            "datetime": "一天前",
            "article_type": 2,
            "title": "中国技术界小奇迹：HBuilder开发者突破200万",
            "image_url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90",
            "source": "DCloud",
            "comment_count": 11395
        },
        data3: {
            "article_type": 3,
            "image_list": [{
                "url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90",
                "width": 563,
                "height": 316
            }, {
                "url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg?imageView2/3/w/200/h/100/q/90",
                "width": 641,
                "height": 360
            }, {
                "url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg?imageView2/3/w/200/h/100/q/90",
                "width": 640,
                "height": 360
            }],
            "datetime": "5分钟前",
            "title": "uni-app 支持使用 npm 安装第三方包，生态更趋丰富",
            "source": "DCloud",
            "comment_count": 11
        },
        data4: {
            "datetime": "2小时前",
            "article_type": 4,
            "title": "uni-app 支持原生小程序自定义组件，更开放、更自由",
            "image_url": "https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg?imageView2/3/w/200/h/100/q/90",
            "source": "DCloud",
            "comment_count": 69
        }
    };
    export default {
        components: {
            // pulldownRefresher
            mediaItem,
            yyRefresh,
            yyLoadMore
        },
        data() {
            return {
                // screenHeight: 1080,
                // screenWidth: 750,
                refreshText: ['下拉刷新', '释放更新', '刷新中...', '刷新成功'],
                loadingText: ['加载更多', '松开加载', '加载中...', '加载完成'],
                tabIndex: 0,
                cacheTab: [],
                navigateFlag: false,
                // tabBars: [{
                navList: [{
                    name: '待办',
                    id: 'wait'
                }, {
                    name: '所有',
                    id: 'all'
                }],
                newsList: [],
                companyName: "",
                isLoading: false,
                pageNum: 0,
                pageSize: 10,
                type: 0,
                isAll: false,
                lists: [],
                switchIndex: 0, // 使 swiper 切换到的 index
                changeIndex: 0, // swiper change 时的 index
                finishedIndex: 0, // swiper 停止滑动后的 index
                screenWidth: uni.getSystemInfoSync().screenWidth, // 屏幕宽
                screenHeight: uni.getSystemInfoSync().screenHeight, // 屏幕宽
                navScrollLeft: 0, // 导航滚动区的滚动距离
                activeBarLeft: 0, // 滑块距离左边距离
                navItemWidth: 150, // navitem 宽
                pulldownRefresh: 0, // 下拉刷新容器距离顶部的距离
                scrollViewHeight: 0, // scroll view 高
                pulldownRefreshing: false, // 页面是否正处于下拉刷新状态
                pullDownStopDistance: 0, //手指松开时下拉刷新容器距离顶部的距离
                pulldownRefreshingTop: 0, //手指松开后下拉刷新容器距离顶部的距离
                pullDownRefreshDistance: 80, // 下拉刷新距离
                imgs: [
                    "http://img0.imgtn.bdimg.com/it/u=2905678561,227122043&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=3677209778,3519789803&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=3256100974,305075936&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=2320696840,2111444643&fm=26&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=3494124402,2674872801&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3974834430,2578081919&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=1585760612,642244870&fm=26&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1428714686,3397313797&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=1290832790,1643168179&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=4047025850,1342274664&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=3023056760,882933912&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=4204445328,3725508908&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=2101268903,2568936024&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=175919244,932448081&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=3227645762,3004706393&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=3467909516,4111722298&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=1741888605,89386081&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=2902433526,1442285569&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=3668490432,692556832&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3287613756,3276986963&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=3293099503,606929711&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=238683735,3305956198&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=2166910524,183843777&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=1392463651,583835545&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=883822522,2397626446&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1439903750,855649209&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=1250169937,2610911529&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=2071734668,2237233962&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=253571335,3875462619&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=1293288590,3290776648&fm=11&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=3360746971,3828802375&fm=11&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=1324590513,1855596965&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=2494076594,1331712878&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=1591374328,97412972&fm=11&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=3951513245,3578307113&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=1813591252,1231576268&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3032480985,1689367916&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=4207785803,871401225&fm=11&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=3247608090,137204570&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1968041477,106026006&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=1136216967,2826364902&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=879694141,372927528&fm=11&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=2215379910,2122229268&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=1957946624,397647334&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=4132967133,641987985&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=1073436194,380383960&fm=26&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1838712407,1350227682&fm=11&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=2394642159,4165202689&fm=11&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=1131012441,2992717943&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=2098594232,1745349305&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=1734393923,1650236243&fm=11&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=192175925,2711098198&fm=26&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=2231718055,564130575&fm=26&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=2794606698,2435177175&fm=11&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=3610042662,962569570&fm=11&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=394188308,86197954&fm=26&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1805229242,1728890757&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=2830376033,2124526516&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3637195516,624681633&fm=11&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=310481193,630913428&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3438209008,2633185639&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=369680510,3534268331&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=1999733494,2070379699&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=1893648356,2373995221&fm=26&gp=0.jpg",
                    "http://img0.imgtn.bdimg.com/it/u=499819894,868726334&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=3169621237,3598614056&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=2515711548,2207634785&fm=26&gp=0.jpg",
                    "http://img3.imgtn.bdimg.com/it/u=2425151763,784343592&fm=11&gp=0.jpg",
                    "http://img5.imgtn.bdimg.com/it/u=2819669926,1214596723&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=1054574265,2150894704&fm=11&gp=0.jpg",
                    "http://img4.imgtn.bdimg.com/it/u=2259563288,1982450258&fm=11&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=3587989638,1055085635&fm=26&gp=0.jpg",
                    "http://img2.imgtn.bdimg.com/it/u=3832007667,3971794725&fm=26&gp=0.jpg",
                    "http://img1.imgtn.bdimg.com/it/u=2749140110,1177618157&fm=11&gp=0.jpg"
                ]
            }
        },
        created() { // 乱序
            // this.navList.forEach(() => this.lists.push(JSON.parse(JSON.stringify(this.imgs.sort(() => Math.random() -
            //     0.5)))))
            this.navList.forEach(() => {
                this.lists.push(JSON.parse(JSON.stringify(this.imgs.sort(() => Math.random() -
                    0.5))))
                this.newsList.push({
                    data: [],
                    isLoading: false,
                    refreshText: "",
                    loadingText: '加载更多...'
                });
            })
        },
        mounted() { // 组件挂载后设置 scrollview 高
            this.screenWidth = uni.getSystemInfoSync().windowWidth;
            this.screenHeight = uni.getSystemInfoSync().windowHeight;
            this.companyName = this.$store.getters.getUserData.companyName
            this.$offset('.swiper-area').then(res => {
                this.scrollViewHeight = res.height
            })
            this.getCaseList()
            this.getList(0);
        },
        methods: {
            refresh() {
                var that = this;
                console.log("哈哈")
                //此处模拟请求数据 Here the request data is simulated
                setTimeout(function() {
                    //结束刷新 stop refreshing
                    that.$refs.refreshStatus.finish(500);
                    console.log("哈哈1")
                }, 1000);
            },
            // loadMore() {
            //     var that = this;
            //     console.log("哈哈2")
            //     //此处模拟请求数据  Here the request data is simulated
            //     setTimeout(function() {
            //         //结束加载  stop loading
            //         that.$refs.loadMoreStatus.finish(500);
            //         console.log("哈哈3")
            //     }, 1000);
            // },

            loadMore(e) {
                var that = this;
                console.log("哈哈2")
                //此处模拟请求数据  Here the request data is simulated
                setTimeout(function() {
                    //结束加载  stop loading
                    that.$refs.loadMoreStatus.finish(500);
                    console.log("哈哈3")
                }, 1000);
                // setTimeout(() => {
                //     this.getList(_this.tabIndex);
                // }, 500)
            },

            clearTabData(e) {
                this.newsList[e].data.length = 0;
                this.newsList[e].loadingText = "加载更多...";
            },
            refreshData() {
                console.log("哈哈8")
            },
            onrefresh(e) {
                console.log("哈哈4")
                var tab = this.newsList[this.tabIndex];
                if (!tab.refreshFlag) {
                    return;
                }
                tab.refreshing = true;
                tab.refreshText = "正在刷新...";
                console.log("哈哈5")
                setTimeout(() => {
                    console.log("哈哈6")
                    this.refreshData();
                    this.pulling = true;
                    tab.refreshing = false;
                    tab.refreshFlag = false;
                    tab.refreshText = "已刷新";
                    setTimeout(() => { // TODO fix ios和Android 动画时间相反问题
                        this.pulling = false;
                    }, 500);
                }, 2000);

                //     var tab = _this.newsList[_this.tabIndex];
                //     if (!tab.refreshFlag) {
                //         return;
                //     }
                //     tab.refreshing = true;
                //     tab.refreshText = "正在刷新...";

                //     setTimeout(() => {
                //         _this.refreshData();
                //         _this.pulling = true;
                //         tab.refreshing = false;
                //         tab.refreshFlag = false;
                //         tab.refreshText = "已刷新";
                //         setTimeout(() => { // TODO fix ios和Android 动画时间相反问题
                //             _this.pulling = false;
                //         }, 500);
                //     }, 2000);
            },
            onpullingdown(e) {
                console.log("哈哈7")
                var tab = this.newsList[this.tabIndex];
                if (tab.refreshing || this.pulling) {
                    return;
                }
                if (Math.abs(e.pullingDistance) > Math.abs(e.viewHeight)) {
                    tab.refreshFlag = true;
                    tab.refreshText = "释放立即刷新";
                } else {
                    tab.refreshFlag = false;
                    tab.refreshText = "下拉可以刷新";
                }
            },

            getCaseList() {
                uni.showLoading({
                    // tittle: '登录中'
                });

                var tableType;
                var state;
                if (this.isAll == true) {
                    tableType = "ALL_CASE_TABLE";
                } else {
                    tableType = "NEED_CASE_TABLE";
                    state = 3;
                }
                this.$api.getCaseList({
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    tableType: tableType,
                    state: state
                    // pageNum: 0,
                    // pageSize: 10,
                    // tableType: "NEED_CASE_TABLE",
                    // state: 3

                }).then(res => {
                    uni.hideLoading();
                    var data = res.data.data
                    console.log(data)
                    console.log(this.isAll)
                    // let activeTab = this.newsList[index];
                    // activeTab.data = data.list
                }).catch(res => {
                    uni.hideLoading();
                    //失败操作
                    // console.log(res)
                    console.log("操作失败")
                    // uni.showToast({
                    //     title: res.data.msg,
                    //     icon: 'none'
                    // })
                })
            },

            transition({
                detail: {
                    dx
                }
            }) { // swiper 运动时触发
                this.activeBarLeft = this.navItemWidth * this.finishedIndex + this.navItemWidth * (dx / this.screenWidth)
                if (this.activeBarLeft > (this.screenWidth - this.navItemWidth) / 2) {
                    this.navScrollLeft = this.activeBarLeft - (this.screenWidth - this.navItemWidth) / 2
                }
            },
            change({
                detail: {
                    current
                }
            }) { // swiper index 变化时触发
                this.changeIndex = current
                this.tabIndex = current
                // this.switchIndex = current
                this.switchTab(current);
            },
            animationfinish({
                detail: {
                    current
                }
            }) { // swiper 运动结束时触发
                this.switchIndex = this.finishedIndex = current
                this.tabIndex = current
                this.switchTab(current);
            },
            tapNav(index) { // 点击 bavbar 切换
                this.switchIndex = index
                this.tabIndex = index
                this.switchTab(index);
            },
            switchTab(index) {
                if (this.newsList[index].data.length === 0) {
                    this.getList(index);
                }

                if (this.tabIndex === index) {
                    return;
                }

                // 缓存 tabId
                if (this.newsList[this.tabIndex].data.length > MAX_CACHE_DATA) {
                    let isExist = this.cacheTab.indexOf(this.tabIndex);
                    if (isExist < 0) {
                        this.cacheTab.push(this.tabIndex);
                        //console.log("cache index:: " + this.tabIndex);
                    }
                }

                this.tabIndex = index;
                this.scrollInto = this.tabBars[index].id;

                // 释放 tabId
                if (this.cacheTab.length > MAX_CACHE_PAGE) {
                    let cacheIndex = this.cacheTab[0];
                    this.clearTabData(cacheIndex);
                    this.cacheTab.splice(0, 1);
                    //console.log("remove cache index:: " + cacheIndex);
                }
            },
            newGuid() {
                let s4 = function() {
                    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
                }
                return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
            },
            $offset(selector) { // 获取组件内元素的 offset 信息
                return new Promise(resolve => uni.createSelectorQuery().in(this).select(selector).boundingClientRect(
                    data => resolve(data)).exec())
            }
            // ,
            // refresh() { // 下拉刷新
            //     setTimeout(() => {
            //         this.$refs.pulldownRefresher.pullup()
            //     }, 1234)
            // },
            // pulldownrefresh() {
            //     this.$refs.pulldownRefresher.pulldown()
            //     setTimeout(() => {
            //         this.$refs.pulldownRefresher.pullup()
            //     }, 1234)
            // }

            ,
            getList(index) {
                let activeTab = this.newsList[index];
                let list = [];
                for (let i = 1; i <= 10; i++) {
                    let item = Object.assign({}, newsData['data' + Math.floor(Math.random() * 5)]);
                    item.id = this.newGuid();
                    list.push(item);
                }

                activeTab.data = activeTab.data.concat(list);
                console.log(this.newsList[index])
            },
            goDetail(e) {
                if (this.navigateFlag) {
                    return;
                }
                this.navigateFlag = true;
                uni.navigateTo({
                    url: './detail/detail?title=' + e.title
                });
                setTimeout(() => {
                    this.navigateFlag = false;
                }, 200)
            },
            close(index1, index2) {
                uni.showModal({
                    content: '是否删除本条信息？',
                    success: (res) => {
                        if (res.confirm) {
                            this.newsList[index1].data.splice(index2, 1);
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../style/color/color.scss";
    @import url("../mine/css/main.css");

    /* #ifndef APP-PLUS */
    page {
        width: 100%;
        min-height: 100%;
        display: flex;
    }

    /* #endif */
    .refresh {
        width: 750upx;
        height: 64px;
        justify-content: center;
    }

    .refresh-view {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
    }

    .refresh-icon {
        width: 30px;
        height: 30px;
        transition-duration: .5s;
        transition-property: transform;
        transform: rotate(0deg);
        transform-origin: 15px 15px;
    }

    .refresh-icon-active {
        transform: rotate(180deg);
    }

    .loading-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        color: #999999;
    }

    .loading-text {
        margin-left: 2px;
        font-size: 16px;
        color: #999999;
    }

    .loading-more {
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
    }

    .loading-more-text {
        font-size: 28upx;
        color: #999;
    }

    @mixin flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content {
        height: 100%;
        display: flex;
        flex-direction: column;

        .status_bar {
            width: 100%;
            background: #007AFF;
            height: var(--status-bar-height);
        }

        .pulldownrefresh {
            left: 50%;
            bottom: 0;
            z-index: 1;
            position: fixed;
            transform: translateX(-50%);
        }

        .nav-area {
            width: 100%;
            // height: 100rpx;
            height: 80rpx;

            .scroller {
                height: 100%;

                .scroller-wrapper {
                    // height: 90rpx;
                    height: 70rpx;

                    .scroller-item {
                        @include flex();
                        float: left;
                        height: 100%;
                        width: 50%;

                        &.active {
                            color: #007AFF;
                        }
                    }
                }

                .scroller-bar {
                    // height: 10rpx;
                    height: 5rpx;
                    position: relative;

                    .active-bar {
                        @include flex();
                        top: 0;
                        left: 0;
                        height: 100%;
                        position: absolute;

                        view {
                            width: 30%;
                            height: 100%;
                            background: #007AFF;
                        }
                    }
                }
            }
        }

        .swiper-area {
            flex: 1;
            width: 100%;
            background: #FF3333;

            swiper {
                height: 100%;

                background: #F8F8F8;

                swiper-item {
                    flex: 1;
                    flex-direction: row;
                    image {
                        float: left;
                        width: 47vw;
                        height: 47vw;
                        border-radius: 1vw;
                        margin: 2vw 0 0 2vw;
                    }
                }
            }
        }
    }

    .line-h {
        height: 1upx;
        background-color: #cccccc;
    }

    .swiper-box {
        flex: 1;
    }

    // .swiper-item {
    //     flex: 1;
    //     flex-direction: row;
    // }

    // .content1 {
    //     flex-direction: column;
    //     align-items: center;
    //     justify-content: center;
    // }

    // .list {
    //     flex-direction: column;
    // }

    // .list-item {
    //     align-items: center;
    //     justify-content: center;
    // }

    .scroll-v {
        flex: 1;
        // background: #FF3333;
        /* #ifndef MP-ALIPAY */
        flex-direction: column;
        /* #endif */
        width: 750upx;
    }
</style>
