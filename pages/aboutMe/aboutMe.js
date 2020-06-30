// pages/aboutMe/aboutMe.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid: "",
    hasAuth: false,
    school: [],
    schoolIndex: "",
    beforeURL: ""
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.openid == "" || app.globalData.openid == "undefined") {
      setTimeout(function () {
        if (app.globalData.openid != "" &&
          app.globalData.openid != "undefined") {

          app.getOpenid();
        }
      }, 3000)
    }
    this.setData({
      school: app.globalData.school,
      schoolIndex: app.globalData.schoolIndex,
      openid: app.globalData.openid,
      beforeURL: app.globalData.beforeURL
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                hasAuth: true
              })
            }
          })
        }
      }
    })
  },
  onShow: function(){
    if (app.globalData.openid == "" || app.globalData.openid == undefined) {
      app.getOpenid();
    }
  },
  bindAuth: function(e) {
    console.log(e);
    var that = this;
    wx.getSetting({ 
      success: (res) => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (e) {
              console.log("获取到的用户信息：");
              console.log(e);
              app.globalData.userInfo = e.userInfo;
              that.setData({
                hasAuth: true
              })
              setTimeout(function () {
                app.myGetUserInfo(); 
              }, 2000)
             
            },
            fail: function (res) {
              console.log("fail to ge userInfo");
              console.log(res);
            }
          })
        }
      }
    })
  },
  myPublic: function () {

    wx.navigateTo({
      title: "返回",
      url: "../myPublic/myPublic"
    })
  },
  reback: function () {
    wx.navigateTo({
      url: '../reback/reback',
    })
  },
  myOrder: function () {
    wx.navigateTo({
      url: './myOrder/myOrder',
    })
  },
  otherOrder: function () {
    wx.navigateTo({
      url: './otherOrder/otherOrder',
    })
  },
  myBuy: function(){
    wx.navigateTo({
      url: './myBuy/myBuy',
    })
  },
  mySail: function(){
    wx.navigateTo({
      url: './mySail/mySail',
    })
  },
  reback: function(){
    wx.navigateTo({
      url: './reback/reback',
    })
  },

  changeData: function () {
    this.setData({
      list: []
    })
    this.loadData(0);
  },


  //修改学校
  schoolChange: function(e){
    var that = this;
    wx.showModal({
      title: '注意',
      content: '只能看见本学校的商品，更改学校后不会自动更新你已经发布商品的所属学校',
      success: function (sm) {
        if (sm.confirm) {
          wx.request({
            url: that.data.beforeURL + 'updateUserSchool',
            data: {
              openid: that.data.openid,
              schoolIndex: e.detail.value
            },
            success: function (res) {
              if(res.data.status == "200"){
                console.log("成功更改学校");
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  schoolIndex: e.detail.value
                })
              }
            },
            fail(res) {
              console.log("修改失败");
              console.log(res);
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


})