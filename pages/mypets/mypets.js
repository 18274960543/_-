var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        img:'/img/my.png'
      },
      {
        img: '/img/cart1.png'
      },
      {
        img: '/img/xf.png'
      }
    ],
    xindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.pet_list()
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
  onChange(e){
    console.log(e)
    this.setData({
      xindex: e.detail.current
    })
  },
  // 用户的宠物列表
  pet_list() {
    wx.request({
      url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      success: (res) => {
         console.log(res);
        let pet_list = res.data.data;
     
        this.setData({
          list: res.data.data
        })
         
      }
    })
  },
})