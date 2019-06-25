let url = require('../../utils/config.js')
const app = getApp()
const Page = require('../../utils/ald-stat.js').Page;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: null,
    fromdata: null,
    array: null,
    index: 0,
    id: null, //判断是狗的还是猫的ID
    list: [],
    gender: null,
    id: null,
    edit_id: null,
    img1: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 判断是狗的还是猫的id
    let id = options.id
    console.log(options)

    this.setData({
      id,
    })
    this.pet_information()
  },
  // 换宠物靓照
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        let img = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")

        this.setData({
          img: tempFilePaths,
          img1: 'data:image/jpeg;base64,' + img
        })
        console.log(this.data.img1)
      }
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 宠物信息接口
  pet_information() {
    let id = this.data.id;
    if (id) {
      wx.request({
        url: url.api + `/ucs/v1/member/pet/create?type=${id}`, // 仅为示例，并非真实的接口地址
        method: "get",
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res.data)
          let fromdata = res.data.data;
          let gender = res.data.data.breed;
          let array = [];
          gender.map((item) => {
            array.push(item.name)
          })

          fromdata.attr.map((item) => {
            item.values.map((item1) => {
              item1.istrue = false;
            })
          })
          // console.log(gender)
          // console.log(gender)
          this.setData({
            fromdata,
            array,
            gender
          })
        }
      })
    }

  },
  // 体毛、体型
  select(e) {
    let index = e.currentTarget.dataset.index[0];
    let index1 = e.currentTarget.dataset.index[1];
    // console.log(e)
    let fromdata = this.data.fromdata;
    fromdata.attr[index].values.map(item => {
      item.istrue = false
    })
    fromdata.attr[index].values[index1].istrue = !fromdata.attr[index].values[index1].istrue
    this.setData({
      fromdata
    })
    console.log(fromdata)
  },
  //添加宠物  str = '性别,成有，体毛'
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // console.log(this.data.fromdata.attr)
    let attr1 = e.detail.value
    let breed_id;
    let attr = [];
    let specs1 = [];
    let id1 = []
    let fromdata = this.data.fromdata;
    fromdata.attr.map((item) => {
      item.values.map((item1) => {
        if (item1.istrue) {
          // id1.push(item1.value_sort);
          // breed_id = item1.value_sort;
          attr.push(item1.id);
          specs1.push(item1.attr_value)
        }
      })
    })
    console.log(attr)
    // 判断是猫还是狗
    if(this.data.id==1){
      var str = attr.join(',')
    }else{
      var str = attr[1] + ',' + attr[0] + ',' + attr[2]
    }
    
    console.log(str)

    // let id = id1.join(',') 
    // breed_id = id.slice(0, 1);
    let attr_values = str
    let specs = specs1.join(',')
    // 宠物信息验证判断
    if (!attr1.name) {
      wx.showToast({
        title: '请填写宠物名字',
        icon: 'none'
      })
      return
    }
    if (!this.data.gender[this.data.index].id) {
      wx.showToast({
        title: '请选择宠物品种',
        icon: 'none'
      })
      return
    }
    if (!attr1.weight) {
      wx.showToast({
        title: '请填写宠物体重',
        icon: 'none'
      })
      return
    }
    // if (!breed_id) {
    //   wx.showToast({
    //     title: '请选择宠物性别',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (!breed_id) {
    //   wx.showToast({
    //     title: '请选择宠物性别',
    //     icon: 'none'
    //   })
    //   return
    // }
    console.log(specs1.length)
    if (specs1.length <= 2) {
      wx.showToast({
        title: '请选择体毛和犬型',
        icon: 'none'
      })
      return
    }

    if (!attr1.age) {
      wx.showToast({
        title: '请选择宠物年龄',
        icon: 'none'
      })
      return
    }
    if (!this.data.fromdata.avatar_default) {
      wx.showToast({
        title: '请选择宠物靓照',
      })
      return
    } else {
      wx.request({
        url: url.api + `/ucs/v1/member/pet`, // 仅为示例，并非真实的接口地址
        method: "post",
        data: {
          type: this.data.id,
          name: attr1.name,
          breed_id: this.data.gender[this.data.index].id,
          attr_values: attr_values,
          // gender: breed_id,
          age: attr1.age,
          weight: parseInt(attr1.weight),
          specs: specs,
          avatar_default_check: this.data.img1 ? 1 : 0,
          avatar: this.data.img1 ? this.data.img1 : this.data.fromdata.avatar_default,
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res.data)
          // 判断宠物是否添加成功
          if (res.data.code == 200) {
            wx.showToast({
              title: res.data.message,
              icon: 'succes',
            })
            wx.setStorageSync('ISedit', 1)
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }

  }

})