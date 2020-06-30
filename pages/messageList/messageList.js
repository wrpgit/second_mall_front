// pages/messageList/messageList.js
const app = getApp();
Page({
  data: {
    openid: "",
    messageList: [],
    sendOpenid: "",
    beforeURL:""
  },

  onLoad: function (options) {
    var that = this;
  
    this.setData({
      openid: app.globalData.openid,
      beforeURL: app.globalData.beforeURL
    })
    wx.request({
      url: that.data.beforeURL + 'getMessageList',
      data: {
        openid: that.data.openid
      },
      success: function (res) {
        that.setData({
          messageList: res.data
        })
        console.log(res);
      }
    })
    if (app.globalData.openid != "" &&
      app.globalData.openid != "undefined"
      && app.globalData.socketStatus === 'closed') {
        getApp().openSocket();
      }
    wx.onSocketMessage(res => {   //res为返回的消息
      wx.request({
        url: that.data.beforeURL + 'getMessageList',
        data: {
          openid: that.data.openid
        },
        success: function (res) {
          that.setData({
            messageList: res.data
          })
          console.log(res);
        }
      })
    })

  },
  onShow: function (options) {
    //每次更新列表
    var that = this;
    if (app.globalData.openid == "" || app.globalData.openid == undefined) {
      app.getOpenid();
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权");

        } else {
          wx.showModal({
            title: '提示',
            content: '请先到我的界面中进行授权, 否则无法发送消息',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
              else {
                console.log("用户点击取消");
                wx.switchTab({
                  url: '../aboutMe/aboutMe', //跳转到授权页面
                })
              }
            }
          })
        }
      }
    })
    wx.request({
      url: that.data.beforeURL + 'getMessageList',
      data: {
        openid: that.data.openid
      },
      success: function (res) {
        that.setData({
          messageList: res.data
        })
        //console.log(res);
      }
    })
  },
  showDetail: function (e) {
    var that = this;
    var friendOpenid = "";
    if (that.data.messageList[e.currentTarget.dataset.id].toOpenid == that.data.openid) {
      friendOpenid = that.data.messageList[e.currentTarget.dataset.id].fromOpenid;
      //如果最后一条消息是本人发的，未读消息大于0，就清空未读消息
      if (that.data.messageList[e.currentTarget.dataset.id].notReadNum != 0) {
        wx.request({
          url: that.data.beforeURL + 'zeroNotReadNum',
            data: {
            fromOpenid: that.data.messageList[e.currentTarget.dataset.id].fromOpenid,
            toOpenid: that.data.messageList[e.currentTarget.dataset.id].toOpenid
          }
        })
      }
    } else {
      friendOpenid = that.data.messageList[e.currentTarget.dataset.id].toOpenid;
    }
    wx.navigateTo({
      title: "返回",
      url: "./message/message?friendOpenid=" + friendOpenid,

    })
  },

})