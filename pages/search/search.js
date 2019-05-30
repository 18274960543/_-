var app = getApp()
let url = require('../../utils/config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_bottomItems:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.search()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  bindKeyInput(e){
    let likeWhere = e.detail.value;
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
      data: {
        likeWhere: likeWhere
      },
      method: "post",
      success: (res) => {
        console.log(res.data)
        this.setData({
          nav_bottomItems: res.data.data,
        })
        console.log(this.data.nav_bottomItems)
      }
    })
  },
  // 点击购物车小车   加入购物车
  bindcar(e) {
    let index = e.currentTarget.dataset.index
    //加入购物车
    let list = this.data.nav_bottomItems;
    let goods_sku_id = list[index].goods_sku[0].id;
    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id: url.store_id,
        goods_sku_id: goods_sku_id,
        num: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          this.setData({
            is_switch: false,
          })
          wx.showToast({
            title: '添加成功',
            icon: 'succes',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })

        }
        // this.car_list()
      }
    })
  },
  toInfo(e) {
    console.log('商品详情', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
})