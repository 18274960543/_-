// pages/home/home.js
const app = getApp()
let url = require('../../utils/config.js'),
  util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url1: url,
    imgUrls: [
      '/img/home-banner.png',
    ],
    imgUrls1: null,
    order: [],
    nav_topItems: ["主粮", "零食", "用品", "罐头", "主粮", "零食", "用品", "罐头", "零食", "用品", "罐头"],
    curIndex: 0,
    nav_bottomItems: null,
    istrue: "",
    uuid: '',
    mername: '',
    lati: null,
    longi: null,
    address: '',
    ids: '',
    page: 1,
    isCoupon: false,
    isToken: false
  },
  // 
  jump(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 
  bindscrolltolower(e) {

    let self = this;
    // console.log(122222)
    //当长度不够
    // if (self.data.nav_bottomItems.length==this.data.page*8){
    if (this.data.is_nodata) {
      return
    }
    this.setData({
      page: this.data.page + 1
    });
    wx.showLoading({
      title: 'Loading...',
    })
    this.renderGoods(this.data.ids, function (res) {
      wx.hideLoading()
      console.log(123333, res)
      if (!res.data.data.length) {
        console.log(2333)
        self.setData({
          is_nodata: true
        })
        return
      }
      let nav_bottomItems = self.data.nav_bottomItems;
      nav_bottomItems = nav_bottomItems.concat(res.data.data)
      self.setData({
        nav_bottomItems: nav_bottomItems,
      })

    })

  },
  stopPageScroll: function () {
    return
  },
  onLoad: function (options) {
    wx.playBackgroundAudio({
      dataUrl: '',
      title: '',
      coverImgUrl: ''
    })
    this.countdown(7000000)
    console.log(options)
    // 如果扫码进来 有uuid 就显示扫码的店铺
    if (options.uuid) {

      this.homeMergedata(options.uuid, 1)
      this.setData({
        uuid: options.uuid,
      })
      wx.setStorageSync('uuid', options.uuid)
    } else if (wx.getStorageSync('uuid')) { //扫码进来 在用户没有清除换成的情况下 显示扫码进来的店铺（可以在关注门店切换店铺）

      this.homeMergedata(wx.getStorageSync('uuid'), 2)
    } else if (wx.getStorageSync('shop_uuid')) {
      console.log(777)
      this.homeMergedata(wx.getStorageSync('shop_uuid'), 2)
    } else {
      //授权地理位置 => 1、在用户初次进入小程序 不是在在扫码情况下进入 2、在用户扫码进来删除本地缓存情况下 调用这个方法
      this.cmmon()
    }
    this.setData({
      address: wx.getStorageSync('address')
    })

    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          screenHeight: res.screenHeight
        })
      },
    })
  },
  onShow() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('title') //页面标题为路由参数
    })
    // 关注门店进来  显示关注门店的店铺
    if (wx.getStorageSync('is_change')) {
      console.log(111)
      // this.nearestShop({
      //   lat: wx.getStorageSync('location').lat,
      //   lon: wx.getStorageSync('location').lon,
      //   province: wx.getStorageSync('location').province,
      //   city: wx.getStorageSync('location').city,
      // })
      this.homeMergedata(wx.getStorageSync('uuid'), 2)
      wx.setStorageSync('is_change', '')
    }
    this.setData({
      address: wx.getStorageSync('address'),
    })
  },
  onShareAppMessage(res) {

    let uuid = wx.getStorageSync('uuid')
    let title = wx.getStorageSync('shop_info').name
    // console.log(goodsInfo)
    return {
      title: title,
      imageUrl: '/img/share1.png',
      path: '/pages/home/home?share=share&uuid=' + uuid,
      success: (res) => { }
      //
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // wx.startPullDownRefresh()
  },
  // 省市范围内最优店铺排序
  nearestShop(opts) {
    console.log(opts)
    let nearParams = {
      'city': opts.city,
      'province': opts.province,
      'lat': opts.lat,
      'lon': opts.lon,
    }
    wx.request({
      url: url.api + `/ucs/v1/service/all/store`,
      method: "post",
      data: nearParams,
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token'),
      },
      success: (res) => {
        console.log('附近店铺', res)
        if (res.data.data.length) {
          let uuid = res.data.data[0].uuid;
          this.homeMergedata(uuid, 3)
          return
        }
        wx.showModal({
          content: '附近暂无店铺请切换店铺',
          showCancel: false,
          success(res) {
            wx.redirectTo({
              url: '../follow_store/follow_store',
            })
          }
        })
      }
    })
  },
  // 合并 服务，商品分类，联系方式，轮播图 ，广告图
  homeMergedata(uuid, type) {
    wx.showLoading({
      title: 'Loading...',
    })
    console.log(uuid)
    let uuid1 = uuid //如果是扫码进来的就用扫码的UUID  不是扫码就用附近最近店铺UUID
    wx.request({
      url: url.api + `/ucs/v1/shop/index/${uuid1}`,
      method: "get",
      data: {
        uuid: uuid,
        type, //1 扫码 2 关注门店 3用户自己进来
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": wx.getStorageSync('token')
      },
      success: (res) => {
        console.log(res.data)
        if (res.statusCode == 200) {
          let mergedata = res.data;
          mergedata.broupbuy.map(item=>{
            item.goods_price = parseFloat(item.goods_price)
            item.origin_price = parseFloat(item.origin_price)
          })
          wx.setStorageSync('shop_info', res.data.info)
          url.store_id = res.data.info.id
          wx.setStorageSync('shop_id', res.data.info.id)
          wx.setStorageSync('title', res.data.info.name)
          wx.setStorageSync('uuid', res.data.info.uuid)
          wx.setStorageSync('category', res.data.category)
          wx.setStorageSync('service', res.data.service)
          let isCoupon = mergedata.is_new
          if (isCoupon) {
            isCoupon = true
          } else {
            isCoupon = false
          }
          console.log(typeof isCoupon)
          this.setData({
            mergedata,
            isCoupon,
          })
          wx.setNavigationBarTitle({
            title: res.data.info.name //页面标题为路由参数
          })
          this.moren()
          wx.hideLoading()
        }
      }
    })
  },
  /*
   * 记录列表点击的按钮下标 
   */
  switchRightTab(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  // 距离顶部的位置
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    this.setData({
      istrue: e.scrollTop
    })
  },
  // 商品列表
  switchRightTab(e) {
    let self = this;
    console.log('switch list');
    wx.showLoading({
      title: '加载中...',
    })
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    this.setData({
      ids: id,
      page: 1,
      is_nodata: false
    })
    this.renderGoods(id, function (res) {
      console.log(res.data.data)
      self.setData({
        nav_bottomItems: res.data.data,
        curIndex: index,

      })
      wx.hideLoading()
    })
  },
  // 商品列表默认数据
  moren() {
    let self = this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log('moren list');
    this.setData({
      ids: this.data.mergedata.category[0].id,
      page: 1,
    })
    this.renderGoods(this.data.mergedata.category[0].id, function (res) {
      console.log(res.data)
      self.setData({
        nav_bottomItems: res.data.data
      })
      console.log(self.data.nav_bottomItems)
      wx.hideLoading()
    })
  },
  //render goods
  renderGoods(ids, callback) {
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/list',
      data: {
        ids: ids,
        page: this.data.page,
      },
      method: "post",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (callback) callback(res);
      }
    })
  },

  // 打电话
  dianhua() {
    // let tel = this.data.mergedata.contact_number
    wx.makePhoneCall({
      phoneNumber: '0731-82826069' // 电话号码
    })
  },
  // 点击去商品详情页
  godetails(e) {
    // console.log(e)
    //  商品id
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
    })
  },
  // 点击去预约服务页面
  goservice(e) {
    let id = e.currentTarget.dataset.id;
    let service_id = e.currentTarget.dataset.serviceid
    console.log(service_id)
    wx.request({
      url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data.data)
        if (res.data.data.length > 0) {
          switch (id + 1) {
            case 1:
              wx.navigateTo({
                url: '/pages/template/template?service_id=' + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 2:
              wx.navigateTo({
                url: "/pages/template/template?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 3:
              wx.navigateTo({
                url: "/pages/foster/foster?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 4:
              wx.navigateTo({
                url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 5:
              wx.navigateTo({
                url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              //   break;
              // case 6:
              //   wx.navigateTo({
              //     url: "/pages/serviceTemplateTwo/serviceTemplateTwo?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              //   })
              break;
            case 7:
              wx.navigateTo({
                url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 9:
              wx.navigateTo({
                url: "/pages/serviceTemplate/serviceTemplate?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
            case 6:
              wx.navigateTo({
                url: "/pages/peripheryTemplate/peripheryTemplate?service_id=" + service_id + '&mername=' + this.data.mergedata.service[id].name,
              })
              break;
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请先添加宠物',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/mypet/mypet'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })

  },
  // 点击 宠物小课堂 去宠物小课堂列表页 
  classroom() {
    wx.navigateTo({
      url: '/pages/petsClassroom/petsClassroom',
    })
  },
  freshgrain() {
    wx.navigateTo({
      url: '/pages/freshgrain/freshgrain',
    })
  },
  // 地址切换
  position() {
    wx.navigateTo({
      url: '/pages/position/position',
    })
  },
  // 店铺切换
  goNearbyShops() {
    wx.navigateTo({
      url: '/pages/nearbyShops/nearbyShops',
    })
  },
  // 重新授权 地理位置 判断等
  btnclick: function () {
    wx.getSetting({
      success: (res) => {
        // console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '授权当前地理位置',
            content: '兽兽淘平台为您匹配附近店铺',
            success: (res) => {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权地理位置无法匹配附近店铺',
                  icon: 'none',
                  duration: 5000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: (dataAu) => {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      // wx.showToast({
                      //   title: '授权成功',
                      //   icon: 'success',
                      //   duration: 1000
                      // })
                      this.setData({
                        isToken: false
                      })
                      this.cmmon()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 5000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          this.cmmon()
        } else {
          this.cmmon()
        }
      }
    })
  },
  // 授权地理位置
  cmmon() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(111111111111, res)
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
            let result = res.result;
            // 获取当前位置 调用最近店铺
            this.nearestShop({
              'city': result.address_component.city,
              'province': result.address_component.province,
              'lat': lati,
              'lon': longi,
            })
            console.log(res)
            let address = res.result.formatted_addresses.recommend;
            wx.setStorageSync('address', address);
            let location = {};
            location.lat = res.result.location.lat;
            location.lon = res.result.location.lng;
            wx.setStorageSync('location', location);
            this.setData({
              address
            })
          },
        })
      },
      fail: (res) => {
        this.setData({
          isToken: true
        })
      }
    })
  },
  // 优惠劵
  couponNone() {
    this.setData({
      isCoupon: false
    })
  },
  // 点击优惠劵图片  跳转到优惠劵页面
  goCoupon() {
    this.setData({
      isCoupon: false
    })
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  //获取电话号码
  getPhoneNumber(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  // 倒计时
  countdown(time) {
    var that = this,
      sj = util.dateformat(time),
      sj = sj.split(':')
    this.setData({
      clock: sj
    });
    if (time <= 0) {
      this.setData({
        clock: ['00', '00', '00'] //若已结束，此处输出'0天0小时0分钟0秒'
      });
      return;
    }
    setTimeout(function () {
      time -= 1000;
      that.countdown(time);
      // return
    }, 1000)
  },
  goserviceOffer(){
    wx.navigateTo({
      url: '/pages/serviceOffer/serviceOffer',
    })
  }
})