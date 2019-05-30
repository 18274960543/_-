let url = require('../../utils/config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressList: [],
    state_desc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    let state_desc = options.state_desc;
    let id = options.id;
    this.setData({
      state_desc: state_desc,
    })
    // 获取/渲染物流信息
    this.renderExpressList(id);
  },

  renderExpressList(id) {
    let self = this;
    wx.showLoading({});
    wx.request({
      url: url.api + `/ucs/v1/order/express/${id}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      complete: () => {
        wx.hideLoading()
      },
      success: (res) => {
        let resd = res.data;
        if (resd.status == 'success')
          self.setData({
            expressList: resd.data.express_info||[],
            express_name: resd.data.express.express_name,
            express_code: resd.data.express.express_code,
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})