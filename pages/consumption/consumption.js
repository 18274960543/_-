const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
let url = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let card_id = options.card_id;
    this.statistics(card_id)
    wx.request({
      url: url.api + `/ucs/v1/club/expenselist`,  
      method: "get",
      // data:{
      //   card_id,
      // },
      header: {
        'content-type': 'application/json',  
        "Authorization": app.token
      },  
      success: (res) => {
        console.log(res.data.data)
        this.setData({
          list:res.data.data.data
        })
      }
    })
  },
  statistics(card_id){
    wx.request({
      url: url.api + `/ucs/v1/club/statistics`,
      method: "get",
      data:{
        card_id,
      },
      header: {
        'content-type': 'application/json',
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          statistics:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  goConsumptionDetails(e){
    let list = this.data.list;
    let index = e.currentTarget.dataset.index;
    let consumptionDetails = list[index]
    wx.setStorageSync('consumptionDetails', consumptionDetails)
    wx.navigateTo({
      url: '/pages/consumptionDetails/consumptionDetails',
    })
  }
})