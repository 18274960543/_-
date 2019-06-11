var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { text: '宠物是救命恩人！网友：这样的宠物给我来一打', date: '2018.12.26', img:'/img/ketang1.png'},
      { text: '如何让狗狗安静地洗澡？学会“这一招”很重要', date: '2018.12.26', img: '/img/ketang1.png' },
      { text: '宠物是 救命恩人！网友：这样的宠物给我来一打', date: '2018.12.26', img: '/img/ketang1.png' },
      { text: '狗狗的眼神好温柔，叼着骨头的模样好像在说：你要和我一起吃吗？', date: '2018.12.26', img: '/img/ketang1.png' },
      { text: '冬天给宠物这样保暖，其实是害了它！', date: '2018.12.26', img: '/img/ketang1.png' }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.titelData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  classroomdetails(e){
    let index = e.currentTarget.dataset.index;
     
    let list = this.data.list
    let url=list.data.data[index].content
    console.log(url)
    wx.navigateTo({
      url: '/pages/classroomdetails/classroomdetails?url='+url,
    })
  },
  // 文章列表
  titelData(){
    wx.request({
      url: url.api + '/ucs/v1/article',  
      method: "get",
      header: {
        'content-type': 'application/json',  
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code==200){
          this.setData({
            list: res.data
          })
        } 
        console.log(this.data.list)
      }
    })
  }
})