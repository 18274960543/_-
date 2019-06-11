var app = getApp()
let url = require('../../utils/config.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist: null,
    location:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      location: wx.getStorageSync('location')
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      location: wx.getStorageSync('location')
    })
  },
  // 店铺列表
  shoplist(e) {
    let value = e.detail.value;
    wx.request({
      url: url.api + `/ucs/v1/service/store/like`, // 仅为示例，并非真实的接口地址
      data: {
        name: value,
        lon: this.data.location.lon,
        lat: this.data.location.lat,
      },
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          let addresslist = res.data.data
          this.setData({
            addresslist
          })
        }
      }
    })
  },
 
  //点击当前定位去首页
  gohome() {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 点击搜索的地址列表  去首页切换
  listTOhome(e) {
    let index = e.currentTarget.dataset.index;
    let addresslist = this.data.addresslist;
    // let title = addresslist[index].name;
    let uuid = addresslist[index].uuid;
    // wx.setStorageSync('address', title);
    wx.setStorageSync('uuid', uuid);
    this.info(uuid)
    
  },
  info(uuid) {
    // 判断是否二维码扫码 生成unid 有就调店铺信息数据
    // if (this.data.uuid){
    wx.request({
      url: url.api + '/ucs/v1/shop/info', // 仅为示例，并非真实的接口地址
      data: {
        uuid:uuid
      },
      method: "post",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res.data.data)
        // 有这个店铺 就去这个店铺
        if (res.data.code == 200) {
          console.log(this.data.mername);
          wx.setStorageSync('shop_info', res.data.data)
          wx.setStorageSync('address', res.data.data.address);
          wx.setStorageSync('shop_id', res.data.data.id)
          wx.setStorageSync('title', res.data.data.name)
        } else {
          //没有这个店铺就去附近的店铺
          wx.setStorageSync('shop_id','')
        }
        wx.navigateBack({
          delta: 1,
        })
      }
    })
    // }
  },
})