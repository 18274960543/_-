const app = getApp(),
  url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    userInfo: null,
    maskstate: true,
    is_select: true,
    is_varieties: true,
  },
  onLoad: function(options) {
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // 如果用户没有授权
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
    if (!wx.getStorageSync('userInfo')){
      this.queryUsreInfo()
    }else{
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },
  // 选择服务的宠物列表接口数据
  pet_list() {
    wx.request({
      url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        //  console.log(res.data.data);
        let pet_list = res.data.data;
        this.setData({
          pet_list: pet_list
        })
        console.log(this.data.pet_list)
      }
    })
  },
  // 点击去选择宠物信息
  go_petinformation(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/petinformation/petinformation?id=' + id,
    })
    this.setData({
      is_varieties: true
    })
  },
  stopPageScroll: function () {
    return
  },
  // 点击遮罩层 遮罩层消失 弹框消失
  mask() {
      this.setData({
        maskstate: true,
        selectiontime: true,
        is_varieties: true
      })
    
  },
  // 添加宠物
  addPets() {
    this.setData({
      is_varieties: false,
      maskstate: true
    })
  },
  onShow(){
    this.queryUsreInfo()
    this.pet_list()
  },
  my_order: function() {
    wx.navigateTo({
      url: "/pages/myorder/myorder",
    })
  },
  onTap_pet: function() {
    wx.navigateTo({
      url: "/pages/mypet/mypet",
    })
  },
  onTap_coupon: function() {
    wx.navigateTo({
      url: "/pages/coupon/coupon",
    })
  },
  jump(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  go_Aboutus() {
    wx.navigateTo({
      url: "/pages/Aboutus/Aboutus",
    })
  },
  go_follow_store() {
    wx.navigateTo({
      url: "/pages/follow_store/follow_store",
    })
  },
  go_news() {
    wx.navigateTo({
      url: "/pages/news/news",
    })
  },
  go_edit() {
    wx.navigateTo({
      url: "/pages/edit/edit",
    })
  },
  gomember(){
    wx.navigateTo({
      url: "/pages/member/member",
    })
  },
  gocomplaint(){
    wx.navigateTo({
      url: "/pages/complaint/complaint",
    })
  },
  //获取用户信息接口
  queryUsreInfo: function() {
    var that=this
    wx.request({
      url: url.api + `/ucs/v1/member/${app.member_id}`,
      // data: {
      //   openid: app.globalData.openid
      // },
      method: "get",
      header: {
        'content-type': 'application/json',
        "Authorization": app.token
      },
      success: function(res) {
        console.log(res.data)
        //  把用户的信息缓存 我的页面可以拿取
        that.setData({
          userInfo:res.data
        })
      }
    })
  },
})