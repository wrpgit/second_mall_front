// pages/goodsDetail/goodDetail.js
Page({

  data: {
    openid: "",
    goodsId: "",
    goodsDetail: [],
    school: [],
    beforeURL: "",
    shoperInfo: {}
  },

  onLoad: function (options) {
    var that = this;
    //console.log(options);
    that.setData({
      goodsId: options.goodsId,
      openid: getApp().globalData.openid,
      school: getApp().globalData.school,
      beforeURL: getApp().globalData.beforeURL
    })
    wx.request({
      url: that.data.beforeURL + 'getGoodsDetail',
      data: {
        goodsId: that.data.goodsId
      },
      success: res=> {
        //console.log(res);
        that.setData({
          goodsDetail: res.data,
        })
        wx.request({
          url: that.data.beforeURL + 'getUserByOpenid',
          data: {
            openid: res.data.openid
          },
          success: e => {
            that.setData({
              shoperInfo: e.data
            })
          }
        })
      }
    })
  },

  //进入商家页面
  toShoper: function () {
    var that = this;
    
    let pages = getCurrentPages();
    console.log("页面深度为： " + pages.length); 
    if(pages.length >= 4){
      return;
    }
    var data = JSON.stringify(that.data.shoperInfo);
    wx.navigateTo({
      title: "返回",
      url: "../shoper/shoper?shoperInfo=" + data,
    })
  },


changeData:function(goodsId){
  var that = this;
  wx.request({
    url: that.data.beforeURL + 'getGoodsDetail',
    data: {
      goodsId: goodsId
    },
    success: function (res) {
      console.log(res);
      that.setData({
        goodsDetail: res.data,
      })
      console.log(res);
    }
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

  /**删除此物品 */
  cancel: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'deleteGoods',
            data: {
              openid: that.data.openid,
              goodsId: that.data.goodsId
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

  //跳转到修改信息界面
  change: function (e) {
    var that = this;
    wx.navigateTo({
      title: "返回",
      url: "../updateGoods/updateGoods?goodsId=" + that.data.goodsId,
    })
  },

  makeOrder: function(){
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");
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
                    goodsId: that.data.goodsId
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
        } else {
          wx.showModal({
            title: '提示',
            content: '请先到我的界面中登陆',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
              else {
                console.log("用户点击取消");
              }
            }
          })
        }
      }
    })
   
  },
  contect: function(e){
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");
          wx.navigateTo({
            title: "返回",
            url: "../messageList/message/message?friendOpenid=" + that.data.goodsDetail.openid,

          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请先到我的界面中登陆',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
              else {
                console.log("用户点击取消");
              }
            }
          })
        }
      }
    })
  
  }

})