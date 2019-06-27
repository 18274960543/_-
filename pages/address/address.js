// pages/address/address.js
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
    ],
    Viewfrom: 'edit' /*select:选择 edit：编辑 */
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.addresslist()
    console.log(options)
    if (options.Viewfrom) {
      this.setData({
        Viewfrom: options.Viewfrom
      })
      console.log(this.data.Viewfrom)
    }
  },
  onShow: function(options) {
    this.addresslist()
  },
  // 点击去添加新地址
  go_addresseditor() {
    wx.navigateTo({
      url: '/pages/newaddress/newaddress',
    })
  },
  // 点击编辑去添加新地址页面 编辑修改地址
  go_addresseditor1(e) {
    let list = e.currentTarget.dataset.list;
    wx.navigateTo({
      url: '/pages/addresseditor/addresseditor?name=' + list.name + '&&mobile=' + list.mobile + '&&province=' + list.province + '&&city=' + list.city + '&&area=' + list.area + '&&address=' + list.address + '&&is_default=' + list.is_default + '&&id=' + list.id,
    })

  },
  // 地址列表接口数据
  addresslist() {
    wx.request({
      url: url.api + `/ucs/v1/member/address`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        // console.log(res.data.data.data)
        let list = res.data.data.data;
        list.map((item)=>{
          item.is_gaoL = item.is_default
        })
        if (this.data.Viewfrom == 'select' && app.globalData.address) {
          list.map((item) => {
            if (app.globalData.address.id == item.id) {
              item.is_default = 1;
            } else {
              item.is_default = 0;
            }
          })
        } else {
         for(let i = 0;i < list.length;i++){
           if(list[i].is_default){
             app.globalData.address = list[i]
             break
           }
         }
        }
        if(!app.globalData.address && list.length > 0){
          list[0].is_default = 1
          app.globalData.address = list[0]
        }
        if (list.length<=0){
          app.globalData.address=false
        }
        this.setData({
          list
        })

      }
    })
  },
  // 是否选择为默认地址
  is_selection(e) {
    console.log(this.data.Viewfrom)
    let index = e.currentTarget.dataset.index;
    if (this.data.Viewfrom == 'edit') {
      console.log(122222)
      let list = this.data.list
      app.globalData.address = list[index]
      wx.navigateBack({
        delta:1
      })
    } else {
      let list = this.data.list;
      list.map((item) => {
        item.is_default = 0
      })
      list[index].is_default = !this.data.list[index].is_default
      this.setData({
        list
      })
    }
  }
})