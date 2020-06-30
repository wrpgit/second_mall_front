// pages/myPublic/myPublic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
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
     this.setData({
       openid: getApp().globalData.openid,
       beforeURL: getApp().globalData.beforeURL
     })
     this.loadData(0);
  },

  /*
* 加载商品，请求当前类别的nowNumber后面number个
*/
  loadData: function (nowNumber) {
    var that = this;
    wx.request({
      url: that.data.beforeURL + 'getMyPublicGoods',
      data: {
        openid: getApp().globalData.openid,
        number: that.data.number,
        nowNumber: nowNumber,
       // kindId: that.data.currentTab
      },
      header: { 'Content-Type': 'application/json' },
      success: res => {
        var len = res.data.length;
        if (len != 0) {
          var dataArr = that.data.list
          var newData = dataArr.concat(res.data);
          console.log(newData);
          that.setData({
            list: newData,
            nowNumber: nowNumber + len
          })
        }
        else {
          that.setData({ isHavaMore: "block" })
        }
      },
      fail: res => {
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
  changeData: function () {
    this.setData({
      list: []
    })
    this.loadData(0);
  }

})