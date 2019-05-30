var app = getApp()
let url = require('../../utils/config.js')
Page({
  data: {
    maskstate: true,
    is_select: true,
    curIndex: 0,
    index: 0,
    indexI: 0,
    index2: 0,
    address: '',
    selectiontime: true,
    selectDate: '',
    is_varieties: true,
    choosingpets: '',
    selectDate: null,
    dateSwitch: true,
    delicate: null,
    iscolor: false,
    fosterDate: '',
    leaveDate: '',
    grain_price: '',
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
    gt: '>',
    lt: '<',
    // 含粮和不含粮
    foodstuff: [
      {
        text: '含粮',
        state: 1,
      },
      {
        text: '不含粮',
        state: 0,
      }
    ]
  },
  onLoad: function (options) {
    console.log(options)
    //初始化数据
    // this.initialization()
    // 选择宠物
    // this.initDate();
    var myDate = new Date();
    this.setData({
      address: wx.getStorageSync("address"),
      service_id: options.service_id,
      mername: options.mername,
      // fosterDate: myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate(),
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
    console.log(this.data.isrebook)
    wx.setNavigationBarTitle({
      title: options.mername//页面标题为路由参数
    })
    // this.fostershijian(options.service_id)
    // console.log(this.data.fosterDate)
  },
  onShow: function (options) {
    if (wx.getStorageSync('ISedit')) {
      this.pet_list();
      wx.setStorageSync('ISedit', 0)
    }
  },
  stopPageScroll: function () {
    return
  },
  // 寄养预约时间
  dianji: function () {
   
    this.yunxin()//调用回调函数
  },
  yunxin: function () {
   
    var that = this;
    that.rili = that.selectComponent("#rili")
    var fosterDate = ''
    var day = ''
    var leaveDate = ''
    that.rili.xianShi({
      data: function (res) {
    
        console.log(res)//选择的日期
        if (res != null) {
          if (res.length == 1) {
            fosterDate = res[0].data
          }
          else if (res.length == 2) {
            fosterDate = res[0].data
            leaveDate = res[1].data
            day = res[1].chaDay
          }
        }
        else {
          fosterDate = ''
          day = ''
          leaveDate = ''
        }
        that.setData({
          fosterDate: fosterDate,
          leaveDate: leaveDate,
          day: day,
        })
        if(that.data.leaveDate){
          that.foodstuff(that.data.index2)
        }
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
  //  寄养内容选择切换
  fosterContent(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let foodstuff = this.data.foodstuff;
    foodstuff.map((item) => {
      item.state = false
    })
    foodstuff[index].state = true;
    //含量费用
    // let grain_price = foster_list[index].grain_price
    this.setData({
      foodstuff,
      index2: index
      // grain_price
    })
    this.foodstuff(index)
  },
  // 含粮和不含粮 价格切换
  foodstuff(index) {
    // index =0 的时候是含粮  =1 的时候是不含粮
    if (!this.data.leaveDate) {
      wx.showToast({
        title: '请先选择预约时间',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: url.api + `/ucs/v1/service/escrow/cost`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        start_time: this.data.fosterDate,
        end_time: this.data.leaveDate,
        grain_price: index ? '' : this.data.setmeal[this.data.indexI].grain_price,
        price: index ? this.data.setmeal[this.data.indexI].price : ''
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": app.token
      },
      success: (res) => {
        console.log(res.data);
        if (res.data.code == 200) {
          this.setData({
            price: res.data.date.total_fee,
            day: res.data.date.day
          })
        }

      }
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
          setmeal.map(item => {
            item.is_select = false
          })
          //设置店铺name
          this.setData({
            shopName: setmeal[0].shop_name
          })
          setmeal[this.data.indexI].is_select = true
          wx.setStorageSync('shop', setmeal[0].shop)
          wx.setStorageSync('setmeal', setmeal[this.data.indexI])
          // 判断是不是分销订单  返回的shop_id 和用户进来的店铺shop_id是不是相等
          // if (setmeal[0].shop_id != wx.getStorageSync('shop_id')) {
          //   this.setData({
          //     is_distribution: 1,
          //     shop_id: setmeal[0].shop_id,
          //     remind: true
          //   })
          //   console.log(this.data.is_distribution)
          //   setTimeout(res => {
          //     this.setData({
          //       remind: false
          //     })
          //   }, 10000)
          //   wx.setStorageSync('shop', setmeal[0].shop)
          //   wx.setStorageSync('setmeal', setmeal[this.data.indexI])
          // } else {
          //   wx.setStorageSync('shop', setmeal[0].shop)
          //   wx.setStorageSync('setmeal', setmeal[this.data.indexI])
          //   this.setData({
          //     is_distribution: 0,
          //     shop_id: ''
          //   })
          // }
          this.setData({
            setmeal
          })
        } else {
          wx.showModal({
            content:'区域内无此服务可供匹配',
            showCancel:false,
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
            submit: false,
          })

        }
        // wx.hideLoading()
      }
    })
  },
  // 点击跳转到确认订单页面
  goorder(e) {
    wx.setStorageSync('dis_img', this.data.setmeal[this.data.indexI].service[0].img)
    console.log(this.data.index2)
    let grain_price = this.data.index2 == 0 ? this.data.price:''  //含粮总费用
    let price1 = this.data.index2 == 1?this.data.price:'';//不含粮总费用
    let price2 = this.data.index2 == 0 ? this.data.setmeal[this.data.indexI].grain_price : this.data.setmeal[this.data.indexI].price ;//含粮和不含粮 每天的费用
    if (!this.data.submit) {
      wx.showToast({
        title: '暂无此宠物规格的服务，请重新选择宠物',
        icon: 'none'
      })
      return
    }
    // 判断有没有选择宠物
    console.log(this.data.leaveDate)
    if (!this.data.leaveDate) {
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?price=' + this.data.price + '&grain_price=' + grain_price + '&service_id=' + this.data.service_id + '&name=' + this.data.pet_list[this.data.index].name + '&specs=' + this.data.pet_list[this.data.index].specs + '&weight=' + this.data.pet_list[this.data.index].weight + '&start_time=' + this.data.fosterDate + '&end_time=' + this.data.leaveDate + '&member_pets_id=' + this.data.pet_list[this.data.index].id + '&service_specs_id=' + this.data.setmeal[this.data.indexI].specs_id + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id + '&mername=' + this.data.mername + '&exes=' + ['escrow/cost', 'escrow/add', 'escrow/store'] + '&service_product_id=' + this.data.setmeal[this.data.indexI].id + '&is_distribution=' + 0 + '&shop_id=' + this.data.setmeal[this.data.indexI].shop_id + '&day=' + this.data.day + '&cost1=' + 1 + '&price1=' + price1 + '&price2=' + price2  
      })
    }
  },

  // 隐藏日历
  // timeSure() {
  //   const year = new Date().getFullYear()
  //   let dayList = this.data.dayList;
  //   let fosterDate, leaveDate
  //   dayList.forEach((item) => {
  //     if (item.residue == '寄养') {
  //       let a = this.PrefixInteger(item.month);
  //       let b = this.PrefixInteger(item.day)
  //       fosterDate = `${year}-${a}-${b}`;
  //     }
  //     if (item.residue == '离店') {
  //       let a = this.PrefixInteger(item.month);
  //       let b = this.PrefixInteger(item.day)
  //       leaveDate = `${year}-${a}-${b}`;
  //     }
  //   })
  //   console.log(dayList)
  //   if (this.data.isrebook) {
  //     this.setData({
  //       fosterDate,
  //       leaveDate,
  //     })
  //     this.rebook()

  //     return
  //   }
  //   this.setData({
  //     dateSwitch: true,
  //     is_shadow: false,
  //     fosterDate,
  //     leaveDate,
  //     selectiontime: true
  //   })
  //   this.foodstuff(this.data.index2)
  // },
  //初始化日期
  // initDate() {
  //   const year = new Date().getFullYear()
  //   const month = new Date().getMonth() + 1
  //   const nowDay = new Date().getDate()
  //   this.setData({
  //     year,
  //     month,
  //     nowDay,
  //     nowMonth: month,
  //     nowYear: year,
  //   })
  //   console.log(nowDay)
  //   this.getDayList(year, month)
  // },
  // // 日期 月份加0 方法
  // PrefixInteger(num) {
  //   return (Array(2).join('0') + num).slice(-2);
  // },
  // //获取天数
  // getDayList(year, month) {
  //   //当前显示月份最大天数
  //   const dayMax = new Date(year, month, 0).getDate()
  //   //当前月份开始天星期数
  //   const startWeek = new Date(`${year}-${month}-1`).getDay()
  //   //当前月份最后一天星期数
  //   const endWeek = new Date(`${year}-${month}-${dayMax}`).getDay()
  //   //上一个年份
  //   const prevYear = month == 1 ? year - 1 : year
  //   //上一个月份
  //   const prevMonth = month == 1 ? 12 : month - 1
  //   //上一个月份最大天数
  //   let prevDatMax = new Date(prevYear, prevMonth, 0).getDate()
  //   //天数列表
  //   let dayList = []
  //   //每月1号不是星期一时从上一个月补
  //   for (let i = (prevDatMax - Math.abs(1 - startWeek) + 1); i <= prevDatMax; i++) {
  //     dayList.push({
  //       day: '',
  //       month: prevMonth
  //     })
  //   }
  //   //当前展示月份天数
  //   for (let i = 1; i <= dayMax; i++) {
  //     dayList.push({
  //       day: i,
  //       month,
  //     })
  //   }
  //   console.log(dayList)
  //   this.setData({
       
  //     dayList,
  //     prevMonth
  //   }) 
  // },
  // //下一月
  // next() {
  //   this.data.month += 1
  //   let month = this.data.month > 12 ? 1 : this.data.month
  //   let year = this.data.month > 12 ? this.data.year + 1 : this.data.year
  //   this.getDayList(year, month)
  //   this.setData({
  //     year,
  //     month,
  //   })
  // },
  // //上一月
  // prev() {
  //   this.data.month -= 1
  //   let month = this.data.month < 1 ? 12 : this.data.month
  //   let year = this.data.month < 1 ? this.data.year - 1 : this.data.year
  //   this.getDayList(year, month)
  //   this.setData({
  //     year,
  //     month,
  //   })
  // },
  // 点击休假改变日期
  // getDay(e) {
  //   console.log(e)
  //   let day = e.currentTarget.dataset.day;
  //   let index = e.currentTarget.dataset.index
  //   let dayList = this.data.dayList;
  //   let month = e.currentTarget.dataset.month;
  //   if (e.currentTarget.dataset.residue == '休假') {
  //     return
  //   }
  //   var bool_num = 0,
  //     jy = '',
  //     ld = ''

  //   for (var i = 0; i < dayList.length; i++) {
  //     if (!dayList[i].status) {
  //       ++bool_num
  //     }
  //     if (dayList[i].status == 1) {
  //       // console.log(i)
  //       jy = i
  //     }
  //     if (dayList[i].status == 2) {
  //       // console.log('离店',i)
  //       ld = i
  //     }
  //   }
  //   console.log('寄养:', jy, '离店:', ld, '当前下标：', index)

  //   if (bool_num == dayList.length) {
  //     dayList[index].status = 1
  //     dayList[index].residue = '寄养'
  //   } else {
  //     if (index > jy) {
  //       console.log('大于')
  //       if (this.data.is_selectDay) {
  //         console.log('已选择了离店，再次重新选择寄养')
  //         if (ld) {
  //           dayList[ld].status = ''
  //           dayList[ld].residue = ''
  //         }
  //         if (jy) {
  //           dayList[jy].status = ''
  //           dayList[jy].residue = ''
  //         }
  //         dayList[index].status = 1
  //         dayList[index].residue = '寄养'
  //         this.setData({
  //           is_selectDay: false
  //         })
  //         var chongzhi = true
  //       } else {
  //         for (var i = 0; i < dayList.length; i++) {
  //           if (!ld) {
  //             if (i > jy && i < index) {
  //               if (dayList[i].residue == '休假') {
  //                 console.log('1彼此坦诚相待')
  //                 var is_xiujia = true
  //               }
  //             }
  //           }
  //           if (ld) {
  //             if (i > jy && i < ld) {
  //               if (dayList[i].residue == '休假') {
  //                 console.log('2彼此坦诚相待')
  //                 var is_xiujia = true
  //               }
  //             }
  //           }
  //         }
  //         if (is_xiujia) { //有休假处理
  //           wx.showModal({
  //             content: '有休假,请重新选择',
  //             showCancel: false,
  //           })
  //           dayList[jy].status = ''
  //           dayList[jy].residue = ''
  //           this.setData({
  //             dayList,
  //           })
  //           return
  //         }
  //         dayList[index].status = 2
  //         dayList[index].residue = '离店'
  //         this.setData({
  //           is_selectDay: true
  //         })
  //       }
  //     }
  //     if (index < jy) {
  //       console.log('小于寄养重新选择寄养')
  //       if (ld) {
  //         dayList[ld].status = ''
  //         dayList[ld].residue = ''
  //       }
  //       dayList[jy].status = ''
  //       dayList[jy].residue = ''
  //       dayList[index].status = 1
  //       dayList[index].residue = '寄养'
  //       var chongzhi = true
  //       this.setData({
  //         is_selectDay: false
  //       })
  //     }
  //     for (var i = 0; i < dayList.length; i++) {
  //       if (ld) {
  //         if (i > jy && i < ld) {
  //           dayList[i].moren = 1
  //         }
  //       }
  //       if (!ld) {
  //         if (i > jy && i < index) {
  //           dayList[i].moren = 1
  //         }
  //       }
  //       if (chongzhi) {
  //         dayList[i].moren = 0
  //       }
  //     }
  //   }
  //   const year = new Date().getFullYear()
  //   let fosterDate="";
  //   let leaveDate="";
  //   dayList.forEach((item) => {
  //     if (item.residue == '寄养') {
  //       let a = this.PrefixInteger(item.month);
  //       let b = this.PrefixInteger(item.day)
  //       fosterDate = `${year}-${a}-${b}`;
  //     }
  //     if (item.residue == '离店') {
  //       let a = this.PrefixInteger(item.month);
  //       let b = this.PrefixInteger(item.day)
  //       leaveDate = `${year}-${a}-${b}`;
  //     }
  //   })
  //   this.setData({
  //     leaveDate,
  //     fosterDate,
  //   })
  //   if (leaveDate){
  //     this.foodstuff(this.data.index2)
  //   }else{
  //     this.setData({
  //       price: this.data.index2 == 0 ? this.data.setmeal[this.data.indexI].grain_price : this.data.setmeal[this.data.indexI].price
  //     })
  //   }
  //   console.log(fosterDate, leaveDate,this.data.iDays)
  //   this.setData({
  //     dayList,
  //   })
  // },
  //放大图片
  bigimage(e) {
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
  // 改签接口
  rebook() {
    if (!this.data.fosterDate) {
      wx.showToast({
        title: '请完善改签时间',
        icon: 'none'
      })
      return
    }
    if (!this.data.leaveDate) {
      wx.showToast({
        title: '请完善改签时间',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: url.api + `/ucs/v1/service/order/change/time`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        escrow_begin: this.data.fosterDate,
        escrow_end: this.data.leaveDate,
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
      success: function (res) {
        wx.openLocation({ //​使用微信内置地图查看位置。
          latitude: Number(lat), //要去的纬度-地址
          longitude: Number(lon), //要去的经度-地址
          name: name,
          address: name
        })
      }
    })
  },
})