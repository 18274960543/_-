// components/my-coupon/my-coupon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
       type:String,
       value:'我是优惠劵组件',
       observer:function(newVal,oldVal){
         console.log(newVal, oldVal)//一个返回的是新值 一个返回的是旧值
       }
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
