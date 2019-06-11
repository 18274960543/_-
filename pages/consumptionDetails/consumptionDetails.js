const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consumptionDetails: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  let consumptionDetails = wx.getStorageSync('consumptionDetails')
 this.setData({
   consumptionDetails
 })
    // console.log(wx.getStorageSync('consumptionDetails'))
  },
 
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
 
})