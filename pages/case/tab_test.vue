<template>
    <view class="tabs">
        <cu-custom bgImage="linear-gradient(45deg, rgba(0,0,0,0.7), rgba(0,0,0,0.6))" :isBack="false" :isShadown="false">
            <block slot="backText"></block>
            <block slot="content">我的</block>
        </cu-custom>

        <view class="logo flexlogo">
            <view class="logo-title flexlogo">
                <text class="uer-name text-white">{{companyName}}</text>
            </view>
        </view>
    </view>
</template>

<script>
    // import cuCustom from '../../lib/colorui/components/cu-custom.vue'
    // Vue.component('cu-custom',cuCustom)
    export default {
        // components: {
        //     mediaItem,
        //     itemCase
        // },
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
                }],
                scrollInto: "",
                showTips: false,
                navigateFlag: false,
                pulling: false,
                refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
                companyName: "",
                pageNum: 0,
                pageSize: 10,
                type: 0,
                isAll: false
            }
        },
        onLoad() {
            console.log("哈哈哈")
            // _this = this
            console.log(this.companyName)
            this.companyName = this.$store.getters.getUserData.companyName
            console.log(this.$api)
            console.log(this.$request)
            console.log(this.$store)
            console.log(this.isAll)
            uni.setNavigationBarTitle({
                title: this.companyName
            })
            // uni.setNavigationBarColor({
            // frontColor: this.hasSetBg ?  "#000000" : "#ffffff",
            // backgroundColor: this.hasSetBg ? "#F8F8F8" : "#007AFF"
            // })
            console.log("哈哈哈1")

            // setTimeout(() => {
            this.tabBars.forEach((tabBar) => {
                this.newsList.push({
                    data: [],
                    isLoading: false,
                    refreshText: "",
                    loadingText: '加载更多...'
                });
            });
            console.log("哈哈哈2")
            // _this.getList(0);
            // this.getCaseList(0);
            this.test()
            // }, 350)
        },
        methods: {
            test() {
                var urlConfig = "https://sandbox.gongguyi.com/car/api/"
                var url = "case/pageCase"
                var data = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    // tableType: tableType,
                    // state: state
                    // pageNum: 0,
                    // pageSize: 10,
                    tableType: "NEED_CASE_TABLE",
                    state: 3
                }
                var method = "POST"
                var headers = {
                    "env": "TEST",
                    "token": "token_e4d494e7-4f71-421f-83c1-144b96f0ba3d"
                }
                var isCar = true
                uni.request({
                    url: urlConfig + url,
                    method,
                    data: data,
                    dataType: 'json',
                    header: headers
                }).then(res => {
                    console.log(res[1])
                    console.log("哈哈")
                    console.log(this.isAll)
                    if (isCar == true) {
                        if (res[1].data.code == 2000) {
                            if (url == "login/login") {
                                TOKEN = res[1].data.data.token
                                headers = {
                                    "env": "TEST",
                                    "token": TOKEN
                                }
                            }
                            return res[1]
                        } else {
                            throw res[1].data
                        }
                    } else {
                        if (res[1].data.error.no == 0) {
                            if (url == "login/login") {
                                TOKEN = res[1].data.data.token
                                headers = {
                                    "env": "TEST",
                                    "token": TOKEN
                                }
                            }
                            return res[1]
                        } else {
                            throw res[1].data
                        }
                    }
                }).catch(parmas => {
                    console.log("操作失败")
                    console.log(parmas)
                    switch (parmas.code) {
                        case 401:
                            uni.clearStorageSync()
                            break
                        default:
                            return Promise.reject()
                            break
                    }
                })
            },
            getCaseList(index) {
                console.log("哈哈哈3")
                uni.showLoading({});

                var tableType;
                var state;
                console.log("哈哈哈4")
                if (this.isAll == true) {
                    tableType = "ALL_CASE_TABLE";
                } else {
                    tableType = "NEED_CASE_TABLE";
                    state = 3;
                }
                console.log("哈哈哈5")
                console.log(this)
                console.log(this.pageNum)
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
                    console.log("哈哈哈6")
                    console.log(this.newsList)
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
            }
        }
    }
</script>
<!-- <style src="../../style/animation/animation.css"></style>
<style src="../../lib/colorui/main.css"></style>
<style src="../../lib/colorui/icon.css"></style> -->
<style>

</style>
