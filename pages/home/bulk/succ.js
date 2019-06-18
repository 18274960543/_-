// pages/home/bulk/succ.js
const app = getApp(),
  url = require('../../../utils/config.js'),
  util = require('../../../utils/util.js')
Page({
  data: {
    showSucc: true,
    address_id:'',
  },
  onLoad(options) {
    console.log(options)
    var that = this
    that.setData({
      options
    })
    // 判断是不是分享进来的新用户 
    if (options.share) {
      console.log('分享进来')
      wx.login({
        success: res => {
          console.log(res)
          // 发送 res.code 到后台换取 openId, sessionKey, un   
          let shop_id = wx.getStorageSync('shop_id')
          // var shop_id = options.shop_id;
          wx.request({
            url: url.api + `/ucs/v1/oauth/login`,
            data: {
              code: res.code,
              shop_id: shop_id ? shop_id : 1
            },
            method: "post",
            success: (res) => {
              console.log(res)
              // console.log('getCode',res.data)
              // 获取token
              url.token = res.data.token_type + ' ' + res.data.access_token;
              let token = res.data.token_type + ' ' + res.data.access_token;
              that.abc(token, options)
              wx.setStorageSync(token, token)
              // 获取member_id
              url.member_id = res.data.id;
              // abc(shop_id)
              this.addresslist(token)
            }
          })
        }
      })
    } else{
      this.abc(wx.getStorageSync('token'), options)
      // this.addresslist(wx.getStorageSync('token'))
      }
    // 分享进来结束
  },
  abc(token, options) {
    wx.request({
      url: url.api + `/ucs/v1/groupbuy/order/info/` + options.activity_id, 
      header: {
        'content-type': 'application/json',
        "Authorization": token,
      },
      success:(res)=>{
        console.log('团购详情', res)
        if (res.data.code == 200) {
          var groupbuy = res.data.data.user.groupbuy,
            user = res.data.data.user,
            groupbuyList = res.data.data.list,
            arr = [],
            arrNum = 0
          for (var i = 0; i < groupbuy.person_num - 1; i++) {
            if (groupbuyList[i]) {
              var obj = groupbuyList[i]
              console.log(obj)
            } else {
              var obj = {}
              ++arrNum
            }
            arr.push(obj)
          }
          console.log(arr)
          // this.countdown(parseInt(res.data.data.time + '1000'))
          this.countdown(parseInt(res.data.data.time)*1000)
          this.setData({
            user,
            groupbuyList: arr,
            groupbuy,
            userInfo: wx.getStorageSync('userInfo'),
            options,
            needNum: arrNum
          })
          return
        }
        wx.showModal({
          content: res.data.message,
          showCancel: false,
        })
      }
    })
  },
  // 地址列表接口数据
  addresslist(token) {
    wx.request({
      url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": token,
        "Accept": 'application/json'
      },
      success: (res) => {
        // console.log(res.data.data.data)
        console.log(res)
        let list = res.data.data.data;
        let address_id='';
        list.map(item=>{
          if (item.is_default){
            address_id = item.id
          }
        })
        this.setData({
          address_id
        })
      }
    })
  },
  onShow(){
    this.addresslist(wx.getStorageSync('token'))
  },
  // 立即参团
  gobuy(e) {
    var that = this,
      groupbuy = this.data.groupbuy,
      user = this.data.user
    if (!this.data.address_id){
      wx.navigateTo({
        url: '/pages/address/address?Viewfrom=' +'select',
      })
      return
    }
    wx.request({
      url: url.api + `/ucs/v1/groupbuy/order/activity`,
      data: {
        groupbuy_id: groupbuy.id,
        shop_id: user.shop_id,
        address_id: this.data.address_id,
        pay_type: "WeChat",
        activity_sn: user.activity_sn
      },
      method: "post",
      header: {
        'content-type': 'application/json',
        "Authorization": app.token
      },
      success(res) {
        console.log('拼团下单', res)
        if (res.data.code == 200) {
          wx.requestPayment({
            timeStamp: res.data.pay_info.timestamp,
            nonceStr: res.data.pay_info.nonceStr,
            package: res.data.pay_info.package,
            signType: res.data.pay_info.signType,
            paySign: res.data.pay_info.paySign,
            success: res => {
              wx.showToast({
                title: '拼团成功'
              })
            },
            fail: err => {
              wx.showModal({
                content: '支付失败',
                showCancel: false,
              })
            }
          })
          return
        }
        wx.showModal({
          content: res.data.message,
          showCancel: false
        })
      }
    })
  },
  binShowRules(e) {
    this.setData({
      showRules: !this.data.showRules
    })
  },
  bindSucc() {
    this.setData({
      showSucc: false
    })
  },
  jump(e) {
    if (e.currentTarget.dataset.types == 1) {
      wx.reLaunch({
        url: '/pages/home/home',
      })
    } else {
      wx.redirectTo({
        url: 'myBulk',
      })
    }
  },
  onShareAppMessage: function() {
    var groupbuy = this.data.groupbuy,
      activity_id = this.data.options.activity_id ? this.data.options.activity_id : ''
    return {
      title: groupbuy.goods_name,
      imageUrl: groupbuy.post_image,
      path: '/pages/home/bulk/succ?share=share&activity_id=' + activity_id,
      success: (res) => {
        console.log(res)
      }
    }
  },
  // 倒计时
  countdown(time) {
    // console.log(time)
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
    setTimeout(function() {
      time -= 1000;
      that.countdown(time);
      // return
    }, 1000)
  }
})