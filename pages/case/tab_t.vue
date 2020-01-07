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
            <swiper :current="switchIndex" :duration="567" @transition="transition" @change="change" @animationfinish="animationfinish">
                <!-- <swiper-item v-for="(item, index) in navList" :key="index">
                        <scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }">
                            <image v-for="src in lists[index]" :src="src" :key="src"></image>
                        </scroll-view>
                    </swiper-item> -->
                <!-- <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1"> -->
                <swiper-item v-for="(item, index) in navList" :key="index">
                    <!-- #ifdef APP-NVUE -->
                    <list class="scroll-v list" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(index)">
                        <refresh class="refresh" @refresh="onrefresh(index)" @pullingdown="onpullingdown" :display="tab.refreshing ? 'show' : 'hide'">
                            <div class="refresh-view">
                                <image class="refresh-icon" :src="refreshIcon" :style="{width: (tab.refreshing || pulling) ? 0: '30px'}"
                                    :class="{'refresh-icon-active': tab.refreshFlag}"></image>
                                <loading-indicator class="loading-icon" animating="true" v-if="tab.refreshing"></loading-indicator>
                                <!-- <text class="loading-text">{{tab.refreshText}}</text> -->
                                <text class="loading-text">下拉刷新</text>
                            </div>
                        </refresh>
                        <!-- <cell class="loading-more" v-if="tab.isLoading || tab.data.length > 4"> -->
                        <cell class="loading-more">
                            <text class="loading-more-text">加载更多</text>
                        </cell>
                    </list>
                    <!-- #endif -->
                    <!-- #ifndef APP-NVUE -->
                    <scroll-view class="scroll-v list" enableBackToTop="true" scroll-y @scrolltolower="loadMore(index)">
                        <cell>
                            <scroll-view scroll-y :style="{ height: scrollViewHeight + 'px' }">
                                <image v-for="src in lists[index]" :src="src" :key="src"></image>
                            </scroll-view>
                        </cell>
                        <!-- <view class="loading-more" v-if="tab.isLoading || tab.data.length > 4"> -->
                        <view class="loading-more">
                            <text class="loading-more-text">加载更多</text>
                        </view>
                    </scroll-view>
                    <!-- #endif -->
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
    // import pulldownRefresher from '../../components/pulldown-refresher.vue'
    export default {
        // components: {
        //     pulldownRefresher
        // },
        data() {
            return {
                tabIndex: 0,
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
            this.companyName = this.$store.getters.getUserData.companyName
            this.$offset('.swiper-area').then(res => {
                this.scrollViewHeight = res.height
            })
            this.getCaseList()
        },
        methods: {
            loadMore(e) {
                // setTimeout(() => {
                //     this.getList(_this.tabIndex);
                // }, 500)
            },
            // clearTabData(e) {
            //     this.newsList[e].data.length = 0;
            //     this.newsList[e].loadingText = "加载更多...";
            // },
            refreshData() {},
            onrefresh(e) {
                var tab = _this.newsList[_this.tabIndex];
                if (!tab.refreshFlag) {
                    return;
                }
                tab.refreshing = true;
                tab.refreshText = "正在刷新...";

                setTimeout(() => {
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
            },
            animationfinish({
                detail: {
                    current
                }
            }) { // swiper 运动结束时触发
                this.switchIndex = this.finishedIndex = current
                this.tabIndex = current
            },
            tapNav(index) { // 点击 bavbar 切换
                this.switchIndex = index
                this.tabIndex = index
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
        }
    }
</script>

<style lang="scss" scoped>
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
            // background: #FF3333;

            swiper {
                height: 100%;

                background: #F8F8F8;

                swiper-item {
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
</style>
