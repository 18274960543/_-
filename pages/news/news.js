let url = require('../../utils/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.news()
  },
  getPhoneNumber(e) {
    // console.log(e)
    // console.log(e.detail.errMsg)
    // console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    console.log(e, e.detail.encryptedData)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
//  消息
  news(){
    wx.request({
      url: url.api + `/ucs/v1/system_message`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        // console.log(res.data.data)
        let news = res.data.data;
        //循环遍历将毫秒时间戳转成日期
        news.map((item) => {
          item.date = new Date(parseInt(item.created_at) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
        })
        console.log(news)
        this.setData({
          news: news
        })
      }
    })
  }
})