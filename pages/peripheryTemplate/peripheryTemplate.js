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
    mername: null,
    domesticationDate: '',
    grain_price: null,
    submit: true,
    submit1: true,
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
    date: null, //选择时间
    gt: '>',
    lt: '<',
    nowDay: '',
    region: ['湖南省', '长沙市', '天心区'],
    region1: ['浙江省', '杭州市', '西湖区'],
    istaocan: false,
    activeList: [],
    setmeal: null,
    shopName: '',
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      address: wx.getStorageSync("address"),
      service_id: options.service_id,
      mername: options.mername,
      isrebook: options.isrebook ? options.isrebook : 0,
      checkAddress: wx.getStorageSync('checkAddress')
    })
    // 选择宠物
    // this.pet_list()
    this.initDate();
    var myDate = new Date();
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
      title: options.mername //页面标题为路由参数
    })

  },
  onShow: function(options) {
    if (wx.getStorageSync('ISedit')) {
      this.pet_list();
      wx.setStorageSync('ISedit', 0)
    }
  },
  input1(e) {
    this.setData({
      input1: e.detail.value
    })
    console.log(this.data.input1)
  },
  input2(e) {
    this.setData({
      input2: e.detail.value
    })
    console.log(this.data.input2)
  },
  input3(e) {
    this.setData({
      input3: e.detail.value
    })
    console.log(this.data.input3)
  },
  input4(e) {
    this.setData({
      input4: e.detail.value
    })
    console.log(this.data.input4)
  },
  input5(e) {
    this.setData({
      input5: e.detail.value
    })
    console.log(this.data.input5)
  },
  input6(e) {
    this.setData({
      input6: e.detail.value
    })
    console.log(this.data.input6)
  },
  // 寄出人地址
  bindRegionChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //收宠地址
  bindRegionChange1: function(e) {
    console.log(e)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region1: e.detail.value
    })
  },
  stopPageScroll: function() {
    return
  },
  //  托运表单
  formSubmit(e) {
    console.log(e)
  },
  //放大图片
  bigimage(e) {
    console.log(e, 222)
    let src = e.currentTarget.dataset.src;
    let setmeal = this.data.setmeal;
    let indexI = this.data.indexI;
    let allsrc = [];
    setmeal[indexI].imag.map(item => {
      allsrc.push(item.img_key.full_img_url)
    })
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: allsrc // 需要预览的图片http链接列表
    })
  },
  // 托运选择地址 地图
  goMap() {
    wx.chooseLocation({
      success: res => {
        console.log(res)
        let mailingAddress = res;
        this.setData({
          mailingAddress
        })
      }
    })
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
    // wx.showLoading({
    //   title: '加载中...',
    // })
    var parameter = 'auto';
    if (this.data.mername == '托运') {
      var parameter = 'convey';
    }
    console.log(this.data.pet_list[this.data.index].id)
    console.log(this.data.service_id)
    console.log(wx.getStorageSync('shop_info').lon)
    console.log(wx.getStorageSync('shop_info').lat)
    console.log(wx.getStorageSync('shop_info').city)
    console.log(wx.getStorageSync('shop_info').province)
    wx.request({
      url: url.api + `/ucs/v1/service/${parameter}/match`, // 仅为示例，并非真实的接口地址
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
              remind: true
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
        if (this.data.mername =="殡葬"){
          this.funeral()
        }
       
        // wx.hideLoading()
      }
    })
  },
  // 点击跳转到确认订单页面
  goorder(e) {
    wx.setStorageSync('dis_img', this.data.setmeal[this.data.indexI].service[0].img)
    var bb = "periphery";
    if (this.data.mername == "托运") {
      var bb = "bath/add"
      if (!this.data.input1) {
        wx.showToast({
          title: '请输入寄宠人姓名',
          icon: 'none'
        })
        return
      } else if (!this.data.input2) {
        wx.showToast({
          title: '请输入寄宠人联系电话',
          icon: 'none'
        })
        return
      } else if (!this.data.input3) {
        wx.showToast({
          title: '请输入寄宠人详细地址',
          icon: 'none'
        })
        return
      } else if (!this.data.input4) {
        wx.showToast({
          title: '请输入收宠人姓名',
          icon: 'none'
        })
        return
      } else if (!this.data.input5) {
        wx.showToast({
          title: '请输入收宠人联系电话',
          icon: 'none'
        })
        return
      } else if (!this.data.input6) {
        wx.showToast({
          title: '请输入收宠人详细地址',
          icon: 'none'
        })
        return
      }
      let input1 = this.data.input1; //寄宠人姓名
      let input2 = this.data.input2; //寄宠人电话号码
      let input3 = this.data.input3; //寄宠人详细地址
      let input4 = this.data.input4; //收宠人姓名
      let input5 = this.data.input5; //收宠人电话号码
      let input6 = this.data.input6; //收宠人详细地址
      let region = this.data.region;
      let region1 = this.data.region1;
      if (!(/^1[34578]\d{9}$/.test(this.data.input2))) {
        wx.showToast({
          title: '寄宠人联系电话格式不正确',
          icon: 'none'
        })
        return
      } else if (!(/^1[34578]\d{9}$/.test(this.data.input5))) {
        wx.showToast({
          title: '收宠人联系电话格式不正确',
          icon: 'none'
        })
        return
      }
      let completeAddress = region[0] + region[1] + region[2] + input3 //寄宠人完整地址；
      let completeAddress1 = region1[0] + region1[1] + region1[2] + input6 //收宠人完整地址；
      // let data = {
      //   convey_product_id: this.data.setmeal[this.data.indexI].id, //托运产品id
      //   sender_name: input1, //	寄件人姓名
      //   sender_mobile: input2, //寄件人电话
      //   sender_address: completeAddress, //寄件人地址
      //   recipient_name: input4, //收件人姓名
      //   recipient_mobile: input5, //收件人电话
      //   recipient_address: completeAddress1, //收件人地址
      // }
      console.log(this.data.setmeal[this.data.indexI].service[0].img)
      wx.request({
        url: url.api + `/ucs/v1/service/convey/address`, // 仅为示例，并非真实的接口地址
        data: {
          convey_product_id: this.data.setmeal[this.data.indexI].id, //托运产品id
          sender_name: input1, //	寄件人姓名
          sender_mobile: input2, //寄件人电话
          sender_address: completeAddress, //寄件人地址
          recipient_name: input4, //收件人姓名
          recipient_mobile: input5, //收件人电话
          recipient_address: completeAddress1, //收件人地址
        },
        method: "post",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res)
          if (res.data.code == 200) {
            let checkAddress=res.data.data
            wx.setStorageSync('checkAddress', checkAddress);
            // wx.setStorageSync('checkAddress', checkAddress)
          }
        }
      }) 
    }
    if (!this.data.submit) {
      this.setData({
        submit1: false
      })
      setTimeout(res => {
        this.setData({
          submit1: true
        })
      }, 3000)
      return
    }
    // 判断有没有选择宠物
    if (!this.data.domesticationDate) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
      return
    }
     
    let price = this.data.setmeal[this.data.indexI].wholesale_price ? this.data.setmeal[this.data.indexI].wholesale_price : this.data.setmeal[this.data.indexI].grain_price ? this.data.setmeal[this.data.indexI].grain_price :this.data.setmeal[this.data.indexI].price;
    console.log(this.data.setmeal[this.data.indexI].wholesale_price, this.data.setmeal[this.data.indexI].retail_price)
   var retail_price = this.data.setmeal[this.data.indexI].retail_price
  //  判断是不是殡葬 
    if (this.data.service_id=='6'){
       retail_price = (this.data.setmeal[this.data.indexI].wholesale_price * this.data.setmeal[this.data.indexI].retail_price) / 100 
    }
     

    wx.navigateTo({
      url: '/pages/order/order?price=' + price + '&service_id=' + this.data.service_id + '&date_time=' + this.data.date + '&member_pets_id=' + this.data.pet_list[this.data.index].id + '&service_product_id=' + this.data.setmeal[this.data.indexI].id + '&exes=' + ['bath/expenses11', bb, 'bath/store'] + '&name=' + this.data.pet_list[this.data.index].name + '&weight=' + this.data.pet_list[this.data.index].weight + '&specs=' + this.data.pet_list[this.data.index].specs + '&mername=' + this.data.mername + '&member_name=' + wx.getStorageSync('shop_info').name + '&is_distribution=' + this.data.is_distribution + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id + '&wholesale_price=' + this.data.setmeal[this.data.indexI].wholesale_price + '&retail_price=' + retail_price + '&service_specs_id=' + this.data.setmeal[this.data.indexI].specs_id + '&grain_price=' + this.data.setmeal[this.data.indexI].grain_price +'&price1='+ this.data.setmeal[this.data.indexI].price
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
    for (let i = (prevDatMax - Math.abs(1 - startWeek) + 1); i <= prevDatMax; i++) {
      dayList.push({ day: '111', month: prevMonth })
    }
    // //当前展示月份天数
    for (let i = 1; i <= dayMax; i++) {
      dayList.push({
        day: i,
        month,
      })
    }
    let domesticationDate = this.data.domesticationDate
    // dayList.forEach(Ditem => {
    //   if (Ditem.day == nowDay && Ditem.month == month) {
    //     Ditem.residue = "选择";
    //     domesticationDate = Ditem.month + '.' + Ditem.day
    //   }
    // })
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
  getDay(e, year) {
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
    dayList[index].residue = '选择';
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
  },
  //  点击导航
  gomap() {
    let shop = wx.getStorageSync("shop")[0];
    let lat = shop.lat; //经度
    let lon = shop.lon; //纬度
    let name = shop.name
    wx.getLocation({ //获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function(res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(lat), //要去的纬度-地址
          longitude: Number(lon), //要去的经度-地址
          name: name,
          address: name
        })
      }
    })
  },
  // 殡葬服务费用计算
  funeral(){
    wx.request({
      url: url.api + `/ucs/v1/service/funeral/cost`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        wholesale_price: this.data.setmeal[this.data.indexI].wholesale_price,
        retail_price: this.data.setmeal[this.data.indexI].retail_price,
        base_weight: this.data.setmeal[this.data.indexI].base_weight,
        each_charge: this.data.setmeal[this.data.indexI].each_charge,
        pet_id: this.data.pet_list[this.data.index].id
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        let setmeal = this.data.setmeal;
        console.log(222, setmeal)
        console.log(res)
        console.log(setmeal[this.data.index])
        if (res.data.code == 200) {
          setmeal[this.data.index].retail_price = res.data.data.retail_price;
          setmeal[this.data.index].wholesale_price = res.data.data.wholesale_price;
          this.setData({
            setmeal
          })
        }  
      }
    })
  }
})