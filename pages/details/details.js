const app = getApp()
let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
Page({
  data: {
    ewmPath: "",
    goodsPath: "",
    screenWidth: "",
    screenHeight: "",
    list: null,
    is_switch: false,
    is_show: false,
    is_poster: false,
    index_a: 0,
    addlist: [],
    badgeCount: 0,
    attrValueList: [],
    formatdata: {
      color: [{
        red: '红色',
        istrue: false
      }, {
        red: '黄色',
        istrue: true
      }],
      size: [{
        da: '大型犬',
        istrue: false
      }, {
        da: '中型犬',
        istrue: true
      }, {
        da: '小型犬',
        istrue: true
      }],
      num: 1
    },
    img: '/img/sst.png',
    goods_sku: [], //规格列表
    selectSpecPrice: '',
    supplierLogo: '',
    supplierName: '',
    supplierGoodsNumb: 0,
    supplier_id: '',
  },
  onShareAppMessage(res) {
    var goodsInfo = this.data.list
    console.log(goodsInfo)
    return {
      title: goodsInfo.name,
      imageUrl: goodsInfo.image,
      path: '/pages/details/details?share=share&id=' + goodsInfo.id + '&shop_id=' + url.store_id,
      success: (res) => {
        this.setData({
          is_poster: false
        })
      }
      //
    }
  },
  // 分享
  onShareTap: function(event) {
    this.setData({
      is_show: true
    })
  },
  stopPageScroll: function() {
    return
  },
  // 生成海报
  onCreatPoster: function() {
    wx.showLoading({
      title: '',
      mask: true,
    })
    var that = this;
    this.setData({
      is_poster: true,
      is_show: false
    })
    var ctx = wx.createCanvasContext('share');
    let rpx = this.data.screenWidth / 750;
    let goodsPath = this.data.goodsPath;
    let ewmPath = this.data.ewmPath;
    console.log(this.data.list, goodsPath, ewmPath)
    // return
    // 画海报背景
    ctx.drawImage("/img/poster_bg.png", 0, 0, 528 * rpx, 755 * rpx);
    // 画价格
    ctx.setFontSize(31 * rpx);
    ctx.setFillStyle("#FC4C4C");
    ctx.fillText("￥" + that.data.list.price, 22 * rpx, 694 * rpx);
    //画商品图
    ctx.drawImage(goodsPath, 64 * rpx, 64 * rpx, 400 * rpx, 400 * rpx);
    // 画二维码
    ctx.drawImage(ewmPath, 357 * rpx, 546 * rpx, 140 * rpx, 140 * rpx);
    //画二维码小字
    ctx.setFontSize(17 * rpx);
    ctx.setFillStyle("#999999");
    ctx.fillText("长按扫描去逛逛", 368 * rpx, 705 * rpx);
    //画商品名
    let text = this.data.list.name;
    let chr = text.split(""); //将一个字符串分割成字符串数组
    let temp = "";
    let row = [];
    ctx.setFontSize(28 * rpx);
    ctx.setFillStyle("#333333");
    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 170) {
        temp += chr[a];
        // console.log("0", temp);
      } else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);
    // console.log("row", row);
    console.log("temp", temp);
    //如果数组长度大于2 则截取前两行
    if (row.length > 2) {
      var rowCut = row.slice(0, 2);
      var rowPart = rowCut[1];
      var test = "";
      var empty = [];
      console.log("rowPart", rowPart);
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < 140) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test);
      var group = empty[0] + "..." //这里只显示两行，超出的用...表示
      rowCut.splice(1, 1, group);
      row = rowCut;
      console.log("group", group);
    }
    // 绘制标题
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 22 * rpx, (586 + b * 40) * rpx, 300 * rpx);
      console.log("row[" + b + "]", row[b])
    }
    ctx.draw();
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 528,
        height: 755,
        destWidth: 528 * 4,
        destHeight: 755 * 4,
        canvasId: 'share',
        success: function(res) {
          wx.hideLoading()
          // console.log("1", res);
          //这就是生成的文件临时路径
          that.setData({
            shareImgSrc: res.tempFilePath
          })
          // console.log(that.data.shareImgSrc);
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }

        },
        fail: function(res) {
          wx.hideLoading()
          console.log(res);
        }
      })
    }, 1000)
  },
  // 将图片保存到相册
  savePic: function() {
    var that = this;
    console.log("aa")
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgSrc,
      success(res) {
        // 提示
        console.log("成功")
        wx.showToast({
          title: "图片已保存到相册",
          icon: 'none',
          duration: 2000
        })
        that.setData({
          is_poster: false
        })
      }
    })
  },
  // 绘制换行文本方法
  drawText: function(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    var lineWidth = 0;
    var lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 16; //16为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 30;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
  },
  // 取消分享
  onCancelTap: function() {
    this.setData({
      is_show: false
    })
  },
  // 取消生成海报
  onCloseTap: function() {
    this.setData({
      is_poster: false
    })
  },
  onLoad: function(options) {
    console.log(options)
    var that = this
    that.setData({
      options
    })
    if (options.share) {
      console.log('分享进来')
      wx.login({
        success: res => {
          console.log(res)
          // 发送 res.code 到后台换取 openId, sessionKey, un   
          var shop_id = options.shop_id;
          wx.request({
            url: url.api + `/ucs/v1/oauth/login`,
            data: {
              code: res.code,
              shop_id
            },
            method: "post",
            success: (res) => {
              console.log(res)
              // console.log('getCode',res.data)
              // 获取token
              url.token = res.data.token_type + ' ' + res.data.access_token;
              // 获取member_id
              url.member_id = res.data.id;
              abc(shop_id)
            }
          })
        }
      })
    } else {
      if (options.bulk == '1') {
        wx.request({
          url: url.api + '/ucs/v1/groupbuy/goods/info', // 仅为示例，并非真实的接口地址
          data: {
            id: options.id
          },
          header: {
            'content-type': 'application/json',
            "Authorization": app.token
          },
          success(res) {
            console.log('团购详情', res)
            var bulkInfo = res.data.data,
              list = bulkInfo.goods
            var goods_sku = [{
              price: bulkInfo.goods_price
            }]
            list.goods_sku = goods_sku
            list.ot_price = bulkInfo.origin_price
            list.name = bulkInfo.goods_name
            list.goods_img = bulkInfo.goods_img

          
            let listImag = [];
            // listImag.push(bulkInfo.image)
            bulkInfo.goods_img.map(item => {
              if (item.img_url != bulkInfo.image) {
                listImag.push(item.img_url)
              }
            })
            that.setData({
              bulkInfo,
              list,
              listImag
            })
          }
        })
        return
      }
      abc()
    }

    function abc(hostname, shop_id) {
      var scene = decodeURIComponent(options.scene)
      that.car_list()
      //获取用户设备信息，屏幕宽度
      wx.getSystemInfo({
        success: res => {
          // console.log("111", res);
          that.setData({
            screenWidth: res.screenWidth,
            screenHeight: res.screenHeight
          })
        }
      })
      // 商品详情接口数据
      let id = options.id
      wx.showLoading({
        title: '加载中...',
      })
      wx.request({
        url: url.api + '/ucs/v1/shop/goods', // 仅为示例，并非真实的接口地址
        method: "post",
        data: {
          shop_id: url.store_id ? url.store_id : shop_id,
          goods_id: id
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.code != 200) {
            wx.hideLoading()
            wx.showModal({
              content: res.data.message,
              showCancel: false,
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
            return
          }
          let list = res.data.data;
          let listImag = [];
          listImag.push(list.image)
          list.goods_img.map(item => {
            if (item.img_url != list.image) {
              listImag.push(item.img_url)
            }
          })
          // console.log(listImag)
          // console.log(list)
          that.setData({
            listImag,
            list,
            goods_sku: list.goods_sku,
            selectSpecImg: list.image,
            selectSpecPrice: list.goods_sku[0].price
          })
          console.log(that.data.listImag) 
          // that.loadingimg(list, that)
          wx.hideLoading()
          // console.log(this.data.list)
          // 下载网络图片（二维码）到本地
          // console.log("25",that.data.list.code_path);
          wx.downloadFile({
            url: insertStr(that.data.list.code_path, 4, 's'),
            success(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                that.setData({
                  ewmPath: res.tempFilePath
                })
              }
            }
          })
          // 下载网络图片（商品图）到本地
          wx.downloadFile({
            url: insertStr(that.data.list.image, 4, 's'),
            success: res => {
              if (res.statusCode === 200) {
                that.setData({
                  goodsPath: res.tempFilePath
                })
              }
            }
          })

          function insertStr(soure, start, newStr) {
            return soure.slice(0, start) + newStr + soure.slice(start);
          }
          // zjq
          var goodsInfo = list
          if (goodsInfo.sku.length != 0) {
            for (var i = 0; i < goodsInfo.goods_sku.length; i++) {
              goodsInfo.goods_sku[i].attr_name = goodsInfo.goods_sku[i].attr_name.split(',')
            }
            that.updateData(goodsInfo.sku, goodsInfo.goods_sku) //数据重构
          }
          // 解析html标签
          // var aHrefHrefData = list.detail;
          // WxParse.wxParse('aHrefHrefData', 'html', aHrefHrefData, this);

          //设置 供应商相关详情
          // let supplier=res.data.data.supplier;
          // if(supplier && supplier.supplier_store);
          // { 
          //   that.setData({
          //     supplierName: supplier.name,
          //     supplierLogo: supplier.supplier_store.store_logo,
          //     supplier_id: supplier.supplier_store.id,
          //   })
          // }
        }
      })
    }
  },
  // 获取二维码接口

  onShow: function() {},
  // 点击颜色规格显示、影藏弹框 和遮罩层
  show() {
    this.setData({
      is_switch: true,
      ispurchase: false
    })
  },
  hide() {
    this.setData({
      is_switch: false
    })
  },
  //颜色选择
  color(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index[0];
    let index1 = e.currentTarget.dataset.index[1];
    let list = this.data.list;
    //  获取规格
    let norms = [];
    list.sku.map(item => {
      item.checks.map(itemTwo => {
        if (item.sort == itemTwo) {
          norms.push(itemTwo)
        }
      })
    })
    var judge = [];
    for (var i = list.sku.length - 1; i >= 0; i--) {
      if (index == i) {
        judge.push(list.sku[index].checks[index1])
      } else {
        judge.push(norms[i])
      }
    }
    var judgeBool = false;
    console.log(judge);
    console.log(typeof judge)
    //规格判断价格
    for (var i = 0; i < list.goods_sku.length; i++) {
      if (list.goods_sku[i].attr_name.split(',').sort().toString() == judge.sort().toString()) {
        judgeBool = true;
        this.setData({
          index_a: i
        })
      }
    }
    if (judgeBool) {
      list.sku[index].sort = 0;
      list.sku[index].sort = list.sku[index].checks[index1]
      debugger;
    } else {
      wx.showToast({
        title: '店铺无此规格',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      list
    })
  },
  // 购物数量加减
  inputChangeHandle: function(event) {
    var num = event.detail.value; //通过这个传递数据
    console.log(num)
    let formatdata = this.data.formatdata;
    formatdata.num = num
    this.setData({
      formatdata
    })
  },
  add() {
    let formatdata = this.data.formatdata;
    formatdata.num++;
    this.setData({
      formatdata
    })
  },
  reduce() {
    let formatdata = this.data.formatdata;
    formatdata.num > 1 ? formatdata.num-- : 1
    this.setData({
      formatdata
    })
  },
  // 确定
  sure() {
    //加入购物车
    let list = this.data.list;
    let goods_sku_id = this.data.goods_sku_id;
    console.log(2)
    // let goods_sku_id = list.goods_sku[0].id
    console.log(goods_sku_id)

    if (list.sku.length != 0) {
      if (list.goods_sku[0].attr_name != '') {
        if (!this.data.goods_sku_id) {
          wx.showToast({
            title: '请选择规格',
            icon: 'none'
          })
          return
        }
      } else {
        goods_sku_id = list.goods_sku[0].id
      }
    } else {
      goods_sku_id = list.goods_sku[0].id
    }
    wx.request({
      url: url.api + `/ucs/v1/cart/operate`, // 仅为示例，并非真实的接口地址
      method: "post",
      data: {
        shop_id: url.store_id,
        goods_sku_id: goods_sku_id,
        num: this.data.formatdata.num
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
          this.setData({
            is_switch: false,
          })
          wx.showToast({
            title: '添加成功',
            icon: 'succes',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
          this.setData({
            is_switch: false
          })
        }
        this.car_list()
      }
    })
  },
  gocart() {
    this.setData({
      is_switch: true,
      ispurchase: false
    })
  },
  // 点击立即购买去 订单页面
  goconfirmorder() {
    let list = this.data.list;
    let goods_sku_id = this.data.goods_sku_id
    if (list.sku.length != 0) {
      if (list.goods_sku[0].attr_name != '') {
        if (!this.data.goods_sku_id) {
          wx.showToast({
            title: '请选择规格',
            icon: 'none'
          })
          return
        }
      } else {
        goods_sku_id = list.goods_sku[0].id
      }
    } else {
      goods_sku_id = list.goods_sku[0].id
    }
    wx.navigateTo({
      url: '/pages/confirmorder/confirmorder?goods_sku_id=' + goods_sku_id + '&shop_id=' + url.store_id + '&num=' + this.data.formatdata.num
    })
  },
  purchase() {
    this.setData({
      is_switch: true,
      ispurchase: true
    })
  },
  // 直接去购物车页面
  go_home() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  //  购物车列表的数据  获取购物车数量
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
        // console.log(res.data)
        // let totalMoney = res.data.amount_total
        let car_list = res.data.data;
        // console.log(list)
        // let car_list = [];
        // for (var key in list) {
        //   car_list.push(list[key])
        // }
        let badgeCount = 0;
        car_list.map((item) => {
          item.goods.map((item1, index) => {
            badgeCount++
          })
        })
        this.setData({
          badgeCount,
          car_list
        })
        console.log(badgeCount)
        console.log(car_list)
      }
    })
  },
  // 点击商品 跳转到商品列表
  goshoplist(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shop_list/shop_list?id=' + id + '&name=' + e.currentTarget.dataset.name,
    })
  },
  // 去供应商xiangq
  gosupplierdetails() {
    wx.navigateTo({
      url: '/pages/supplierdetails/supplierdetails?supplier_id=' + this.data.supplier_id
    })
  },
  // ***************************/
  // 1
  updateData(attr, sku) {
    // console.log(attr)
    // console.log(sku)
    for (var i = 0; i < sku.length; i++) {
      var attrValueList = []
      for (var k = 0; k < sku[i].attr_name.length; k++) {
        // console.log(sku[i].attr_name[k])
        var attrKey = abc(sku[i].attr_name[k])
        // console.log(attrKey, sku[i].attr_name[k])
        var obj = {
          attrKey,
          attrValue: sku[i].attr_name[k]
        }
        attrValueList.push(obj)
      }
      // console.log(attrValueList)

      sku[i].attrValueList = attrValueList
      // console.log(obj)
      // console.log(attrValueList)
    }

    function abc(attrValue) {
      // console.log(attrValue)
      for (var i = 0; i < attr.length; i++) {
        for (var k = 0; k < attr[i].checks.length; k++) {
          if (attr[i].checks[k] == attrValue) {
            return attr[i].categoryName
          }
        }
      }
    }
    console.log(sku)
    this.setData({
      commodityAttr: sku,
      includeGroup: sku
    })
    this.distachAttrValue(sku)
  },
  /* 获取数据 */
  distachAttrValue(commodityAttr) {
    var attrValueList = this.data.attrValueList;
    console.log(attrValueList, commodityAttr)
    // 遍历获取的数据 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        // console.log(commodityAttr[i].attrValueList[j].attrKey, attrValueList)
        var attrIndex = this.getAttrIndex(commodityAttr[i].attrValueList[j].attrKey, attrValueList);

        // console.log('属性索引', attrIndex); 
        // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置 
        if (attrIndex >= 0) {
          // 如果属性值数组中没有该值，push新值；否则不处理 
          if (!this.isValueExist(commodityAttr[i].attrValueList[j].attrValue, attrValueList[attrIndex].attrValues)) {
            attrValueList[attrIndex].attrValues.push(commodityAttr[i].attrValueList[j].attrValue);
          }
        } else {
          attrValueList.push({
            attrKey: commodityAttr[i].attrValueList[j].attrKey,
            attrValues: [commodityAttr[i].attrValueList[j].attrValue]
          });
        }
      }
    }

    // console.log('result', attrValueList) 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].attrValueStatus) {
          attrValueList[i].attrValueStatus[j] = true;
        } else {
          attrValueList[i].attrValueStatus = [];
          attrValueList[i].attrValueStatus[j] = true;
        }
      }
    }
    this.setData({
      attrValueList
    });
    // console.log(attrValueList)
  },
  // 判断数组中的attrKey是否有该属性值 
  getAttrIndex(attrName, attrValueList) {
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrName == attrValueList[i].attrKey) {
        break;
      }
    }
    // console.log(i, attrValueList.length)
    return i < attrValueList.length ? i : -1;
  },
  // 判断是否已有属性值 
  isValueExist(value, valueArr) {
    for (var i = 0; i < valueArr.length; i++) {
      if (valueArr[i] == value) {
        break;
      }
    }
    return i < valueArr.length;
  },
  /* 选择属性值事件 */
  selectAttrValue: function(e) {
    var attrValueList = this.data.attrValueList,
      dataset = e.currentTarget.dataset
    var index = dataset.index; //属性索引 
    var key = dataset.key; //类型
    var value = dataset.value; //下标
    var status = dataset.status
    // console.log(attrValueList, dataset)
    if (status || index == this.data.firstIndex) {
      if (dataset.selectedvalue == e.currentTarget.dataset.value) {
        // console.log(123)
        this.disSelectValue(attrValueList, index, key, value); // 取消选中 
      } else {
        // console.log(456) 
        this.selectValue(attrValueList, index, key, value); // 选中 
      }
    }
  },
  /* 选中 */
  selectValue: function(attrValueList, index, key, value, unselectStatus) {
    // console.log('firstIndex', this.data.firstIndex);
    var includeGroup = [];
    if (index == this.data.firstIndex && !unselectStatus) { // 如果是第一个选中的属性值，则该属性所有值可选 
      var commodityAttr = this.data.commodityAttr;
      // 其他选中的属性值全都置空 
      // console.log('其他选中的属性值全都置空', index, this.data.firstIndex, !unselectStatus); 
      for (var i = 0; i < attrValueList.length; i++) {
        for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
          attrValueList[i].selectedValue = '';
        }
      }
    } else {
      var commodityAttr = this.data.includeGroup;
    }

    // console.log('选中', commodityAttr, index, key, value); 
    for (var i = 0; i < commodityAttr.length; i++) {
      for (var j = 0; j < commodityAttr[i].attrValueList.length; j++) {
        if (commodityAttr[i].attrValueList[j].attrKey == key && commodityAttr[i].attrValueList[j].attrValue == value) {
          includeGroup.push(commodityAttr[i]);
        }
      }
    }
    attrValueList[index].selectedValue = value;

    // 判断属性是否可选 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = false;
      }
    }

    for (var k = 0; k < attrValueList.length; k++) {
      for (var i = 0; i < includeGroup.length; i++) {
        for (var j = 0; j < includeGroup[i].attrValueList.length; j++) {
          if (attrValueList[k].attrKey == includeGroup[i].attrValueList[j].attrKey) {
            for (var m = 0; m < attrValueList[k].attrValues.length; m++) {
              if (attrValueList[k].attrValues[m] == includeGroup[i].attrValueList[j].attrValue) {
                attrValueList[k].attrValueStatus[m] = true;
              }
            }
          }
        }
      }
    }
    // console.log('结果', attrValueList); 
    this.setData({
      attrValueList: attrValueList,
      includeGroup: includeGroup
    });

    var count = 0;
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        if (attrValueList[i].selectedValue) {
          count++;
          break;
        }
      }
    }
    if (count < 2) { // 第一次选中，同属性的值都可选 
      this.setData({
        firstIndex: index
      });
    } else {
      this.setData({
        firstIndex: -1
      });
    }
    this.is_selected()
  },
  /* 取消选中 */
  disSelectValue: function(attrValueList, index, key, value) {
    var commodityAttr = this.data.commodityAttr;
    attrValueList[index].selectedValue = '';

    // 判断属性是否可选 
    for (var i = 0; i < attrValueList.length; i++) {
      for (var j = 0; j < attrValueList[i].attrValues.length; j++) {
        attrValueList[i].attrValueStatus[j] = true;
      }
    }
    this.setData({
      includeGroup: commodityAttr,
      attrValueList: attrValueList
    });

    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        this.selectValue(attrValueList, i, attrValueList[i].attrKey, attrValueList[i].selectedValue, true);
      }
    }
    this.is_selected()
  },
  is_selected() {
    var attrValueList = this.data.attrValueList,
      goodsInfo = this.data.list,
      num = 0,
      arr = [],
      that = this
    // console.log(goodsInfo)
    // console.log(attrValueList)
    for (var i = 0; i < attrValueList.length; i++) {
      if (attrValueList[i].selectedValue) {
        ++num
        arr.push(attrValueList[i].selectedValue)
        if (num == attrValueList.length) {
          console.log(goodsInfo.goods_sku, arr)
          abc(goodsInfo.goods_sku, arr)
        } else {
          that.setData({
            goods_sku_id: ''
          })
        }
      }
    }

    function abc(goods_sku, arr) {
      for (var i = 0; i < goods_sku.length; i++) {
        var text = goods_sku[i].attr_name,
          text2 = arr.join(',')
        // console.log(text, text2)
        if (text == text2) {
          console.log(13333333333)
          that.setData({
            selectSpecImg: goods_sku[i].image_url ? goods_sku[i].image_url : goodsInfo.image,
            selectSpecPrice: goods_sku[i].price,
            goods_sku_id: goods_sku[i].id
          })
          return
        }
      }
    }

    let goods_sku = that.data.goods_sku;
    for (let i = 0; i < goods_sku.length; i++) {
      if (goods_sku[i].attr_name == arr.toString()) {
        that.setData({
          index_a: i
        })
        break;
      }
    }
    that.setData({
      selected: arr
    })
  },
  // 拼团
  goBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  gobuy() {
    var bulkInfo = this.data.bulkInfo
    wx.navigateTo({
      url: '/pages/confirmorder/confirmorder?bulk=1&goods_sku_id=' + bulkInfo.goods_sku_id + '&shop_id=' + url.store_id + '&num=1' + '&groupbuy_id=' + bulkInfo.id + '&price=' + bulkInfo.goods_price
    })
  }
})