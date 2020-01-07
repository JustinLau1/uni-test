<template>
    <view>
        <cu-custom bgImage="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.6))" :isBack="false" :isShadown="false">
            <block slot="backText"></block>
            <block slot="content">{{companyName}}</block>
        </cu-custom>

    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    var dateUtils = require('../../common/util.js').dateUtils;
    var _this;
    export default {
        components: {
            uniLoadMore
        },
        data() {
            return {
                listData: [],
                last_id: '',
                imgUrl: "https://img.36krcdn.com/20191230/v2_dd4ae3d3c9734de9b219eefe50d19072_img_png",
                reload: false,
                status: 'more',
                contentText: {
                    contentdown: '上拉加载更多',
                    contentrefresh: '加载中',
                    contentnomore: '没有更多'
                },
                tabIndex: 0,
                tabBars: {
                    "wait": 待办,
                    "all": 所有
                },
                scrollInto: "",
                showTips: false,
                navigateFlag: false,
                pulling: false,
                refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
                companyName: "",
                TabCur: 'wait',
                pageNum: 0,
                pageSize: 10,
                type: 0,
                isAll: false
            };
        },
        // data() {
        //     return {
        //         // banner: {},
        //         listData: [],
        //         last_id: '',
        //         imgUrl: "https://img.36krcdn.com/20191230/v2_dd4ae3d3c9734de9b219eefe50d19072_img_png",
        //         reload: false,
        //         status: 'more',
        //         contentText: {
        //             contentdown: '上拉加载更多',
        //             contentrefresh: '加载中',
        //             contentnomore: '没有更多'
        //         },
        //         tabIndex: 0,
        //         tabBars: {
        //             "wait": 待办,
        //             "all": 所有
        //         },
        //         scrollInto: "",
        //         showTips: false,
        //         navigateFlag: false,
        //         pulling: false,
        //         refreshIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg==",
        //         companyName: "",
        //         TabCur: 'wait',
        //         pageNum: 0,
        //         pageSize: 10,
        //         type: 0,
        //         isAll: false
        //     }

        // },
        onLoad() {
            _this = this
            // this.getBanner();
            this.companyName = this.$store.getters.getUserData.companyName
            console.log(this.companyName)
            this.getList();
            // getList()
        },
        onPullDownRefresh() {
            this.reload = true;
            this.last_id = '';
            // this.getBanner();
            this.getList();
        },
        onReachBottom() {
            this.status = 'more';
            this.getList();
        },
        mounted() {
            // _this = this;
            // getisLogin() //是否登陆

            // this.getData() //获取数据
        },
        methods: {
            // tabSelect(e) {
            tabSelect(tab) {
                //健康切换
                this.TabCur = e.currentTarget.dataset.id
                // this.TabCur = tab
            },
            // getList: () => ,
            getList() {
                console.log("哈哈哈")
                console.log(this.companyName)
                console.log(_this.companyName)
                // console.log(this)
                console.log(_this)
                console.log(_this.pageNum)
                console.log(this.pageNum)
                console.log(_this.reload)

                // uni.showLoading({
                //     // tittle: '登录中'
                // });
                // if (_this.last_id) {
                //     //说明已有数据，目前处于上拉加载
                //     _this.status = 'loading';
                //     // data.minId = this.last_id;
                //     // data.time = new Date().getTime() + '';
                //     // data.pageSize = 10;
                // }
                var tableType;
                var state;
                if (_this.isAll == true) {
                    tableType = "ALL_CASE_TABLE";
                } else {
                    tableType = "NEED_CASE_TABLE";
                    state = 3;
                }
                // var _this = this
                var num = _this.pageNum
                var size = _this.pageSize

                // this.$api.getCaseList({
                //     pageNum: num,
                //     pageSize: size,
                //     tableType: tableType,
                //     state: state
                // }).then(res => {
                //     uni.hideLoading();
                //     console.log("哈哈哈")
                //     var data = res.data.data
                //     console.log(data)
                //     var list = data.list
                //     console.log(list)
                //     console.log(this.reload)
                //     this.listData = this.reload ? list : this.listData.concat(list);
                //     console.log("哈哈哈")
                //     console.log(this.listData)
                //     console.log("哈哈哈2")
                //     this.last_id = list[list.length - 1].id;
                //     console.log("哈哈哈3")
                //     this.reload = false;
                // }).catch(res => {
                //     uni.showToast({
                //         title: res.data.error.info,
                //         icon: 'none'
                //     })
                // })
                console.log(num)
                console.log(_this.pageNum)
                console.log(_this.pageNum)
                console.log(_this.reload)
                // this.$api.checkVersion({
                //     versionNum: 1,
                //     // versionNum: 6,
                //     versionType: "ANDROID"
                // }).then(res => {
                //     // console.log("哈哈哈")
                //     // console.log(res)
                //     // console.log(_this.version)
                //     // console.log(res.data.result.versionNum)
                //     // console.log(res.data.result.versionUrl)
                //     uni.hideLoading();
                //     // var result = res.result
                //     // if (_this.version < res.data.result.versionNum) {
                //     //     // if (6 < res.data.result.versionNum) {
                //     //     _this.vDownUrl = res.data.result.versionUrl //赋值下载地址
                //     //     _this.versionShow = true //弹窗
                //     //     uni.showToast({
                //     //         position: 'bottom',
                //     //         title: "有新版本"
                //     //     });
                //     //     // uni.hideLoading();
                //     // } else {
                //     //     // uni.hideLoading();
                //     //     uni.showToast({
                //     //         position: 'bottom',
                //     //         title: "无新版本可更新！"
                //     //     });
                //     // }
                //     console.log(this.reload)
                // }).catch(res => {
                //     uni.showToast({
                //         title: res.data.error.info,
                //         icon: 'none'
                //     })
                // })

                // _this.$api.getCaseList({
                //     pageNum: num,
                //     pageSize: size,
                //     tableType: tableType,
                //     state: state
                // }).then(res => {
                //     uni.hideLoading();
                //     console.log("哈哈哈")
                //     var data = res.data.data
                //     console.log(data)
                //     var list = data.list
                //     console.log(list)
                //     console.log(_this.reload)
                //     _this.listData = _this.reload ? list : _this.listData.concat(list);
                //     console.log("哈哈哈")
                //     console.log(_this.listData)
                //     console.log("哈哈哈2")
                //     _this.last_id = list[list.length - 1].id;
                //     console.log("哈哈哈3")
                //     _this.reload = false;
                // }).catch(res => {
                //     console.log("失败操作")
                //     // uni.showToast({
                //     //     title: res.data.error.info,
                //     //     icon: 'none'
                //     // })
                // })

                // setTimeout(() => {
                // this.$api.getCaseList({
                //     pageNum: this.pageNum,
                //     pageSize: this.pageSize,
                //     tableType: tableType,
                //     state: state
                //     // pageNum: 0,
                //     // pageSize: 10,
                //     // tableType: "NEED_CASE_TABLE",
                //     // state: 3

                // }).then(res => {
                //     uni.hideLoading();
                //     var data = res.data.data
                //     console.log(data)
                //     // let activeTab = this.newsList[index];
                //     // activeTab.data = data.list
                //     var list = data.list
                //     // let list = this.setTime(data.list);
                //     // this.listData=list
                //     console.log("哈哈哈1")
                //     console.log(list)
                //     // console.log(this.reload)
                //     // this.reload = false
                //     // console.log(this.listData)
                //     // var l = this.listData
                //     // console.log(l)
                //     // this.listData = l.concat(list);
                //     this.listData = this.reload ? list : this.listData.concat(list);
                //     console.log("哈哈哈")
                //     console.log(this.listData)
                //     console.log("哈哈哈2")
                //     this.last_id = list[list.length - 1].id;
                //     console.log("哈哈哈3")
                //     this.reload = false;
                // }).catch(res => {
                //     // uni.hideLoading();
                //     //失败操作
                //     // console.log(res)
                //     console.log("失败操作")
                //     // uni.showToast({
                //     //     title: res.data.msg,
                //     //     icon: 'none'
                //     // })
                // })
                // }, 350)
            },
            goDetail: function(e) {


            }
            // ,
            // setTime: function(items) {
            //     var newItems = [];
            //     items.forEach(e => {
            //         // //信息流中插入广告，微信限制一页只允许出现一个广告
            //         // if( this.listData.length==0 && newItems.length==5){
            //         //     newItems.push({type:'ad'});
            //         // }
            //         // newItems.push({
            //         // 	author_name: e.author_name,
            //         // 	cover: e.cover,
            //         // 	id: e.id,
            //         // 	post_id: e.post_id,
            //         // 	published_at: dateUtils.format(e.published_at),
            //         // 	title: e.title
            //         // });
            //         console.log(e)
            //         newItems.push(e)
            //     });
            //     return newItems;
            // }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../style/color/color.scss"; //颜色

    .line-blue {
        color: $blueColor !important;
    }

    .text-blue {
        font-size: 24upx;
        color: $blueColor !important;
    }

    .line-cyan {
        color: $cyanColor !important;
    }

    .text-cyan {
        font-size: 24upx;
        color: $cyanColor !important;
    }

    .jk-cur {
        font-size: 28upx;
    }

    .text-center {
        margin-right: 24upx;
    }

    .uni-media-list-logo {
        width: 180upx;
        height: 140upx;
    }

    .uni-media-list-body {
        height: auto;
        justify-content: space-around;
    }

    .uni-media-list-text-top {
        height: 74upx;
        font-size: 28upx;
        overflow: hidden;
    }

    .uni-media-list-text-bottom {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
