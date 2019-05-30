// pages/addresseditor/addresseditor.js
let url = require('../../utils/config.js')
 const app = getApp()
//  经纬度sdk文件
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({ key: 'J73BZ-TLPCX-BJ74R-7BMIU-I6V65-3YFLM' });
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switch1: 1, 
    region: ['湖南省', '长沙市', '天心区'],
    // customItem: '全部'
    list:[],
    id:'',
    address:'',
    lat:'',
    lon:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      list: options,
      region: [options.province, options.city, options.area],
      switch1: Number(options.is_default),
      id: options.id
    })
    console.log(this.data.switch1);
    
  },
  // 默认地址切换
  switch1(){
    this.setData({
      switch1: !this.data.switch1
    })
    console.log(this.data.switch1)
  },
 
  formSubmit(e){
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log(e);
    let formdata = e.detail.value;
    let region = this.data.region;
    let id = this.data.id;
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(e.detail.value.name))){
      wx.showToast({
        title: '姓名不能带表情',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    // if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(e.detail.value.address))) {
    //   wx.showToast({
    //     title: '地址不能带表情',
    //     duration: 2000,
    //     icon: 'none'
    //   });
    //   return false;
    // }
    this.setData({
      address: region[0] + region[1] + region[2] + formdata.address
    })
    // 调用接口获取经纬度
    qqmapsdk.geocoder({
      address: this.data.address,
      success:(res)=>{
        console.log(res.result.location);
        let lat = res.result.location.lat;//纬度
        let lon = res.result.location.lng;//纬度
        wx.request({
          url: url.api + `/ucs/v1/member/address/${id}`, // 仅为示例，并非真实的接口地址
          method: "put",
          data: {
            name: formdata.name,
            mobile: formdata.mobile,
            province: formdata.region[0],
            city: formdata.region[1],
            area: formdata.region[2],
            address: formdata.address,
            is_default: this.data.switch1,
            lat: lat,
            lon: lon,
            comment: ''
          },
          header: {
            'content-type': 'application/json', // 默认值
            "Authorization": app.token,
            "Accept": 'application/json'
          },
          success: (res) => {
            console.log(res.data)
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.message,
              })
              setTimeout(function () {
                wx.navigateBack({})
              }, 500)
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000,
                icon: 'none',
              })
            }
          }
        })
        console.log(this.data.lon)
      },
    });
  },
  // 省市区选择
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
//  删除地址
go_delete(e){
  // 地址id
  let id=this.data.id;
  wx.showModal({
    title: '提示',
    content: '是否删除该地址',
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: url.api + `/ucs/v1/member/address/${id}`, // 仅为示例，并非真实的接口地址
          method: "delete",
          header: {
            'content-type': 'application/json', // 默认值
            "Authorization": app.token,
            "Accept": 'application/json'
          },
          success: (res) => {
            app.globalData.address = null;
            wx.navigateBack({
            })
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
   
}
})