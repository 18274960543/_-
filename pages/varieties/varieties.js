const Page = require('../../utils/ald-stat.js').Page;
let url = require('../../utils/config.js')
const app = getApp()
const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18
Page({
  data: {
    toView: '',
    logs: [],
    scrollTop: 0,
    HOT_NAME: '热',
    HOT_SINGER_LEN: 5,
    listHeight: [],
    currentIndex: 0,
    fixedTitle: '',
    fixedTop: 0,
    cli:0,
    list: [
    ],
    imgUrls:[
      { img: '/img/xizao.png', text:"泰迪犬"},
      { img: '/img/xizao.png', text: "泰迪犬" },
      { img: '/img/xizao.png', text: "泰迪犬" },
    ],
    name:""
  },
  onLoad: function () {
    // 宠物品种接口数据
    this.varieties_data()
    //  let list = this.data.list;
      
    // this.setData({
    //   logs: this._normalizeSinger(list)
    // })
    this._calculateHeight()
    // console.log(that.data.logs)
  },
  _normalizeSinger(list) {
    //宠物品种列表渲染
    let map = {
      hot: {
        title: this.data.HOT_NAME,
        items: []
      }
    }
    list.forEach((item, index) => {
      if (index < this.data.HOT_SINGER_LEN) {
        map.hot.items.push({
          name: item.name,
          avatar: item.img,
          avatar1: item.avtatar1
        })
      }
      
      const key = item.index
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push({
        name: item.name,
        avatar: item.img
      })
       
    })
    // console.log(list)
    // 为了得到有序列表，我们需要处理 map
    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]
      if (val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === this.data.HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  },
  scroll: function (e) {
    var newY = e.detail.scrollTop;
    this.scrollY(newY);
  },
  scrollY(newY) {
    // console.log('vv')
    const listHeight = this.data.listHeight
    // 当滚动到顶部，newY>0
    if (newY == 0 || newY < 0) {
      this.setData({
        currentIndex: 0,
        fixedTitle: ''
      })
      return
    }
    
    // 在中间部分滚动
    for (let i = 0; i < listHeight.length - 1; i++) {
      let height1 = listHeight[i]
      let height2 = listHeight[i + 1]
      if (newY >= height1 && newY < height2) {
        console.log(listHeight.length)
        let index = this.data.cli;
        // console.log(index)
        if(this.data.cli > 0){
          this.setData({
            currentIndex: index,
            fixedTitle: this.data.logs[index].title,
            cli:0,
          })
        } else {
          this.setData({
            currentIndex: i,
            fixedTitle: this.data.logs[i].title
          })
        }
        
        this.fixedTt(height2 - newY);
        return
      } 
    }
    // 当滚动到底部，且-newY大于最后一个元素的上限
    // console.log(listHeight.length - 2)
    // this.setData({
    //   currentIndex: listHeight.length - 2,
    //   fixedTitle: this.data.logs[listHeight.length - 2].title
    // })
  },
  fixedTt(newVal) {
    let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
    if (this.data.fixedTop === fixedTop) {
      return
    }
    this.setData({
      fixedTop: fixedTop
    })
  },
  _calculateHeight() {
    var lHeight = [],
      that = this;
    let height = 0;
    lHeight.push(height);
    var query = wx.createSelectorQuery();
    query.selectAll('.list-group').boundingClientRect(function (rects) {
      var rect = rects,
        len = rect.length;
      for (let i = 0; i < len; i++) {
        height += rect[i].height;
        lHeight.push(height)
      }

    }).exec();
    var calHeight = setInterval(function () {
      if (lHeight != [0]) {
        that.setData({
          listHeight: lHeight
        });
        clearInterval(calHeight);
      }
    }, 1000)
  },
  scrollToview(e) {
    var id = e.target.dataset.id[0];
    let index = e.target.dataset.id[1];
    // console.log(index)

    if (id == 'A') {
      this.setData({
        scrollTop: 0,
        currentIndex: index,
        cli:index,
      })
    } else {
      this.setData({
        toView: id,
        cli: index,
        currentIndex: index,
      })
    }

  },
  // 选宠物品种
  selectedVarieties(e){
    // console.log(e)
    let index = e.currentTarget.dataset.index[0];
    let index1 = e.currentTarget.dataset.index[1]
    // console.log(index)
    let logs=this.data.logs;
    if(logs[index].items[index1].avatar){
      logs[index].items[index1].avatar = false;
      this.setData({
        logs
      })
      return
  } else {
     this.setData({
       name:logs[index].items[index1].name
     })
     console.log(this.data.name)
  }
    logs.map((item)=>{
      item.items.map((index)=>{
        index.avatar=false
      })
    })
    logs[index].items[index1].avatar = !this.data.logs[index].items[index1].avatar;
    this.setData({
      logs
    })
  },
  // 宠物品种接口数据
  varieties_data(){
    wx.request({
      url: url.api + '/ucs/v1/pet/breed', // 仅为示例，并非真实的接口地址
      data: {
      },
      method: "get",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        let list = res.data.data;
        let newlist=list.map((item)=>{
          return { "index": item.lette, "name": item.name, "img": "", "avtatar1": item.avatar, "popular": item.popular}
        })
        this.setData({
             list:newlist,
          logs: this._normalizeSinger(newlist)
        })
        // console.log(this.data.list);
        console.log(this.data.logs)
      }
    })
  }
})