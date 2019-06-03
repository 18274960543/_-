const app = getApp(),
  url = require('../../utils/config.js')
Page({
  data: {
    userInfo: null
  },
  onLoad: function(options) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // 如果用户没有授权
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
    if (!wx.getStorageSync('userInfo')){
      this.queryUsreInfo()
    }else{
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  onShow(){
    this.queryUsreInfo()
  },
  my_order: function() {
    wx.navigateTo({
      url: "/pages/myorder/myorder",
    })
  },
  onTap_pet: function() {
    wx.navigateTo({
      url: "/pages/mypet/mypet",
    })
  },
  onTap_coupon: function() {
    wx.navigateTo({
      url: "/pages/coupon/coupon",
    })
  },
  go_Aboutus() {
    wx.navigateTo({
      url: "/pages/Aboutus/Aboutus",
    })
  },
  go_follow_store() {
    wx.navigateTo({
      url: "/pages/follow_store/follow_store",
    })
  },
  go_news() {
    wx.navigateTo({
      url: "/pages/news/news",
    })
  },
  go_edit() {
    wx.navigateTo({
      url: "/pages/edit/edit",
    })
  },
  gomember(){
    wx.navigateTo({
      url: "/pages/member/member",
    })
  },
  gocomplaint(){
    wx.navigateTo({
      url: "/pages/complaint/complaint",
    })
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    var that=this
    wx.request({
      url: url.api + `/ucs/v1/member/${app.member_id}`,
      // data: {
      //   openid: app.globalData.openid
      // },
      method: "get",
      header: {
        'content-type': 'application/json',
        "Authorization": app.token
      },
      success: function(res) {
        console.log(res.data)
        //  把用户的信息缓存 我的页面可以拿取
        that.setData({
          userInfo:res.data
        })
      }
    })
  },
})