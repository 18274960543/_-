const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
  },
  onLoad(option){
    console.log(option)
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(option.lat),//要去的纬度-地址
          longitude: Number(option.lon),//要去的经度-地址
          name: option.name,
          address: option.name
        })
      }
    })
    
  }
})   