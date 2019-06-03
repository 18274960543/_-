let url = require('../../utils/config.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    src:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })
  },
  chooseImage(){
    wx.chooseImage({
      count:10,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=>{
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        this.setData({
          src: tempFilePaths
        })
      }
    })
  },
  submit(){
    if (!this.data.value){
       wx.showToast({
         title: '请输入您的建议',
         icon:'none'
       })
       return
    }
    wx.request({
      url: url.api + `/ucs/v1/member/complaint`, // 仅为示例，并非真实的接口地址
      method: "post",
      data:{
        content: this.data.value,
        image:[]
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
            console.log(res)
            if(res.data.code==200){
              wx.showModal({
                // title: '提示',
                content: '谢谢您的反馈，您的每一次建议，都是我们进步的源泉！',
                showCancel:false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 2
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
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