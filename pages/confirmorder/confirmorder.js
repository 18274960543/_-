let url = require('../../utils/config.js')
const app = getApp();

//  经纬度sdk文件
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'J73BZ-TLPCX-BJ74R-7BMIU-I6V65-3YFLM'
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirst: true,
    detail_list: null, //从订单详情进来的当前商品数据
    totalprice: 0,
    totalpriceAfterDiscount: 0,
    ids: null,
    goods_sku_id: null,
    shop_id: null,
    num: null,
    length: '',
    comment: null,
    couponVisible: false,
    couponList: [],
    selectCouponIndex: '',
    selectCouponText: '',
    selectCouponDiscount: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.addressData()
    this.setData({
      isFirst: false,
      options,
    })
    console.log(options)
    // 判断是不是重商品详情页直接进来的
    // if (options.num) {
    //   this.orderData(options)
    // }
    // if (options.ids) {
    //   this.cartData(options)
    // }
  },
  stopPageScroll: function () {
    return
  },
  onShow: function() {
    this.addressData()

    // if (this.data.options.ids){
    //   this.cartData(this.data.options)
    // }
    // if (!this.data.isFirst) {
    //   this.setData({
    //     address: app.globalData.address
    //   })
    // }
  },
  // 点击去编辑地址
  goaddress() {
    wx.navigateTo({
      url: '/pages/address/address?viewform=select',
    })
  },
  //会员地址接口数据
  addressData() {
    wx.request({
      url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        
          console.log(res.data.data)
          let list = res.data.data.data;
          if (res.data.data.data.length == 0) {
            let address_id = ""
            if (this.data.options.ids) {
              this.cartData(this.data.options, address_id)
            }
            if (this.data.options.num) {
              this.orderData(this.data.options, address_id)
            }
          } else {
            let address = '';
            // 判断全局 切换地址页面  切换的地址全局有没有 有就显示这个地址
            if (app.globalData.address) {
              address = app.globalData.address;
            }
            // 没有就显示 接口返回默认的地址
            else {
              let list = res.data.data.data
              list.map(item => {
                if (item.is_default) {
                  address = item
                }
              })
            }
            if (this.data.options.ids) {
              this.cartData(this.data.options, address.id)
            }
            if (this.data.options.num) {
              this.orderData(this.data.options, address.id)
            }
            this.setData({
              address,
            })
          }
          return
        

      }
    })
  },
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    this.setData({
      comment: e.detail.value
    })
  },
  // 商品详情直接进入确认订单页面
  orderData(options, address_id) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + `/ucs/v1/order/preview`, // 仅为示例，并非真实的接口地址
      data: {
        goods_sku_id: options.goods_sku_id,
        shop_id: options.shop_id,
        num: options.num,
        comment: this.data.comment,
        address_id: address_id ? address_id : ''
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
      
          console.log(res.data)
          let detail_list = res.data.list;
          let totalprice = res.data.order_amount;
          let length = detail_list[0].goods_list.length;
          let couponList = res.data.couponList;
          couponList.push({
            empty: true,
            name: "不使用优惠"
          });

          console.log(res.data.address_info)
          this.setData({
            detail_list,
            totalprice,
            totalpriceAfterDiscount:totalprice,
            length,
            goods_sku_id: options.goods_sku_id,
            shop_id: options.shop_id,
            num: options.num,
            couponList: couponList,
          })
          //模拟选中最高优惠
          if (couponList.length > 1) {
            let maxIndex = 0;
            let maxDiscount = 0;
            for (let i = 0; i < couponList.length - 1; i++) {
              if (parseFloat(couponList[i].discount) > maxDiscount) {
                maxDiscount = parseFloat(couponList[i].discount);
                maxIndex = i;
              }
            }
            this.choseCouponAction({
              currentTarget: {
                dataset: {
                  index: maxIndex
                }
              }
            })
          }else{
            this.choseCouponAction({
              currentTarget: {
                dataset: {
                  index: 0
                }
              }
            })
          }
          wx.hideLoading()
        

      }
    })
  },
  // 购物车直接进入确认订单页面
  cartData(options, address_id) {
    wx.showLoading({
      title: '加载中...',
    })
    let ids = options.ids.split(",");
    console.log(ids)
    console.log(address_id)
    wx.request({
      url: url.api + `/ucs/v1/order/preview`, // 仅为示例，并非真实的接口地址
      data: {
        ids: ids,
        is_cart: 1,
        address_id: address_id ? address_id : ''
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
     
          console.log(res.data)
          let detail_list = res.data.list;
          let totalprice = res.data.order_amount;
          let length = detail_list[0].goods_list.length;
          let couponList = res.data.couponList;
          couponList.push({
            empty: true,
            name: "不使用优惠"
          })

          this.setData({
            length,
            detail_list,
            totalprice,
            totalpriceAfterDiscount: totalprice,
            ids: ids,
            couponList: couponList,
            // address: res.data.address_info
          })
          //模拟选中最高优惠
          if (couponList.length > 1) {
            let maxIndex = 0;
            let maxDiscount = 0;
            for (let i = 0; i < couponList.length - 1; i++) {
              if (parseFloat(couponList[i].discount) > maxDiscount) {
                maxDiscount = parseFloat(couponList[i].discount);
                maxIndex = i;
              }
            }
            this.choseCouponAction({
              currentTarget: {
                dataset: {
                  index: maxIndex
                }
              }
            })
          }
          else {
            this.choseCouponAction({
              currentTarget: {
                dataset: {
                  index: 0
                }
              }
            })
          }
          wx.hideLoading()
          return

      }
    })
  },
  // 订单确认页面 到支付
  payment() {
    console.log(this.data.ids)
    console.log(this.data.address)
    if (this.data.address == '' || this.data.address == null || this.data.address == undefined) {
      wx.showToast({
        title: '请填写地址',
        icon: 'none'
      })
      return
    }

    //判断最终价格是否小于等于0
    let lastPrice = this.data.totalpriceAfterDiscount || this.data.totalprice;
    if(lastPrice<=0){
      wx.showLoading({
        title: '最终价格不得为0',
      })
      return;
    }

    // 判断是直接从购物车进来支付 还是商品详情页面进来支付
    if (this.data.ids) { //有购物车的id 就执行购物车进来的支付
      let submitParams = {
        ids: this.data.ids,
        is_cart: 1,
        address_id: this.data.address.id,
        pay_type: "WeChat"
      };
      // 判断优惠券
      let selectCouponIndex = this.data.selectCouponIndex;
      if ((selectCouponIndex || selectCouponIndex == 0) && this.data.couponList[selectCouponIndex] && this.data.couponList[selectCouponIndex].couponId) {
        submitParams.coupon_id = this.data.couponList[selectCouponIndex].couponId;
      }
      // debugger;
      // return;
      wx.request({
        url: url.api + `/ucs/v1/order/submit`, // 仅为示例，并非真实的接口地址
        data: submitParams,
        method: "post",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res)
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
                  url: '/pages/pay_success/pay_success?pay_sn=' + pay_info.pay_sn
                })
              },
              fail: err => {
                wx.redirectTo({
                  url: '/pages/myorder/myorder?curIndex=' + 1
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
          }
        }
      })
    } else { //走商品详情进来的支付
      console.log(this.data.address.id)
      let submitParams = {
        goods_sku_id: this.data.goods_sku_id,
        shop_id: this.data.shop_id,
        num: this.data.num,
        address_id: this.data.address.id,
        pay_type: "WeChat"
      };
      // 判断优惠券
      let selectCouponIndex = this.data.selectCouponIndex;
      if ((selectCouponIndex || selectCouponIndex == 0) && this.data.couponList[selectCouponIndex] && this.data.couponList[selectCouponIndex].couponId) {
        submitParams.coupon_id = this.data.couponList[selectCouponIndex].couponId;
      }
      wx.request({
        url: url.api + `/ucs/v1/order/submit`, // 仅为示例，并非真实的接口地址
        data: submitParams,
        method: "post",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res)
          if (res.data.code == 200) {
            var pay_info = res.data.pay_info;
            wx.requestPayment({ //调用支付接口
              timeStamp: pay_info.timestamp,
              nonceStr: pay_info.nonceStr,
              package: pay_info.package,
              signType: pay_info.signType,
              paySign: pay_info.paySign,
              success: res => {
                console.log('go to here')
                wx.redirectTo({
                  url: '/pages/pay_success/pay_success?pay_sn=' + pay_info.pay_sn
                })
              },
              fail: err => {
                wx.redirectTo({
                  url: '/pages/myorder/myorder?curIndex=' + 1
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
          }
        }
      })
    }
  },
  // lida
  showCouponModel(e) {
    this.setData({
      couponVisible: true
    })
  },
  /**
   * 选择模态部分隐藏优惠券选择
   */
  clickCouponWrapper(e) {
    this.setData({
      couponVisible: false,
    })
  },
  choseCouponAction(e) {
    let index = e.currentTarget.dataset.index;
    let selectCouponText = '';
    let selectCouponDiscount = "";
    if (this.data.couponList[index].empty) {
      selectCouponText = "不使用优惠券";
      selectCouponDiscount = "";
    } else {
      selectCouponText = this.data.couponList[index].name;
      selectCouponDiscount = this.data.couponList[index].discount;
    }
    let totalpriceAfterDiscount = this.data.totalprice;
    if (this.data.couponList[index] && !this.data.couponList[index].empty) {
      totalpriceAfterDiscount = (this.data.totalprice - this.data.couponList[index].discount);
      totalpriceAfterDiscount = totalpriceAfterDiscount ? totalpriceAfterDiscount.toFixed(2):''
      if (totalpriceAfterDiscount <= 0) {totalpriceAfterDiscount =0}
    } else { 
    }
    this.setData({
      selectCouponIndex: index,
      selectCouponText: selectCouponText,
      couponVisible: false,
      totalpriceAfterDiscount: totalpriceAfterDiscount,
      selectCouponDiscount: selectCouponDiscount,
    })
  }
})