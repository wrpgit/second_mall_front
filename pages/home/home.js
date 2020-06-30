// pages/home/home.js
const app = getApp();
Page({
  data: {
    navbar:[],
    currentTab: 0,         //当前导航栏是哪个
    number: 6,             //每次请求商品数量
    nowNumber: 0,          //当前显示的商品数量
    isHavaMore: "none",    //记录当前类别是否还有未加载的，none 为还有未加载的
    list: [],               //商品列表
    beforeURL: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      navbar: app.globalData.navbar,
      beforeURL: app.globalData.beforeURL
    })
    //this.loadData(this.data.nowNumber);
    setTimeout(function () {
      that.loadData(that.data.nowNumber);
      that.setData({
        navbar: app.globalData.navbar,
        beforeURL: app.globalData.beforeURL
      })
    }, 2000)
  },

onShow: function(){
  var that = this;
  this.setData({
    navbar: app.globalData.navbar,
    beforeURL: app.globalData.beforeURL
  })
  setTimeout(function () {
    if (app.globalData.openid != "" && app.globalData.openid != undefined && app.globalData.socketStatus === "closed"){
      app.openSocket();
    }
  }, 2000)
  this.loadData(this.data.nowNumber);
},


  /*
  * 改变导航栏事件
  */
  navbarTap:function(e){
    var that = this;
    if (e.currentTarget.dataset.idx == that.data.currentTartab)
      return;
    this.setData({
      currentTab: e.currentTarget.dataset.idx, 
      nowNumber: 0,
      list: [],
      isHavaMore: "none"
    })
    this.loadData(0);
  },

  /*
  * 加载商品，请求当前类别的nowNumber后面number个
  */
  loadData: function(nowNumber){
    var that = this;
     wx.request({
       url: that.data.beforeURL + 'getHomeGoodsPage',
       data:{
         openid: getApp().globalData.openid,
         number: that.data.number,
         nowNumber: nowNumber,
         kindId: that.data.currentTab
       },
       header: { 'Content-Type': 'application/json'},
       success: res=>{
         var len = res.data.length;
         if(len != 0){
           var dataArr = that.data.list
           var newData = dataArr.concat(res.data);
           console.log(newData);
           that.setData({
              list: newData,
              nowNumber: nowNumber + len
            })
         }
         else{ 
           console.log(res);
           that.setData({isHavaMore: "block"})
         }
       },
       fail: res=>{
         console.log("加载失败");
         console.log(res);
       }
     })
  },

/*
* 滑屏到底部触发事件
*/
  onReachBottom: function (e) {
    var that = this;

    if (that.data.isHavaMore == "none")
      this.loadData(this.data.nowNumber);
    else {
      console.log(that.data.isHavaMore);
      console.log("以加载到最底部");
    }
  },
  //点击进入详情页
  toDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var goodsId = this.data.list[id].goodsId;
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?goodsId=' + goodsId
    })
  },
  bindfocus: function () {
    wx.navigateTo({
      title: "返回",
      url: '../search/search'
    })
  },

  changeData: function () {
    this.setData({
      list: []
    })
    this.loadData(0);
  }

})