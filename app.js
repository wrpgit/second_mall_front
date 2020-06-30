//app.js
App({
  globalData: {
    userInfo: null,
    openid:"",
    sessionId: "",
    navbar:[],
    school:[],
    // beforeURL: "http://localhost:8080/second/",
    beforeURL: "https://www.wrpxcx.com/second_war/",
    schoolIndex: "",
    socketStatus: "closed",
  },
  
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    var that = this;

    //获取openid
    this.getOpenid();
    // 获取用户信息
    if(this.globalData.openid == "") { 
      var that = this;
      setTimeout(function () {
        that.myGetUserInfo();
      }, 3000)
    } 
 
    //获取导航栏信息
    wx.request({
      url: that.globalData.beforeURL + 'getNavAndSchool',
      success: res=> {
        //console.log(res);
        var temp = res.data.nav;
        var navbar = [];
        for (var i = 0; i < temp.length; i++) {
          navbar.push(temp[i].kindName);
        }
        this.globalData.navbar = navbar;

        var school = [];
        temp = res.data.school;
        for(var i = 0; i < temp.length; i++){
          school.push(temp[i].schoolName);
        }
        this.globalData.school = school;
      },
      fail: res=> {
        console.log("获取导航栏信息失败");
      }
    })
  },
  getOpenid: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.beforeURL + 'login',
          data: {
            code: res.code
          },
          success: e => {
            console.log(e);
            this.globalData.openid = e.data.openid;
            this.globalData.sessionId = e.data.sessionId;
            this.globalData.schoolIndex = e.data.schoolIndex;
            //console.log(e.data);
            console.log("登陆成功");
            console.log(this.globalData.openid + "  sessionid: " + this.globalData.sessionId);

          },
          fail: function (e) {
            console.log("登陆失败");
          }
        })
      }
    })
  },
  myGetUserInfo: function(){
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              //console.log(res);
              that.globalData.userInfo = res.userInfo;

              wx.request({
                url: that.globalData.beforeURL + 'updateUserInfo',
                header: {
                  'content-type': 'application/json',
                  Cookie: "JSESSIONID=" + that.globalData.sessionId
                },
                data:{
                  openid: that.globalData.openid,
                  iv: res.iv,
                  encryptedData: res.encryptedData
                },
                success: function(e){
                  console.log("success");
                }
              })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  openSocket() {
    var that = this;
    // 打开信道
    wx.connectSocket({
      // url: "ws://localhost:7777?openid=" + that.globalData.openid,
      url: "wss://" + "www.wrpxcx.com/wss/?openid=" + that.globalData.openid,
      header: {
        'content-type': 'application/json',
      }
    })
    //打开时的动作
    wx.onSocketOpen(() => {

      console.log('WebSocket 已连接');
      that.globalData.socketStatus = 'connected';
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      that.globalData.socketStatus = 'closed'
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })

  },

  //关闭信道
  closeSocket() {
    if (this.globalData.socketStatus === 'connected') {
      wx.closeSocket({
        success: () => {
          this.globalData.socketStatus = 'closed'
        }
      })
    }
  },
  filterEmoji: function(name){

    var str = name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "");

    return str;

  }


})