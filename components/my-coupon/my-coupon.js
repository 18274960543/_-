// components/my-coupon/my-coupon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow:{
       type:Boolean,
    },
  
  },
  externalClasses:['titleclass'],//传过来的样式 接收
  /**
   * 组件的初始数据
   */
  data: {
    num:0,
    total:0
  },
  /**
   * 组件的方法列表
   */
  methods: {
     handerNmu(){
       this.triggerEvent('handBut',{num:this.data.num})
     }
  }
})
