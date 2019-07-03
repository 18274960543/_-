const Page = require('../../utils/ald-stat.js').Page;

const app = getApp()
let url = require('../../utils/config.js')
Page({
  /*页面的初始数据*/
  data: {
    store_list: [],
    store_index: "0"
  },
  requestList: function() {
    var that = this;
    // console.log("111",app.token);
    wx.request({
      url: url.api + '/ucs/v1/member/follow',
      header: {
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        console.log(res)
        that.setData({
          store_list: res.data.list
        })
      },
    })
  },
  onDeleteTap(event) {
    this.setData({
      store_index: event.target.dataset.id
    })
    var shop_id = this.data.store_list[this.data.store_index].pivot.shop_id;
    var that = this;
    wx.request({
      url: url.api + '/ucs/v1/member/follow',
      data: {
        "shop_id": shop_id
      },
      header: {
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      method: 'delete',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: res.data.message,
          duration: 1000,
          icon: "success"
        })
        that.requestList();
      },
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function(options) {
    this.requestList();
  },
  /*生命周期函数--监听页面显示*/
  onShow: function() {},
  // 点击关注门店 去首页 切换店铺  
  gohome(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let store_list = this.data.store_list;
    let uuid = store_list[index].uuid
    console.log(index, store_list)
    let location = {};
    location.lon = store_list[index].lon;
    location.lat = store_list[index].lat;
    location.province = store_list[index].province;
    location.city = store_list[index].city;
    console.log(location)
    wx.setStorageSync('uuid', uuid)
    wx.setStorageSync('is_change', 1)
    wx.switchTab({
      url: '../home/home'
    })
  }
})