// app.js - 考研AI助手
App({
  globalData: {
    userInfo: null,
    // API配置 - 替换为你的真实配置
    apiBaseUrl: 'https://your-server.com/api',
    // 大模型API配置（示例用DeepSeek，可替换为豆包/通义等）
    aiApiUrl: 'https://api.deepseek.com/v1/chat/completions',
    aiApiKey: 'sk-your-api-key-here',
    // 用户学习数据
    studyStats: {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0,
      lastStudyDate: null
    }
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token')
    if (token) {
      this.globalData.isLoggedIn = true
    }

    // 初始化学习统计
    const stats = wx.getStorageSync('studyStats')
    if (stats) {
      this.globalData.studyStats = stats
    }

    // 检查今天是否已学习
    const today = new Date().toDateString()
    if (stats && stats.lastStudyDate !== today) {
      this.globalData.studyStats.studyDays += 1
      this.globalData.studyStats.lastStudyDate = today
      wx.setStorageSync('studyStats', this.globalData.studyStats)
    }
  },

  // 全局方法：调用AI接口
  callAI(messages, callback) {
    wx.request({
      url: this.globalData.aiApiUrl,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.globalData.aiApiKey}`
      },
      data: {
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      },
      success(res) {
        if (res.data && res.data.choices && res.data.choices[0]) {
          callback(null, res.data.choices[0].message.content)
        } else {
          callback('AI返回格式异常', null)
        }
      },
      fail(err) {
        callback(err.errMsg || '网络请求失败', null)
      }
    })
  }
})
