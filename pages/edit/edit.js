// pages/edit/edit.js
const app = getApp()
let url = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    telephone:app.tele_phone
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('userInfo').mobile) {
      this.queryUsreInfo();
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  onAdressTap(){
    wx.navigateTo({
      url: "/pages/address/address",
    })
  },
  onTeleTap:function(){
    wx.navigateTo({
      url: "/pages/edit/editTele/editTele",
    })
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    var that = this
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
      success: function (res) {
        //  把用户的信息缓存 我的页面可以拿取
        console.log(res.data)
        that.setData({
          userInfo: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!wx.getStorageSync('userInfo').mobile) {
      this.queryUsreInfo();
    }else{
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})