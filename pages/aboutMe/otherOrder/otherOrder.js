// pages/aboutMe/otherOrder/otherOrder.js
Page({

  data: {
    openid: "",
    list: [],               //商品列表
    beforeURL: "",
    isHaveMore: "none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid,
      beforeURL: getApp().globalData.beforeURL
    })
    this.loadData();
  },

  /*
* 加载我的订单
*/
  loadData: function () {
    var that = this;
    wx.request({
      url: that.data.beforeURL + 'getOrderByOpenid',
      data: {
        openid: getApp().globalData.openid,
        operation: 2
        // kindId: that.data.currentTab
      },
      header: { 'Content-Type': 'application/json;' },
      success: res => {
        var len = res.data.length;
        console.log(res);
        console.log(res.data.length);
        if (len != 0) {
          console.log(res.data);
          that.setData({
            list: res.data,
          })
        }
        else {
          that.setData({ isHaveMore: "block" })
        }
      },
      fail: res => {
        console.log("加载失败");
        console.log(res);
      }
    })
  },

  //点击进入详情页
  toDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var data = JSON.stringify(that.data.list[id]);
    wx.navigateTo({
      url: '../orderDetail/orderDetail?data=' + data
    })
  },
  changeData: function () {
    this.setData({
      list: []
    })
    this.loadData();
  }


})