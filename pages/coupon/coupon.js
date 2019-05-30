// pages/me/coupon/coupon.js

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
    self.setData({
      couponList: [],
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + `/ucs/v1/member/coupon/` + this.data.currIndex, // 仅为示例，并非真实的接口地址
      // url: url.api + `/ucs/v1/member/coupon/` + 0, // 仅为示例，并非真实的接口地址
      method: "get",
      data: {
        shop_id: wx.getStorageSync('shop_id'),
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      complete: (res) => {
        wx.hideLoading();
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
        } else { //接口请求失败

        }
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

  },
  // 去领券
  go2CouponCenter: function(e) {
    if (this.data.currIndex == 0)
      wx.navigateTo({
        url: '/pages/coupon_center/coupon_center'
      })
  },
  go2useCoupon: function(e) {
    if (this.data.currIndex == 0) {
      let use_way = e.target.dataset.use_way;
      let is_shop_coupon = e.target.dataset.is_shop_coupon;
      if (use_way == 1) {
        //不能使用
        if (is_shop_coupon == 0) {
          //服务优惠券
          wx.showToast({
            title: '本店铺无此服务或优惠券范围与当前店铺不一致，不能使用此优惠券',
            icon: 'none',
          })
        } else {
          wx.switchTab({
            url: '../home/home',
          })
        }
      } else {
        wx.navigateTo({
          url: '/pages/couponShopList/couponShopList?id=' + e.target.dataset.id,
        })
      }
    }
  }
})