// import urlConfig from './config.js'
import {
    url_config,
    url_config_car
} from './config.js'

const request = {}

var urlConfig

var TOKEN = ""
var headers = {
    "env": "TEST",
    "token": TOKEN
}
// 定义全局请求方法及相关参数
request.globalRequest = (url, method, data, isCar) => {
    urlConfig = isCar ? url_config_car : url_config
    console.log("isCar  =  " + isCar)
    console.log(urlConfig + url)
    console.log(data)
    return uni.request({
        url: urlConfig + url,
        method,
        data: data,
        dataType: 'json',
        header: headers
    }).then(res => {
        // console.log(res)
        // var result = res[1].data
        if (isCar == true) {
            if (res[1].data.success && res[1].data.code == 2000) {
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
        switch (parmas.code) {
            case 401:
                uni.clearStorageSync()
                break
            default:
                uni.showToast({
                    title: parmas.msg,
                    icon: 'none'
                })
                return Promise.reject()
                break
        }
    })
}

export default request
