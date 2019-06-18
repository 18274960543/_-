// pages/order/order.js
let url = require('../../utils/config.js')
const app = getApp()
//  经纬度sdk文件
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({ key: 'J73BZ-TLPCX-BJ74R-7BMIU-I6V65-3YFLM' });
const Page = require('../../utils/ald-stat.js').Page;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    remind:false,
    isclose:false,
    switch_dp:[],
    address:null,
    iswitch: false,
    isshuttle: false,
    isFirst:true,
    show:false,
    cost:null,
    cost1:null,
    price:'',
    lon:'',
    lat:'',
    service_id:'',
    shop_info:null,
    spec:null,
    exes:null,
    shopName:'',
    expenses:'',
    isReceiveCost:false,//选择接送费用的开关
    isReceiveCost1:true,
    //lida
    couponVisible: false,
    couponList: [],
    selectCouponId: '',
    selectCouponIndex:'',
    selectCouponText: '',
    selectCouponDiscount: '',
    totalpriceAfterDiscount:'',
    ismername:true,
    switchImg:true,
    is_varieties:false,
    memberPayment:[
      {
        img:'/img/WeChat.png',
        text:'微信支付',
        status:true
      },
      {
        img: '/img/memberPayment.png',
        text: '会员卡支付',
        status: false
      }
    ],
    index:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  ismername(){
    this.setData({
      ismername: !this.data.ismername
    })
  },
  downloadFile(){
    wx.navigateTo({
      url: '../img/img',
    })
  },
  promptly(){
    // 判断是微信支付
    let order_id = this.data.order_id;
    let pay_info = this.data.pay_info;
    let pay_sn = this.data.pay_sn;
    console.log(pay_sn)
    if (this.data.index == 0) {
      wx.requestPayment({
        timeStamp: pay_info.timestamp,
        nonceStr: pay_info.nonceStr,
        package: pay_info.package,
        signType: pay_info.signType,
        paySign: pay_info.paySign,
        success: res => {
          wx.redirectTo({
            url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn
          })
        },
        fail: err => {
          wx.redirectTo({
            url: '/pages/myorder/myorder?pay_sn1' + pay_sn
          })
        }
      })
    } else {
      wx.request({
        url: url.api + `/ucs/v1/pay/club_pay/${order_id}`,
        method: "post",
        header: {
          'content-type': 'application/json',
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res.data)
          if(res.data.code==200){
            wx.redirectTo({
              url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn
            })
          }else{
            wx.showToast({
              title:res.data.message,
              icon:'none',
              duration:2000
            })
          }
        }
      })
    }
  },
  // 会员支付切换
  switchImg(e){
    let index = e.currentTarget.dataset.index;
    let memberPayment = this.data.memberPayment;
    console.log(memberPayment)
    memberPayment.map(item=>{
      item.status=false
    })
    memberPayment[index].status=true;
    this.setData({
      memberPayment,
      index,
    })
  },
  // 点击遮罩层 遮罩层消失  弹框消失
  mask() {
      this.setData({
        is_varieties: false,
      })
  },
  onLoad: function (options) {
    console.log(options)
    let exes = options.exes.split(",")
    console.log(exes)
    this.addressData()
    this.setData({
      isFirst: false,
      price: options.price,
      grain_price: options.grain_price,
      price1: options.price1,
      service_id: options.service_id,
      shop_info: wx.getStorageSync("setmeal"),
      spec: options,
      cost1: options.cost1,
      exes,
      dis_img: wx.getStorageSync('dis_img'),
      checkAddress1: wx.getStorageSync('checkAddress'),
      is_distribution: options.is_distribution,
      deal_store: options.shop_id
    })
   console.log(url.store_id)
    if (wx.getStorageSync('setmeal').shop_id != wx.getStorageSync('shop_id')){
        this.setData({
          remind:true
        })
    }
    if (options.cost1){
      let iDays=datedifference(options.start_time, options.end_time)
     this.setData({
       iDays
     })
      console.log(iDays)
    }
    function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
      var dateSpan,
        tempDate,
        iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays
    };
 
    let uuid = wx.getStorageSync('uuid');
    // this.info(uuid) 
  },
  onShow: function (options) {
    if (!this.data.isFirst){
      console.log(0)
      this.setData({
        address:app.globalData.addres,
        isReceiveCost: false,
        isReceiveCost1: true,
      })
      this.addressData()
    }else{
      this.getCounponList();
    }
    console.log(1111111111, this.data.checkAddress1, wx.getStorageSync('checkAddress'))
  },
  onHide(){
    // this.setData({
    //   // address: app.globalData.address,
    //   isReceiveCost: false,
    //   isReceiveCost1: true,
    // })
  },
  // 点击接送费用弹出接送费用计算
  is_show(){
    this.setData({
      isclose:true,
      isshuttle:true
    })
  },
  // 点击阴影
  shadow(){
    this.setData({
      isclose: false,
      isshuttle: false,
    })
  },
  // 打电话
  dianhua(){
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync("shop")[0].contact_number // 仅为示例，并非真实的电话号码
    })
  },
// 接送费用计算关闭
  close(){
    this.setData({
      isclose:false,
      isshuttle: false,
    })
  },
  // 切换店铺
  switch_dp1(e){
    let index = e.currentTarget.dataset.index;
    let switch_dp = this.data.switch_dp;
    switch_dp.map((item,index) => {
      item.switch1 = false
    })
    switch_dp[index].switch1 = true;
    let shopName = switch_dp[index].name

    this.setData({
      switch_dp,
      shopName
    })
  },
  // 切换店铺确定
  switch_bt(){
     this.setData({
       iswitch: false,
       isclose: false
     })
  },
  // 点击切换店铺 出来弹框
  // switch_dp(){
  //   // 最优店铺选择接口数据
  //   let c=this.data.exes[2]
  //   wx.request({
  //     url: url.api + `/ucs/v1/service/${c}`, // 仅为示例，并非真实的接口地址
  //     method: "post",
  //     data:{
  //       lon:this.data.lon,
  //       lat:this.data.lat,
  //       province: this.data.address.province,
  //       city: this.data.address.city,
  //       service_id: this.data.service_id
  //     },
  //     header: {
  //       'content-type': 'application/json', // 默认值
  //       "Authorization": app.token
  //     },
  //     success: (res) => {
  //       console.log(res.data.data) 
  //       let switch_dp = res.data.data;
  //       switch_dp.map((item)=>{
  //         item.switch1=false
  //       })
  //        this.setData({
  //          switch_dp: res.data.data
  //        })
  //     }
  //   })
  //  this.setData({
  //    iswitch: true,
  //    isclose: true
  //  })
  // },
  // 点击去编辑地址
  goaddress(){
    wx.navigateTo({
      url: '/pages/address/address?viewform=select',
    })
  },
  //会员地址接口数据
  addressData(){
    wx.request({
      url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
         console.log(res.data)
      let list = res.data.data.data;
        if (list.length<=0){
          wx.showToast({
            title: '请先添加地址',
            icon:'none',
            duration: 2000
          })
          this.setData({
            total_fee: '',
            expenses: '',
            address: false,
          })
          return
        }
        if (app.globalData.address){
          let address = app.globalData.address
          console.log(address)
          this.setData({
            address: app.globalData.address
          })

        }else{
          let address = list.filter(item =>
            item.is_default == 1
          )[0]                                   
          if (!address) {
            address = list[0];
            address.is_default = 1;
          }
          console.log(address)
          this.setData({
            address: address
          })
           
        }
     
        let exes = this.data.exes
        // wx.setStorageSync('address1', address);
        
        // this.isReceiveCost()
      
        // console.log(this.data.address)
        // 调用腾讯地图接口获取经纬度
        qqmapsdk.geocoder({
          address: this.data.address.province + this.data.address.city + this.data.address.area + this.data.address.address,
          success: (res) => {
            console.log(res.result.location);
            let lat = res.result.location.lat;//纬度
            let lon = res.result.location.lng;//纬度
             this.setData({
               lat,
               lon
             })
          },
        });
     
        console.log(this.data.address)
        this.getCounponList();
      }
    })
  },
  // 接送费用接口数据 开关
  isReceiveCost(){
    if (!this.data.address) {
      console.log(666)
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000
      })
      
      return
    }
    let a = this.data.exes[0]
    // console.log(this.data.address)
    // 首先判断是否接送费用开关打开
    if (!this.data.isReceiveCost){
      if (a) {
        if (a == 'bath/expenses') {
          console.log(wx.getStorageSync('setmeal'))
          wx.request({
            url: url.api + `/ucs/v1/service/${a}`, // 仅为示例，并非真实的接口地址
            method: "post",
            data: {
              id: this.data.address.id,
              user_id: url.store_id,
              price: this.data.price,
              deliver_free: wx.getStorageSync('setmeal').deliver_free,
              kilometer_fee: wx.getStorageSync('setmeal').kilometer_fee,
              max_kilometer: wx.getStorageSync('setmeal').max_kilometer,
            },
            header: {
              'content-type': 'application/json', // 默认值
              "Authorization": app.token
            },
            success: (res) => {
              console.log(res.data)
              if (res.data.code == 200) {
                let total_fee = res.data.data.total_fee;
                let expenses = res.data.data.deliver_fee.toFixed(2);
                let distance = res.data.data.distance;
                let cost=res.data.data;
                cost.deliver_fee = cost.deliver_fee.toFixed(2)
                console.log(expenses)
                console.log(cost)
                this.setData({
                  cost,
                  total_fee,
                  expenses,
                  distance,
                  isReceiveCost: !this.data.isReceiveCost,
                  isReceiveCost1: true,
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
                this.setData({
                  total_fee:'',
                  expenses:'',
                  distance:'',
                  show: false,
                  isReceiveCost: !this.data.isReceiveCost,
                  isReceiveCost1: false,
                })
              }
            }
          })
        }
      } else {
        // 不是洗澡等..服务 就不出现切换店铺
        this.setData({
          show: true,
          // isReceiveCost: !this.data.isReceiveCost
        })
      } 
    }else{
      this.setData({
        isReceiveCost: false,
        isReceiveCost1: true,
        total_fee:'',
        expenses:'',
      })
    }
   // 首先判断有没有这个参数
    
  },
  payment() {
    if(!this.data.address){
      console.log(666)
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000
      })
     return
    }
    let address1 = this.data.address
    let address = address1.province + '' + address1.city + '' + address1.area + '' + address1.address  
    console.log(address)
  let b=this.data.exes[1]
    //判断是不是寄养订单
    if (b =='escrow/add'){
      wx.request({
        url: url.api + `/ucs/v1/service/bath/add`, // 仅为示例，并非真实的接口地址
        data: {
          member_pets_id: this.data.spec.member_pets_id,
          service_specs_id: this.data.spec.service_specs_id,
          shop_id: url.store_id,
          total_fee: this.data.total_fee ? this.data.total_fee : this.data.price,
          price: this.data.price1 ? this.data.price1:0,
          grain_price: this.data.grain_price ? this.data.grain_price:'',
          escrow_begin: this.data.spec.start_time,
          escrow_end: this.data.spec.end_time,
          address_id: this.data.address.id,
          pay_type: 'WeChat',
          service_product_id: this.data.spec.service_product_id,
          service_id: this.data.spec.service_id,
          is_distribution: this.data.is_distribution ? this.data.is_distribution : 0,
          deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
          charges: wx.getStorageSync('setmeal').charges,
          service_product_name: wx.getStorageSync('setmeal').service_product_name,
          day: this.data.spec.day,
          coupon_id: this.data.selectCouponId,//优惠券
          address,
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
            let pay_sn = res.data.pay_sn;
            let order_id = res.data.order_id
            this.setData({
              pay_info,
              pay_sn,
              order_id,
            })
            if (res.data.isClubPay){
              this.setData({
                is_varieties:true
              })
            }else{
              wx.requestPayment({
                timeStamp: pay_info.timestamp,
                nonceStr: pay_info.nonceStr,
                package: pay_info.package,
                signType: pay_info.signType,
                paySign: pay_info.paySign,
                success: res => {
                  wx.redirectTo({
                    url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn
                  })
                },
                fail: err => {
                  wx.redirectTo({
                    url: '/pages/myorder/myorder?pay_sn1' + pay_sn
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
          }
        }
      })
    }else{
      // 判断是不是周边服务下单支付
      if (b =='periphery'){
      
        //周边服务没有service_specs_id
        console.log(this.data.spec.service_specs_id, this.data.checkAddress1.id)
        wx.request({
          url: url.api + `/ucs/v1/service/bath/add`, 
          data: {
            member_pets_id: this.data.spec.member_pets_id,
            member_name: this.data.spec.member_name,
            shop_id: url.store_id,
            service_product_id: this.data.spec.service_product_id,

            price: this.data.spec.price,
            wholesale_price: this.data.spec.price,
            retail_price: this.data.spec.retail_price,
            total_fee: this.data.total_fee ? this.data.total_fee : this.data.spec.price,
            
            date_time: this.data.spec.date_time,
            address_id: this.data.address.id,
            pay_type: 'WeChat',
            service_id: this.data.spec.service_id,
            is_distribution: this.data.is_distribution ? this.data.is_distribution : 0,
            deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
            service_product_name: wx.getStorageSync('setmeal').service_product_name,
            address,
            convey_address_id: this.data.checkAddress1.id,
            coupon_id: this.data.selectCouponId,//优惠券
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
              let pay_sn = res.data.pay_sn;
              let order_id = res.data.order_id
              this.setData({
                pay_info,
                pay_sn,
                order_id,
              })
              if (res.data.isClubPay) {
                this.setData({
                  is_varieties: true
                })
              } else {
                wx.requestPayment({
                  timeStamp: pay_info.timestamp,
                  nonceStr: pay_info.nonceStr,
                  package: pay_info.package,
                  signType: pay_info.signType,
                  paySign: pay_info.paySign,
                  success: res => {
                    wx.redirectTo({
                      url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn
                    })
                  },
                  fail: err => {
                    wx.redirectTo({
                      url: '/pages/myorder/myorder?pay_sn1' + pay_sn
                    })
                  }
                })
              }
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            }
          }
        }) 
      }else{
        // 判断是不是托运 是托运 闲阅读托运须知
        if (this.data.spec.mername == '托运') {
          if (!this.data.ismername) {
            wx.showToast({
              title: '请先同意勾选托运须知',
              icon:'none'
            })
            return
          }
        }
        console.log(this.data.is_distribution)
        wx.request({
          url: url.api + `/ucs/v1/service/${b}`, 
          data: {
            member_pets_id: this.data.spec.member_pets_id ? this.data.spec.member_pets_id:0,
            service_specs_id: this.data.spec.service_specs_id ? this.data.spec.service_specs_id:0,
            shop_id: url.store_id,
            expenses: this.data.expenses ? this.data.expenses:0,
            date_time: this.data.spec.date_time,
            address_id: this.data.address.id,
            convey_address_id: this.data.checkAddress1.convey_product_id ? this.data.checkAddress1.convey_product_id : 0,
            total_fee: this.data.total_fee ? this.data.total_fee : this.data.spec.price,//零售价
            price: this.data.spec.price1 ? this.data.spec.price1 : 0,
            wholesale_price: this.data.spec.price ? this.data.spec.price : 0,//零售价
            retail_price: this.data.spec.price1 ? this.data.spec.price1 : 0,//批发价

            pay_type: 'WeChat',
            service_id: this.data.spec.service_id,
            service_product_id: this.data.spec.service_product_id,
            is_distribution: this.data.is_distribution ? this.data.is_distribution:0,
            deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
            charges: wx.getStorageSync('setmeal').charges,
            distance: this.data.distance ? this.data.distance:'',
            service_product_name: wx.getStorageSync('setmeal').service_product_name,
            address,
            coupon_id: this.data.selectCouponId,//优惠券
          },
          method: "post",
          header: {
            'content-type': 'application/json', 
            "Authorization": app.token
          },
          success: (res) => {
            console.log(res.data)
            if (res.data.code == 200) {
              var pay_info = res.data.pay_info;
              let pay_sn = res.data.pay_sn;
              let order_id = res.data.order_id
              this.setData({
                pay_info,
                pay_sn,
                order_id,
              })
              if (res.data.isClubPay) {
                this.setData({
                  is_varieties: true
                })
              } else {
                wx.requestPayment({
                  timeStamp: pay_info.timestamp,
                  nonceStr: pay_info.nonceStr,
                  package: pay_info.package,
                  signType: pay_info.signType,
                  paySign: pay_info.paySign,
                  success: res => {
                    wx.redirectTo({
                      url: '/pages/orderdetails/orderdetails?pay_sn=' + pay_sn
                    })
                  },
                  fail: err => {
                    wx.redirectTo({
                      url: '/pages/myorder/myorder?pay_sn1' + pay_sn
                    })
                  }
                })
              }
            }else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
              })
            }
          }
        }) 
      }
      
    }
    },
    //  点击导航
   gomap() {
     let shop = wx.getStorageSync("shop")[0];
     let lat = shop.lat; //经度
     let lon = shop.lon; //纬度
     let name = shop.name
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(lat), //要去的纬度-地址
          longitude: Number(lon), //要去的经度-地址
          name: name,
          address: name
        })
      }
    })
  },
  // lida
  getCounponList(){ 
    if (!this.checkAddress()) return;
    let params={};
    let address1 = this.data.address
    let address = address1.province + '' + address1.city + '' + address1.area + '' + address1.address
    console.log(address)
    let b = this.data.exes[1]
    //判断是不是寄养订单
    if (b == 'escrow/add') {
      params = {
        member_pets_id: this.data.spec.member_pets_id,
        service_specs_id: this.data.spec.service_specs_id,
        shop_id: url.store_id,
        total_fee: this.data.total_fee ? this.data.total_fee : this.data.price,
        price: this.data.price1 ? this.data.price1 : 0,
        grain_price: this.data.grain_price ? this.data.grain_price : '',
        escrow_begin: this.data.spec.start_time,
        escrow_end: this.data.spec.end_time,
        address_id: this.data.address.id,
        pay_type: 'WeChat',
        service_product_id: this.data.spec.service_product_id,
        service_id: this.data.spec.service_id,
        is_distribution: this.data.is_distribution ? this.data.is_distribution : 0,
        deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
        charges: wx.getStorageSync('setmeal').charges,
        service_product_name: wx.getStorageSync('setmeal').service_product_name,
        day: this.data.spec.day,
        coupon_id: this.data.selectCouponId,//优惠券
        address,
        expenses: this.data.expenses ? this.data.expenses : 0
      }
    } else {
      // 判断是不是周边服务下单支付
      if (b == 'periphery') { 
        console.log(b)
        //周边服务没有service_specs_id
        params = {
          member_pets_id: this.data.spec.member_pets_id,
          member_name: this.data.spec.member_name,
          shop_id: url.store_id,
          service_product_id: this.data.spec.service_product_id,
          price: this.data.spec.price,
          total_fee: this.data.total_fee ? this.data.total_fee : this.data.spec.price,
          date_time: this.data.spec.date_time,
          address_id: this.data.address.id,
          pay_type: 'WeChat',
          service_id: this.data.spec.service_id,
          is_distribution: this.data.is_distribution ? this.data.is_distribution : 0,
          deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
          service_product_name: wx.getStorageSync('setmeal').service_product_name,
          address,
          coupon_id: this.data.selectCouponId,//优惠券
        };
      } else { 
        console.log(this.data.spec.service_specs_id)
        params = {
          member_pets_id: this.data.spec.member_pets_id ? this.data.spec.member_pets_id : 0,
          service_specs_id: this.data.spec.service_specs_id ? this.data.spec.service_specs_id : 0,
          shop_id: url.store_id,
          expenses: this.data.expenses ? this.data.expenses : 0,
          date_time: this.data.spec.date_time,
          address_id: this.data.address.id,
          convey_address_id: this.data.checkAddress1.convey_product_id ? this.data.checkAddress1.convey_product_id : 0,
          total_fee: this.data.total_fee ? this.data.total_fee : this.data.spec.price,//零售价
          price: this.data.spec.price1 ? this.data.spec.price1 : 0,
          wholesale_price: this.data.spec.price ? this.data.spec.price : 0,//零售价
          retail_price: this.data.spec.price1 ? this.data.spec.price1 : 0,//批发价
          pay_type: 'WeChat',
          service_id: this.data.spec.service_id,
          service_product_id: this.data.spec.service_product_id,
          is_distribution: this.data.is_distribution ? this.data.is_distribution : 0,
          deal_store: this.data.deal_store ? this.data.deal_store : url.store_id,
          charges: wx.getStorageSync('setmeal').charges,
          distance: this.data.distance ? this.data.distance : '',
          service_product_name: wx.getStorageSync('setmeal').service_product_name,
          address,
          coupon_id: this.data.selectCouponId,//优惠券
        };
      }

    }
    wx.request({
      url: url.api + `/ucs/v1/service/order/coupon`, // 仅为示例，并非真实的接口地址
      data: params,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      complete: () => { wx.hideLoading()},
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          let couponList = res.data.data;
          couponList.push({
            empty: true,
            name: "不使用优惠"
          });
          this.setData({
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
          } else {
            this.choseCouponAction({
              currentTarget: {
                dataset: {
                  index: 0
                }
              }
            })
          }
        }
      }
    }) 
  },
  checkAddress(){
    if (!this.data.address) {
      console.log(666)
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    return true;
  },
  showCouponModel(e) {
    if(!this.checkAddress()) return;
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
    let totalpriceAfterDiscount = this.data.total_fee ? this.data.total_fee : this.data.price ? this.data.price : this.data.grain_price;
    if (this.data.couponList[index] && !this.data.couponList[index].empty) {
      totalpriceAfterDiscount = (totalpriceAfterDiscount - this.data.couponList[index].discount);
      totalpriceAfterDiscount = totalpriceAfterDiscount ? totalpriceAfterDiscount.toFixed(2) : ''
      if (totalpriceAfterDiscount <= 0) { totalpriceAfterDiscount = 0 }
    } else {
    }
    this.setData({
      selectCouponIndex: index,
      selectCouponId: this.data.couponList[index].couponId,
      selectCouponText: selectCouponText,
      couponVisible: false,
      totalpriceAfterDiscount: totalpriceAfterDiscount,
      selectCouponDiscount: selectCouponDiscount,
    })
  },
  
})