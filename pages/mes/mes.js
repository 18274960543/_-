// let url = require('../../utils/config.js')
// const app = getApp()
// Page({
//   /**
//    * 页面的初始数据
//    */
//   data: {
//     openid: ""

//   },
//   orderSign: function (e) {
//     wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
//       title: '加载中',
//       icon: 'loading',
//     });
//     var fId = e.detail.formId;
//     var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.access_token;
//     var d = {
//       "keyword1": {
//         "value": "00273",
//         "color": "#4a4a4a"
//       },
//       "keyword2": {
//         "value": "腾讯早餐店",
//         "color": "#9b9b9b"
//       },
//       "keyword3": {
//         "value": "66元",
//         "color": "#9b9b9b"
//       },
//       "keyword4": {
//         "value": "包子",
//         "color": "#9b9b9b"
//       },
//       "keyword5": {
//         "value": "68元",
//         "color": "#9b9b9b"
//       }
//     };
//     console.log(d)
//     id:'ZIHDSPZC5gxgVdeQLMwMp-IGM--R0fyjWwFBsTJoW4c'
//     wx.request({
//       url: l,
//       　　　　　//注意不要用value代替data
//       data: {
//         touser: this.data.openid,
//         template_id: 'id',//申请的模板消息id，  
//         page: '/pages/home/home',
//         form_id: fId,
//         data: d,
//         color: '#ccc',
//         emphasis_keyword: 'keyword1.DATA'
//       },
//       method: 'POST',
//       success: function (res) {
//         wx.hideLoading();
//         console.log("发送成功");
//         console.log(res);
//       },
//       fail: function (err) {
//         // fail  
//         console.log("push err")
//         console.log(err);
//       }
//     });
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     var that = this;
//     wx.login({
//       success: (res) => {
//         if (res.code) {
//           wx.request({
//             url: "https://api.weixin.qq.com/sns/jscode2session",
//             data: {
//               appid: app.appid,//你的appid
//               secret: app.secret,//你的secret
//               js_code: res.code,
//               grant_type: "authorization_code"
//             },
//             success: (res) => {
//               console.log(res);
//               that.setData({
//                 openid: res.data.openid //存储openid
//               })
//             }
//           })
//         }
//       }
//     })
//   }
// })