var city = require('../../utils/city.js');
var server = require('../../utils/server');
const Page = require('../../utils/ald-stat.js').Page;
var app = getApp()
Page({
  data: {
    searchLetter: [],
    showLetter: "",
    tabs:["select","",""],
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    city: "",
    hotcityList: [{ cityCode: 110000, city: '北京市' }, { cityCode: 310000, city: '上海市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' }, { cityCode: 330100, city: '杭州市' }, { cityCode: 320100, city: '南京市' }, { cityCode: 420100, city: '武汉市' }, { cityCode: 410100, city: '郑州市' }, { cityCode: 120000, city: '天津市' }, { cityCode: 610100, city: '西安市' }, { cityCode: 510100, city: '成都市' }, { cityCode: 500000, city: '重庆市' }]
  },
  keywords:function(res){
    var search = res.currentTarget.dataset.city;

    wx.showToast({
      title: search,
    })
    //return ;
    getApp().globalData.search = search;
    wx.navigateBack({
      delta:2
    })
  },
  tap:function(res){
var index=res.currentTarget.dataset.index;
    var id = res.currentTarget.dataset.id;
    var tabs = ["", "", ""];
    if(index == 0)
    tabs[index] = "select";
    if (index == 1)
      tabs[index] = "select1";
    if (index == 2)
      tabs[index] = "select2";
    this.setData({"tabs":tabs});

    var that = this;
    server.getJSON("/User/categoryGroup", { id: id }, function (res) {
      var cityList = res.data.result;
      that.setData({ cityList: cityList });
    });


  },
  onLoad: function () {
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      //cityList: cityList
    })
var that = this;
    server.getJSON("/User/categoryGroup",{id:844},function(res){
      var cityList = res.data.result;
      that.setData({ cityList: cityList});
    });
  },
  
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    var city = getApp().globalData.city;
    this.setData({city:city});
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    console.log("bindCity")
    this.setData({ city: e.currentTarget.dataset.city })
    getApp().globalData.city = e.currentTarget.dataset.city;
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  //选择热门城市
  bindHotCity: function (e) {
    console.log("bindHotCity")
    this.setData({
      city: e.currentTarget.dataset.city
    })
    getApp().globalData.city = e.currentTarget.dataset.city;
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})