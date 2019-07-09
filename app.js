
//app.js
const App = require('./utils/ald-stat.js').App;
let url = require('./utils/config.js')
App({
  onLaunch: function() {
    //判断有没有token  
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, un   
        let shop_id = wx.getStorageSync('shop_id')
        wx.request({
          url: url.api + `/ucs/v1/oauth/login`,
          data: {
            code: res.code,
            shop_id: shop_id ? shop_id : 1
          },
          method: "post",
          success: (res) => {
            console.log('getCode', res)
            // 获取token
            this.token = res.data.token_type + ' ' + res.data.access_token;
            let uuid = res.data.shop_uuid
            wx.setStorageSync('token', this.token);
            wx.setStorageSync('shop_uuid', uuid);
            console.log(res.data.token_type + ' ' + res.data.access_token)
            this.tokenHeader = {
              'content-type': 'application/json', 
              "Authorization": this.token,
              "Accept": 'application/json'
            };
            // 获取member_id
            this.member_id = res.data.id;
            if (this.mstrCallback) {
              this.mstrCallback(res.data.token_type + ' ' + res.data.access_token);
            }
          }
        })
      }
    })
 
  },
  tele_phone: '18275142301', //电话号码
  appid: "wx12a9b6ebd67dcb13",
  token: '',
  tokenHeader: {}, 
  sst_secret: '0e506ed52bfade9ae29ebe3f312b90c1',
access_token:"19_IqrDQdM6o6bVRedOZcGTsWQXspoOBTa-K7xSV_IFJM81Kxo1MSybmR9EOTOsHn4f204juaaeDsCIkcjehf5q1sR7dxW3e3Q0hH_eLY-seF17I_RTts9ehXvREECc4Ip4rOkHr3xNrYg5c9SfGFOcAJACBK",
  member_id: '',
  globalData: {
    userInfo: null,
    address: null,
    get getFixed(){
      
    }
  },
})
// global
Date.prototype.Format = function(fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
