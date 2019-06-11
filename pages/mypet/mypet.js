var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    pet_list:null
  },
  // 点击去选择宠物品种弹框
  add_pet() {
    this.setData({
      is_next: false,
      is_shadow: true,
      is_varieties: true
    })
  },
  // 点击去选择宠物信息
  go_petinformation(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/petinformation/petinformation?id='+id,
    })
    this.setData({
      is_shadow: false,
      is_varieties: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow(){
    this.pet_list()
  },
// 用户的宠物列表
  pet_list() {
    wx.request({
      url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        //  console.log(res.data.data);
        let pet_list = res.data.data;
        pet_list.map((item) => {
          item.is_select = false
        })
        this.setData({
          pet_list: pet_list
        })
        console.log(this.data.pet_list)
      }
    })
  },
  // 编辑
  edit(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/Peteditor/Peteditor?edit_id='+id,
    })
  },
  shadow(){
      this.setData({
        is_shadow: false,
        is_varieties: false
      })
  }
})