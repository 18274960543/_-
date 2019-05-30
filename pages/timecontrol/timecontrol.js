// pages/index/rili.js
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

  },
  dianji: function () {
    this.yunxin()//调用回调函数
  },
  yunxin: function () {
    var that = this;
    that.rili = that.selectComponent("#rili")
    var starTime = ''
    var day = ''
    var endTime = ''
    that.rili.xianShi({
      data: function (res) {
        console.log(res)//选择的日期
        if (res != null) {
          if (res.length == 1) {
            starTime = res[0].data
          }
          else if (res.length == 2) {
            starTime = res[0].data
            endTime = res[1].data
            day = res[1].chaDay
          }
        }
        else {
          starTime = ''
          day = ''
          endTime = ''
        }
        that.setData({
          starTime: starTime,
          endTime: endTime,
          day: day,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})