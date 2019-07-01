let url = require('../../utils/config.js')
const app = getApp()
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statustext:"支付成功",
    useraddress1:"湖南省长沙市开福区...",
    // ordernumber:"20190107152625835",
    orderclassify:"服务",
    payway:"微信",
    // ordertime:"2019-01-07 15:45",
    paytime:'',
    detailsData:null,
    spec:null,
    address:wx.getStorageSync('checkAddress')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.orderDetails(options.pay_sn);
    this.setData({
      spec: options.specs,
      state: options.state
    })
  },
  onCopyTap:function(){
    wx.setClipboardData({
      data: this.data.detailsData.order_sn,
      success:(res)=>{
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  showImg(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  orderDetails(pay_sn){
    console.log(pay_sn)
    wx.showLoading({
      title: '加载中...',
    })
   wx.request({
     url: url.api + `/ucs/v1/service/bath/detail/${pay_sn}`,
     method: "get",
     header: {
       'content-type': 'application/json', // 默认值
       "Authorization": app.token
     },
     success: (res) => {
       console.log(res.data)
       let detailsData=res.data.data;
       this.getLocalTime(detailsData.created_at)
       this.setData({
         detailsData
       })
       wx.hideLoading()
     }
   })
 },
 //下单时间
getLocalTime(nS) {
    this.setData({
      ordertime: new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
    })
  } , 
//导航
  gomap() {
    let service_list = this.data.detailsData;
    let lat = service_list.shop[0].lat;//经度
    let lon = service_list.shop[0].lon;//纬度
    let name = service_list.shop[0].name
    // wx.navigateTo({
    //   url: '/pages/map/map?lat=' + lat + '&lon=' + lon + '&name=' + name,
    // })
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: Number(lat),//要去的纬度-地址
          longitude: Number(lon),//要去的经度-地址
          name: name,
          address: name
        })
      }
    })
  },
  // 联系 打电话
  telephone() {
    let service_list = this.data.detailsData;
    let tel = service_list.shop[0].contact_number;
    wx.makePhoneCall({
      phoneNumber: tel//仅为示例，并非真实的电话号码
    })
  },
  // 再次购买
  go_payment(e) {
    let service_id = e.currentTarget.dataset.service_id;
    let pets_id = e.currentTarget.dataset.pets_id;
    let mername = e.currentTarget.dataset.mername
    switch (service_id) {
      case 1:
        wx.navigateTo({
          url: '/pages/template/template?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/template/template?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/foster/foster?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 13:
        wx.navigateTo({
          url: '/pages/template/template?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 14:
        wx.navigateTo({
          url: '/pages/template/template?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/peripheryTemplate/peripheryTemplate?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 11:
        wx.navigateTo({
          url: '/pages/peripheryTemplate/peripheryTemplate?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/template/template?service_id=' + service_id + '&pets_id=' + pets_id + '&mername=' + mername
        })
        break;
    }
  },
  // 查看物流
  go_express(e){
    debugger;
  },
  // 去订单列表
  gomyorder(){
wx.redirectTo({
  url: '/pages/myorder/myorder',
}) 
  }
})