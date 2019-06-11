const Page = require('../../utils/ald-stat.js').Page;
const util = require('../../utils/util.js'),
  url = require('../../utils/config.js');
 
  const app = getApp()
Page({
  data: {
    vaeTypes: 1,
    topList: [{
        text: '售后申请',
        status: 1
      },
      {
        text: '处理中',
        status: 0
      },
      {
        text: '申请记录',
        status: 0
      }
    ],
    topListIndex: 0,
  },
  onLoad(options) {
    let state = options.state
    console.log(options)
    this.refundData(options.num ? options.num:'1')
    let topListIndex = this.data.topListIndex
    let index = Number(options.num - 1)
    let topList = this.data.topList
   
    topList[topListIndex].status = 0;
    topList[index].status = 1;
    this.setData({
      topList,
      topListIndex: index
    })
  },
  add(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      showSerivce: !this.data.showSerivce,
      index,
    })
  },
 
  // 退款退货数据
  refundData(num){
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url.api + `/ucs/v1/refund/index/${num}`,
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      method: "get",
      success: (res) => {
        if(res.data.code==200){
            this.setData({
              list:res.data.data
            })
        }
        wx.hideLoading()
        console.log('售后列表', res.data.data)
      }
    })
  },
  bindSelect(e) {
    console.log(e)
    var topList = this.data.topList,
      topListIndex = this.data.topListIndex,
      index = e.currentTarget.dataset.index
    topList[topListIndex].status = 0
    topList[index].status = 1;
    this.refundData(index+1)
    this.setData({
      topList,
      topListIndex: index
    })
  },
  stopPageScroll: function () {
    return
  },
  refund(e){
    let index = this.data.index
    let orderData = this.data.list;
    let orderId = orderData[index].order_id;
    let goodsSkuId = orderData[index].goods_sku_id;
    let num = orderData[index].goods_num;
    let refund_state = e.currentTarget.dataset.types-1; //售后状态:0是仅退款,1是退款退货,2是换货;
    console.log(refund_state)
    wx.navigateTo({
      url: `/pages/refundInfo/refundInfo?orderId=${orderId}&goodsSkuId=${goodsSkuId}&refund_state=${refund_state}`,
    })
    this.setData({
      showSerivce:false
    })
  },
  // 去退货 退款 退款退货详情
  gorefundInfo(e){
    let index = e.currentTarget.dataset.index;
    let list=this.data.list
    let refundId=list[index].id
     wx.navigateTo({
       url: `/pages/afterSaleDetails/afterSaleDetails?refundId=${refundId}`,
     })
  }
})