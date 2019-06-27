const app = getApp();
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
 
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "授权" //页面标题为路由参数
    })
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/home/home'
              })
            } 
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      console.log(e.detail.userInfo)
      var that = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        url: url.api + `/ucs/v1/member/${app.member_id}`,
        data: {
          // openid: getApp().globalData.openid,
          nick_name: e.detail.userInfo.nickName,
          avatar: e.detail.userInfo.avatarUrl,
          province: e.detail.userInfo.province,
          city: e.detail.userInfo.city,
          gender: e.detail.userInfo.gender
        },
        method: "put",
        header: {
          'content-type': 'application/json',
          "Authorization":app.token
        },
        success: (res)=>{
          //从数据库获取用户信息
          this.queryUsreInfo();
          console.log(res.data)
          wx.switchTab({
            url: '/pages/home/home'
          })
          console.log("插入小程序登录用户信息成功！");
        },
      
      });
      
      //授权成功后，跳转进入小程序首页
     
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: url.api + `/ucs/v1/member/${app.member_id}`,
      // data: {
      //   openid: app.globalData.openid
      // },
      method:"get",
      header: {
        'content-type': 'application/json',
        "Authorization": app.token
      },
      success: function (res) {
        console.log(res.data);
      //  把用户的信息缓存 我的页面可以拿取
        wx.setStorageSync('userInfo', res.data)
      }
    }) 
  },
})
 