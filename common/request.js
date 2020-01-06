// import urlConfig from './config.js'
import {
    url_config,
    url_config_car
} from './config.js'

const request = {}

// var urlConfig

var TOKEN = ""
var headers = {
    "env": "TEST",
    "token": TOKEN
}
// 定义全局请求方法及相关参数
request.globalRequest = (url, method, data, isCar) => {
    var urlConfig = isCar ? url_config_car : url_config
    console.log("isCar  =  " + isCar)
    console.log(urlConfig + url)
    console.log(data)
    console.log(data.headers)
    console.log(headers)
    return uni.request({
        url: urlConfig + url,
        method,
        data: data,
        dataType: 'json',
        header: data.headers != null ? data.headers : headers
    }).then(res => {
        console.log(res[1])
        // var result = res[1].data
        if (isCar == true) {
            // if (res[1].data.success == true && res[1].data.code == 2000) {
            if (res[1].data.code == 2000) {
                if (url == "login/login") {
                    TOKEN = res[1].data.data.token
                    console.log("登录")
                    headers = {
                        "env": "TEST",
                        "token": TOKEN
                    }
                    console.log(headers)
                }
                return res[1]
            } else {
                throw res[1].data
            }
        } else {
            if (res[1].data.error.no == 0) {
                if (url == "login/login") {
                    TOKEN = res[1].data.data.token
                    // console.log(headers)
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
        console.log("请求失败")
        console.log(parmas)
        switch (parmas.code) {
            case 401:
                uni.clearStorageSync()
                break
            default:
                // uni.showToast({
                //     title: parmas.msg,
                //     icon: 'none'
                // })
                return Promise.reject()
                break
        }
    })
}

export default request
