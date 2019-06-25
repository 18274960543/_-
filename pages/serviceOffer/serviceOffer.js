var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.servicelist()
  },
  gocoupon(){
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
 servicelist(){
   wx.request({
     url: url.api + `/ucs/v1/service/coupon/list`,  
     method: "get",
     header: {
       'content-type': 'application/json',  
       "Authorization": wx.getStorageSync('token') 
     },
     success: (res) => {
        console.log(res.data);
   
       this.setData({
          list:res.data.data
       })
     }
   })
 },
  receive(e){
    let index = e.currentTarget.dataset.index;
    let list =this.data.list;
    let receive=list[index]
    wx.request({
      url: url.api + `/ucs/v1/service/coupon/own`,
      method: "post",
      data:{
        coupon_id: receive.coupon_id,
        start_time: receive.coupon[0].start_time,
        end_time: receive.coupon[0].end_time,
        discount: receive.coupon[0].discount,//折扣
        use_way:1,
        service_coupon_id: receive.id
      },
      header: {
        'content-type': 'application/json',
        "Authorization": wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res.data);
        if(res.data.code==200){
          this.servicelist()
        }
      wx.showToast({
        title: res.data.message,
        duration:1000
      })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

})