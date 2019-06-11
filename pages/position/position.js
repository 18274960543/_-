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
    lati: null,
    longi: null,
    address: '',
    active: false,
    suggestion: null,
    region: '长沙市'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.addresslist();
    this.setData({
      address: wx.getStorageSync('address')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.addresslist()
    this.setData({
      address: wx.getStorageSync('address')
    })
  },
  // 地址列表
  addresslist() {
    wx.request({
      url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
      data: {},
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        // console.log(res.data)
        if (res.data.code == 200) {
          let addresslist = res.data.data.data;
          this.setData({
            addresslist
          })
        }
      }
    })
  },
  // 去添加地址
  gonewaddress() {
    wx.navigateTo({
      url: '/pages/newaddress/newaddress',
    })
  },
  //切换服务地址
  address(e) {
    let index = e.currentTarget.dataset.index;
    let addresslist = this.data.addresslist;
    console.log(222222222, addresslist)
    let address = addresslist[index].address;
    wx.setStorageSync('address', address);
    let location = {};
    location.lat = addresslist[index].lat;
    location.lon = addresslist[index].lon;
    location.province = addresslist[index].province
    location.city = addresslist[index].city
    wx.setStorageSync('location', location);
    wx.setStorageSync('is_change', '1')
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 重新定位
  newWd() {
    console.log(1)
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res.latitude, res.longitude)
        let lati = res.latitude
        let longi = res.longitude
        // 实例化API核心类
        var demo = new QQMapWX({
          key: url.key // 申请的key
        })
        // 调用接口
        demo.reverseGeocoder({
          location: {
            latitude: lati,
            longitude: longi
          },
          success: (res) => {
            console.log(res)
            let  address = res.result.formatted_addresses.recommend;
            wx.setStorageSync('address', address);
            let location = {};
            location.lat = res.result.location.lat;
            location.lon = res.result.location.lng;
            location.province = res.result.address_component.province
            location.city = res.result.address_component.city
            wx.setStorageSync('is_change', '1')
            wx.setStorageSync('location', location);
            this.setData({
              address: wx.getStorageSync('address'),
              active: true
            })
            setTimeout(res => {
              this.setData({
                active: false
              })
            }, 2000)
          },
          fail: function(res) {
            console.log(res);
          }
        })
      }
    })
  },
  //点击当前定位去首页
  gohome() {
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 切换当前城市
  city() {
    var qqmapsdk = new QQMapWX({
      key: url.key // 必填
    });
    var _this = this;
    qqmapsdk.getCityList({
      success: function(res) { //成功后的回调
        console.log(res);
        console.log('省份数据：', res.result[0]); //打印省份数据
        console.log('城市数据：', res.result[1]); //打印城市数据
        console.log('区县数据：', res.result[2]); //打印区县数据
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },
  // 搜索地址
  searchAddress(e) {
    let value = e.detail.value;
    var _this = this;
    var qqmapsdk = new QQMapWX({
      key: url.key // 必填
    });
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: this.data.region, //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function(res) { //搜索成功后的回调
        // console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        // console.log(sug)
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
    });
  },
  // 点击搜索的地址列表  去首页切换
  listTOhome(e) {
    let index = e.currentTarget.dataset.index;
    let suggestion = this.data.suggestion;
    let title = suggestion[index].title;
    let location = {};
    // console.log(suggestion[index])
    var str = suggestion[index].addr,
      arr = str.split("省"),
      province = arr[0] + '省'
    location.lat = suggestion[index].latitude;
    location.lon = suggestion[index].longitude;
    location.province = province;
    location.city = suggestion[index].city
    wx.setStorageSync('address', title);
    wx.setStorageSync('location', location);
    wx.setStorageSync('is_change', '1')
    wx.switchTab({
      url: '../home/home',
    })
  },
  // 点击切换城市  去切换城市页面
  city(){
    wx.navigateTo({
      url: '/pages/selectCity/selectCity',
    })
  }
})