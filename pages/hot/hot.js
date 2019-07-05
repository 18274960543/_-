var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    nav_bottomItems: null,
  },

// 列表数据
  hotData(category_id){
    wx.showLoading({
      title: '加载中...',
    })
  wx.request({
    url: url.api + '/ucs/v1/shop/hot/list', 
    data: {
      category_id
    },
    method: "post",
    success: (res) => {
      console.log( res)

    this.setData({
        nav_bottomItems:res.data.data
      })
      wx.hideLoading()
     
    }
  })
},
  stopPageScroll: function () {
    return
  },
  onLoad(options) {
    console.log(options)
      this.hotData(options.category_id)
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
 
  // 点击去商品详情页
  godetails(e) {
    // console.log(e)
    //  商品id
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
    })
  },
  // 点击搜索 去搜索页面
  gosearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})