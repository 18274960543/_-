// pages/edit/editTele/editTele.js

const app = getApp()
let url = require('../../../utils/config.js')
Page({

  /*页面的初始数据*/
  data: {
    btnText: "发送验证码",
    inputTele: "",
    inputCode: "",
    isdisabled: true,
    isSavebtn: false,
  },
  //手机号input框
  bindTeleInput(e) {
    this.setData({
      inputTele: e.detail.value
    })
  },
  //验证码框
  bindCodeInput(e) {
    this.setData({
      inputCode: e.detail.value
    })
    if (this.data.inputTele !== "" && this.data.inputCode !== "") {
      this.setData({
        isSavebtn: true
      })
    } else {
      this.setData({
        isSavebtn: false
      })
    }
  },
  // 点击发送验证码
  onSendcodeTap() {
    var that = this;
    wx.request({
      url: url.api + '/ucs/v1/member/verify_code',
      header: {
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      data: {
        mobile: this.data.inputTele,
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res.data);
        // 提示
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
        if(res.data.code==200){
          // 赋值
          that.setData({
            verification_key: res.data.verification_key,
            check_code: res.data.verification_code,
            isdisabled: false
          })
          // 倒计时
          var timeNum = 60;
          var sendCodeTime = setInterval(() => { //定时器，timeNum每一秒减1
            timeNum -= 1;
            that.setData({
              btnText: timeNum + "秒后重发"
            })
            if (timeNum == 0) { //timeNum为0时返回之前的状态
              clearInterval(sendCodeTime);
              that.setData({
                btnText: "发送验证码",
                isdisabled: true
              })
            }
          }, 1000);    
        }else{
          
        }
      }
    })
  },
  // 点击保存
  onSaveTap:function(){
    wx.request({
      url: url.api + '/ucs/v1/member/phone',
      header: {
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      data: {
        mobile: this.data.inputTele,
        verification_key: this.data.verification_key,
        check_code: this.data.check_code
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success:function(res){
        console.log(res.data,res);
        if (res.data.code==200){
          wx.showToast({
            title:'手机号修改成功',
            icon: 'none',
            duration: 2000
          })
          setTimeout((wx.navigateBack({
            delta: 1
          }), 4000))
        }else{
         wx.showToast({
           title:res.data.message,
           icon:'none',
           duration:200
         })
        
        }
        // if (res.data.code == 200) {
        //     app.tele_phone = this.data.inputTele
        //   console.log("000",app.tele_phone)
        // }
      }
    })
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
  },
  /*生命周期函数--监听页面显示*/
  onShow: function () {
  },
})