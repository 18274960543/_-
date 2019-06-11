let url = require('../../utils/config.js')
const app = getApp()
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    index: 0,
    arr: [{
      text: '全部商品',
      status: 1,
    },
    {
      text: '品牌简介',
      status: 0,
    },
    ],
    sup_intro: '',//供应商介绍文字
    sup_intro_img:[],//供应商介绍图片
    goods:[],//商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSupplierDetail(options.supplier_id);
    // this.getSupplierDetail(3);
    // 猜你喜欢
    this.guessLike()
  },
  getSupplierDetail(sup_id) {
    let self = this;
    if (sup_id)
      wx.request({
        url: url.api + `/ucs/v1/shop/goods/supplier/` + sup_id, // 仅为示例，并非真实的接口地址
        method: "GET",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          if (res.data.code == 200) { 
            let goods = res.data.goods;
            let desc = res.data.description;
            let supplier_store = desc?desc.supplier_store||{}:{};
            self.setData({
              sup_intro: desc ? desc.introduction:'',
              // sup_intro:'杭州华元宠物用品有限公司是一家从事宠物用品的电子商务公司，成立于2007年，公司旗下有HOOPET、酷奇思、妙慕等20个品牌；涉及洗浴用品、狗窝、玩具、狗粮零食、保健用品、医药用品等多个领域。其中华元宠物用品专营店是HOOPET在天猫商城上的宠物物用品旗舰店，主营商品为高档宠物窝具、宠物食品、宠物服饰、日用品等宠物用品。',
              sup_intro_img: supplier_store.store_intro||[],
              store_banners: supplier_store.store_banners || [],
              goods: goods,
            })
          }
        }
      })
  },
  guessLike() {
    wx.request({
      url: url.api + `/ucs/v1/shop/goods/list`, // 仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        ids: 3
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data.data);
        let guessLike = res.data.data
        if (res.data.code == 200) {
          this.setData({
            guessLike
          })
        }
      }
    })
  },
  // 品牌简介 商品推荐 切换
  // 头部点击切换样式
  switchRightTab(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.arr;
    arr.map(item => {
      item.status = 0
    })
    arr[index].status = 1
    this.setData({
      arr,
      index
    })
  },
  // 点击猜你喜欢 商品去 商品详情
  toInfo(e) {
    console.log('商品详情', e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id; 
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})