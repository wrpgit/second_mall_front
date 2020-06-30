// pages/aboutMe/reback/reback.js
Page({

  data: {
    message: "",
    beforeURL: ""
  },
  onLoad(){
    this.setData({
      beforeURL: getApp().globalData.beforeURL
    })
  },
  inputMessage(e) {
    this.setData({
      message: e.detail.value
    })
  },
  submit(res) {
    var message = this.data.message;
    var that = this;
    if (message.length > 0) {
      wx.request({
          url: that.data.beforeURL + 'feedback',
          data: {
          openid: getApp().globalData.openid,
          context: message
        },
        success(res) {
          console.log("反馈意见成功");
          wx.showToast({
            title: '感谢您的反馈',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            message: ""
          })
        },
        fail(res) {
          console.log("反馈失败" + res);
        }
      })
    }
  }
})