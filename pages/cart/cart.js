const app = getApp()
let url = require('../../utils/config.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    edit_finish: true,
    car_list: null,
    formatdata: [],
    is_selection: false, //是否是选中状态
    all_selection: false, //是否是当前店铺商品的权限状态
    allSlection: false, //是否是所有商品的选择状态
    all: true, //是否所有的商品店铺    
    totalMoney: '0.00', // 金额总计
    totalCount: 0, // 结算商品数量总和
    ids: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log()
    this.a()
    this.car_list()
  },
  onShow: function (options) {
    this.car_list()
  },
  // 点击购物车列表 内容 去商品详情页面
  godetails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/details/details?id=' + id,
    })

  },
  // 点击编辑完成切换
  edit_finish() {
    this.setData({
      edit_finish: !this.data.edit_finish,
    })
  },
  // 购物车列表数据
  car_list() {
    wx.request({
      url: url.api + `/ucs/v1/cart/list`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        let totalMoney = res.data.amount_total
        let car_list = res.data.data;
        if (car_list.length <= 0) {
          this.setData({
            car_list: null
          })
          return
        }
        let ids = [];
        let totalCount=0;
        car_list.map((item, index) => {
          item.goods.map((item1, index1) => {
            if (!item1.is_del) {
              // console.log(777)
              ids.push(item1.id)
            }
            if (!Number(item1.selected)) {
              // console.log(666)
              item.all_select = 0;
            }
            if (Number(item1.selected)){
              totalCount++
            }
          })
        }),
          console.log(totalCount)
        this.setData({
          car_list,
          totalMoney,
          ids,
          totalCount
        })
          console.log(car_list)
        var num = 0
        car_list.map(item => {
          if (item.all_select) {
            ++num
          }
          if (num == car_list.length) {
            console.log('全选')
            this.setData({
              all: true,
            })
            return
          } else {
            this.setData({
              all: false,
            })
          }
        })
        console.log(this.data.car_list)
      }
    })
  },

  // 填写购物数量
  inputChangeHandle: function (e) {
    var num = e.detail.value; //通过这个传递数据
    let index1 = e.currentTarget.dataset.index[0];
    let index = e.currentTarget.dataset.index[1];
    let car_list = this.data.car_list;
    car_list[index1].goods[index].num = num;
    let shop_id = car_list[index1].goods[0].shop_id
    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id,
        goods_sku_id: car_list[index1].goods[index].goods_sku_id,
        num,
        is_enter: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.code == 429) {
          wx.showToast({
            title: res.data.error,
          })
          return
        }
        if (res.data.code == 5) {
          // let car_list1 = this.data.car_list;
          // console.log(car_list1)
          // //  更新数据
          // this.setData({
          //   car_list: car_list1
          // })
          wx.showToast({
            title: '库存不足',
            icon: 'none'
          })
        }
        // 刷新购物车列表
        this.car_list()
      }
    })
  },
  add(e) {
    let index1 = e.currentTarget.dataset.index[0];
    let index = e.currentTarget.dataset.index[1];
    let car_list = this.data.car_list;
    let shop_id = car_list[index1].goods[index].shop_id
    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id,
        goods_sku_id: car_list[index1].goods[index].goods_sku_id,
        num: 1
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 429) {
          wx.showToast({
            title: res.data.error,
          })
          return
        }
        //购物车金额总计
        if (res.data.code == 200) {
          car_list[index1].goods[index].num++;
          this.setData({
            car_list,
          })
        } else {
          wx.showToast({
            title: '库存不足',
            icon: 'none'
          })
        }
        // 刷新购物车列表
        this.car_list()
      }
    })
  },
  reduce(e) {
    let index1 = e.currentTarget.dataset.index[0];
    let index = e.currentTarget.dataset.index[1];
    let car_list = this.data.car_list;
    let shop_id = car_list[index1].goods[index].shop_id
    car_list[index1].goods[index].num > 1 ? car_list[index1].goods[index].num-- : 1
    // this.setData({
    //   car_list
    // })
    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id,
        goods_sku_id: car_list[index1].goods[index].goods_sku_id,
        num: -1
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token,
        "Accept": 'application/json'
      },
      success: (res) => {
        // 刷新购物车列表
        this.car_list()
      }
    })
  },
  // 切换选中状态
  is_selection(e) {
    console.log(e)
    let index1 = e.currentTarget.dataset.index[0];
    let index = e.currentTarget.dataset.index[1];
    let car_list = this.data.car_list;
    let id = car_list[index1].goods[index].id;
    console.log(id);
    if (this.data.car_list[index1].goods[index].selected=='0') {
      wx.request({
        url: url.api + `/ucs/v1/cart/selected/${id}`, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'  
        },
        success: (res) => {
          console.log(res.data)
          // 刷新购物车列表
          this.car_list()
        }
      })
    } else {
      wx.request({
        url: url.api + `/ucs/v1/cart/unselected/${id}`, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'
        },
        success: (res) => {
          console.log(res.data)
          // 刷新购物车列表
          this.car_list()
        }
      })
    }
  },
  //店铺是否全选接口对接
  all_selection(e) {
    let index = e.currentTarget.dataset.index;
    let car_list = this.data.car_list;
    let supplier_id = car_list[index].supplier.supplier_id
    // 店铺ID
    let shop_id = car_list[index].goods[0].shop_id;
    car_list[index].all_select = !car_list[index].all_select
    if (car_list[index].all_select) {
      car_list[index].goods.map(item => {
        item.selected = 1
      })
    } else {
      car_list[index].goods.map(item => {
        item.selected = 0
      })
    }

    if (car_list[index].all_select) {
      wx.request({
        url: url.api + '/ucs/v1/cart/selected/all?shop_id=' + shop_id + '&supplier_id=' + supplier_id, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'
        },
        success: (res) => {
          // 刷新购物车列表
          this.car_list()
        }
      })
    } else {
      wx.request({
        url: url.api + '/ucs/v1/cart/unselected/all?shop_id=' + shop_id + '&supplier_id=' + supplier_id, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'
        },
        success: (res) => {
          // 刷新购物车列表
          this.car_list()
        }
      })
    }

  },
  //全选
  all() {
    if (!this.data.all) {
      wx.request({
        url: url.api + `/ucs/v1/cart/selected/all`, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'
        },
        success: (res) => {
          console.log(res.data)
          // 刷新购物车列表
          this.car_list()
        }
      })
    } else {
      wx.request({
        url: url.api + `/ucs/v1/cart/unselected/all`, // 仅为示例，并非真实的接口地址
        method: "put",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token,
          "Accept": 'application/json'
        },
        success: (res) => {
          console.log(res.data)
          // 刷新购物车列表
          this.car_list()
        }
      })
    }
  },
  // 删除
  car_delete() {
    let car_list = this.data.car_list;
    //删除商品ids=[];
    let ids = [];
    console.log(car_list)
    car_list.map((item, index) => {
      item.goods.map((item1, index1) => {
        console.log(item1)
        if (item1.selected == true) {
          ids.push(item1.id)
        }
      })
    })
    // 删除商品的数量
    let shopNum = ids.length
    // 判断这个删除的数量大一0的时候才让它删除
    if (shopNum > 0) {
      wx.showModal({
        title: '提示',
        content: `确定要删除这${shopNum}件商品吗`,
        success: (res) => {
          if (res.confirm) {
            wx.request({
              url: url.api + `/ucs/v1/cart`, // 仅为示例，并非真实的接口地址
              data: {
                ids: ids
              },
              method: "delete",
              header: {
                'content-type': 'application/json', // 默认值
                "Authorization": app.token,
                "Accept": 'application/json'
              },
              success: (res) => {
                console.log(res.data)
                // 刷新购物车列表
                this.car_list()
              }
            })
          } else {
            console.log('用户点击取消')
          }
        }
      })
    }

  },
  // 事件截档
  stop() {
    console.log('阻止事件冒泡')
  },
  // 点击立即购买去 订单页面
  goconfirmorder() {
    let list = this.data.car_list;
    let ids = [];
    list.map((item, index) => {
      item.goods.map((item1, index1) => {
        console.log(item1)
        if (!item1.is_del) {
          if (item1.selected == 1) {
            ids.push(item1.id)
          }
        }

      })
    })
    console.log(list, ids)
    if (ids.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/confirmorder/confirmorder?ids=' + ids
      })
    }
  },
  a() {
    wx.showLoading({
      title: '加载中...',
      duration: 1000,
    })

  }
})