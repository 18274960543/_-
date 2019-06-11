var app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    scroll: [],
    pet_list: [],
    week: [],
    time: [],
    time1: [],
    is_open: false,
    curIndex: 0,
    istrue: true,
    // delicate: null,
    iscolor: false,
    hour: '',
    is_shadow: false,
    is_show: false,
    is_next: false,
    is_varieties: false,
    service_id: '',
    index: 0,
    index1: 0,
    selectDate: null,
    mername: null,
    setmeal: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.pet_list()
    this.getDates()
    let a = '';
    this.order_time(a, options.service_id)
    this.setData({
      service_id: options.service_id,
      mername: options.mername
    })
  },
  onShow() {
    // this.pet_list()
  },
  shadow() {
    this.setData({
      is_shadow: false,
      is_varieties: false
    })
  },
  switchRightTab(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    let week = this.data.week;
    let a = week[index].year + "-" + week[index].month + "-" + week[index].day
    this.order_time(a, this.data.service_id)
    this.setData({
      curIndex: index,
    })
  },
  // 点击更多时间
  show() {
    let time = this.data.time;
    this.setData({
      time1: time,
      istrue: false,
      is_open: true,
    })
  },
  // 点击收起
  hide() {
    let time1 = this.data.time;
    let a = time1.slice(0, 15)
    this.setData({
      time1: a,
      istrue: true,
      is_open: false,
    })
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
    this.setData({
      week: dateArry
    })
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
    return todate;
  },
  // 完善信息同意协议切换
  checklist() {
    this.setData({
      iscolor: !this.data.iscolor
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
  // 默认预约时间接口
  order_time(a, service_id) {
    let b = this.data.week[0].year + '-' + this.data.week[0].month + '-' + this.data.week[0].day
    wx.request({
      url: url.api + `/ucs/v1/service/bath/time`, // 仅为示例，并非真实的接口地址
      data: {
        "store_id": app.member_id,
        "choose_time": a ? 'a' : 'b',
        'service_id': service_id
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        let time = res.data;
        time.map((item) => {
          let judgeDate = a + ' ' + item.date_time + ':00'
          if (this.data.selectDate == judgeDate) {
            item.istime = true
          } else {
            item.istime = false
          }
        })
        let time1 = res.data.slice(0, 15);
        this.setData({
          time: res.data,
          time1
        })
        this.hide()
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
    let time1
    if (this.data.is_open) {
      time1 = time
    } else {
      time1 = time.slice(0, 15)
    }
    this.setData({
      hour: this.data.week[this.data.curIndex].week + time[index].date_time,
      selectDate: this.data.week[this.data.curIndex].year + '-' + this.data.week[this.data.curIndex].month + '-' + this.data.week[this.data.curIndex].day + ' ' + time[index].date_time + ':00',
      time,
      time1
    })
    console.log(this.data.selectDate)
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
  // 点击确定去下一步
  go_next() {
    this.setData({
      // is_next:true,
      is_show: false,
      is_shadow: false,
    })
  },
  // 点击跳转到确认订单页面
  go_confirmorder(e) {
    // 判断有没有选择宠物
    if (!this.data.setmeal) {
      wx.showToast({
        title: '请选择服务宠物',
        icon:'none'
      })
    } else if (!this.data.hour) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?price=' + this.data.setmeal.product[this.data.index].specs[0].price + '&service_id=' + this.data.service_id + '&name=' + this.data.pet_list[this.data.index1].name + '&weight=' + this.data.pet_list[this.data.index1].weight + '&time=' + this.data.hour + '&member_pets_id=' + this.data.pet_list[this.data.index1].id + '&service_specs_id=' + this.data.setmeal.specs.id + '&shop_id=' + this.data.setmeal.product[this.data.index].shop_id + '&date_time=' + this.data.selectDate + '&mername=' + this.data.mername + '&exes=' + ['bath/expenses', 'bath/add', 'bath/store'] + '&specs=' + this.data.pet_list[this.data.index].specs + '&service_product_id=' + this.data.setmeal.product[this.data.index].id
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
    this.setData({
      pet_list,
      index1: index
    })
    console.log(pets_id, name)
    this.showerData(pets_id, name)
    console.log(this.data.pet_list)
  },
  // 点击服务宠物 出现选择套餐
  showerData(pets_id, name) {
    console.log(url.store_id)
    console.log(pets_id)
    console.log(this.data.service_id)
    wx.request({
      url: url.api + `/ucs/v1/service/examination/match`, // 仅为示例，并非真实的接口地址
      data: {
        "shop_id": url.store_id,
        "pets_id": pets_id,
        "service_id": this.data.service_id //服务ID
      },
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data);
        let setmeal = res.data.data;
        if (res.data.code == 200) {
          setmeal.product[0].is_select = true
          this.setData({
            setmeal
          })
          console.log(this.data.setmeal)
        } else {
          wx.showModal({
            content: res.data.message,
            showCancel: false
          })
        }
      }
    })
  },
  // 点击切换套餐
  taocan(e) {
    let index = e.currentTarget.dataset.index;
    let setmeal = this.data.setmeal;
    setmeal.product.map(item => {
      item.is_select = false;
    })
    setmeal.product[index].is_select = true;
    this.setData({
      setmeal,
      index,
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
})