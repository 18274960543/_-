let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
Page({
  data: {
    showCourier:false,
    expressName:'',
    oddNumbers:'',
    express_id:'',
    express_name:'',
    isswitch:true,
    showServicePopups:false,
    stateComment:'',//title
    clock:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.pageorder(options.refundId)
    this.setData({
      refundId:options.refundId
    })
    this.logisticsList();
  },
  stopPageScroll: function () {
    return
  },
  pageorder(refundId){
    let self = this;
    wx.request({
      url: url.api + `/ucs/v1/refund/show/${refundId}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
         console.log(res)
         if(res.data.code==200){
           let orderInfo = res.data.data
           if (orderInfo.refund_check == 0 || orderInfo.refund_check == 1 || orderInfo.refund_check == 3) { // 客服审核
             orderInfo.allCheck = 0 //处理中
             self.setData({
               stateComment: {
                 '1': '待第三方处理',
                 '2': '待用户发货',
                 '3': '待第三方审核',
                 '4': '第三方发货',
                 '5': '已到账',
                 '6': '审核拒绝',
                 '7': '服务已关闭',
                 '8': '平台审核',
               }[orderInfo.state_comment]
             })
             self.countdown(orderInfo.time*1000)
           }
           if (orderInfo.finance_check == 1) {
             orderInfo.allCheck = 1 //审核成功
           }
           if (orderInfo.brain_state == 3 || orderInfo.refund_check == 2 || orderInfo.finance_check == 2) {
             orderInfo.allCheck = 2 //审核拒绝
           }
           let created_at = this.getLocalTime(orderInfo.created_at);
           if (orderInfo.express.length!=0){
             this.setData({
               expressName: orderInfo.express.user.express_name,
               express_id: orderInfo.express.user.express_id,
               oddNumbers: orderInfo.express.user.express_code,
             })
           }
            
           this.setData({
             pageorder: orderInfo,
             created_at,
             
           })
           //页面标题为路由参数
           wx.setNavigationBarTitle({
             title: orderInfo.refund_state == 0 ? '仅退款' : orderInfo.refund_state == 1 ? '退款退货' : orderInfo.refund_state == 2 ? '换货' : ''
           })
          
         }
      }
    })
  },
  getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).Format('yyyy-MM-dd hh:mm:ss');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 物流列表  快递公司列表
  logisticsList(){
    wx.request({
      url: url.api + `/ucs/v1/refund/express/list`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res);
        let expressName = res.data.data[0].name
        if (res.data.code == 200) {
          this.setData({
            courierList: res.data.data,
            // expressName
          })
        }
      }
    })
  },
  // 显示物流列表  弹框等
  displayLogistics(){
    this.setData({
      showCourier: true
    })
  },
  clickCour(){
    this.setData({
      showCourier:false
    })
  },
  selectCour(e){
    let expressName = e.currentTarget.dataset.name;
    let express_id = e.currentTarget.dataset.id;
    let express_name = e.currentTarget.dataset.name;
    this.setData({
      expressName,
      showCourier: false,
      express_id,
      express_name,
    })
  },
  bindKeyInput(e){
    console.log(e)
    const value = e.detail.value;
    console.log(value)
    this.setData({
      oddNumbers: value
    })
  },
  // 提交数据
  submit(){
    console.log(this.data.oddNumbers)
    if (!this.data.express_name) {
      wx.showToast({
        title: '请填快递公司',
        icon: 'none'
      })
      return
    }
    if (!this.data.oddNumbers){
      wx.showToast({
        title: '请填写快递单号',
        icon:'none'
      })
      return
    }
   
    let refundId = this.data.refundId
    wx.request({
      url: url.api + `/ucs/v1/refund/addExpress/${refundId}`, // 仅为示例，并非真实的接口地址
      method: "put",
      data:{
        express_id: this.data.express_id,
        express_name: this.data.express_name,
        express_code: this.data.oddNumbers
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
          this.setData({
            isswitch:false
          })
        }
      }
    })
  },
  // 修改 数据
  modify(){
    console.log(this.data.oddNumbers,11)
    if (!this.data.expressName) {
      wx.showToast({
        title: '请填快递公司',
        icon: 'none'
      })
      return
    }
    if (!this.data.oddNumbers) {
      wx.showToast({
        title: '请填写快递单号',
        icon: 'none'
      })
      return
    }
    let refundId = this.data.refundId
    wx.request({
      url: url.api + `/ucs/v1/refund/editExpress/${refundId}`, 
      method: "put",
      data: {
        express_id: this.data.express_id,
        express_name: this.data.expressName,
        express_code: this.data.oddNumbers,
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          // this.setData({
          //   isswitch: true
          // })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  }
  ,// 倒计时
  countdown(time) { 
    var that = this
    this.setData({
      clock: this.dateformat(time) //若已结束，此处输出'0天0小时0分钟0秒'
    });
    if (time <= 0) {
      this.setData({
        clock: ""
      });
      return;
    }
    setTimeout(function () {
      time -= 1000;
      that.countdown(time);
      // return
    }, 1000)
  },
  // 时间格式化输出，如11天03小时25分钟19秒 每1s都会调用一次
  dateformat(micro_second) {
    var second = Math.floor(micro_second / 1000);
    var day = Math.floor(second / 3600 / 24);
    var hr = Math.floor(second / 3600 % 24);
    var min = Math.floor(second / 60 % 60);
    var sec = Math.floor(second % 60);
    return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
  },
  // 联系客服
  kefu(){
    this.setData({
      showServicePopups: true
    })
  },
  clickService(){
    this.setData({
      showServicePopups:false
    })
  },
  isswitch(){
    this.setData({
      showServicePopups: false
    })
     
  },
  // 复制
  onCopyTap: function (e) {
    let number = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: String(number),
      success: (res) => {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 确认收货
  confirm(){
    let refundId = this.data.refundId
    console.log(refundId)
    wx.request({
      url: url.api + `/ucs/v1/refund/complete/${refundId}`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },
  // 平台介入
  platformIntervention(){
    if (this.data.pageorder.is_intervention==1){
      wx.showToast({
        title: '已经申请了一次',
        icon:'none'
      })
      return
    }
    let refundId = this.data.refundId
    wx.request({
      url: url.api + `/ucs/v1/refund/intervention/${refundId}`, // 仅为示例，并非真实的接口地址
      method: "put",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  }
})