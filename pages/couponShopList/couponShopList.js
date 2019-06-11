var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
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
    proList: null,
    catchtouchmove: false,
    is_price: 1, //价格状态判断
    page: 1,
    coupon: {},
    selectIds: [],
    proList: [],
    skuMap: {},
    params: {},
    couponText: '',
    category: [],
    categoryId: 0,
    priceStart: '',
    priceEnd: '',
    searchText: '',
  },

  renderProList(params) {

    let couponId = this.data.couponId
    if (params) { //更新参数
      this.setData({
        selectIds: [],
        totalMoney: '0.00',
        couponText: '',
        searchText: params.keyword || ''
      })

    } else { //分页加载参数 page+1
      params = this.data.params;
      params.page = params.page + 1;
    }
    this.setData({
      params: params,
    })
    wx.showLoading({
      title: 'Loading...',
    })
    let proList = this.data.proList;
    wx.request({
      url: url.api + '/ucs/v1/shop/goods/coupon/' + couponId,
      data: this.data.params,
      method: "get",
      success: (res) => {
        this.setData({
          proList: params.page > 1 ? proList.concat(res.data.data) : res.data.data, //add or new
          coupon: res.data.coupon,
        })
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  bindSearchInput(e) {
    let v = e.detail.value;
    let params = this.data.params;
    params.keyword = v;
    this.renderProList(params)

  },
  bindKeyInput1(e) {
    console.log(e.detail.value)
    this.setData({
      priceStart: e.detail.value
    })
  },
  // 最高价
  bindKeyInput2(e) {
    this.setData({
      priceEnd: e.detail.value
    })
  },

  stopPageScroll: function() {
    return
  },
  bindscrolltolower(e) {
    let self = this;
    this.renderProList()
  },
  onLoad(options) {
    this.setData({
      couponId: options.id || 134,
      // couponId: 109,
      category: [{
        name: '不限',
        id: '0'
      }].concat(wx.getStorageSync('category'))
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
    this.renderProList({
      page: 1
    });
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
    // let list = this.data.proList;
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
      this.renderProList({
        page: 1,
        column: 'add_time',
        sort: 'desc',
      })

    }
    // 价格降序
    if (index == 1) {
      this.renderProList({
        page: 1,
        column: 'price',
        sort: 'desc',
      })
    }
    //价格升序
    if (index == 2) {
      this.renderProList({
        page: 1,
        column: 'price',
        sort: 'asc',
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
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      this.setData({
        showComprehensive: !this.data.showComprehensive
      })
    }
    if (id == 3) { //点击价格
      let params = this.data.params;
      this.renderProList({
        page: 1,
        column: 'price',
        sort: (params.column == 'price' && params.sort == 'asc') ? 'desc' : 'asc',
      })
    }
    // 点击销量
    if (id == 2) {
      let params = this.data.params;
      this.renderProList({
        page: 1,
        column: 'sales',
        sort: (params.column == 'sales' && params.sort == 'desc') ? 'asc' : 'desc',
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
  // 重置
  chongzhi() {
    this.setData({
      priceStart: '',
      priceEnd: '',
      categoryId: 0,
    })
  },
  mask() {
    this.setData({
      showScreening: 3,
      catchtouchmove: false
    })
  },
  // 确定
  bindScreening(e) {
    let params = {
      page: 1
    };
    if (this.data.priceStart) params.start_price = this.data.priceStart;
    if (this.data.priceEnd) params.end_price = this.data.priceEnd;
    if (this.data.categoryId != 0) params.category_id = this.data.categoryId;
    this.renderProList(params)

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

  selectCategory(e) {
    this.setData({
      categoryId: e.target.dataset.id,
    })
  },

  // 商品列表数据
  shopList(ids) {
    // let id = this.data.imgUrls[0].id
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      params: {
        ids: ids,
        page: 1,
      }
    })

  },
  //选中点击
  selectItem(e) {
    let index = e.target.dataset.index;

    let proList = this.data.proList;
    let selectIds = this.data.selectIds;
    let idSearch = selectIds.indexOf(proList[index].goods_id);
    let skuMap = this.data.skuMap;
    let coupon = this.data.coupon;
    if (proList[index].is_select) {
      proList[index].is_select = false;
      if (idSearch != -1) selectIds.splice(idSearch, 1);
    } else {
      proList[index].is_select = true;
      selectIds.push(proList[index].goods_id);
      skuMap[proList[index].goods_id] = skuMap[proList[index].goods_id] || proList[index];
    }
    let totp = 0;

    for (let id of selectIds) {
      totp += parseFloat(skuMap[id].price);
    }
    let couponText = "";
    // 满减 
    if (coupon.minimum) {
      if (totp >= parseFloat(coupon.minimum)) {
        couponText = "已满足优惠条件，下单使用该券可立减" + coupon.discount + "元";
      } else {
        couponText = "还差" + (parseFloat(coupon.minimum) - parseFloat(totp.toFixed(2))).toFixed(2) + "可立减" + coupon.discount + "元";
      }
    } else if (false) {}
    this.setData({
      proList: proList,
      selectIds: selectIds,
      skuMap: skuMap,
      totalMoney: totp.toFixed(2),
      couponText: couponText
    })
  },
  // 点击搜索 去搜索页面
  gosearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  go_cart(e) {
    if (!this.data.selectIds.length) return;
    let goods_sku_id = [];
    for (let item of this.data.selectIds) {
      goods_sku_id.push(this.data.skuMap[item].goods_sku_id)
    }

    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id: wx.getStorageSync('shop_id'),
        goods_sku_id: goods_sku_id,
        num: this.data.selectIds.length
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(3)
        console.log(res.data)
        if (res.data.code == 200) {
          //添加成功
          wx.switchTab({
            url: '/pages/cart/cart'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })

        }
      }
    })
  },
})