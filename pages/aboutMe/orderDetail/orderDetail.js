// pages/aboutMe/orderDetail/orderDetail.js
const app = getApp();
Page({

  data: {
    openid: "",
    goodsId: "",
    goodsDetail: [],
    school: [],
    beforeURL: "",
    data: {}
  }, 

  onLoad: function (option) {
    var that = this;
    console.log(option);
    var data = JSON.parse(option.data);
    console.log(data);
    //console.log(options);
    that.setData({
      //goodsId: options.goodsId,
      openid: app.globalData.openid,
      data: data,
      beforeURL: app.globalData.beforeURL,
      school: app.globalData.school
    })
  },

  /**查看大图 */
  preView: function () {
    const imgs = [this.data.beforeURL + this.data.goodsDetail.goodsImage];
    wx.previewImage({
      current: imgs,  //当前预览的图片
      urls: imgs,//所有要预览的图片
    })
  },

  /**取消这个订单 */
  cancelOrder: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];

    wx.showModal({
      title: '提示',
      content: '确定要取消这个订单吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'cancelOrder',
            data: {
              openid: that.data.openid,
              orderId: that.data.data.orderId
            },
            success: function () {
              console.log("success to delete");
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
              beforePage.changeData();
              wx.navigateBack({
                delta: 1,
              })
            },
            fail(res) {
              consolg.log("删除失败");
              console.log(res);
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //买家确认收货
  buyFinish: function(){
    var that = this;
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    wx.showModal({
      title: '确认收货',
      content: '请与商家联系，东西已经拿到且付过款后，在确认收货',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'updateOrderStatus',
            data: {
              orderId: that.data.data.orderId, 
              status: 2                       //买家确认收货的状态
            },
            success: function () {
              console.log("成功确认收货");
              wx.showToast({
                title: '确认收货成功',
                icon: 'success',
                duration: 2000
              })
              beforePage.changeData();
              wx.navigateBack({
                delta: 1,
              })
            },
            fail(res) {
              consolg.log("操作失败");
              console.log(res);
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sailFinish: function(){
    var that = this;
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    wx.showModal({
      title: '完成订单',
      content: '请与与买主联系后，已经将商品交到买主手中，且收到了付款后，在确认',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'updateOrderStatus',
            data: {
              orderId: that.data.data.orderId,
              status: 3                       //商家家确认收货的状态
            },
            success: function () {
              console.log("确认完成订单");
              wx.showToast({
                title: '订单完成',
                icon: 'success',
                duration: 2000
              })
              beforePage.changeData();
              wx.navigateBack({
                delta: 1,
              })
            },
            fail(res) {
              consolg.log("操作失败");
              console.log(res);
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  makeOrder: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要下单吗？(可以点联系商家查看商家的昵称)',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'addOrder',
            data: {
              openid: that.data.openid,
              sailOpenid: that.data.goodsDetail.openid,
              goodId: that.data.goodsId
            },
            success: function (e) {
              if (e.data.status == "200") {
                wx.showToast({
                  title: '下单成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  contect: function (e) {
    var that = this;
    var buyOpenid = that.data.data.buyOpenid;
    var sailOpenid = that.data.data.sailOpenid;
    var friendOpenid;
    console.log(that.data.data);
    if(that.data.openid == buyOpenid){
      friendOpenid = sailOpenid;
    }
    else{
     friendOpenid = buyOpenid;
    }
    
    wx.navigateTo({
      title: "返回",
      url: "../../messageList/message/message?friendOpenid=" + friendOpenid,

    })
  }
  
})