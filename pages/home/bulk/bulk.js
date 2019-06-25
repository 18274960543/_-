// pages/home/bulk/bulk.js
const app = getApp(),
  url = require('../../../utils/config.js')
Page({
  data: {
    selectTabCur: 1,
    phoneData: {
      phone: "",
      phoneIsp: ""
    },
    scrollLeft: 0
  },
  onLoad(options) {
    wx.setNavigationBarTitle({ title: '超值拼单' })  
    var that = this
    wx.request({
      url: url.api + `/ucs/v1/groupbuy/goods/class`,
      header: {
        'content-type': 'application/json',
        "Authorization": wx.getStorageSync('token'),
      },
      success: (res) => {
        console.log('团购分类', res)
        var data = res.data.data,
          dogList = [],
          catList = []
        for (var i in data) {
          if (data[i].pid == 1) {
            dogList.push(data[i])
          } else {
            catList.push(data[i])
          }
        }
        console.log(dogList)
        console.log(catList)
        that.setData({
          category: dogList,
          dogList,
          catList,
          categoryCur: 0
        })
        that.goodsReq({
          category_id: dogList[0].id
        })
      }
    })
  },
  goodsReq(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    wx.request({
      url: url.api + `/ucs/v1/groupbuy/goods/list`,
      header: {
        'content-type': 'application/json',
        "Authorization": wx.getStorageSync('token'),
      },
      data: e,
      success: (res) => {
        wx.hideLoading()
        console.log('团购列表', res)
        if (res.data.code == 200) {
          var bulkList = res.data.data.data
          for (var item in bulkList) {
            bulkList[item].new_price = (parseFloat(bulkList[item].origin_price) - parseFloat(bulkList[item].goods_price)).toFixed(1)
          }
          that.setData({
            bulkList
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
  bindSelectTab(e) {
    var data = e.currentTarget.dataset,
      that = this
    if (data.types == 1) {
      if (data.id == 1) {
        var category = this.data.dogList
        this.setData({
          selectTabCur: 0
        })
      } else {
        var category = this.data.catList
        this.setData({
          selectTabCur: 0
        })
      }
      this.setData({
        selectTabCur: data.id,
        category
      })
      that.goodsReq({
        category_id: category[0].id
      })
    }
  },
  onCouponItemClick: function(e) {
    // console.log(e)
    var that = this,
      selectedId = e.currentTarget.dataset.id,
      query = wx.createSelectorQuery();
    this.setData({
      categoryCur: e.currentTarget.dataset.index,
      scrollY: 0
    })
    that.goodsReq({
      category_id: that.data.category[e.currentTarget.dataset.index].id
    })
    query.select('#item-' + selectedId).boundingClientRect();
    query.select('#scroll-view').boundingClientRect();
    query.select('#scroll-view').scrollOffset();
    query.exec(function(res) {
      // console.log("res:", res)
      that.setData({
        scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
      });
    });
  },
  bindscroll(e) {
    // console.log(e.detail.scrollTop)
    var that = this
    if (e.detail.scrollTop > 60) {
      this.setData({
        is_couponScrol: true
      })
    } else {
      that.setData({
        is_couponScrol: false
      })
    }
  },
  jump(e) {
    wx.navigateTo({
      url: '/pages/details/details?bulk=1&id=' + e.currentTarget.dataset.id,
    })
  }
})