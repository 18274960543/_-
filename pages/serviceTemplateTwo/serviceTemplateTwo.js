var app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    maskstate: true,
    is_select: true,
    week: [],
    time: [],
    curIndex: 0,
    index: 0,
    indexI: 0,
    address:'',
    selectiontime: true,
    selectDate: '',
    is_varieties: true,
    choosingpets: '',
    mername: null,
    domesticationDate: '',
    grain_price: null,
    submit: true,
    //计算展示年份
    year: 2019,
    //保存不变的当前年份
    nowYear: 2019,
    //用于计算和展示的月份
    month: 12,
    //保存不变的当前月份
    nowMonth: 12,
    //天数列表,
    dayList: [],
    date: null,//选择时间
    gt: '>',
    lt: '<',
    nowDay: '',
    istaocan: false,
    activeList: [],
    setmeal: null,
    shopName:'',
  },
  onLoad: function (options) {
    console.log(options)
    // 选择宠物
    // this.pet_list()
    this.initDate();
    var myDate = new Date();
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
      this.pet_list()
    }
    wx.setNavigationBarTitle({
      title: options.mername//页面标题为路由参数
    })
    
  },
  onShow: function (options) {
    if (!wx.getStorageSync('rebookdata')) {
      this.pet_list();
      wx.setStorageSync('rebookdata', '')
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
    this.setData({
      pet_list,
      index,
      choosingpets,
      maskstate: true,
    })
    this.initialization(pets_id)
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
    wx.showLoading({
      title: '加载中...',
    })
    console.log(this.data.pet_list[this.data.index].id)
    console.log(this.data.service_id)
    console.log(wx.getStorageSync('shop_info').lon)
    console.log(wx.getStorageSync('shop_info').lat)
    console.log(wx.getStorageSync('shop_info').city)
    console.log(wx.getStorageSync('shop_info').province)
    wx.request({
      url: url.api + `/ucs/v1/service/auto/match`, // 仅为示例，并非真实的接口地址
      data: {
        'shop_id': url.store_id,
        'service_id': this.data.service_id,
        'lon': wx.getStorageSync('shop_info').lon,
        'lat': wx.getStorageSync('shop_info').lat,
        'city': wx.getStorageSync('shop_info').city,
        'province': wx.getStorageSync('shop_info').province,
        'pets_id': pets_id ? pets_id: this.data.pet_list[this.data.index].id
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
          setmeal.map(item => {
            item.is_select = false
          })
          setmeal[this.data.indexI].is_select = true;
          //设置店铺name
          this.setData({
            shopName: setmeal[0].shop_name
          })
          // 判断是不是分销订单  返回的shop_id 和用户进来的店铺shop_id是不是相等
          if (setmeal[0].shop_id != wx.getStorageSync('shop_id')) {
            this.setData({
              is_distribution: 1,
              shop_id: setmeal[0].shop_id,
              remind:true
            })
            console.log(this.data.is_distribution)
            // wx.showToast({
            //   title: '本店铺没有此服务，已为你匹配附近最优店铺服务',
            //   duration: 3000,
            //   icon: 'none'
            // })
            setTimeout(res => {
              this.setData({
                remind: false
              })
            }, 10000)
            wx.setStorageSync('shop', setmeal[0].shop)
            wx.setStorageSync('setmeal', setmeal[this.data.indexI])
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
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
          this.setData({
            submit: false
          })
        }
        wx.hideLoading()
      }
    })
  },
  // 点击跳转到确认订单页面
  goorder(e) {
    if (!this.data.submit) {
      wx.showToast({
        title: '暂无此宠物规格的服务，请重新选择宠物',
        icon: 'none'
      })
      return
    }
    // 判断有没有选择宠物
    if (!this.data.domesticationDate) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?price=' + this.data.setmeal[this.data.indexI].wholesale_price + '&service_id=' + this.data.service_id + '&date_time=' + this.data.date + '&member_pets_id=' + this.data.pet_list[this.data.index].id + '&service_product_id=' + this.data.setmeal[this.data.indexI].id + '&exes=' + ['bath/expenses11', 'periphery', 'bath/store'] + '&name=' + this.data.pet_list[this.data.index].name + '&weight=' + this.data.pet_list[this.data.index].weight + '&specs=' + this.data.pet_list[this.data.index].specs + '&mername=' + this.data.mername + '&member_name=' + wx.getStorageSync('shop_info').name + '&is_distribution=' + this.data.is_distribution + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */

  //初始化日期
  initDate() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const nowDay = new Date().getDate()
    this.setData({
      year,
      month,
      nowDay,
      nowMonth: month,
      nowYear: year,
    })
    this.getDayList(year, month, nowDay)
  },
  //获取天数
  getDayList(year, month, nowDay) {
    //当前显示月份最大天数
    const dayMax = new Date(year, month, 0).getDate()
    //当前月份开始天星期数
    const startWeek = new Date(`${year}-${month}-1`).getDay()
    //当前月份最后一天星期数
    const endWeek = new Date(`${year}-${month}-${dayMax}`).getDay()
    //上一个年份
    const prevYear = month == 1 ? year - 1 : year
    //上一个月份
    const prevMonth = month == 1 ? 12 : month - 1
    //上一个月份最大天数
    let prevDatMax = new Date(prevYear, prevMonth, 0).getDate()
    //天数列表
    let dayList = []
    //每月1号不是星期一时从上一个月补
    // for (let i = (prevDatMax - Math.abs(1 - startWeek) + 1); i <= prevDatMax; i++) {
    //   dayList.push({ day: '', month: prevMonth })
    // }
    //当前展示月份天数
    for (let i = 1; i <= dayMax; i++) {
      dayList.push({
        day: i,
        month,
      })
    }
    let domesticationDate = this.data.domesticationDate
    dayList.forEach(Ditem => {
      if (Ditem.day == nowDay && Ditem.month == month) {
        Ditem.residue = "开始";
        domesticationDate = Ditem.month + '.' + Ditem.day
      }
    })
    // console.log(dayList)
    this.setData({
      dayList,
      prevMonth,
      // domesticationDate
    })
  },
  //下一月
  next() {
    this.data.month += 1
    let month = this.data.month > 12 ? 1 : this.data.month
    let year = this.data.month > 12 ? this.data.year + 1 : this.data.year
    this.getDayList(year, month)
    this.setData({
      year,
      month,
    })
  },
  //上一月
  prev() {
    this.data.month -= 1
    let month = this.data.month < 1 ? 12 : this.data.month
    let year = this.data.month < 1 ? this.data.year - 1 : this.data.year
    this.getDayList(year, month)
    this.setData({
      year,
      month,
    })
  },
  // 点击驯养开始时间
  getDay(e, year){
    console.log(e)
    let day = e.currentTarget.dataset.day;
    if (e.currentTarget.dataset.residue1 == '满') {
      wx.showToast({
        title: '当天不可预约',
        icon: 'none'
      })
      return
    }
    let dayList = this.data.dayList;
    let index = e.currentTarget.dataset.index;
    dayList.map(item => {
      if (item.residue) {
        item.residue = undefined;
      }
    })
    dayList[index].residue = '开始';
    let month = e.currentTarget.dataset.month;
    let domesticationDate = this.data.domesticationDate;
    domesticationDate = month + '.' + day;
    let date = new Date().getFullYear() + '/' + month + '/' + day;
    console.log(date)
    let date_time = new Date().getFullYear() + '-' + month + '-' + day;
     
    let index1 = this.data.index
    // 获取套餐的天数
  
    var date1 = new Date(date);
    var date2 = new Date(date1);
    console.log(date1, date2)
    date2.setDate(date1.getDate());
    let leaveDate = this.data.leaveDate;
    leaveDate = (date2.getMonth() + 1) + "." + date2.getDate()
    console.log((date2.getMonth() + 1), date2.getDate())
    this.setData({
      dayList,
      domesticationDate,
      leaveDate,
      date: date_time
    })
  },
  PrefixInteger(num) {
    return (Array(2).join('0') + num).slice(-2);
  },
  //放大图片
  bigimage(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  // 改签接口
  rebook() {
    if (!this.data.date) {
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
        date_time: this.data.date,
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
  }
})