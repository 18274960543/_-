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
    this.memberList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 会员卡列表数据
  memberList(){
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: url.api + `/ucs/v1/club/cardlist`,  
      method: "get",
      header: {
        'content-type': 'application/json', 
        "Authorization": app.token
      },
      success: (res) => {
         console.log(res.data);
          let list=res.data.data;
          // if(res.data.data.length==0){
          //     wx.showToast({
          //       title: '您的会员卡暂无数据',
          //       icon:'none'
          //     })
          // }
          this.setData({
            list
          })
          // wx.hideLoading()
      }
    })
  },
  gocode(){
    wx.navigateTo({
      url: '/pages/code/code',
    })
  },
  goconsumption(){
    wx.navigateTo({
      url: '/pages/consumption/consumption',
    })
  }
})