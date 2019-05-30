var app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    list1: [{
      text: '未收到货',
      status: 0
    }, {
      text: '已收到货',
      status: 0
    }],
    list2: [{
      text: '大小/重量与商品描述不符',
      status: 0
    }, {
      text: '生产日期/保质期与商品不符',
      status: 0
    }, {
      text: '标签/批次/包装/成分/商品描述不符',
      status: 0
    }],
    is_text: '请选择',
    is_text2: '请选择',
    img:'/img/retur.png',
    orderData:'',
    num:1,
    refund_state:'',
    money:''
  },
  onLoad(options) {
    console.log(options)
    this.setData({
      list: this.data.list1,
      options,
      refund_state: Number(options.refund_state) 
    })
    wx.setNavigationBarTitle({
      title: options.refund_state == 0 ? '退款' : options.refund_state == 1 ? '退款退货' : options.refund_state == 2?'退货':''
    })
    this.orderData(options.orderId, options.goodsSkuId, options.num)
  },
  // 购物数量加减
  inputChangeHandle: function (event) {
    var num = event.detail.value; //通过这个传递数据
    let orderData = this.data.orderData.order_goods.goods_pay_price
    console.log(orderData, num)
    let money = num * orderData
    console.log(money)
    this.setData({
      num,
      money
    })

  },
  add() {
    let num = this.data.num;
     num++;
    let orderData = this.data.orderData.order_goods.goods_pay_price
    let money = num * orderData
    this.setData({
      num,
      money
    })
  },
  reduce() {
    let num = this.data.num;
   num > 1 ? num-- : 1;
    let orderData = this.data.orderData.order_goods.goods_pay_price
    let money = num * orderData
    this.setData({
      num,
      money
    })
  },
  bindSelect(e) {
    var types = e.currentTarget.dataset.types
    if (types == 1) {
      this.setData({
        list: this.data.list1,
        is_types: 1,
        showModal: true
      })
    }
    if (types == 2) {
      this.setData({
        list: this.data.list2,
        is_types: 2,
        showModal: true
      })
    }
    if (types == 3) {
      this.setData({
        showModal: false,
        is_select: false
      })
      if (this.data.is_types == 1) {
        this.setData({
          is_text: abc(this.data.list)
        })
      } else {
        this.setData({
          is_text2: abc(this.data.list)
        })
      }

      function abc(list) {
        var bool = false
        for (var i = 0; i < list.length; i++) {
          if (list[i].status == 1) {
            bool = true
            var text = list[i].text
          }
        }
        if (bool) {
          return text
        } else {
          return '请选择'
        }
      }
    }
  },
  stopPageScroll: function () {
    return
  },
  bindList(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    var list = this.data.list
    for (var i = 0; i < list.length; i++) {
      list[i].status = 0
    }
    list[e.currentTarget.dataset.index].status = 1;
    if (this.data.is_types==1){
      let product_state=index + 1;
      this.setData({
        product_state
      })
    }
    if (this.data.is_types == 2) {
      let product_reason=index + 1;
      this.setData({
        product_reason,
      })
    }
    this.setData({
      list,
      is_select: true,
    })
  },
  next(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  // 页面退款显示单个商品详情
  orderData(orderId, goodsSkuId,num){
    console.log(orderId,goodsSkuId) 
    wx.request({
      url: url.api + `/ucs/v1/order/goodsInfo/${orderId}/${goodsSkuId}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          let money = Number(res.data.data.order_goods.goods_pay_price)
          console.log()
            this.setData({
              orderData: res.data.data,
              money
            })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none',
            duration:500
          })
        }
      }
    })
  },
  addImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      success(res) {
        // console.log(res.tempFilePaths[0])
        that.setData({
          img: res.tempFilePaths[0]
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => {
            // console.log(res.data)
            util.imgupload(res.data, 'service')
              .then(res => {
                console.log('上传图片', res)
                that.setData({
                  imgKey: res.data.img_url
                })
              })
          }
        })
      },
    })
  },
 
  // 退款退货说明
  bindKeyInput(e){
    console.log(e)
     this.setData({
       comment: e.detail.value
     })
  },
  // 退换货申请
  apply(){
    console.log(this.data.product_state)
    if (!this.data.product_state){
      wx.showToast({
        title: '请选择货物状态',
        icon:'none'
      })
      return
    } else if (!this.data.product_reason){
      wx.showToast({
        title: '请选择退货原因',
        icon: 'none'
      })
      return
    }
    let orderData = this.data.orderData;
    console.log(this.data.product_state, this.data.product_reason)
    wx.request({
      url: url.api + `/ucs/v1/order/refund`, // 仅为示例，并非真实的接口地址
      data: {
        pay_sn: orderData.order_sn,
        order_id: orderData.order_goods.order_id,
        goods_sku_id: orderData.order_goods.goods_sku_id,
        num: this.data.num,
        product_state: this.data.product_state,
        product_reason: this.data.product_reason,
        comment: this.data.comment,
        // refund_img: [this.data.imgKey ? this.data.imgKey:''],
        refund_state: this.data.options.refund_state
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
         wx.navigateTo({
           url: '/pages/refund/refund?num='+2,
         })
        }else{
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      }
    })
  }
})