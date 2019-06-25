let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderData: null,
    all_pay_sn: null,
    pay_sn: null,
    top_list: ['服务', '商品', '活体'],
    is_true: 1,
    curIndex: 0,
    index1:0,
    service_list: null,
    list: [{
        text: '服务',
        status: 1,
        arr: [{
            text: '全部',
            status: 1,
          },
          {
            text: '待付款',
            status: 1,     
          },
          {
            text: '待服务',
            status: 1,
          },
          {
            text: '已取消',
            status: 1,
          },
          {
            text: '已完成',
            status: 1,
          },
          {
            text: '已过期',
            status: 1,
          },
           {
            text: '改签审核',
            status: 1,
          }
        ]
      },
      {
        text: '商品',
        status: 1,
        arr: [{
            text: '全部',
            status: 1,
          },
          {
            text: '待付款',
            status: 1,
          },
          {
            text: '已取消',
            status: 1,
          },
          {
            text: '已付款',
            status: 1,
          },
          {
            text: '已发货',
            status: 1,
          },
          {
            text: '已完成',
            status: 1,
          },
          {
            text: '退货/售后',
            status: 1,
          }
        ]
      },
      {
        text: '活体',
        status: 1,
        arr:[
          {
            text: '全部',
            status: 1,
          }
        ]
      }
    ],
    num:'',
    selectiontime:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.curIndex) {
      this.setData({
        curIndex: options.curIndex
      })
    } 
    this.abc()
    this.abc1('all')
    this.setData({
      pay_sn: options.pay_sn1,
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log('改签回来')
    if (wx.getStorageSync('rebookTo')) {
      console.log('改签')
      this.setData({
        // curIndex: index,
        index1: 6
      })
      this.abc(30)
      wx.setStorageSync('rebookTo', 0)
    }
  },
  // 头部点击切换样式
  switchRightTab(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index,
      index1:0
    })
   
  },
  showImg(e){
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current:src, // 当前显示图片的http链接
      urls:[src] // 需要预览的图片http链接列表
    })
  },
  // 多个店铺多个商品支付
  go_payment(e) {
    let index = e.currentTarget.dataset.id
    wx.request({
      url: url.api + `/ucs/v1/order/pay`, // 仅为示例，并非真实的接口地址
      data: {
        "order_sn": this.data.orderData[index].order_sn
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          var pay_info = res.data.pay_info;
          wx.requestPayment({
            timeStamp: pay_info.timestamp,
            nonceStr: pay_info.nonceStr,
            package: pay_info.package,
            signType: pay_info.signType,
            paySign: pay_info.paySign,
            success: res => {
              wx.redirectTo({
                url: '/pages/pay_success/pay_success?pay_sn=' + this.data.orderData[index].pay_sn
              })
            },
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    })
  },
  go_payment1(e) {
    let index = e.currentTarget.dataset.id
    wx.request({
      url: url.api + `/ucs/v1/order/pay`, // 仅为示例，并非真实的接口地址
      data: {
        order_sn: this.data.orderData[index].order_sn
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          var pay_info = res.data.pay_info;
          wx.requestPayment({
            timeStamp: pay_info.timestamp,
            nonceStr: pay_info.nonceStr,
            package: pay_info.package,
            signType: pay_info.signType,
            paySign: pay_info.paySign,
            success: res => {
              wx.redirectTo({
                url: '/pages/pay_success/pay_success?pay_sn=' + this.data.orderData[index].pay_sn
              })
            },
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    })
  },
  // 所有服务模块的订单数据、支付等..
  status(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    this.setData({
      index1:index
    })
    if (this.data.curIndex == 0) {
      if (index == 0) {
        this.abc()
      }
      if (index == 1){
        this.abc(10)
      }
      if (index == 2) {
        this.abc(20)
      }
      if (index == 3) {
        this.abc(0)
      }
      if (index == 6) {
        this.abc(30)
      }
      if (index == 4) {
        this.abc(40)
      }
      if (index == 5) {
        this.abc(50)
      }
    }
    if (this.data.curIndex == 1) {
      if (index == 0) {
        this.abc1('all')
      }
      if (index == 1) {
        this.abc1('state_new')
      }
      if (index == 2) {
        this.abc1('state_canceled')
      }
      if (index == 3) {
        this.abc1('state_paid')
      }
      if (index == 4) {
        this.abc1('state_dispatch')
      }
      if (index == 5) {
        this.abc1('state_completed')
      }
      if (index == 6) {
       wx.navigateTo({
         url: '/pages/refund/refund?num='+'1',
       })
      }
    }
  },
 abc(state){
   wx.showLoading({
     title: '加载中...',
   })
    wx.request({
      url: url.api + `/ucs/v1/service/order/list`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        state
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        let service_list = res.data.data;
        this.setData({
          service_list,
        })
        wx.hideLoading()
      }
    })
  },
  // 删除订单
  deleteOrder(e){
 let index = e.currentTarget.dataset.index;
    let orderSn = this.data.orderData[index].order_sn;
    console.log(orderSn)
    wx.showModal({
      title: '提示',
      content: '确定要取消订单？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: url.api + `/ucs/v1/order/delete/${orderSn}`, // 仅为示例，并非真实的接口地址
            method: "DELETE",
            header: {
              'content-type': 'application/json', // 默认值
              "Authorization": app.token
            },
            success: (res) => {
              console.log(res.data)
              let orderData = this.data.orderData;
             
              let that = this;
              if (res.data.code == 200) {
                this.abc1('all')
                // that.setData({
                //   orderData
                // })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                })
              }
             
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
  // 商品不同状态切换
  abc1(state_type) {
    wx.showLoading({
      title: '加载中...',
    }) 
    wx.request({
      url: url.api + `/ucs/v1/order`, // 仅为示例，并非真实的接口地址
      method: "get",
      data:{
        state_type
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        let orderData = res.data.data;
        // let num = orderData.order_goods.length
        this.setData({
          orderData,
          // num
        })
        wx.hideLoading()
      }
    })
  },
  // 联系 打电话
  telephone(e) {
    console.log(e)
    let tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  },
  // 服务模块订单去付款
  servicePayment(e) {
    let index = e.currentTarget.dataset.index
    console.log(this.data.service_list[index].pay_sn);
    let pay_sn = this.data.service_list[index].pay_sn
    wx.request({
      url: url.api + `/ucs/v1/service/pay`, // 仅为示例，并非真实的接口地址
      method: "post",
      data:{
        pay_sn
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          var pay_info = res.data.pay_info;
          wx.requestPayment({
            timeStamp: pay_info.timestamp,
            nonceStr: pay_info.nonceStr,
            package: pay_info.package,
            signType: pay_info.signType,
            paySign: pay_info.paySign,
            success: res => {
              wx.redirectTo({
                url: '/pages/orderdetails/orderdetails?pay_sn=' + this.data.service_list[index].pay_sn
              })
            },
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    })
  },
  // 点击服务订单  去订单详情
  goorderDetails(e) {
    let pay_sn = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let state = e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn + '&id=' + this.data.service_list[index].id + '&state=' + state,
    })
  },
  // 点击商品订单  去商品详情页面
  goshopdetails(e){
    console.log(e)
    let pay_sn = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let state = e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '/pages/shopdetails/shopdetails?pay_sn=' + pay_sn + '&id=' + this.data.orderData[index].id + '&state=' + state,
    })
  },
  // 商品确认收货
  confirm(e){
    let index = e.currentTarget.dataset.index[0];
    let index1 = e.currentTarget.dataset.index[1];
    let order_sn = this.data.orderData[index].order_sn;

    let pay_sn = this.data.orderData[index].pay_sn;
  
    console.log(order_sn, pay_sn)
    wx.request({
      url: url.api + `/ucs/v1/order/complete/${pay_sn}/${order_sn}`, // 仅为示例，并非真实的接口地址 
      method: "put",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code=200){
          this.abc1('state_dispatch')
        }
      }
    })
  },
  // 商品取消订单
  shopCancelOrder(e){
    let index = e.currentTarget.dataset.index[0];
    let index1 = e.currentTarget.dataset.index[1];
    let order_sn = this.data.orderData[index].order_sn
    wx.showModal({
      title: '提示',
      content: '确定要取消订单？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: url.api + `/ucs/v1/order/cancel/${order_sn}`, // 仅为示例，并非真实的接口地址 
            method: "put",
            header: {
              'content-type': 'application/json', // 默认值
              "Authorization": app.token
            },
            success: (res) => {
              console.log(res.data)
              let orderData = this.data.orderData;
              orderData[index].state = 0
              let that = this;
              if (res.data.code == 200) {
                that.setData({
                  orderData
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                })
              }
              console.log(this.data.orderData)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 服务取消订单
  cancelorder(e) {
    let index = e.currentTarget.dataset.index;
    let order_id = this.data.service_list[index].id;
  //托运订单 3天之内不扣钱 3天之后扣100元 手续费
    if (this.data.service_list[index].service[0].name =='托运'){
      wx.showModal({
        title: '提示',
        content: '托运服务3天之后扣100元手续费，确定要取消订单？',
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: url.api + `/ucs/v1/service/order/refund`,
              method: "post",
              data: {
                order_id,
              },
              header: {
                'content-type': 'application/json', // 默认值
                "Authorization": app.token
              },
              success: (res) => {
                console.log(res.data)
                let service_list = this.data.service_list;

                service_list[index].state = 0
                let that = this;
                if (res.data.code == 200) {
                  that.setData({
                    service_list
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定要取消订单？',
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: url.api + `/ucs/v1/service/order/refund`,
              method: "post",
              data: {
                order_id,
              },
              header: {
                'content-type': 'application/json', // 默认值
                "Authorization": app.token
              },
              success: (res) => {
                console.log(res.data)
                let service_list = this.data.service_list;

                service_list[index].state = 0
                let that = this;
                if (res.data.code == 200) {
                  that.setData({
                    service_list
                  })
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    
  },
  gomap(e) {
    let index = e.currentTarget.dataset.index;
    let service_list = this.data.service_list;
    let lat = service_list[index].others[0].lat; //经度
    let lon = service_list[index].others[0].lon; //纬度
    let name = service_list[index].others[0].name
    // wx.navigateTo({
    //   url: '/pages/map/map?lat=' + lat + '&lon=' + lon + '&name=' + name,
    // })
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function(res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(lat), //要去的纬度-地址
          longitude: Number(lon), //要去的经度-地址
          name: name,
          address: name
        })
      }
    })
  },
  // 再次购买
  repurChase(e){
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
      case 12:
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
  // 选择时间消失
  selectiontimeDisappear() {
    this.setData({
      selectiontime: false
    })
  },
  mask() {
    this.setData({
      selectiontime: false,
    })
  },
  // 点击改签
  rebook(e){
    let service_id = e.currentTarget.dataset.service_id;
    // let pets_id = e.currentTarget.dataset.pets_id;
    let mername = e.currentTarget.dataset.mername;
    // let order_id = e.currentTarget.dataset.order_id; 
    let index = e.currentTarget.dataset.index;
    let service_list = this.data.service_list
    let rebookdata = service_list[index];
    console.log(service_id, mername, rebookdata, index)
    wx.setStorageSync('rebookdata', rebookdata)
    switch (service_id) {
      case 1:
        wx.navigateTo({
          url: '/pages/serviceTemplate/serviceTemplate?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/serviceTemplate/serviceTemplate?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/fosterTemplate/fosterTemplate?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 13:
        wx.navigateTo({
          url: '/pages/serviceTemplate/serviceTemplate?service_id=' + service_id + + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 14:
        wx.navigateTo({
          url: '/pages/serviceTemplate/serviceTemplate?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/serviceTemplateTwo/serviceTemplateTwo?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 11:
        wx.navigateTo({
          url: '/pages/serviceTemplateTwo/serviceTemplateTwo?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
      case 12:
        wx.navigateTo({
          url: '/pages/serviceTemplateTwo/serviceTemplateTwo?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/serviceTemplate/serviceTemplate?service_id=' + service_id + '&mername=' + mername + '&isrebook=' + 1 
        })
        break;
    }
  }
})