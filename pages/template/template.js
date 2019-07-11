var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    maskstate: true,
    is_select: true,
    week: [],
    time: [],
    curIndex: 0,
    index: 0,
    indexI: 0,
    address: '',
    selectiontime: true,
    selectDate: '',
    is_varieties: true,
    choosingpets: '',
    submit: true,
    remind: false,
  },  
  onLoad: function (options) {
    console.log(options)
    this.getDates()
    //初始化数据
    // this.initialization()
    let a = '';
    // 获取时间 洗澡 美容等
    this.order_time(a, options.service_id)
    this.setData({
      address: wx.getStorageSync("address"),
      service_id: options.service_id,
      mername: options.mername,
      isrebook: options.isrebook ? options.isrebook : 0
    })
    // 判断是不是改签过来的页面
    if (options.isrebook) {
      this.setData({
        selectiontime: false,
        rebook: options
      })
    } else {
      console.log('寄养')
      this.pet_list()
    }
    wx.setNavigationBarTitle({
      title: options.mername//页面标题为路由参数
    })
  },
  onShow: function (options) {
    if (wx.getStorageSync('ISedit')){
      this.pet_list();
      wx.setStorageSync('ISedit', 0)
    }
  },
  stopPageScroll: function () {
    return
  },
  // 点击遮罩层 遮罩层消失  弹框消失
  mask() {
    if (this.data.isrebook) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.setData({
        maskstate: true,
        selectiontime: true,
        is_varieties: true
      })
    }
  },
  // 点击选择宠物 
  choosingpets() {
    this.setData({
      maskstate: false
    })
  },
  // 选择宠物确定
  determine() {
    let pet_list = this.data.pet_list
    let choosingpets = pet_list[this.data.index].name + " " + pet_list[this.data.index].specs
    this.setData({
      maskstate: true,
      choosingpets
    })
  },
  // 选择时间
  selectiontime() {
    this.setData({
      selectiontime: false
    })
  },

  // 选择时间消失
  selectiontimeDisappear() {
    // 冲改签过来的 返回改签页面
    if (this.data.isrebook) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      this.setData({
        selectiontime: true
      })
    }
  },
  //选择服务的宠物
  is_select(e) {
    let index = e.currentTarget.dataset.index;
    let pet_list = this.data.pet_list;
    let pets_id = pet_list[index].id;
    pet_list.map((item) => {
      item.is_select = false
    })
    let name = pet_list[index].name
    pet_list[index].is_select = !this.data.pet_list[index].is_select;
    let choosingpets = pet_list[index].name + " " + pet_list[index].specs
    this.initialization(pets_id)
    this.setData({
      pet_list,
      index,
      choosingpets,
      maskstate: true,
    })
    console.log(pets_id, name)
    // this.showerData(pets_id, name)
    console.log(this.data.pet_list)
  },
  // 添加宠物
  addPets() {
    this.setData({
      is_varieties: false,
      maskstate: true
    })
  },
  // 点击去选择宠物信息
  go_petinformation(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/petinformation/petinformation?id=' + id,
    })
    this.setData({
      is_varieties: true
    })
  },
  // 选择服务的宠物列表接口数据
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
        pet_list[this.data.index].is_select = true;

        this.setData({
          pet_list: pet_list
        })
        this.initialization()
        console.log(this.data.pet_list)
      }
    })
  },
  // 洗澡 美容 、、
  switchRightTab(e) {
    console.log(e)
    let index = parseInt(e.currentTarget.dataset.index);
    let week = this.data.week;
    let a = week[index].year + "-" + week[index].month + "-" + week[index].day;
    console.log(a)
    // 预约时间切换
    // console.log(index)
    this.order_time(a, this.data.service_id)
    this.setData({
      curIndex: index,
    })
  },
  //时间确定
  timeSure() {
    if (this.data.isrebook) {
      this.rebook()
    } else {
      this.setData({
        selectiontime: true
      })
    }

  },
  // 日期
  getDates: function () {
    let todate = this.getCurrentMonthFirst()
    //console.log(todate);
    var dateArry = [];
    for (var i = 0; i < 7; i++) {
      var dateObj = this.dateLater(todate, i);
      dateArry.push(dateObj)
    }
    //console.log(dateArry);
    this.setData({
      week: dateArry
    })
    // console.log(this.data.week)
    return dateArry;
  },
  dateLater: function (dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    if (later == 0) {
      dateObj.week = '今天';
    } else if (later == 1) {
      dateObj.week = '明天';
    } else if (later == 2) {
      dateObj.week = '后天';
    }
    return dateObj;
  },
  getCurrentMonthFirst: function () {
    var date = new Date();
    var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    //console.log(todate);
    return todate;
  },
  // 默认预约时间接口
  order_time(a, service_id) {
    console.log(service_id)
    console.log(a)
    let b = this.data.week[0].year + '-' + this.data.week[0].month + '-' + this.data.week[0].day
    console.log(b)
    wx.request({
      url: url.api + `/ucs/v1/service/bath/time`, // 仅为示例，并非真实的接口地址
      data: {
        "shop_id": url.store_id,
        "choose_time": a ? a : b,
        'service_id': service_id
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data);
        let time = res.data;
        time.map((item) => {
          let judgeDate = a + ' ' + item.date_time + ':00'
          //  console.log(judgeDate)
          if (this.data.selectDate == judgeDate) {
            item.istime = true
          } else {
            item.istime = false
          }
        })
        this.setData({
          time: res.data,
        })
      }
    })
  },
  // 选择预约时间
  select_time(e) {
    // 当前可预约下标
    let index = e.currentTarget.dataset.index;
    let time = this.data.time;
    time.map((item) => {
      item.istime = false
    })
    time[index].istime = !this.data.time[index].istime;
    // console.log(this.data.week[this.data.curIndex])
    this.setData({
      hour: this.data.week[this.data.curIndex].week + time[index].date_time,
      selectDate: this.data.week[this.data.curIndex].year + '-' + this.data.week[this.data.curIndex].month + '-' + this.data.week[this.data.curIndex].day + ' ' + time[index].date_time + ':00',
      time,
    })
    // console.log(this.data.hour)
    console.log(this.data.selectDate)
  },
  // 套餐切换
  setmeal(e) {
    let index = e.currentTarget.dataset.index
    let setmeal = this.data.setmeal;
    setmeal.map(item => {
      item.is_select = false
    })
    setmeal[index].is_select = true
    this.setData({
      setmeal,
      indexI: index
    })
  },
  // 会员宠物智能匹配规格自动匹配对应附近最优门店的服务规格产品列表
  initialization(pets_id) {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    console.log(this.data.pet_list[this.data.index].id)
    console.log(this.data.service_id)
    console.log(wx.getStorageSync('shop_info').lon)
    console.log(wx.getStorageSync('shop_info').lat)
    console.log(wx.getStorageSync('shop_info').city)
    console.log(wx.getStorageSync('shop_info').province)
    console.log(wx.getStorageSync('shop_info').province)
    console.log(url.store_id)
    wx.request({
      url: url.api + `/ucs/v1/service/auto/match`, // 仅为示例，并非真实的接口地址
      data: {
        'shop_id': url.store_id,
        'service_id': this.data.service_id,
        'lon': wx.getStorageSync('shop_info').lon,
        'lat': wx.getStorageSync('shop_info').lat,
        'city': wx.getStorageSync('shop_info').city,
        'province': wx.getStorageSync('shop_info').province,
        'pets_id': pets_id ? pets_id : this.data.pet_list[this.data.index].id
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data)
        if (res.data.code == 200) {
          this.setData({
            submit: true
          })
          let setmeal = res.data.data;
          //设置店铺name
          this.setData({
            shopName: setmeal[0].shop_name
          })
          setmeal.map(item => {
            item.is_select = false
            if (item.price) {
              item.wholesale_price = ''
            }
            if (item.wholesale_price) {
              item.price = ''
            }
          })
          setmeal[this.data.indexI].is_select = true;
             wx.setStorageSync('shop', setmeal[0].shop)
            wx.setStorageSync('setmeal', setmeal[this.data.indexI])
          // 判断是不是分销订单  返回的shop_id 和用户进来的店铺shop_id是不是相等
          if (setmeal[0].shop_id != wx.getStorageSync('shop_id')) {
            this.setData({
              is_distribution: 1,
              shop_id: setmeal[0].shop_id,
              remind: true
            })
            setTimeout(res => {
              this.setData({
                remind: false
              })
            }, 10000)
            console.log(this.data.is_distribution);
          
          } else {
            wx.setStorageSync('shop', setmeal[0].shop)
            wx.setStorageSync('setmeal', setmeal[this.data.indexI])
            this.setData({
              is_distribution: 0,
              shop_id: ''
            })
          }
          this.setData({
            setmeal
          })
          // wx.setStorageSync('shop_id', res.data.data[0].shop[0].id)
          // url.store_id = res.data.data[0].shop[0].id
        } else {
          wx.showModal({
            content: '区域内无此服务可供匹配',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          this.setData({
            submit: false
          })
        }
        // wx.hideLoading()
      }
    })
  },
  // 点击跳转到确认订单页面
  goorder(e) {
 
    wx.setStorageSync('dis_img', this.data.setmeal[this.data.indexI].service[0].img)
    // 判断有没有选择宠物
    if (!this.data.submit) {
      wx.showToast({
        title: '暂无此宠物规格的服务，请重新选择宠物',
        icon: 'none'
      })
      return
    }
    if (!this.data.selectDate) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    } else {
     
      if (this.data.setmeal[this.data.indexI].price) {
        wx.navigateTo({
          url: '/pages/order/order?price=' + this.data.setmeal[this.data.indexI].price + '&service_id=' + this.data.service_id + '&name=' + this.data.pet_list[this.data.index].name + '&specs=' + this.data.pet_list[this.data.index].specs + '&weight=' + this.data.pet_list[this.data.index].weight + '&time=' + this.data.selectDate + '&member_pets_id=' + this.data.pet_list[this.data.index].id + '&service_specs_id=' + this.data.setmeal[this.data.indexI].specs_id + '&date_time=' + this.data.selectDate + '&mername=' + this.data.mername + '&exes=' + ['bath/expenses', 'bath/add', 'bath/store'] + '&service_product_id=' + this.data.setmeal[this.data.indexI].id + '&is_distribution=' + this.data.is_distribution + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id  + '&price1=' + this.data.setmeal[this.data.indexI].price
        })
      }
      if (this.data.setmeal[this.data.indexI].wholesale_price) {
        wx.navigateTo({
          url: '/pages/order/order?price=' + this.data.setmeal[this.data.indexI].wholesale_price + '&service_id=' + this.data.service_id + '&name=' + this.data.pet_list[this.data.index].name + '&specs=' + this.data.pet_list[this.data.index].specs + '&weight=' + this.data.pet_list[this.data.index].weight + '&time=' + this.data.selectDate + '&member_pets_id=' + this.data.pet_list[this.data.index].id + '&service_specs_id=' + this.data.setmeal[this.data.indexI].specs_id + '&date_time=' + this.data.selectDate + '&mername=' + this.data.mername + '&exes=' + ['bath/expenses', 'bath/add', 'bath/store'] + '&service_product_id=' + this.data.setmeal[this.data.indexI].id + '&is_distribution=' + this.data.is_distribution + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id + '&price1=' + this.data.setmeal[this.data.indexI].price
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  //放大图片
  bigimage(e) {
    let src = e.currentTarget.dataset.src;
    let setmeal = this.data.setmeal;
    let indexI = this.data.indexI;
     let allsrc=[];
    setmeal[indexI].imag.map(item=>{
  
      allsrc.push(item.img_key.full_img_url)
    })
    
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: allsrc// 需要预览的图片http链接列表
    })
  },
  // 改签接口
  rebook() {
    if (!this.data.selectDate) {
      wx.showToast({
        title: '请选择改签时间',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: url.api + `/ucs/v1/service/order/change/time`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        date_time: this.data.selectDate,
        service_id: this.data.rebook.service_id,
        order_id: wx.getStorageSync('rebookdata').id
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.message,
          })
          wx.setStorageSync('rebookTo', 1)
          setTimeout(res => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: none
          })
        }
      }
    })
  },
  //  点击导航
  gomap() {
    let shop = wx.getStorageSync("shop")[0];
    let lat = shop.lat; //经度
    let lon = shop.lon; //纬度
    let name = shop.name
    let address = shop.address
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(lat), //要去的纬度-地址
          longitude: Number(lon), //要去的经度-地址
          name: name,
          address: address
        })
      }
    })
  },
})