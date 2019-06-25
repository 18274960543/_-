// pages/home/bulk/myBulk.js
const app = getApp(),
  url = require('../../../utils/config.js')
Page({
  data: {
    list: ['全部', '拼单中', '拼单成功', '拼单失败'],
    curList: 0
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: '我的拼团' })  
    this.orderReq('all')
  },
  bindVae(e) {
    var curList = e.currentTarget.dataset.index,
      stat = 'all'
    this.setData({
      curList
    })
    if (curList == 1) {
      stat = 'state_new'
    }
    if (curList == 2) {
      stat = 'state_success'
    }
    if (curList == 3) {
      stat = 'state_failed'
    }
    this.orderReq(stat)
  },
  orderReq(status) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: url.api + `/ucs/v1/groupbuy/order/list/` + status,
      header: {
        'content-type': 'application/json',
        "Authorization": wx.getStorageSync('token'),
      },
      success(res) {
        wx.hideLoading()
        console.log('拼团列表', res)
        that.setData({
          orderList: res.data.data.data
        })
      }
    })
  },
  operation(e) {
    var data = e.currentTarget.dataset,
      orderList = this.data.orderList,
      that = this
    if (data.types == 1) {
      wx.request({
        url: url.api + `/ucs/v1/groupbuy/order/payment/` + data.activity_sn,
        header: {
          'content-type': 'application/json',
          "Authorization": wx.getStorageSync('token'),
        },
        method: 'PUT',
        success(res) {
          wx.hideLoading()
          console.log('再次支付', res)
          if (res.data.code == 200) {
            // return
            var pay_info = res.data.payInfo
            wx.requestPayment({
              timeStamp: pay_info.timestamp,
              nonceStr: pay_info.nonceStr,
              package: pay_info.package,
              signType: pay_info.signType,
              paySign: pay_info.paySign,
              success: res => {
                // if (options.bulk == 1) {
                //   wx.redirectTo({
                //     url: '/pages/home/bulk/succ'
                //   })
                //   return
                // }
                wx.redirectTo({
                  url: 'succ?activity_id=' + data.activity_sn
                })
              },
              // fail: err => {
              //   wx.redirectTo({
              //     url: '/pages/myorder/myorder?curIndex=' + 1
              //   })
              // }
            })
          }else{
             wx.showToast({
               title: res.data.message,
               icon: 'none',
               
             })
          }
          // wx.showModal({
          //   content: res.data.message,
          //   showCancel: false
          // })
        }
      })
    }
    if (data.types == 2) {
      wx.navigateTo({
        url: 'succ?activity_id=' + data.activity_sn,
      })
    }
  }
})