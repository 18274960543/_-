var app = getApp()
let url = require('../../utils/config.js')
let formatTime = require('../../utils/util.js')
let year = new Date().getFullYear()
Page({
  data: {
    scroll: [],
    pet_list: null,
    is_open: false,
    istrue: true,
    iscolor: false,
    hour: '',
    selectDate: '',
    is_shadow: false,
    is_show: false,
    is_next: false,
    is_varieties: false,
    service_id: null,
    index: 0,//当前套餐下标
    index1:0,//当前服务下标
    mername: null,
    domesticationDate: '',
    leaveDate: '',
    grain_price: null,
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
    date:null,//选择时间
    gt: '>',
    lt: '<',
    nowDay: '',
    istaocan: false,
    activeList: [],
    setmeal:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initDate();
    this.notTime(options.service_id);
    // this.showDate();
    console.log(this.data.dayList)
    //this.requestData();
    console.log(options)
    // this.fostershijian()
    this.pet_list()
    var myDate = new Date();
    this.setData({
      service_id: options.service_id,
      mername: options.mername,
    })
  },
  onShow() {
    // this.pet_list()
  },
  // 选择服务的宠物列表接口数据
  pet_list() {
    // wx.showLoading({
    //   title: '加载中...',
    // })
    wx.request({
      url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          let pet_list = res.data.data;
          pet_list.map((item) => {
            item.is_select = false
          })
          // 默认选择宠物服务
          // pet_list[0].is_select=true;
          // let pets_id = pet_list[0].id;
          // this.setMeal(pets_id)
          this.setData({
            pet_list: pet_list
          })
          // setTimeout(function() {
          //   wx.hideLoading()
          // }, 500)
        } else {
          wx.showToast({
            title: '请添加宠物',
            icon: 'none',
            duration: 2000
          })
        }
        //console.log(this.data.pet_list)
      }
    })
  },
  // 点击洗护项目显示影藏弹框
  is_show() {
    this.setData({
      is_show: true,
      is_shadow: true
    })
  },
  ishide() {
    this.setData({
      is_show: false,
      is_shadow: false,

    })
  },
  shadow() {
    this.setData({
      is_show: false,
      is_shadow: false,
      is_varieties: false
    })
  },
  // 点击跳转到确认订单页面
  go_confirmorder(e) {
    // 如果没有选择宠物 需要用户选择宠物
    if (!this.data.setmeal) {
      wx.showToast({
        title: '请选择服务宠物',
        icon: 'none',
        duration: 1500,
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?price=' + this.data.setmeal[this.data.index].wholesale_price + '&service_id=' + this.data.service_id + '&date_time=' + this.data.date + '&member_pets_id=' + this.data.pet_list[this.data.index1].id + '&service_product_id=' + this.data.setmeal[this.data.index].id + '&exes=' + ['bath/expenses', 'bath/add', 'bath/store'] + '&name=' + this.data.pet_list[this.data.index1].name + '&weight=' + this.data.pet_list[this.data.index1].weight + '&specs=' + this.data.pet_list[this.data.index1].specs + '&mername=' + this.data.mername + '&member_name=' + wx.getStorageSync('shop_info').name + '&shop_id=' + this.data.setmeal[this.data.index].shop_id
      })
    }
  },
  //选择服务的宠物  
  is_select(e) {
    let index1 = e.currentTarget.dataset.index;
    let pet_list = this.data.pet_list;
    let pets_id = pet_list[index1].id;
    pet_list.map((item) => {
      item.is_select = false
    })
    let name = pet_list[index1].name
    pet_list[index1].is_select = !this.data.pet_list[index1].is_select;
    this.setData({
      pet_list,
      index1
    })
    console.log(pet_list)
    // console.log(pets_id, name)
    this.setMeal(pets_id, name)
    // console.log(this.data.pet_list)
  },
  // 点击服务宠物 出现套餐
  setMeal(pets_id, name) {
    console.log(pets_id)
    console.log(this.data.service_id)
    wx.request({
      url: url.api + `/ucs/v1/service/tame/match`, // 仅为示例，并非真实的接口地址
      data: {
        "shop_id": url.store_id,
        "pets_id": pets_id,
        "service_id": this.data.service_id
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res.data);
          let setmeal = res.data.data;
          setmeal[0].is_select = true
          this.setData({
            setmeal
          })
         
        } else {
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        }
      }
    })
  },
  // 添加宠物
  addPets() {
    this.setData({
      is_next: false,
      is_shadow: true,
      is_varieties: true
    })
  },
  // 点击去选择宠物信息
  go_petinformation(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/petinformation/petinformation?id=' + id,
    })
    this.setData({
      is_shadow: false,
      is_varieties: false
    })
  },
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
    console.log(dayList)
    this.setData({
      dayList,
      prevMonth,
      domesticationDate
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
  getDay(e, year) {
    console.log(e)
    let day = e.currentTarget.dataset.day;
    if (e.currentTarget.dataset.residue1=='满'){
      wx.showToast({
        title: '当天不可预约',
        icon:'none'
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
    let date_time = new Date().getFullYear() + '-' + month + '-' + day;
    let setmeal = this.data.setmeal;
  // 如果没有选择服务 请用户点击服务
    if (!setmeal) {
      wx.showToast({
        title: '请选择服务',
        icon: 'none'
      })
      return
    }
    let index1 = this.data.index
    // 获取套餐的天数
    let dataNum = setmeal[index1].tame_days;
    var date1 = new Date(date);
    var date2 = new Date(date1);
    console.log(date1,date2)
    date2.setDate(date1.getDate() + dataNum);
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
  // 点击切换套餐
  taocan(e) {
    let index = e.currentTarget.dataset.index;
    let setmeal = this.data.setmeal;
    setmeal.map(item => {
      item.is_select = false;
    })
    setmeal[index].is_select = true;
    console.log(setmeal[index])
    this.setData({
      setmeal,
      index,
      
    })
  },
  PrefixInteger(num) {
    return (Array(2).join('0') + num).slice(-2);
  },
  // 驯养不可预约的时间
  notTime(service_id) {
    wx.request({
      url: url.api + `/ucs/v1/service/escrow/disable`, // 仅为示例，并非真实的接口地址
      data: {
        "shop_id": url.store_id,
        "service_type": service_id
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res)
        if (res.statusCode== 200) {
          let activeList = res.data;
          let dayList = this.data.dayList
          dayList.forEach(Ditem => {
            //console.log(2)
            let year = new Date().getFullYear();
            let a = this.PrefixInteger(Ditem.day);
            let b = this.PrefixInteger(Ditem.month)
            const dates = `${year}-${b}-${a}`;
            activeList.forEach(Aitem => {
              if (dates === Aitem.forbid) {
                Ditem.residue1 = "满"
              }
            })
          })
          // console.log(dayList)
          this.setData({
            dayList
          })
        }
      }
    })
  }
})