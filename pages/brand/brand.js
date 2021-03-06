var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    nav_bottomItems: [],
    page:1
  },

  // 列表数据
  hotData(brand_id,page) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + '/ucs/v1/shop/brand/product',
      data: {
        brand_id,
        page,
      },
      method: "post",
      success: (res) => {
       
        let nav_bottomItems = this.data.nav_bottomItems;
        let list = res.data.data.data;
         list.map(item=>{
           nav_bottomItems.push(item)
         })
        console.log(res)
        this.setData({
          nav_bottomItems,
          page:page++
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
    this.setData({
      brand_id: options.brand_id
    })
    let page=this.data.page
    this.hotData(options.brand_id,page)
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
// 滑动到底部的时候  
  onReachBottom(){
    this.hotData(this.data.brand_id,this.data.page)
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