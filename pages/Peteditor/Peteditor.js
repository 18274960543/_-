let url = require('../../utils/config.js')
const Page = require('../../utils/ald-stat.js').Page;
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: null,
    img2: null,
    fromdata: null,
    list: [],
    gender: null,
    edit_id: null,
    index: 0,
    breed_id: '',
    img1:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let edit_id = options.edit_id
    console.log(edit_id,options)
    this.setData({
      edit_id
    })
    this.pet_information()
  },
  bindname(e) {
    this.setData({
      "fromdata.name": e.detail.value
    })
  },
  bindweight(e) {
    this.setData({
      "fromdata.weight": e.detail.value
    })
  },
  bindage(e) {
    this.setData({
      "fromdata.gender": e.detail.value
    })
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
        console.log(tempFilePaths)
        let img = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        this.setData({
          img: tempFilePaths,
          img1: 'data:image/jpeg;base64,' + img
        })
        // console.log(this.data.img1)
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
    let edit_id = this.data.edit_id
    if (edit_id) {
      wx.request({
        url: url.api + `/ucs/v1/member/pet/${edit_id}/edit`, // 仅为示例，并非真实的接口地址
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
          let breed_id;
          console.log(fromdata.breed_id)
          gender.map((item, index) => {
            if (item.id == fromdata.breed_id) {
              breed_id = index
            }
          })
          console.log(breed_id)
          let specs = fromdata.specs;
          let arr = specs.split(",");
          console.log(arr)
          fromdata.attr.map((item, index) => {
            item.values.map((item1, index1) => {
              if (arr[index] == item1.attr_value) {
                item1.istrue = true;
              } else {
                item1.istrue = false;
              }
            })
          })
          let avatar = fromdata.avatar;
          wx.getImageInfo({
            src: avatar.replace('http:','https:'),
            success:(res)=>{
              console.log(res)
              let img = wx.getFileSystemManager().readFileSync(res.path,"base64")
              // console.log(img)
              // console.log(res.width)
              // console.log(res.height)
            this.setData({
              img2: 'data:image/jpeg;base64,' + img
            })
              console.log(this.data.img2)
            }
          })
          console.log(array)
          this.setData({
            fromdata,
            array,
            gender,
            index: breed_id,
            
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
  //添加宠物
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // console.log(this.data.img1)
    // console.log(this.data.img2)
    let attr1 = e.detail.value
    let breed_id;
    let attr = [];
    let specs1 = [];
    let id1 = []
    let fromdata = this.data.fromdata;
    fromdata.attr.map((item) => {
      item.values.map((item1) => {
        if (item1.istrue) {
          // id1.push(item1.id);
          attr.push(item1.id);
          specs1.push(item1.attr_value)
        }
      })
    })
    // let id = id1.join(',')
    if (this.data.fromdata.type == 1) {
      var str = attr.join(',')
    } else {
      var str = attr[1] + ',' + attr[0] + ',' + attr[2]
    }
    let attr_values = str;
    let specs = specs1.join(',')
    let avatar;
    // console.log(breed_id, attr_values, specs)
    // console.log(this.data.array[this.data.index].id)
    // 修改宠物信息  如果有宠物ID 就执行修改接口
    // console.log(this.data.img1)
    // console.log(this.data.img2)
    if (this.data.img1){
      avatar = this.data.img1
    }
    if (this.data.img2) {
      avatar = this.data.img2
    }
    if (!attr1.name) {
      wx.showToast({
        title: '请填写宠物名字',
      })
    } else if (!this.data.gender[this.data.index].id) {
      wx.showToast({
        title: '请选择宠物品种',
        icon: 'none'
      })
    } else if (!attr1.weight) {
      wx.showToast({
        title: '请填写宠物体重',
        icon: 'none'
      })
    }
    else if (!specs) {
      wx.showToast({
        title: '请选择体毛犬型',
        icon: 'none'
      })
    } else if (!attr1.age) {
      wx.showToast({
        title: '请选择宠物年龄',
        icon: 'none'
      })
    } else if (!avatar) {
      wx.showToast({
        title: '请选择宠物靓照',
        icon: 'none'
      })
    } else {
      let a = this.data.edit_id;
    // console.log(typeof this.data.fromdata.type, typeof attr1.name, typeof this.data.gender[this.data.index].id, typeof attr_values, typeof attr1.age, typeof attr1.weight, typeof specs,)
    //   console.log(this.data.img1, this.data.img2)
      wx.request({
        url: url.api + `/ucs/v1/member/pet/${a}`, // 仅为示例，并非真实的接口地址
        method: "PUT",
        data: {
          type: this.data.fromdata.type,
          name: attr1.name,
          breed_id: this.data.gender[this.data.index].id,
          attr_values: attr_values,
          // gender: breed_id,
          age: attr1.age,
          weight: attr1.weight,
          specs: specs,
          avatar_default_check: 1,
          avatar: this.data.img1 ? this.data.img1 :this.data.img2,
        },
        header: {
          'content-type': 'application/json', // 默认值
          "Authorization": app.token
        },
        success: (res) => {
          console.log(res.data)
          if (res.data.code == 200) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }

  },
  // 删除宠物
  deletPets() {
    let id = this.data.edit_id;
    wx.showModal({
      title: '提示',
      content: '确定要删除当前宠物信息吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url.api + `/ucs/v1/member/pet/${id}`, // 仅为示例，并非真实的接口地址
            method: "DELETE",
            header: {
              'content-type': 'application/json', // 默认值
              "Authorization": app.token
            },
            success: (res) => {
              console.log(res.data)
              if (res.data.code == 200) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})