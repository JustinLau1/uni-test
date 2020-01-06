import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/common/request.js'
import {
    formatGetUri
} from '@/common/util.js'

const api = {}
const PORT1 = 'baseinfo'
// 注册获取验证码
api.register = params => request.globalRequest(`${PORT1}/mobile/signUp`, 'GET //必须大写，为了兼容其他应用', params, 1)
//调用登录接口并传参
api.login = params => request.globalRequest("login/login", "POST", params, true)
api.getCaseList = params => request.globalRequest("case/pageCase", "POST", params, true)
api.checkVersion = params => request.globalRequest("ggyt/function006", "POST", params, false)
export default api
