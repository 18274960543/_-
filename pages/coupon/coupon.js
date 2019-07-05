const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    currIndex: 0,
    currIndex1:0,
    list: ["未使用", "已使用", "已失效"],
    couponList: [],
    actionDisabled: false,
    couponClass: ['服务券','商品券'],
    title:'优惠劵组件',
    num:0,
  },
  on_tap(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currIndex: index,
      actionDisabled: index != 0 ? true : false
    })
    let is_service = this.data.currIndex1+1
    this.getCoupon(is_service);
  },
  tabChange(e){
    let index = e.currentTarget.dataset.index;
    let is_service = index + 1
    this.setData({
      currIndex1:index,
    })
    this.getCoupon(is_service);
  },
  handBut(event){
    console.log(event)
    console.log("----");
    let num = this.data.num;
    num++
    this.setData({
      num
    })
  },
 
  handZhu(e){
    console.log(e)
    let zhuJ = this.selectComponent('#myShow');
    let total = zhuJ.data.total;
    total++
    zhuJ.setData({
      total
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let is_service = this.data.currIndex1 + 1
    this.getCoupon(is_service);
  },
  formatDate(val, format) {
    val = val.replace(/-/g, '/');
    let format_ = new Date(val).Format(format || 'yyyy.MM.dd');
    return format_
  },
  /**
   * 获取优惠券列表
   */
  getCoupon(is_service) {
    let self = this;
    self.setData({
      couponList: [],
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + `/ucs/v1/member/coupon/` + this.data.currIndex,
      // url: url.api + `/ucs/v1/member/coupon/` + 0, 
      method: "get",
      data: {
        shop_id: wx.getStorageSync('shop_id'),
        is_service,
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      complete: (res) => {
        wx.hideLoading();
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.status == 'success') {
          for (let item of res.data.data) {
            item.start_time = self.formatDate(item.start_time);
            item.end_time = self.formatDate(item.end_time);
          }
          self.setData({
            couponList: res.data.data
          })
        } else {
        }
      }
    })
  },
  go_home() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  // 去领券
  go2CouponCenter: function(e) {
    // if (this.data.currIndex == 0)
      wx.navigateTo({
        url: '/pages/coupon_center/coupon_center'
      })
  },
  go2useCoupon: function(e) {
    if (this.data.currIndex == 0) {
      let index = e.target.dataset.index
      let use_way = e.target.dataset.use_way;
      let is_shop_coupon = e.target.dataset.is_shop_coupon;
      let service=wx.getStorageSync('service')
      // 等于1是服务的优惠劵
      if (use_way == 1) {
        //不能使用
        if (is_shop_coupon == 0) {
          //服务优惠券
          wx.showToast({
            title: '本店铺不能使用此优惠券',
            icon: 'none',
          })
        } else {
          if (!this.data.couponList[index].common){
            wx.switchTab({
              url: '/pages/home/home'
            }) 
           return
          }
          let service_id = this.data.couponList[index].common.service_type;
          let id;
          service.map((item,index)=>{
            if (item.id == service_id){
              id=index
            }
          })
          switch (id+1) {
              case 1:
                wx.navigateTo({
                  url: '/pages/template/template?service_id=' + service_id + '&mername=' + service[id].name,
                })
                break;
              case 2:
                wx.navigateTo({
                  url: "/pages/template/template?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 3:
                wx.navigateTo({
                  url: "/pages/foster/foster?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 4:
                wx.navigateTo({
                  url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 5:
                wx.navigateTo({
                  url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 7:
                wx.navigateTo({
                  url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 9:
                wx.navigateTo({
                  url: "/pages/serviceTemplate/serviceTemplate?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
              case 6:
                wx.navigateTo({
                  url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + service[id].name,
                })
                break;
            }
        }
      } else {
        wx.navigateTo({
          url: '/pages/couponShopList/couponShopList?id=' + e.target.dataset.id,
        })
      }
    }
  }
})