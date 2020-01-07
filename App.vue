<script>
    import Vue from 'vue'
    export default {
        created() {
            // #ifdef APP-PLUS
            plus.navigator.closeSplashscreen();
            // #endif
        },
        onLaunch: function() {
            console.log('App Launch，app启动')
            uni.getSystemInfo({
                success: function(e) {
                    // #ifndef MP
                    Vue.prototype.StatusBar = e.statusBarHeight;
                    if (e.platform == 'android') {
                        Vue.prototype.CustomBar = e.statusBarHeight + 50;
                    } else {
                        Vue.prototype.CustomBar = e.statusBarHeight + 45;
                    };
                    // #endif

                    // #ifdef MP-WEIXIN
                    Vue.prototype.StatusBar = e.statusBarHeight;
                    let custom = wx.getMenuButtonBoundingClientRect();
                    Vue.prototype.Custom = custom;
                    Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
                    // #endif

                    // #ifdef MP-ALIPAY
                    Vue.prototype.StatusBar = e.statusBarHeight;
                    Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
                    // #endif
                }
            })

            // #ifdef APP-PLUS
            // 锁定屏幕方向
            plus.screen.lockOrientation('portrait-primary'); //锁定
            // 检测升级
            // uni.request({
            //     url: 'https://www.gongguyi.com/guyi-platform-backend/api/ggyt/function006', //检查更新的服务器地址
            //     data: {
            //         versionType: "ANDROID",
            //          versionNum:62
            //         // versionNum: plus.runtime.version
            //         // appid: plus.runtime.appid,
            //         // version: plus.runtime.version,
            //         // imei: plus.device.imei
            //     },
            //     success: (res) => {
            //         console.log(res);
            //         console.log('success', res);
            //         // if (res.statusCode == 2000 && res.data.isUpdate) {
            //         if (res[1].data.eeror.no == 0 && res[1].data.result.versionNum < plus.runtime.version) {
            //             // let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
            //             let openUrl = res[1].data.result.versionUrl;
            //             // 提醒用户更新
            //             uni.showModal({
            //                 title: '更新提示',
            //                 content: res.data.result.versionComment,
            //                 success: (showResult) => {
            //                     if (showResult.confirm) {
            //                         plus.runtime.openURL(openUrl);
            //                     }
            //                 }
            //             })
            //         }
            //     }
            // })
            // #endif
        },
        onShow: function() {
            console.log('App Show，app展现在前台')
        },
        onHide: function() {
            console.log('App Hide，app不再展现在前台')
        },
        globalData: {
            test: ''
        }
    }
</script>
<!--
<style>
    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/uni.css';

    /* 以下样式用于 hello uni-app 演示所需 */
    page {
        background-color: #F4F5F6;
        height: 100%;
        font-size: 28upx;
        line-height: 1.8;
    }

    .uni-header-logo {
        padding: 30upx;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10upx;
    }

    .uni-header-image {
        width: 100px;
        height: 100px;
    }

    .uni-hello-text {
        color: #7A7E83;
    }

    .uni-hello-addfile {
        text-align: center;
        line-height: 300upx;
        background: #FFF;
        padding: 50upx;
        margin-top: 10px;
        font-size: 38upx;
        color: #808080;
    }

    /* #endif*/
</style>
 -->
<style lang="scss">
    // @import './common/uni.css';
    /*每个页面公共css */
    @import url("./style/animation/animation.css");
    /* 动画 */
    /* ColorUi */
    @import url("./lib/colorui/main.css");
    @import url("./lib/colorui/icon.css");

    /* 加载loding */
    .cu-load.load-modal {
        width: 0px;
        height: 0px;
        background-color: transparent;
    }

    .cu-load.load-modal::after {
        background-color: rgba(0, 0, 0, 0.3);
        width: 30px;
        height: 30px;
        border-left: 3px solid #FFF0F6;
    }

    body {
        background: #FFFFFF !important;
    }

    /* 阴影 */
    .bar-shadown {
        -webkit-box-shadow: 0 0 36px 0 rgba(43, 86, 112, .1) !important;
        box-shadow: 0 0 36px 0 rgba(43, 86, 112, .1) !important;
    }

    page,
    view {
        display: flex;
    }


    page {
        display: flex;
        background-color: #F4F5F6;
        height: 100%;
        font-size: 28upx;
        line-height: 1.8;
    }


    template {
        display: flex;
        flex: 1;
    }
</style>
