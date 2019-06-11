let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeData:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.codeData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  codeData(){
    wx.showLoading({
      title: '加载中.....',
    })
    wx.request({
      url: url.api + `/ucs/v1/club/code`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res)
        this.setData({
          codeData:res.data.data
        })
        wx.hideLoading()
      }
    })
  },
  bigimage(){
    console.log(this.data.codeData.qr_code)
    let urls=[];
    urls.push(this.data.codeData.qr_code)
    wx.previewImage({
      current: this.data.codeData.qr_code, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    })
  }
  
})