const Page = require('../../utils/ald-stat.js').Page;
const query = wx.createSelectorQuery();
const app = getApp()
let url = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navLeftItems: [],
    curIndex: 0,
    curIndextop: 0,
    navRightItems: [],
    list: [{ name: '狗' }, { name: '猫' }],
    list1: [
      { name:'狗狗主粮'},
      { name: "狗狗零食"},
      { name: "狗狗玩具"},
      { name: "狗狗服饰"},
      { name: "狗狗窝垫"},
      { name: "狗狗清洁"},
      { name: "狗狗保健"},
      { name: "狗狗护理"},
      { name: "狗狗生活"}
      ],
    imgUrls:null,
    img:'/img/sst.png',
    rightScrollId:'',
  },   
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    this.homeMergedata()
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + '/ucs/v1/shop/category/show', // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json' 
      },
      success: (res) => { 
        // this.setData({
        //   navLeftItems: res.data.data
        // })
        console.log(res.data.data)
        let list = res.data.data;
        this.setData({
          list:list,
        })
        wx.hideLoading(); 
        setTimeout(function(){
          self.bindRightObserve();
        },200)
      }
    })
  },
  // 合并 服务，商品分类，联系方式，轮播图 ，广告图
  homeMergedata() {
  let uuid = wx.getStorageSync('shop_info').uuid  
    wx.request({
      url: url.api + `/ucs/v1/shop/index/${uuid}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode == 200) {
          let mergedata = res.data
          this.setData({
            mergedata
          })
          
        }
      }
    })
  },
  /*
   * 记录左侧点击的按钮下标 
   */
  switchRightTab(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index,
      rightScrollId:'ri'+index
    })
  },
  /**
   * 绑定滚动
   */
  bindRightObserve(){ 
    let self = this;
    this._observer = wx.createIntersectionObserver(this, { observeAll: true });
    // this._observer = wx.createIntersectionObserver(this);
    this._observer
      .relativeTo('.nav_right')
      .observe('.scroll-item', (res) => {
        let setIndex = null;
        let curIndex = this.data.curIndex;
        let resIndex = parseInt(res.id.split('ri')[1]);
        if (res.intersectionRatio==0){//离开
          if(curIndex===resIndex) {
            setIndex = curIndex+1;
          }
        }else{//进入
          if (curIndex-1 === resIndex) {
            setIndex = curIndex - 1;
          }
        }
        if (setIndex!==null){ 

          self.setData({
            curIndex:setIndex
          })
        }
      })
  },
  /*
   * 记录头部侧点击的按钮下标 
   */
  switchtopTab(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let list = this.data.list;
    this.setData({
      curIndextop: index
    })
  },
  // 点击商品 跳转到商品列表
  goshoplist(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shop_list/shop_list?id=' + id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  // 点击搜索 去搜索页面
  gosearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 广告图
  lunbo() {
    console.log(url.store_id)
    wx.request({
      url: url.api + `/ucs/v1/shop/banner`, // 仅为示例，并非真实的接口地址
      data: {
        shop_id: url.store_id,
        type: 3
      },
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data)
        this.setData({
          imgUrls: res.data.data
        })
      }
    })
  },
})