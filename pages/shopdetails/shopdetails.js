let url = require('../../utils/config.js')
const app = getApp()
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    orderData:null,
    showSerivce:false,
    index1:0,
    time: Date.parse(new Date())/1000-5184000
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.orderData(options.id)
    console.log(this.data.time)
  },
  // 商品确认收货
  confirm(e) {
    let order_sn = this.data.orderData.order_sn;
    let pay_sn = this.data.orderData.pay_sn;
    wx.request({
      url: url.api + `/ucs/v1/order/complete/${pay_sn}/${order_sn}`, // 仅为示例，并非真实的接口地址 
      method: "put",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)

      }
    })
  },
  orderData(id) {
    // console.log(app.token)
    console.log(id)
    wx.request({
      url: url.api + `/ucs/v1/order/${id}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        let orderData = res.data.data;
        let created_at = this.getLocalTime(res.data.data.created_at);
        this.setData({
          orderData,
          created_at
        })
      }
    })
  },
  onCopyTap: function () {
    wx.setClipboardData({
      data: String(this.data.orderData.order_sn),
      success: (res) => {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
   getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
  } ,
  // 再次购买
  gohome(){
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  //查看物流
  goExpress(){
    let orderData = this.data.orderData;
    wx.navigateTo({
      url: `/pages/orderexpress/orderexpress?id=` + orderData.id + '&state_desc=' + orderData.state_desc,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  add(e) {
    let index1 = e.currentTarget.dataset.index;
    this.setData({
      showSerivce: !this.data.showSerivce,
      index1,
    })
  },
  // 申请售后 跳转到退款退货页面
refund(e){
    
    let index = this.data.index1
    let orderData=this.data.orderData;
    let orderId = orderData.order_goods[index].order_id;
    let goodsSkuId = orderData.order_goods[index].goods_sku_id;
  let num = orderData.order_goods[index].goods_num;
  let refund_state = e.currentTarget.dataset.types//售后状态:0是仅退款,1是退款退货,2是换货;
   wx.navigateTo({
     url: `/pages/refundInfo/refundInfo?orderId=${orderId}&goodsSkuId=${goodsSkuId}&refund_state=${refund_state}&num=${num}`,
    })
  this.setData({
    showSerivce: false
  })
},
 stopPageScroll: function () {
    return
  },
})