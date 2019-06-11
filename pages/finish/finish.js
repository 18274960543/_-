let url = require('../../utils/config.js')
const app = getApp()
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statustext:"支付成功",
    useraddress1:"湖南省长沙市开福区...",
    ordernumber:"20190107152625835",
    orderclassify:"服务类商品",
    payway:"微信/支付宝",
    ordertime:"2019-01-07 15:45",
    paytime:"2019-01-07 15:45",
    servicecost:"60.00",
    pickupcost:"00.00",
    distance:10.6,
    goodstitle:"黑山羊蔓越莓狗粮",
    goodsprice:"519.00",
    goodstotalprice:"1038.00",
    freightprice:"0.00",
    storediscounts:"0.00",
    detailsData:null,
    spec:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.orderDetails(options.pay_sn);
    this.setData({
      spec: options.specs
    })
  },
  onCopyTap:function(){
    wx.setClipboardData({
      data: this.data.ordernumber,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  orderDetails(pay_sn){
   wx.request({
     url: url.api + `/ucs/v1/service/bath/detail/${pay_sn}`, // 仅为示例，并非真实的接口地址
     method: "get",
     header: {
       'content-type': 'application/json', // 默认值
       "Authorization": app.token
     },
     success: (res) => {
       console.log(res.data)
       let detailsData=res.data.data;
      //  console.log(detailsData.体毛)
      //  let spec = detailsData.spec[0].service_specs;
       this.setData({
         detailsData
       })
     }
   })
 }
})