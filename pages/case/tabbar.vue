<template>

    <!-- <view class="content"> -->
    <view class="tabs">
        <!-- <cu-custom class="root" bgImage="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))" :isBack="false"
            :isShadown="false">
            <block slot="backText"></block>
            <block slot="content">{{companyName}}</block>
        </cu-custom>
        <view class="line-h"></view> -->
        <!-- <view> -->
        <!-- <view class="motion animation-fade"> -->
        <!-- 顶部 -->
        <!--  <cu-custom bgColor="bg-white" :isBack="false" class="motion animation-fade">
            :isShadown="false">
            <block slot="backText"></block>
            <block slot="content">{{companyName}}</block>
        </cu-custom> -->
        <view class="forget">
            <!-- 顶部 -->
            <cu-custom bgColor="bg-white" :isBack="false">
                <!-- <cu-custom class="mine animation-fade" bgImage="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))"
                :isBack="false" :isShadown="false"> -->
                <block slot="backText"></block>
                <block slot="content">{{companyName}}</block>
            </cu-custom>
            <view class="line-h" />
        </view>
        <view class="content">
            <!--  </view> -->
            <scroll-view id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
                <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
                    @click="ontabtap">
                    <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
                </view>
            </scroll-view>
            <view class="line-h"></view>
            <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
                <swiper-item class="swiper-item" v-for="(tab,index1) in newsList" :key="index1">
                    <!-- #ifdef APP-NVUE -->
                    <list class="scroll-v list" enableBackToTop="true" scroll-y loadmoreoffset="15" @loadmore="loadMore(index1)">
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
                    <!-- #endif -->
                    <!-- #ifndef APP-NVUE -->
                    <scroll-view class="scroll-v list" enableBackToTop="true" scroll-y @scrolltolower="loadMore(index1)">
                        <view v-for="(newsitem,index2) in tab.data" :key="newsitem.id">
                            <media-item :options="newsitem" @close="close(index1,index2)" @click="goDetail(newsitem)"></media-item>
                        </view>
                        <view class="loading-more" v-if="tab.isLoading || tab.data.length > 4">
                            <text class="loading-more-text">{{tab.loadingText}}</text>
                        </view>
                    </scroll-view>
                    <!-- #endif -->
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>
<script>
    import mediaItem from '../template/tabbar/news-item.nvue';

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
            mediaItem
        },
        data() {
            return {
                newsList: [],
                cacheTab: [],
                tabIndex: 0,
                tabBars: [{
                        name: '待办',
                        id: 'wait'
                    }, {
                        name: '所有',
                        id: 'all'
                    }
                ],
                scrollInto: "",
                showTips: false,
                navigateFlag: false,
                pulling: false,
                refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
                companyName: ""
            }
        },
        onLoad() {
            this.companyName = this.$store.getters.getUserData.companyName
            setTimeout(() => {
                this.tabBars.forEach((tabBar) => {
                    this.newsList.push({
                        data: [],
                        isLoading: false,
                        refreshText: "",
                        loadingText: '加载更多...'
                    });
                });
                this.getList(0);
            }, 350)
        },
        methods: {
            getList(index) {
                let activeTab = this.newsList[index];
                let list = [];
                for (let i = 1; i <= 10; i++) {
                    let item = Object.assign({}, newsData['data' + Math.floor(Math.random() * 5)]);
                    item.id = this.newGuid();
                    list.push(item);
                }
                activeTab.data = activeTab.data.concat(list);
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
            loadMore(e) {
                setTimeout(() => {
                    this.getList(this.tabIndex);
                }, 500)
            },
            ontabtap(e) {
                let index = e.target.dataset.current || e.currentTarget.dataset.current;
                this.switchTab(index);
            },
            ontabchange(e) {
                let index = e.target.current || e.detail.current;
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
            clearTabData(e) {
                this.newsList[e].data.length = 0;
                this.newsList[e].loadingText = "加载更多...";
            },
            refreshData() {},
            onrefresh(e) {
                var tab = this.newsList[this.tabIndex];
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
            newGuid() {
                let s4 = function() {
                    return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
                }
                return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../style/color/color.scss";
    @import url("../mine/css/main.css");
    // .motion {
    //     margin-top: 100upx;
    // }

    // .motion_top {
    //     margin-top: 128upx;
    //     background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0iNzEyN2E1NTItNDNkNi00YjE2LTlkZjItOWYwZmE5NjM3YWI4IiBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI5NjIuMiIgaGVpZ2h0PSI3NzEuNjciIHZpZXdCb3g9IjAgMCA5NjIuMiA3NzEuNjciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZDIwZmFhYjEtNmFiNi00MzJiLWJiYTAtNjA3MDEzODkyNzYxIiB4MT0iMjAyOC4xOSIgeTE9IjQwMy4yOCIgeDI9IjIwMjguMTkiIHkyPSI0MDIuNzgiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTEsIDAsIDAsIDEsIDI3NzgsIDApIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJncmF5IiBzdG9wLW9wYWNpdHk9IjAuMjUiLz48c3RvcCBvZmZzZXQ9IjAuNTQiIHN0b3AtY29sb3I9ImdyYXkiIHN0b3Atb3BhY2l0eT0iMC4xMiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iZ3JheSIgc3RvcC1vcGFjaXR5PSIwLjEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iY2FiZjY3MGUtYmJiMS00ODcyLWJjNTQtYzY1OWM5OGIzODc4IiB4MT0iMjE5Mi40NyIgeTE9IjgzNS44NCIgeDI9IjIxOTIuNDciIHkyPSIxNzUuODEiIHhsaW5rOmhyZWY9IiNkMjBmYWFiMS02YWI2LTQzMmItYmJhMC02MDcwMTM4OTI3NjEiLz48L2RlZnM+PHRpdGxlPkpvZ2dpbmc8L3RpdGxlPjxwYXRoIGQ9Ik04NTQsNTIyLjI2YTEwLjg4LDEwLjg4LDAsMCwwLTE0LjIsMS4zMiwxMS4xMywxMS4xMywwLDAsMCwuNDQsMTUuNTFsMTMuNTgsMTMuNWEyLjI2LDIuMjYsMCwwLDAsMy4yMSwwTDg3MC41Nyw1MzlhMTEuMTMsMTEuMTMsMCwwLDAsLjM2LTE1LjUxLDEwLjkyLDEwLjkyLDAsMCwwLTE0LjIyLTEuMjRBMi4yOCwyLjI4LDAsMCwxLDg1NCw1MjIuMjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzhkYTZlMyIvPjxwYXRoIGQ9Ik0yNjIsMjE0LjI2YTEwLjg4LDEwLjg4LDAsMCwwLTE0LjIsMS4zMiwxMS4xMywxMS4xMywwLDAsMCwuNDQsMTUuNTFsMTMuNTgsMTMuNWEyLjI2LDIuMjYsMCwwLDAsMy4yMSwwTDI3OC41NywyMzFhMTEuMTMsMTEuMTMsMCwwLDAsLjM2LTE1LjUxLDEwLjkyLDEwLjkyLDAsMCwwLTE0LjIyLTEuMjRBMi4yOCwyLjI4LDAsMCwxLDI2MiwyMTQuMjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzhkYTZlMyIvPjxwYXRoIGQ9Ik0xMzYsNDg5LjI2YTEwLjg4LDEwLjg4LDAsMCwwLTE0LjIsMS4zMiwxMS4xMywxMS4xMywwLDAsMCwuNDQsMTUuNTFsMTMuNTgsMTMuNWEyLjI2LDIuMjYsMCwwLDAsMy4yMSwwTDE1Mi41Nyw1MDZhMTEuMTMsMTEuMTMsMCwwLDAsLjM2LTE1LjUxLDEwLjkyLDEwLjkyLDAsMCwwLTE0LjIyLTEuMjRBMi4yOCwyLjI4LDAsMCwxLDEzNiw0ODkuMjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzhkYTZlMyIvPjxwYXRoIGQ9Ik04NTMsMTg3LjI2YTEwLjg4LDEwLjg4LDAsMCwwLTE0LjIsMS4zMiwxMS4xMywxMS4xMywwLDAsMCwuNDQsMTUuNTFsMTMuNTgsMTMuNWEyLjI2LDIuMjYsMCwwLDAsMy4yMSwwTDg2OS41NywyMDRhMTEuMTMsMTEuMTMsMCwwLDAsLjM2LTE1LjUxLDEwLjkyLDEwLjkyLDAsMCwwLTE0LjIyLTEuMjRBMi4yOCwyLjI4LDAsMCwxLDg1MywxODcuMjZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzhkYTZlMyIvPjxyZWN0IHg9IjY1MSIgeT0iNzMuOTIiIHdpZHRoPSIzIiBoZWlnaHQ9IjE3IiBmaWxsPSIjM2FkMjlmIi8+PHJlY3QgeD0iNzY5LjkiIHk9IjEzOC4wOCIgd2lkdGg9IjMiIGhlaWdodD0iMTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc5OS4wOCAtNjg4Ljk4KSByb3RhdGUoOTApIiBmaWxsPSIjM2FkMjlmIi8+PHJlY3QgeD0iNzgzIiB5PSIzMDQuOTIiIHdpZHRoPSIzIiBoZWlnaHQ9IjE3IiBmaWxsPSIjM2FkMjlmIi8+PHJlY3QgeD0iOTAxLjkiIHk9IjM2OS4wOCIgd2lkdGg9IjMiIGhlaWdodD0iMTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDExNjIuMDggLTU4OS45OCkgcm90YXRlKDkwKSIgZmlsbD0iIzNhZDI5ZiIvPjxyZWN0IHg9IjE5MyIgeT0iNTE1LjkyIiB3aWR0aD0iMyIgaGVpZ2h0PSIxNyIgZmlsbD0iIzNhZDI5ZiIvPjxyZWN0IHg9IjMxMS45IiB5PSI1ODAuMDgiIHdpZHRoPSIzIiBoZWlnaHQ9IjE3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3ODMuMDggMjExLjAyKSByb3RhdGUoOTApIiBmaWxsPSIjM2FkMjlmIi8+PHJlY3QgeD0iMTI0IiB5PSI3My45MiIgd2lkdGg9IjMiIGhlaWdodD0iMTciIGZpbGw9IiMzYWQyOWYiLz48cmVjdCB4PSIyNDIuOSIgeT0iMTM4LjA4IiB3aWR0aD0iMyIgaGVpZ2h0PSIxNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjcyLjA4IC0xNjEuOTgpIHJvdGF0ZSg5MCkiIGZpbGw9IiMzYWQyOWYiLz48cmVjdCB4PSIyNTYiIHk9IjEwMC45MiIgd2lkdGg9IjMiIGhlaWdodD0iMTciIGZpbGw9IiMzYWQyOWYiLz48cmVjdCB4PSIzNzQuOSIgeT0iMTY1LjA4IiB3aWR0aD0iMyIgaGVpZ2h0PSIxNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDMxLjA4IC0yNjYuOTgpIHJvdGF0ZSg5MCkiIGZpbGw9IiMzYWQyOWYiLz48cGF0aCBkPSJNMzEyLDM1MWEzLjY3LDMuNjcsMCwwLDEtMi4wNS00LjQ0LDEuODYsMS44NiwwLDAsMCwuMDgtLjQxaDBhMS44NCwxLjg0LDAsMCwwLTMuMzEtMS4yMmgwYTEuODIsMS44MiwwLDAsMC0uMi4zNiwzLjY4LDMuNjgsMCwwLDEtNC40NCwyLjA1LDIsMiwwLDAsMC0uNDEtLjA4aDBhMS44NCwxLjg0LDAsMCwwLTEuMjIsMy4zMWgwYTEuNTgsMS41OCwwLDAsMCwuMzYuMiwzLjY5LDMuNjksMCwwLDEsMi4wNSw0LjQ1LDEuMzUsMS4zNSwwLDAsMC0uMDguNGgwYTEuODQsMS44NCwwLDAsMCwzLjMxLDEuMjJoMGEyLjA4LDIuMDgsMCwwLDAsLjItLjM2LDMuNjcsMy42NywwLDAsMSw0LjQ0LTIsMS44NiwxLjg2LDAsMCwwLC40MS4wOGgwYTEuODUsMS44NSwwLDAsMCwxLjIyLTMuMzJoMEEyLjA4LDIuMDgsMCwwLDAsMzEyLDM1MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZjU1ZjQ0Ii8+PHBhdGggZD0iTTg3OSw3MWEzLjY3LDMuNjcsMCwwLDEtMi00LjQ0LDEuODYsMS44NiwwLDAsMCwuMDgtLjQxaDBhMS44NCwxLjg0LDAsMCwwLTMuMzEtMS4yMmgwYTEuODIsMS44MiwwLDAsMC0uMi4zNiwzLjY4LDMuNjgsMCwwLDEtNC40NCwyLDIsMiwwLDAsMC0uNDEtLjA4aDBhMS44NCwxLjg0LDAsMCwwLTEuMjIsMy4zMWgwYTEuNTgsMS41OCwwLDAsMCwuMzYuMiwzLjY5LDMuNjksMCwwLDEsMi4wNSw0LjQ1LDEuMzUsMS4zNSwwLDAsMC0uMDguNGgwYTEuODQsMS44NCwwLDAsMCwzLjMxLDEuMjJoMGEyLjA4LDIuMDgsMCwwLDAsLjItLjM2LDMuNjcsMy42NywwLDAsMSw0LjQ0LTIsMS44NiwxLjg2LDAsMCwwLC40MS4wOGgwYTEuODUsMS44NSwwLDAsMCwxLjIyLTMuMzJoMEEyLjA4LDIuMDgsMCwwLDAsODc5LDcxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiMzYWQyOWYiLz48cGF0aCBkPSJNNTI3LDg3YTMuNjcsMy42NywwLDAsMS0yLTQuNDQsMS44NiwxLjg2LDAsMCwwLC4wOC0uNDFoMGExLjg0LDEuODQsMCwwLDAtMy4zMS0xLjIyaDBhMS44MiwxLjgyLDAsMCwwLS4yLjM2LDMuNjgsMy42OCwwLDAsMS00LjQ0LDIsMiwyLDAsMCwwLS40MS0uMDhoMGExLjg0LDEuODQsMCwwLDAtMS4yMiwzLjMxaDBhMS41OCwxLjU4LDAsMCwwLC4zNi4yLDMuNjksMy42OSwwLDAsMSwyLjA1LDQuNDUsMS4zNSwxLjM1LDAsMCwwLS4wOC40aDBhMS44NCwxLjg0LDAsMCwwLDMuMzEsMS4yMmgwYTIuMDgsMi4wOCwwLDAsMCwuMi0uMzYsMy42NywzLjY3LDAsMCwxLDQuNDQtMiwxLjg2LDEuODYsMCwwLDAsLjQxLjA4aDBhMS44NSwxLjg1LDAsMCwwLDEuMjItMy4zMmgwQTIuMDgsMi4wOCwwLDAsMCw1MjcsODdaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iI2Y1NWY0NCIvPjxwYXRoIGQ9Ik0zNDIsNDYxYTMuNjcsMy42NywwLDAsMS0yLjA1LTQuNDQsMS44NiwxLjg2LDAsMCwwLC4wOC0uNDFoMGExLjg0LDEuODQsMCwwLDAtMy4zMS0xLjIyaDBhMS44MiwxLjgyLDAsMCwwLS4yLjM2LDMuNjgsMy42OCwwLDAsMS00LjQ0LDIuMDUsMiwyLDAsMCwwLS40MS0uMDhoMGExLjg0LDEuODQsMCwwLDAtMS4yMiwzLjMxaDBhMS41OCwxLjU4LDAsMCwwLC4zNi4yLDMuNjksMy42OSwwLDAsMSwyLjA1LDQuNDUsMS4zNSwxLjM1LDAsMCwwLS4wOC40aDBhMS44NCwxLjg0LDAsMCwwLDMuMzEsMS4yMmgwYTIuMDgsMi4wOCwwLDAsMCwuMi0uMzYsMy42NywzLjY3LDAsMCwxLDQuNDQtMiwxLjg2LDEuODYsMCwwLDAsLjQxLjA4aDBhMS44NSwxLjg1LDAsMCwwLDEuMjItMy4zMmgwQTIuMDgsMi4wOCwwLDAsMCwzNDIsNDYxWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiNmNTVmNDQiLz48cGF0aCBkPSJNNzg0LDMzM2EzLjY3LDMuNjcsMCwwLDEtMi00LjQ0LDEuODYsMS44NiwwLDAsMCwuMDgtLjQxaDBhMS44NCwxLjg0LDAsMCwwLTMuMzEtMS4yMmgwYTEuODIsMS44MiwwLDAsMC0uMi4zNiwzLjY4LDMuNjgsMCwwLDEtNC40NCwyLjA1LDIsMiwwLDAsMC0uNDEtLjA4aDBhMS44NCwxLjg0LDAsMCwwLTEuMjIsMy4zMWgwYTEuNTgsMS41OCwwLDAsMCwuMzYuMiwzLjY5LDMuNjksMCwwLDEsMi4wNSw0LjQ1LDEuMzUsMS4zNSwwLDAsMC0uMDguNGgwYTEuODQsMS44NCwwLDAsMCwzLjMxLDEuMjJoMGEyLjA4LDIuMDgsMCwwLDAsLjItLjM2LDMuNjcsMy42NywwLDAsMSw0LjQ0LTIsMS44NiwxLjg2LDAsMCwwLC40MS4wOGgwYTEuODUsMS44NSwwLDAsMCwxLjIyLTMuMzJoMEEyLjA4LDIuMDgsMCwwLDAsNzg0LDMzM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZjU1ZjQ0Ii8+PHBhdGggZD0iTTEwODAsMjI5YTMuNjcsMy42NywwLDAsMS0yLTQuNDQsMS44NiwxLjg2LDAsMCwwLC4wOC0uNDFoMGExLjg0LDEuODQsMCwwLDAtMy4zMS0xLjIyaDBhMS44MiwxLjgyLDAsMCwwLS4yLjM2LDMuNjgsMy42OCwwLDAsMS00LjQ0LDIuMDUsMiwyLDAsMCwwLS40MS0uMDhoMGExLjg0LDEuODQsMCwwLDAtMS4yMiwzLjMxaDBhMS41OCwxLjU4LDAsMCwwLC4zNi4yLDMuNjksMy42OSwwLDAsMSwyLDQuNDUsMS4zNSwxLjM1LDAsMCwwLS4wOC40aDBhMS44NCwxLjg0LDAsMCwwLDMuMzEsMS4yMmgwYTIuMDgsMi4wOCwwLDAsMCwuMi0uMzYsMy42NywzLjY3LDAsMCwxLDQuNDQtMiwxLjg2LDEuODYsMCwwLDAsLjQxLjA4aDBhMS44NSwxLjg1LDAsMCwwLDEuMjItMy4zMmgwQTIuMDgsMi4wOCwwLDAsMCwxMDgwLDIyOVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZjU1ZjQ0Ii8+PHBhdGggZD0iTTc0OS43Myw0MDIuNzhsLjE2LjVBMi42NiwyLjY2LDAsMCwxLDc0OS43Myw0MDIuNzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0idXJsKCNkMjBmYWFiMS02YWI2LTQzMmItYmJhMC02MDcwMTM4OTI3NjEpIi8+PHBhdGggZD0iTTI4My4xLDgwMy43M2MtLjEtLjE0LS4yLS4yOC0uMjgtLjQycy0uMTEtLjItLjE2LS4zYTQuMjMsNC4yMywwLDAsMS0uMjItLjQybC0uMTItLjNjLS4wNS0uMTQtLjExLS4yOS0uMTUtLjQzbC0uMDgtLjI5YzAtLjE0LS4wNy0uMjktLjEtLjQ0bDAtLjI3YzAtLjE1LDAtLjMxLDAtLjQ2czAtLjE2LDAtLjI1LDAtLjMyLDAtLjQ3LDAtLjE1LDAtLjIzbC4wNi0uNWMwLS4wNiwwLS4xMywwLS4xOWE0Ljg3LDQuODcsMCwwLDEsLjEyLS41MmwwLS4xNnEuMDctLjI3LjE4LS41NHMwLS4wOSwwLS4xMy4xNS0uMzguMjMtLjU3bDAtLjA4Yy4wOS0uMi4xOS0uNC4yOS0uNTlsMCwwLC4zNS0uNjFoMGEyMS41NiwyMS41NiwwLDAsMSw1LTUuMzljMTQuOTUsNi4xNSwzMy40MS0uODgsMzMuNDEtLjg4czI0LjYyLTEyLjMxLDIyLjg2LTguNzljLS41OSwxLjE4LS4yOSwzLjU1LjM4LDYuMTgsMTEuOC0yLjQ3LDE4LjMtOC44MSwyMS44NS0xNC41NWwtMTMuNDQtMTQuNDlTNDA3Ljg4LDcyNi44Miw0MTQsNzExczM2LTYwLjY2LDM2LTYwLjY2LDkuNjctMzUuMTcsMjcuMjYtNDMuMDhjMCwwLDM1LjA3LTQxLjg5LDU1LjU0LTc3LjgyLTcuMjctMTguMDktMTcuNC00Ni4zNy0xNS4xLTU4LjQ2LDIuODctMTUtLjExLTQzLjUyLTEuMy01My41NC05LjczLDguMTEtNDkuMjcsNDAuMjUtNjQuNjQsMzkuNDgtNS41Mi0uMjgtMTEuNDctMy4yNC0xNy03LjE3LTEzLjI4LTguNDEtMjUuMTYtMjMuNi0yNS4xNi0yMy42LDEuNzkuMTcsMy4yNi0xLjQ3LDQuNDUtNC4yMS0xNC42OC0xNi00NS4wOS00OC43Ni00OC40MS00OS40Mi00LjM5LS44OC0yOC4xMy00Mi4yMS0xNC45NC01MXMzNi45MiwyMi44NiwzNy44LDI5Yy42LDQuMTcsMTksMjIuNSwzMC43NiwzMy44NiwwLS4yOSwwLS40NiwwLS40NmwxLjc0Ljg3YzAtLjU1LDAtLjg3LDAtLjg3bDMwLjM2LDE1LjE5LDI1LjkxLTM1LjQxczctMzcuOCwyNC42Mi00NCwzMC4zMy0yNS4wNSwzMC4zMy0yNS4wNWExOCwxOCwwLDAsMSwuMzksMS44N2MuODktMS4xNywxLjM3LTEuODcsMS4zNy0xLjg3czAsLjE1LjEuNDJhNDUuOTMsNDUuOTMsMCwwLDAsMS0xNi41NWwtLjI1LS4xNWMtLjExLS42OC0uMjItMS4zMy0uMzQtMS45NUE0NCw0NCwwLDAsMSw1MTYuNzUsMjIyYy00LjQ4LTMuMTMtMTEtNS4wOC0xNi41LTcuNDYtOC4zMS0zLjU3LTE1LjI1LTguODItMTkuODMtMTVhMTcuNDcsMTcuNDcsMCwwLDEsOS4xOS4xOWMuMzctNC4wNi00LjMyLTguNy0uNjctMTEuNzksMi4yNi0xLjkyLDYuNDctMS43NSw5LjctLjhzNi4xNSwyLjUyLDkuNTgsMi45NGM2LC43MywxMS41OS0yLjE2LDE1Ljg1LTUuMjhzOC4yNC02Ljc3LDEzLjk0LTguMjVjMTEuMjgtMi45MywyMi40OCwzLjc5LDMzLjgxLDYuNjMsMTguMiw0LjU2LDI5LjA2LDkuNDIsMjkuODcsMjFhMzcuNTMsMzcuNTMsMCwwLDEsNi40Myw1LjQ2LDI0LDI0LDAsMCwxLDcuNzIsMTMuMDhjMS41NCw3Ljg5LTEuNjYsMTUuOTEtNS41MSwyMy0yLjE5LDQtMTIuNzEsMjQuODItMTkuODYsMjIuMDdhNDQsNDQsMCwwLDEtNi41OCw2LjE1Yy4yMywyLjQuNTYsNC44MiwxLDcuMjRhMTYuMTUsMTYuMTUsMCwwLDAsNS4xNywxLjc4QTYyLjc3LDYyLjc3LDAsMCwwLDYwMS45MywyODRhMTc1Ljc5LDE3NS43OSwwLDAsMCwxOC43Mi0xLjE0LDE1Ny40OCwxNTcuNDgsMCwwLDEsMTguMTktMSw5MC4wNyw5MC4wNywwLDAsMSw5LjA3LjQzbC40NywwYy42MS4wNywxLjIxLjE0LDEuNzkuMjNsLjI4LDBjLjY4LjEsMS4zMy4yLDIsLjMybC4yMSwwLDEuNi4zMS4zNi4wOGMuNTYuMTIsMS4xLjI1LDEuNjMuMzloMHEuODIuMjEsMS41OS40NWwuMjYuMDgsMS4yNS4zOS4yNy4xYy45NC4zMiwxLjgzLjY2LDIuNjcsMWwuMjYuMTEsMSwuNDUuMTkuMDksMS4xOC41NS4xLjA1LDEsLjUuMjUuMTIsMSwuNTEuMDcsMCwxLjI1LjY1Ljc1LjM5LjM1LjE4LDEsLjUyYzguNzksNC40LDk0LjA3LDI3LjI2LDEwOSw3M2wtLjMuMjgtLjA3LjA1LS4zNC4zMWMuMjUuNjcuNDksMS4zMy43MSwyLDAsMC0xLjQ1LDEuMy0zLjcxLDMuNDIsNCwxNy40OSwxNC43Niw2Mi4xNiwyMC40MSw2NC4yOCw3LDIuNjQsMTQuOTUsNTYuMjctMy41MSw1NC41MXMtMTguNDctNDQuODQtMTguNDctNDQuODQtMTIuMTctMzIuNjQtMjEuMTUtNDkuMjFhMjMuMTYsMjMuMTYsMCwwLDAtMy41Miw2LjgzbC4wNi4xOGExLjE1LDEuMTUsMCwwLDEtLjA2LS4xNyw0Ljg2LDQuODYsMCwwLDAtLjEsMi4zMWMtLjg3LTIuNTUtNS4zOC0xNC4yNi0xNC43OS0xMi42OS0xMC4wNSwxLjY3LTQ4LTM1LjcxLTUxLjU5LTM5LjI5LjA4LDEsLjE5LDIuMTguMzEsMy41OWgwdi4wNWMuMDcuODIuMTUsMS43MS4yMiwyLjY2bDAsLjNjMCwuMjQsMCwuNDguMDUuNzNzMCwuMzIsMCwuNDhsLjA2Ljc0YzAsLjE3LDAsLjM1LDAsLjUybC4wNi43NGMwLC4yMiwwLC40NSwwLC42N3MuMDYuNzIuMDgsMS4wOS4wNS41OS4wNy44OCwwLC40MiwwLC42M2wuMDYuODhjMCwuMiwwLC40LDAsLjZzMCwuNjIuMDcuOTQsMCwuNDEsMCwuNjJsLjA2LDFjMCwuMiwwLC4zOSwwLC41OCwwLC41My4wNywxLjA2LjEsMS42di4yMWwuMDksMS40OCwwLC41MWMwLC40LjA1LjgxLjA3LDEuMjJsMCwuNThjMCwuNDIuMDUuODQuMDcsMS4yNmwwLC41MmMwLC41LDAsMSwuMDgsMS41MiwwLC4xLDAsLjE5LDAsLjI5bC4wOSwxLjkxdi4xMWMwLC41OCwwLDEuMTYuMDgsMS43NCwwLC4xNywwLC4zNCwwLC41bC4wNiwxLjQzYzAsLjE5LDAsLjM4LDAsLjU3LDAsLjQ4LDAsMSwwLDEuNDUsMCwuMTYsMCwuMzMsMCwuNSwwLDEuMzIuMDksMi42Ni4xMyw0LDAsLjEsMCwuMiwwLC4yOSwwLC41NywwLDEuMTQsMCwxLjcxLDAsLjE3LDAsLjM1LDAsLjUyLDAsLjUxLDAsMSwwLDEuNTQsMCwuMTgsMCwuMzYsMCwuNTNsMCwxLjd2LjM0YzAsMS4zOCwwLDIuNzcsMCw0LjE3LDAsLjE0LDAsLjI5LDAsLjQ0djEuNjJjMCwuMTksMCwuMzgsMCwuNTYsMCwuNTIsMCwxLDAsMS41NXYuNDNjLjA2LDE5LjE4LTEuMTcsMzguNy01LjQ4LDQ5Ljg0YTU0Ljg4LDU0Ljg4LDAsMCwwLTMuNiwxOC43MkE3Ni40LDc2LjQsMCwwLDAsNjg1LjcxLDUwN2gwbC0xLS4zMmMuMTIuMjIuMTkuMzMuMTkuMzNsLS41Ny0uMThjLjg2LDEuODEsMS40NSwyLjgyLDEuNDUsMi44MnMtMS4yOC0uNDEtMy41Ni0xLjA4YzMuMjQsMTEuNDUsNS40MSwyOS4wOC0uODQsNTEuMTksMCwwLTMuNTIsMTkuMzQtLjg4LDI2LjM4czUuMjgsNjMuMyw1LjI4LDYzLjMsNS4yNyw3LDE0Ljk0LDIuNjRTODI5LDYzMi43NCw4MjksNjMyLjc0cy4yOC40OS43NCwxLjM0YzMuNjUtMS4xNCw4LjkxLTIuODgsMTIuNzYtNC41LTEuNDItMi0yLjc0LTMuMTUtMy44My0zLDAsMCw2LjM0LTMuMDYsMTMuMjQtNS40N2gwbDEuMjYtLjQzLjA1LDAsMS4yMy0uNC4wOCwwLDEuMTgtLjM2LjEzLDAsMS4wOC0uMy4yMi0uMDcsMS0uMjYuMjYtLjA3LDEtLjIyLjI4LS4wNi44Ny0uMTguMzMtLjA2Ljc5LS4xMy4zNy0uMDYuNzItLjA4LjM5LDAsLjY2LDAsLjM3LDBoMWwuNTQsMCwuMzQsMCwuNDguMS4zMi4wN2MuMTQsMCwuMjcuMS40LjE1YTIuNDksMi40OSwwLDAsMSwuMjkuMTEsMy40MSwzLjQxLDAsMCwxLC4zOC4yMWMuMDcsMCwuMTUuMDguMjEuMTNhMi41NiwyLjU2LDAsMCwxLC40OC40NWM0LjM5LDUuMjcsMjksMTA2LjM4LDE3LjU4LDExMy40MS0uMzQuMjEtLjY3LjQxLTEsLjU5bC0uNC4yMy0uNTIuMjktLjUuMjctLjM3LjE5LS41NC4yNi0uMjguMTMtLjU2LjI0LS4yLjA4Yy0uMi4wOC0uNC4xNi0uNTkuMjJsLS4xMywwLS42LjE5LS4wOCwwYy02LjM3LDEuNzItOC40OS00LjE4LTE2LjIyLTE2LjgyLTcuNTctMTIuMzktMTcuMjktMjgtMjUuNzktMzMuNzgtLjE5LjQxLS4zNy44NC0uNTgsMS4yNSwwLDAtODguOCw5LjY3LTEyMS4zMywyMC4yMnMtNTgsMjQuNjEtNzkuMTMsMGMtMTguOTMtMjIuMDgtMzcuODUtOTMuNjctNDEuNTUtMTA4LjE5aDB2MGMtLjI2LTEtLjQ0LTEuNzctLjU1LTIuMThoMGwwLS4xOCwwLS4wNywwLS4wN3YwbC03MC4zNCw1My42M0w0OTQsNjg1LjVTNDUxLDc0Ni4xNiw0NDMuMDUsNzQ3cy00NC44NCw1OC45LTQ0Ljg0LDU4LjlsLTEuMzQtMS40NGMtLjMyLDEuNjEtLjU2LDMuMDktLjc0LDQuMzgsMyw3LC4yMSwxNS4zOC0yLjQzLDIwLjkzaDBsLS4xMS4yMi0uMy42MS0uMTYuMzJjLS4xLjE5LS4xOS4zOC0uMjkuNTZsLS4xNS4yOGMtLjEuMi0uMjEuMzktLjMxLjU4bC0uMTUuMjgtLjI0LjQyLS4xMi4yMWMtLjEuMTktLjIxLjM2LS4zLjUzYTEuNTksMS41OSwwLDAsMC0uMTMuMjJjLS4wNy4xLS4xMy4yMS0uMTkuMzFzLS4wNy4xMi0uMTEuMTdsLS4yMy4zOGExLjE5LDEuMTksMCwwLDAtLjA5LjE1bC0uMTUuMjItLjA2LjEtLjE1LjIzLDAsMGMwLC4wNi0uMDYuMDktLjA4LjEzbDAsMCwwLDBzLTkyLjMyLTIyLTEwMy43NS0yOWMtLjM2LS4yMi0uNy0uNDUtMS0uNjhsLS4yOS0uMjJjLS4yLS4xNi0uNC0uMzEtLjU4LS40N2E0LDQsMCwwLDEtLjMtLjI4Yy0uMTUtLjE0LS4zMS0uMjgtLjQ0LS40MnMtLjE4LS4yLS4yNy0uM2wtLjM1LS40MVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSJ1cmwoI2NhYmY2NzBlLWJiYjEtNDg3Mi1iYzU0LWM2NTljOThiMzg3OCkiLz48cGF0aCBkPSJNODE5LjI2LDYzMnMyMC41Ni02LDIxLjQxLTguNTcsMTgsNDcuMSwxOCw0Ny4xbC0xNy4xMywxMnMtMTgtMTAuMjctMjcuNC04LjU2UzgxOS4yNiw2MzIsODE5LjI2LDYzMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjNGM0YzU2Ii8+PHBhdGggZD0iTTM3Ni41Myw3NTQuNDhTMzc0LDc3Ny42LDM0NS43LDc4MC4xN3MxOC44NCwyMy4xMiwxOC44NCwyMy4xMmwzNiwyLjU3cy44NS0xNC41Niw2Ljg1LTI1LjY5UzM3Ni41Myw3NTQuNDgsMzc2LjUzLDc1NC40OFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjNGM0YzU2Ii8+PHBhdGggZD0iTTY3My42OCw0OTQuMTRTNjkwLDUxOSw2NzguODIsNTU4LjM3YzAsMC0zLjQyLDE4Ljg0LS44NSwyNS42OXM1LjEzLDYxLjY2LDUuMTMsNjEuNjYsNS4xNCw2Ljg1LDE0LjU2LDIuNTcsMTI1LTE4Ljg0LDEyNS0xOC44NCwxOC44NCwzMi41NCw4LjU2LDUyLjI0YzAsMC04Ni40OSw5LjQyLTExOC4xNywxOS42OXMtNTYuNTIsMjQtNzcuMDgsMC00MS4xLTEwNy45LTQxLjEtMTA3LjlsLTY4LjUxLDUyLjI0LTMwLDM1LjExcy00Miw1OS4wOS00OS42Nyw1OS45NC00My42Nyw1Ny4zOC00My42Nyw1Ny4zOGwtNDMuNjgtNDcuMXM1My4xLTMwLDU5LjA5LTQ1LjM5LDM1LjExLTU5LjA4LDM1LjExLTU5LjA4LDkuNDItMzQuMjYsMjYuNTUtNDJjMCwwLDYxLjY2LTczLjY0LDY3LjY1LTEwNy45czEwMi43Ni0xOCwxMDIuNzYtMThaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzVmNWQ3ZSIvPjxwYXRoIGQ9Ik0zNTUuMTIsNzkwLjQ0cy02LTEzLjctNC4yOC0xNy4xMi0yMi4yNyw4LjU2LTIyLjI3LDguNTYtMTgsNi44NS0zMi41NC44NmMwLDAtMTIuODQsOS40MS0xLjcxLDE2LjI3czEwMS4wNSwyOC4yNiwxMDEuMDUsMjguMjYsMTMuNy0xOS43LDIuNTctMzAuODNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzk4NjM2NSIvPjxwYXRoIGQ9Ik00MTguNDksNzA1LjY2YzYtMTUuNDEsMzUuMTEtNTkuMDgsMzUuMTEtNTkuMDhzOS40Mi0zNC4yNiwyNi41NS00MmMwLDAsNjEuNjYtNzMuNjQsNjcuNjUtMTA3LjksMS4yNC03LjA2LDYuMzQtMTIsMTMuNjQtMTUuMzJxNiwxNy45NCwxMS45NSwzNS44Nyw4LjE1LDI0LjUsMTYuMzEsNDljMy4xNCw5LjQ1LDYuMTIsMjAsNS44MywyOS43Ni0uNDEtMS42My0uNjMtMi41My0uNjMtMi41M2wtNjguNTEsNTIuMjQtMzAsMzUuMTFzLTQyLDU5LjA5LTQ5LjY3LDU5Ljk0LTQzLjY3LDU3LjM4LTQzLjY3LDU3LjM4bC00My42OC00Ny4xUzQxMi41LDcyMS4wOCw0MTguNDksNzA1LjY2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01MzQuMSwyNzQuMDZzNy4yOCwxOC40MS0yLjE0LDM1LjU0LDMuODUsNDcuNTMsMTIuNDEsNDkuMjQsNDIuODItMjAuNTUsNDUuMzktMzUuMTEtMTEuMTMtNDQuNTMtNC4yOC02NC4yM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZmRjMmNjIi8+PHBhdGggZD0iTTU4MC4zNCwzMDUuNzVzLTI2LjU1LDUzLjk1LTU1LjY2LDE1LjQxYzAsMC0yOS4xMiw1OS4wOS0xOS43LDY4LjUxYTE5Ny4xNiwxOTcuMTYsMCwwLDAsMjEuNDEsMThsMTUuNDIsMTA3LjlzODcuMzQtMzAsMTI0LjE3LTI0LjgzbC01Ni41Mi0xMzUuM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBvcGFjaXR5PSIwLjEiLz48cGF0aCBkPSJNNTgwLjM0LDMwMy4xOHMtMjYuNTUsNTMuOTUtNTUuNjYsMTUuNDFjMCwwLTI5LjEyLDU5LjA5LTE5LjcsNjguNTFhMTk3LjE2LDE5Ny4xNiwwLDAsMCwyMS40MSwxOEw1NDEuODEsNTEzUzYyOS4xNSw0ODMsNjY2LDQ4OC4xNWwtNTYuNTItMTM1LjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iI2QzOTk5OSIvPjxwYXRoIGQ9Ik03NjkuNiwzNjUuNjlzMTQuNTUsNjYuOCwyMS40LDY5LjM3LDE0LjU2LDU0LjgtMy40Miw1My4wOS0xOC00My42Ny0xOC00My42N1M3NTAuNzYsMzk0LDc0My4wNSwzODgsNzY5LjYsMzY1LjY5LDc2OS42LDM2NS42OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZmRjMmNjIi8+PHBhdGggZD0iTTQzMy4wNSwzOTYuNTJzLTM4LjU0LTM2LTM5LjM5LTQyLTI0LTM2LjgyLTM2LjgzLTI4LjI2LDEwLjI4LDQ4LjgxLDE0LjU2LDQ5LjY3LDU0LjgxLDU2LjUyLDU0LjgxLDU2LjUyWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiNmZGMyY2MiLz48cGF0aCBkPSJNNTg0LjIsMjg5LjA1czQuNzEsNS41NiwzNi4zOSwyLjE0LDM5LjM5LDIuNTcsNDgsNi44NSw5MS42MywyNi41NSwxMDYuMTgsNzEuMDhjMCwwLTMyLjU0LDI5LjExLTI5LjExLDM2LjgyLDAsMC00LjI4LTE0LjU2LTE0LjU2LTEyLjg0cy01MC41My0zOC41NC01MC41My0zOC41NCw3LjcxLDc1LjM2LTIuNTYsMTAxLjkxLDUuMTMsNTMuMDksNS4xMyw1My4wOS03Mi43OS0yMy4xMi0xMDUuMzMtMTJjMCwwLTE4Ljg0LTg0Ljc4LTIuNTctMTE5cy02Ljg1LTY2LjgtNi44NS02Ni44WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01ODMuMzQsMjg2LjQ4czQuNzEsNS41NywzNi4zOSwyLjE0LDM5LjQsMi41Nyw0OCw2Ljg1Uzc1OS4zMiwzMjIsNzczLjg4LDM2Ni41NWMwLDAtMzIuNTQsMjkuMTEtMjkuMTIsMzYuODIsMCwwLTQuMjgtMTQuNTYtMTQuNTYtMTIuODRTNjc5LjY4LDM1Miw2NzkuNjgsMzUyczcuNzEsNzUuMzYtMi41NywxMDEuOTFTNjgyLjI1LDUwNyw2ODIuMjUsNTA3cy03Mi43OS0yMy4xMi0xMDUuMzMtMTJjMCwwLTE4Ljg0LTg0Ljc4LTIuNTctMTE5cy02Ljg1LTY2LjgtNi44NS02Ni44WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01ODQuMiwyODYuNDhzNC43MSw1LjU3LDM2LjM5LDIuMTQsMzkuMzksMi41Nyw0OCw2Ljg1Uzc2MC4xOCwzMjIsNzc0LjczLDM2Ni41NWMwLDAtMzIuNTQsMjkuMTEtMjkuMTEsMzYuODIsMCwwLTQuMjgtMTQuNTYtMTQuNTYtMTIuODRTNjgwLjUzLDM1Miw2ODAuNTMsMzUyczcuNzEsNzUuMzYtMi41NiwxMDEuOTFTNjgzLjEsNTA3LDY4My4xLDUwN3MtNzIuNzktMjMuMTItMTA1LjMzLTEyYzAsMC0xOC44NC04NC43OC0yLjU3LTExOXMtNi44NS02Ni44LTYuODUtNjYuOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjZWM3NTgwIi8+PHBhdGggZD0iTTUzNi4yNCwzMDEuODlzLTEyLjQyLDE4LjQyLTI5LjU0LDI0LjQxLTI0LDQyLjgyLTI0LDQyLjgyTDQ1Nyw0MDQuMjMsNDI2LjIsMzg4Ljgxcy0uODYsNDItOS40Miw0MS4xMWMwLDAsMjEuNDEsMjcuNCwzOC41MywyOC4yNnM2NS4wOS00MC4yNSw2NS4wOS00MC4yNSw1LjE0LDM3LjY4LDEuNzEsNTUuNjYsMjEuNDEsNzIuNzksMjEuNDEsNzIuNzlsMzQuMjUtNi44NXMtMTgtNjguNTEtNDAuMjUtNzkuNjRjMCwwLDAtNDYuMjQsMy40My01Ny4zOHMtMjIuMjctNTMuMDktMTguODQtNjEuNjVjMS45Mi00LjgxLDkuNDctMTUuMDgsMTMuMjctMjQuNDFBMjQuNCwyNC40LDAsMCwwLDUzNi4yNCwzMDEuODlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgb3BhY2l0eT0iMC4xIi8+PHBhdGggZD0iTTUzMy42NywzMDAuMThzLTEyLjQyLDE4LjQxLTI5LjU0LDI0LjQxLTI0LDQyLjgxLTI0LDQyLjgxbC0yNS42OSwzNS4xMUw0MjMuNjMsMzg3LjFzLS44Niw0Mi05LjQyLDQxLjExYzAsMCwyMS40MSwyNy40LDM4LjU0LDI4LjI2czY1LjA4LTQwLjI1LDY1LjA4LTQwLjI1LDUuMTQsMzcuNjgsMS43MSw1NS42NlM1NDEsNTQ0LjY3LDU0MSw1NDQuNjdsMzQuMjUtNi44NXMtMTgtNjguNTEtNDAuMjQtNzkuNjRjMCwwLDAtNDYuMjUsMy40Mi01Ny4zOHMtMjIuMjYtNTMuMDktMTguODQtNjEuNjZjMS45Mi00LjgsOS40Ny0xNS4wNywxMy4yNy0yNC40QTI0LjQsMjQuNCwwLDAsMCw1MzMuNjcsMzAwLjE4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01MzUuMzgsMzAwLjE4UzUyMywzMTguNTksNTA1Ljg0LDMyNC41OXMtMjQsNDIuODEtMjQsNDIuODFsLTI1LjY5LDM1LjExTDQyNS4zNCwzODcuMXMtLjg1LDQyLTkuNDIsNDEuMTFjMCwwLDIxLjQxLDI3LjQsMzguNTQsMjguMjZzNjUuMDgtNDAuMjUsNjUuMDgtNDAuMjUsNS4xNCwzNy42OCwxLjcxLDU1LjY2LDIxLjQxLDcyLjc5LDIxLjQxLDcyLjc5bDM0LjI2LTYuODVzLTE4LTY4LjUxLTQwLjI1LTc5LjY0YzAsMCwwLTQ2LjI1LDMuNDItNTcuMzhzLTIyLjI2LTUzLjA5LTE4Ljg0LTYxLjY2YzEuOTMtNC44LDkuNDgtMTUuMDcsMTMuMjgtMjQuNEEyNC40NSwyNC40NSwwLDAsMCw1MzUuMzgsMzAwLjE4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiNlYzc1ODAiLz48cGF0aCBkPSJNNTMzLjkzLDMwMS42M1M1MjEuNTIsMzIwLDUwNC4zOSwzMjZzLTI0LDQyLjgxLTI0LDQyLjgxTDQ1NC43Miw0MDRsLTMwLjgzLTE1LjQxcy0uODUsNDItOS40Miw0MS4xYzAsMCwyMS40MSwyNy40MSwzOC41NCwyOC4yNnM2NS4wOC00MC4yNCw2NS4wOC00MC4yNCw1LjE0LDM3LjY4LDEuNzEsNTUuNjYsMjEuNDEsNzIuNzksMjEuNDEsNzIuNzlsMzQuMjYtNi44NXMtMTgtNjguNTEtNDAuMjUtNzkuNjRjMCwwLDAtNDYuMjUsMy40Mi01Ny4zOHMtMjIuMjYtNTMuMDktMTguODQtNjEuNjZjMS45My00LjgsOS40OC0xNS4wOCwxMy4yOC0yNC40QTI0LjQ1LDI0LjQ1LDAsMCwwLDUzMy45MywzMDEuNjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik04MzIuMTEsNjIzLjQ1czI0LjgzLTEyLDI5LjEyLTYuODUsMjguMjUsMTAzLjYyLDE3LjEyLDExMC40Ny0xMiwxLjcxLTIxLjQxLTEzLjctMjIuMjYtMzYtMzEuNjgtMzUuMTFjMCwwLDI3LjQtOS40MiwyNi41NS0xMi44NVM4MzguMSw2MjIuNiw4MzIuMTEsNjIzLjQ1WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiM5ODYzNjUiLz48cGF0aCBkPSJNNTgzLjkzLDI4MS42NGE0Mi44Miw0Mi44MiwwLDAsMS00Ny43MiwyLjY5LDQzLDQzLDAsMCwwLTIuMTEtOC41Nmw1MS4zOC0xNC41NUM1ODMuMzYsMjY3LjMsNTgzLjIxLDI3NC4zNiw1ODMuOTMsMjgxLjY0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01NTIuMTUsMjQ4LjEyYy0xMC40NC45MS0yMy4xNS0xLjA2LTI3LTguMTctMS4xMS0yLTEuMzUtNC4yOS0yLjQ4LTYuMzMtMy4yNy01Ljg5LTEyLjY0LTguMy0yMC4xNi0xMS41My04LjEtMy40OC0xNC44Ni04LjU5LTE5LjMyLTE0LjYxYTE3LjA5LDE3LjA5LDAsMCwxLDksLjE4Yy4zNy00LTQuMjEtOC40Ny0uNjUtMTEuNDksMi4yLTEuODcsNi4zLTEuNyw5LjQ0LS43N3M2LDIuNDUsOS4zNCwyLjg2YzUuODEuNzEsMTEuMjktMi4xLDE1LjQ0LTUuMTRzOC02LjYsMTMuNTctOGMxMS0yLjg2LDIxLjksMy42OSwzMi45NCw2LjQ1LDIyLjYzLDUuNjcsMzMuNiwxMS44MSwyNy40NSwzMS40OUM1OTUuMDksMjM3LjU2LDU3MS4xNCwyNDYuNDgsNTUyLjE1LDI0OC4xMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIiBmaWxsPSIjODY1YTYxIi8+PGNpcmNsZSBjeD0iNDM5LjE3IiBjeT0iMTgxLjY0IiByPSI0Mi44MiIgZmlsbD0iI2ZkYzJjYyIvPjxwYXRoIGQ9Ik01OTEuMzYsMjM5LjI3Yy0yLjA3LTguNC04LjA1LTE2LjI1LTE2LjM5LTE4LjU4LTcuMDktMi0xNC42My4xNy0yMS41NSwyLjY4cy0xNCw1LjQ0LTIxLjM0LDUtMTUuMDYtNS41LTE1LjYyLTEyLjg0YTYuMTUsNi4xNSwwLDAsMSwuNTMtMy4zMiw4LjA2LDguMDYsMCwwLDEsMy4wNy0yLjgzYzEwLjc3LTYuODcsMjMtMTIuMjgsMzUuNzktMTIuMDcsMTAuNTEuMTcsMjAuNTUsNC4xMSwzMC4zMiw4LDEyLjMzLDQuOSwyNi4zNCwxMS43NSwyOC44OCwyNC43NiwxLjUsNy42OS0xLjYxLDE1LjUtNS4zNiwyMi4zNy0yLjE3LDQtMTIuNywyNC44LTE5LjY3LDIxLjM3QzU4Ny4yMSwyNzIuNDMsNTkyLjY5LDI0NC42Nyw1OTEuMzYsMjM5LjI3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIG9wYWNpdHk9IjAuMSIvPjxwYXRoIGQ9Ik01ODkuNjUsMjM3LjU2Yy0yLjA3LTguNDEtOC4wNi0xNi4yNS0xNi40LTE4LjU4LTcuMDktMi0xNC42My4xNy0yMS41NSwyLjY4cy0xNCw1LjQ0LTIxLjM0LDUtMTUuMDYtNS41MS0xNS42Mi0xMi44NWE2LjE5LDYuMTksMCwwLDEsLjU0LTMuMzIsOC4yNiw4LjI2LDAsMCwxLDMuMDYtMi44M2MxMC43OC02Ljg2LDIzLTEyLjI3LDM1LjgtMTIuMDcsMTAuNTEuMTgsMjAuNTUsNC4xMiwzMC4zMiw4LDEyLjMyLDQuOSwyNi4zNCwxMS43NSwyOC44OCwyNC43NiwxLjUsNy42OC0xLjYyLDE1LjQ5LTUuMzcsMjIuMzYtMi4xNiw0LTEyLjY5LDI0LjgxLTE5LjY2LDIxLjM4QzU4NS41LDI3MC43Miw1OTEsMjQzLDU4OS42NSwyMzcuNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIgZmlsbD0iIzg2NWE2MSIvPjxwYXRoIGQ9Ik04NzUuNzgsNzI3LjkzYzExLjE0LTYuODUtMTIuODQtMTA1LjMzLTE3LjEyLTExMC40Ny0xLjg4LTIuMjUtNy43MS0xLjIxLTEzLjY2LjY2LDYuNzYtMi4zNiwxNC4wOC00LjA5LDE2LjIzLTEuNTIsNC4yOCw1LjE0LDI4LjI1LDEwMy42MiwxNy4xMiwxMTAuNDdhMjAuMTMsMjAuMTMsMCwwLDEtNi4yMSwyLjgzQTMwLjksMzAuOSwwLDAsMCw4NzUuNzgsNzI3LjkzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjxwYXRoIGQ9Ik0yOTEuMTksNzg4Yy0xLjE1LDIuOTUtLjgsNi4zNyw0LDkuMzEsMTEuMTMsNi44NSwxMDEuMDUsMjguMjYsMTAxLjA1LDI4LjI2YTQ0LjYzLDQ0LjYzLDAsMCwwLDIuNDUtNC4xNiw0Ni4xMiw0Ni4xMiwwLDAsMS0zLjMxLDUuODhTMzA1LjQ1LDgwNS44NiwyOTQuMzIsNzk5QzI4OC41Nyw3OTUuNDcsMjg5LjIyLDc5MS4yNCwyOTEuMTksNzg4WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuNSIvPjxnIG9wYWNpdHk9IjAuMDUiPjxwYXRoIGQ9Ik03NDEsMzk0Ljc5YzcuMTItMTEuNDUsMjYuODQtMjkuMSwyNi44NC0yOS4xLTE0LjU2LTQ0LjUzLTk3LjYyLTY2Ljc5LTEwNi4xOC03MS4wOC00LjczLTIuMzYtOS4yLTUuMjQtMTcuNTctNi43NywxMy4wNywxLDE4LjU0LDQuNywyNC40Miw3LjYzLDguNTYsNC4yOCw5MS42MywyNi41NSwxMDYuMTgsNzEuMDgsMCwwLTMxLjI3LDI4LTI5LjI3LDM2LjM0QTI2Ljg4LDI2Ljg4LDAsMCwwLDc0MSwzOTQuNzlaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTE4LjkgLTY0LjE2KSIvPjxwYXRoIGQ9Ik03NDUuNDYsNDAyLjg5bC4xNi40OEEyLjQ2LDIuNDYsMCwwLDEsNzQ1LjQ2LDQwMi44OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIi8+PHBhdGggZD0iTTU4My4yMSwyODcuODlsMS0xLjQxczEuMDksMS4yOCw1LjY5LDIuMjNBNTEuNzksNTEuNzksMCwwLDEsNTgzLjIxLDI4Ny44OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIi8+PHBhdGggZD0iTTczMC4xMywzOTAuNTdhMTEuMzUsMTEuMzUsMCwwLDEtMy43NC0xQTkuMzMsOS4zMywwLDAsMSw3MzAuMTMsMzkwLjU3WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTExOC45IC02NC4xNikiLz48cGF0aCBkPSJNNjE4LjcxLDQ5My4wN2MtMTUuMzItMS42OS0zMC4yOC0xLjcxLTQwLjk0LDEuOTMsMCwwLS4yLS44OS0uNTMtMi41MUM1ODguOTIsNDkwLjIyLDYwMy45Myw0OTEsNjE4LjcxLDQ5My4wN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIi8+PHBhdGggZD0iTTY3NS41MSw1MDQuNzRjLTMtNS43Ny0xMy4yOS0yOC43My00LjQtNTEuNywxMC4yOC0yNi41NSwyLjU3LTEwMS45MSwyLjU3LTEwMS45MXMyLjk0LDIuOTQsNy40Myw3LjE5QzY4Mi42OSwzNzcsNjg2LjQzLDQzMiw2NzgsNDUzLjksNjY3LjY5LDQ4MC40NCw2ODMuMSw1MDcsNjgzLjEsNTA3UzY4MC4yOCw1MDYuMDksNjc1LjUxLDUwNC43NFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTguOSAtNjQuMTYpIi8+PC9nPjwvc3ZnPg==");
    //     background-position: center center;
    //     background-size: cover;
    //     background-repeat: no-repeat;
    //     height: 410upx;
    //     width: 500upx;
    //     margin-left: 128upx;
    // }

    // /* #ifndef APP-PLUS */
    // page {
    //     width: 100%;
    //     min-height: 100%;
    //     display: flex;
    // }


    // /* #endif */

    .tabs {
        flex: 1;
        flex-direction: column;
        overflow: hidden;
        background-color: #ffffff;
        /* #ifdef MP-ALIPAY || MP-BAIDU */
        height: 100vh;
        /* #endif */
    }

    .scroll-h {
        width: 750upx;
        height: 80upx;
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
        /* flex-wrap: nowrap; */
        /* border-color: #cccccc;
		border-bottom-style: solid;
		border-bottom-width: 1px; */
    }

    .line-h {
        height: 1upx;
        background-color: #cccccc;
    }

    .uni-tab-item {
        /* #ifndef APP-PLUS */
        display: inline-block;
        /* #endif */
        flex-wrap: nowrap;
        padding-left: 34upx;
        padding-right: 34upx;
    }

    .uni-tab-item-title {
        color: #555;
        font-size: 30upx;
        height: 80upx;
        line-height: 80upx;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
    }

    .uni-tab-item-title-active {
        color: #007AFF;
    }

    .swiper-box {
        flex: 1;
    }

    .swiper-item {
        flex: 1;
        flex-direction: row;
    }

    .scroll-v {
        flex: 1;
        /* #ifndef MP-ALIPAY */
        flex-direction: column;
        /* #endif */
        width: 750upx;
    }

    .update-tips {
        position: absolute;
        left: 0;
        top: 41px;
        right: 0;
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #FDDD9B;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .update-tips-text {
        font-size: 14px;
        color: #ffffff;
    }

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
</style>
