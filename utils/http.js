// 接口域名
const apiUrl ="https://api.shoushoutao.com";
// 封装请求
const http = (params)=>{
  return new Promise((resolve, reject)=>{
    wx.showLoading({
      title: '加载中',
      mask: true
    })
       wx.request({
         url: apiUrl + params.url,//服务器url+参数中携带的接口具体地址
         data: params.data,//请求参数
         header: params.header || {
          "Content-Type": "application/x-www-form-urlencoded"//设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
          },
        method: params.method || 'get',//默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
        success:(res)=>{
          if (res.data.code==200){
            wx.hideLoading()
            resolve(res.data)
          }  
        },
         fail:(res)=>{
           wx.hideLoading()
           showError()
           reject(res)
         }
       })
  })
}
/**
 * 弹窗提示网络错误
 */
function showError() {
  wx.showToast({
    title: '加载失败',
    icon: 'none',
    duration: 2000,
    mask: true
  })
}
// 把封装的HTTP 公出
module.exports = {
  http
}