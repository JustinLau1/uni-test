let url_config = ""
let url_config_car = ""
// const isCar = true
if (process.env.NODE_ENV === 'development') {
    // 开发环境
    // url_config = 'https://www.gongguyi.com/car/api/'
    url_config_car = "https://sandbox.gongguyi.com/car/api/"
    url_config = 'https://sandbox.gongguyi.com/guyi-platform-backend/api/'
    // url_config = isCar ? 'https://sandbox.gongguyi.com/car/api/' :
    //     'https://sandbox.gongguyi.com/guyi-platform-backend/api/'
    // if (isCar) {
    //     url_config = 'https://sandbox.gongguyi.com/car/api/'
    // } else {
    //     url_config = 'https://sandbox.gongguyi.com/guyi-platform-backend/api/'
    // }
} else {
    // 生产环境
    // url_config = 'https://www.gongguyi.com/car/api/'
    url_config_car = "https://sandbox.gongguyi.com/car/api/"
    url_config = 'https://www.gongguyi.com/guyi-platform-backend/api/'
    // url_config = isCar ? 'https://www.gongguyi.com/car/api/' :
    //     'https://www.gongguyi.com/guyi-platform-backend/api/'
    // if (isCar) {
    //     url_config = 'https://www.gongguyi.com/car/api/'
    // } else {
    //     url_config = 'https://www.gongguyi.com/guyi-platform-backend/api/'
    // }
}

// export default url_config
export {
    url_config,
    url_config_car
}
