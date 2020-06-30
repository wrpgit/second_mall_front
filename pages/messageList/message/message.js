// pages/messageList/message/message.js

const app = getApp();

  Page({
    data: {
      openid: "",
      message: [],
      length: 0,
      friendOpenid: "",
      friendName:"",
      friendHeadAddress: "",
      myName:"",
      myHeadAddress: "",
      words: "",
      isShow1:"none",
      isShow2: "block",
      beforeURL: ""
    },
    
    onLoad: function (options) {
    var that = this;
    console.log("查看用户信息");
    console.log(app.globalData.userInfo);
    that.setData({
      friendOpenid: options.friendOpenid,
      openid: app.globalData.openid,
      myHeadAddress: app.globalData.userInfo.avatarUrl,
      myName: app.globalData.userInfo.nickName,
      beforeURL: app.globalData.beforeURL,
    })
    wx.request({
      url: that.data.beforeURL + 'getUserByOpenid',
      data:{
        openid: that.data.friendOpenid
      },
      success: res=>{
        that.setData({
          friendName: res.data.userName,
          friendHeadAddress: res.data.headAddress
        })
      }
    })
    wx.request({
      url: that.data.beforeURL + 'getMessage',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        method: "POST"
      },
      data: {
        fromOpenid: that.data.openid,
        toOpenid: that.data.friendOpenid
      },
      success: function (res) {
        that.setData({
          message: res.data,
          length: res.data.length,
        })
       // console.log(res);
        that.pageScrollToBottom();
      }
    })
    wx.onSocketMessage(res => {   //res为返回的消息
      //把JSONStr转为JSON
      res = res.data.replace(" ", "");
      if (typeof res != 'object') {
        res = res.replace(/\ufeff/g, ""); //重点
        var jj = JSON.parse(res);
        res = jj;
      }
      console.log("【websocket监听到消息】内容如下：");
      console.log(res);

      if (res.toOpenid == that.data.openid) {
        var temp = that.data.message;
        console.log("进入if");
        temp.push({
          "context": res.message,
          "time": "",
          "fromHeadaddr": res.fromHeadaddr,
          "fromName": "",
          "fromOpenid": res.fromOpenid
        })
        console.log(temp);
        that.setData({
          message: temp,
          words: ""
        })
        that.pageScrollToBottom();
      }
    })
  },
  sendMessage: function () {
    var that = this;
    // console.log("长度："  + that.data.words.length);  
    if (that.data.words.length > 0 && app.globalData.socketStatus == "connected") {
      wx.sendSocketMessage({
        data: "{\"fromOpenid\":\"" + that.data.openid + "\","
          + "\"toOpenid\":\"" + that.data.friendOpenid + "\","
          + "\"message\":\"" + that.data.words
          + "\"}",
        success: function (res) {
          var temp = that.data.message;
          temp.push({
            "context": that.data.words,
            "time": "",
            "fromHeadaddr": app.globalData.userInfo.avatarUrl,
            "fromName": app.globalData.userInfo.nickName,
            "fromOpenid": that.data.openid
          })
          console.log(temp);
          that.setData({
            message: temp,
            words: ""
          })
          that.pageScrollToBottom();
        }
      })
    }
  },
  inputWord: function (e) {
    var that = this;
    // console.log("查看数字变动：");
    // console.log(e);
    var value = e.detail.value;
    var str = app.filterEmoji(value);
    var len = parseInt(str.length);
    if (len <= 255) {
      this.setData({
        words: str
      })
    }
  },
  wordFoucus: function () {
    this.setData({
      isShow1: "block",
      isShow2: "none"
    })
  },
  wordBlur: function () {
    this.setData({
      isShow1: "none",
      isShow2: "block"
    })
  },
  clickText: function () {
    this.wordFoucus();
  },
  pageScrollToBottom: function () {
    wx.createSelectorQuery().in(this).select('#all').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      //console.log(rect);
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },
  /** 点击返回后跳转到消息列表 */
  onUnload: function () {
    var pages = getCurrentPages();
    var beforePage = pages[pages.length - 2];
    wx.navigateBack({
      delta: 1,
    })
  },
})
