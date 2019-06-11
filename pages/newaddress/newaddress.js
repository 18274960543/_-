const app = getApp()
let url = require('../../utils/config.js')
//  经纬度sdk文件
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const Page = require('../../utils/ald-stat.js').Page;

var qqmapsdk = new QQMapWX({
  key: url.key
});
Page({
  data: {
    switch1: 0,
    region: ['湖南省', '长沙市', '天心区'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },
  // 默认地址切换
  switch1() {
    this.setData({
      switch1: !this.data.switch1
    })
    console.log(this.data.switch1)
  },
  // 新地址编辑
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let formdata = e.detail.value;
    let id = this.data.id;
    let region = this.data.region;
    //姓名地址正则判断
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(e.detail.value.name))) {
      wx.showToast({
        title: '姓名不符合规范',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }
    // if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(e.detail.value.address))) {
    //   wx.showToast({
    //     title: '地址不符合规范',
    //     duration: 2000,
    //     icon: 'none'
    //   });
    //   return false;
    // }
    let address = region[0] + region[1] + region[2] + formdata.address
    console.log(address)
    qqmapsdk.geocoder({
      address: address,
      success: (res) => {
        console.log('成功',res);
          let lat = res.result.location.lat; //纬度
          let lon = res.result.location.lng; //纬度
          wx.request({
            url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
            method: "post",
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
              comment:''
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
                  icon:'none'
                })
              }
            }
          })
        }  
   
     
    });
  },
  // 省市区选择
  bindRegionChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
})