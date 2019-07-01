const Page = require('../../utils/ald-stat.js').Page;

const app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    currIndex: "0",
    list: ["未使用", "已使用", "已失效"],
    couponList: [],
    actionDisabled: false,
  },

  on_tap(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currIndex: index,
      actionDisabled: index != 0 ? true : false
    })
    this.getCoupon();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    this.getCoupon();
  },
  formatDate(val, format) {
    val = val.replace(/-/g, '/');
    let format_ = new Date(val).Format(format || 'yyyy-MM-dd');
    return format_
  },
  /**
   * 获取优惠券列表
   */
  getCoupon() {
    let self = this;
    wx.request({
      // url: url.api + `/ucs/v1/member/coupon/` + this.data.currIndex, 
      url: url.api + `/ucs/v1/coupon/list`, 
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.status == 'success') {
          for (let item of res.data.data) {
            item.start_time = self.formatDate(item.start_time);
            item.end_time = self.formatDate(item.end_time);
          }
          self.setData({
            couponList: res.data.data
          })
          console.log(res.data.data)
        } else { //接口请求失败

        }
      }
    })
  },
  getCouponByIndex(e) {
    let couponId = e.currentTarget.dataset.id;
    wx.request({
      url: url.api + `/ucs/v1/coupon/receive`, // 仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        couponId: couponId,
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.data.status == 'success') {
          wx.showToast({
            title: "优惠券领取成功",
            duration: 2000
          })
          setTimeout(function(){
            wx.navigateBack({});
          },2000)
        } else { //接口请求失败

        }
        //  
    
      }
    })
  },
  go_home() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})