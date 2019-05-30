let url = require('../../utils/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    totalMoney:null,
    guessLike:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 猜你喜欢
    this.guessLike()
    if (options.pay_sn){
      this.pyaData(options.pay_sn)
    }
    if (options.pay_sn1){
      this.servePyaData(options.pay_sn1)
    }
    // this.servePyaData(options.pay_sn1)
    console.log(options)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  go_home(){
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  go_myorder(){
    wx.navigateTo({
      url: '/pages/myorder/myorder?curIndex='+1,
    })
  },
  // 商品模块支付成功
  pyaData(pay_sn){
    wx.request({
      url: url.api + `/ucs/v1/order/payment/${pay_sn}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        let list = res.data.orders;
         
        let totalMoney = Number(res.data.amount)/100
        // list.map((item)=>{
        //   totalMoney = item.order_amount + totalMoney
        // })
        this.setData({
          totalMoney,
          list
        })
      }
    })
  },
  // 服务模块支付成功
  servePyaData(pay_sn) {
    wx.request({
      url: url.api + `/ucs/v1/service/bath/finish/${pay_sn}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        let  serve_list = res.data;
        let totalMoney = serve_list.total_fee;
        // list.map((item) => {
        //   item.order_goods.map((item1) => {
        //     totalMoney = item1.goods_price * item1.goods_num
        //   })
        // })
        this.setData({
          totalMoney,
           serve_list
        })
      }
    })
  },
  // 猜你喜欢
  guessLike() {
    wx.request({
      url: url.api + `/ucs/v1/shop/goods/list`, // 仅为示例，并非真实的接口地址
      method: "POST",
      data:{
        ids:3
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data.data);
        let guessLike = res.data.data
        if (res.data.code==200){
          this.setData({
            guessLike
          })
        }  
      }
    })
  },
  // 点击猜你喜欢 商品去 商品详情
  toInfo(e) {
    console.log('商品详情', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
})