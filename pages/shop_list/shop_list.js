var app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    selectView: [{
        id: 1,
        text: '综合',
        icon: '/img/0ffc0821ec2fae70514e578445360fe.png'
      },
      {
        id: 2,
        text: '畅销',
      },
      {
        id: 3,
        text: '价格',
      },
      {
        id: 4,
        text: '筛选',
        icon: '/img/16059cd46b97a862ceb36669df04032.png'
      },
    ],
    comprehensiveList: [{
        text: '新品优先',
        status: 0
      },
      {
        text: '价格降序',
        status: 0
      },
      {
        text: '价格升序',
        status: 0
      },
    ],
    nav_bottomItems: null,
    catchtouchmove: false,
    is_price: 1 ,//价格状态判断
    page:1,
    params:{},
  },
  // 最高价
    
  bindKeyInput1(e) {
    console.log(e.detail.value)
    this.setData({
      priceEnd: e.detail.value
    })
  },
  // 最低价
  bindKeyInput2(e) {
    this.setData({
      priceStart: e.detail.value
    })
  },
   
  stopPageScroll: function () {
    return
  },
  bindscrolltolower(e) {
    let self = this;
    //当长度不够
    // if (self.data.nav_bottomItems.length==this.data.page*8){
    let params = this.data.params;
    params.page = params.page+1;
    this.setData({
      params: params,
    });
    wx.showLoading({
      title: 'Loading...',
    })
    // this.renderGoods(this.data.ids, function (res) {
 
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
      data: this.data.params,
      method: "post",
      success: (res) => {
        console.log(111111,res)
        var nav_bottomItems = self.data.nav_bottomItems
        nav_bottomItems = nav_bottomItems.concat(res.data.data)
        self.setData({
          nav_bottomItems
        })
        wx.hideLoading()
        console.log(self.data.nav_bottomItems)
      }
    })
  },
  onLoad(options) {
    console.log(options)
    this.shopList(options.id)
    this.setData({
      ids: options.id
    })
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        that.setData({
          systemInfo: res
        })
      },
    })
    wx.request({
      url: url.api + '/ucs/v1/category_attr/' + options.id + '/show',
      success(res) {
        // console.log('筛选数据', res)
        that.setData({
          shuaixuan: res.data.data
        })
        console.log(that.data.shuaixuan)
      }
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
  },
  // 
  toInfo(e) {
    console.log('商品详情', e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  bindcar(e) {
    // let index = e.currentTarget.dataset.index
    // //加入购物车
    // let list = this.data.nav_bottomItems;
    // let goods_sku_id = list[index].goods_sku[0].id;
   
    // wx.request({
    //   url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
    //   method: "post",
    //   data: {
    //     shop_id: url.store_id,
    //     goods_sku_id: goods_sku_id,
    //     num: 1
    //   },
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     "Authorization": app.token,
    //     "Accept": 'application/json'
    //   },
    //   success: (res) => {
    //     console.log(res.data)
    //     if (res.data.code == 200) {
    //       this.setData({
    //         is_switch: false,
    //       })
    //       wx.showToast({
    //         title: '添加成功',
    //         icon: 'succes',
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'none',
    //       })
      
    //     }
    //   }
    // })
  },
  // 筛选 选择种类
  selectCompre(e) {
    console.log(e)
    var index = e.currentTarget.dataset.index,
      comprehensiveList = this.data.comprehensiveList
      // 新品优先
    if (index == 0) {
      this.setData({
        params: {
          ids: this.data.ids,
          sortFiled: 'is_new',
          sortType: this.data.is_price,
          paeg:1,
        }
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
        data: {
          ids: this.data.ids,
          sortFiled: 'is_new',
          sortType: 2,
          paeg: 1,
        },
        method: "post",
        success: (res) => {
          console.log(res.data)
          this.setData({
            nav_bottomItems: res.data.data,
          })
          console.log(this.data.nav_bottomItems)
        }
      })
    }
    // 价格降序
    if (index == 1) {
      this.setData({
        params: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType: 2,
          paeg: 1,
        }
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
        data: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType: 2,
          paeg: 1,
        },
        method: "post",
        success: (res) => {
          console.log(res.data)
          this.setData({
            nav_bottomItems: res.data.data,
          })
          console.log(this.data.nav_bottomItems)
        }
      })
    }
    //价格升序
    if (index == 2) {
      this.setData({
        params: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType: 1,
          page:1
        }
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
        data: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType:1,
          page: 1
        },
        method: "post",
        success: (res) => {
          console.log(res.data)
          this.setData({
            nav_bottomItems: res.data.data,
          })
          console.log(this.data.nav_bottomItems)
        }
      })
    }
    if (comprehensiveList[index].is_select == true) {
      comprehensiveList[index].status = 0;
    }
    for (var i = 0; i < comprehensiveList.length; i++) {
      comprehensiveList[i].status = 0
      comprehensiveList[i].is_select = false
    }
    comprehensiveList[index].status = 1
    comprehensiveList[index].is_select = true
    this.setData({
      comprehensiveList,
      showComprehensive: false
    })
  },
  // 选择分类
  bindSelect(e) {
    // console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      this.setData({
        showComprehensive: !this.data.showComprehensive
      })
    }
    if (id == 3) { //点击价格
      this.setData({
        params: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType: 1,
          page: 1
        }
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
        data: {
          ids: this.data.ids,
          sortFiled: 'price',
          sortType: this.data.is_price,
          page: 1
        },
        method: "post",
        success: (res) => {
          console.log(res.data)
          this.setData({
            nav_bottomItems: res.data.data,
          })
          if (this.data.is_price == 1) {
            this.setData({
              is_price: 2
            })
          } else {
            this.setData({
              is_price: 1
            })
          }
          console.log(this.data.nav_bottomItems)
        }
      })
    }
    // 点击销量
    if (id == 2) {
      this.setData({
        params:{
          ids: this.data.ids,
          sortFiled: 'ficti',
          sortType: this.data.is_price,
          page:1
        }
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
        data: {
          ids: this.data.ids,
          sortFiled: 'ficti',
          sortType: this.data.is_price,
          page: 1
        },
        method: "post",
        success: (res) => {
          console.log(res.data)
          this.setData({
            nav_bottomItems: res.data.data,
          })
          if (this.data.is_price == 1) {
            this.setData({
              is_price: 2
            })
          } else {
            this.setData({
              is_price: 1
            })
          }
          console.log(this.data.nav_bottomItems)
        }
      })
    }
    if (id == 4) {
      this.setData({
        showScreening: 1,
        showComprehensive: false,
        catchtouchmove: true
      })
    }
  },
  // 选择 筛选选项
  clickSelect(e) {
    var dataset = e.currentTarget.dataset,
      obj = this.data.shuaixuan
    console.log('选择选项', dataset, obj)
    for (var i = 0; i < obj.length; i++) {
      if (obj[i].id == dataset.attr_key_id) {
        // console.log(obj[i])
        for (var k = 0; k < obj[i].attr_mx.length; k++) {
          obj[i].attr_mx[k].status = false
        }
        for (var k = 0; k < obj[i].attr_mx.length; k++) {
          // console.log(k, dataset.index)
          if (k == dataset.index) {
            obj[i].attr_mx[k].status = true
            this.setData({
              shuaixuan: obj
            })
            return
          }
        }
      }
    }
  },
  // 重置
  chongzhi() {
    var obj = this.data.shuaixuan
    for (var i = 0; i < obj.length; i++) {
      for (var k = 0; k < obj[i].attr_mx.length; k++) {
        console.log(obj[i].attr_mx[k])
        obj[i].attr_mx[k].status = false
      }
    }
    this.setData({
      shuaixuan: obj
    })
  },
  mask(){
    this.setData({
      showScreening: 3,
      catchtouchmove: false
    })
  },
  // 确定
  bindScreening(e) {
    var that = this,
     shuaixuan = that.data.shuaixuan;
     let spec=[];
     shuaixuan.map((item)=>{
       item.attr_mx.map((item1)=>{ 
         if (item1.status==true){
           spec.push(item1.id)
         }
       })
     })
    let spec1=spec.join(',')
    console.log(spec1, this.data.ids)
    this.setData({
      params:{
        ids: this.data.ids,
        spec: spec1,
        page:1,
        // priceStart: this.data.priceStart ? this.data.priceStart:'', 
        // priceEnd: this.data.priceEnd ? this.data.priceEnd : '', 
      }
    })
    // 筛选接口数据对接
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/show', 
      data: {
        ids: this.data.ids,
        spec: spec1,
        page: 1,
        priceStart: this.data.priceStart ? this.data.priceStart:'', 
        priceEnd: this.data.priceEnd ? this.data.priceEnd : '', 
      },
      method: "post",
      success: (res) => {
        console.log(res.data)
        this.setData({
          nav_bottomItems: res.data.data,

        })
        console.log(this.data.nav_bottomItems)
      }
    })
    this.setData({
      showScreening: 2
    })
    setTimeout(res => {
      this.setData({
        showScreening: 3,
        catchtouchmove: false
      })
    }, 500)
  },
  // 商品列表数据
  shopList(ids) {
    // let id = this.data.imgUrls[0].id
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      params:{
        ids: ids,
        page: 1,
      }
    })
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/show', // 仅为示例，并非真实的接口地址
      data: {
        ids: ids,
        page:1
      },
      method: "post",
      success: (res) => {
        console.log(res.data)
        this.setData({
          nav_bottomItems: res.data.data
        })
        wx.hideLoading()
        console.log(this.data.nav_bottomItems)
      }
    })
  },
  // 点击搜索 去搜索页面
  gosearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})