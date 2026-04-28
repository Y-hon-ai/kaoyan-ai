// pages/index/index.js
const app = getApp()

Page({
  data: {
    greeting: '早上好',
    userName: '',
    daysLeft: 0,
    stats: {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0
    },
    currentSubject: 'politics',
    subjects: [
      { id: 'politics', name: '政治', emoji: '📕', progress: 0 },
      { id: 'english', name: '英语', emoji: '📗', progress: 0 },
      { id: 'math', name: '数学', emoji: '📘', progress: 0 },
      { id: 'professional', name: '专业课', emoji: '📙', progress: 0 }
    ],
    newsList: [
      {
        id: 1,
        tag: '政策',
        type: 'policy',
        title: '2027年研究生招生政策变化解读',
        date: '2026-04-28'
      },
      {
        id: 2,
        tag: '经验',
        type: 'exp',
        title: '双非逆袭985：我的备考时间表分享',
        date: '2026-04-27'
      },
      {
        id: 3,
        tag: '提醒',
        type: 'tips',
        title: '4月复习进度自查：你跟上了吗？',
        date: '2026-04-25'
      }
    ]
  },

  onLoad() {
    this.updateGreeting()
    this.calculateDaysLeft()
    this.loadStats()
    this.loadSubjectProgress()
  },

  onShow() {
    this.loadStats()
  },

  // 更新问候语
  updateGreeting() {
    const hour = new Date().getHours()
    let greeting = '早上好'
    if (hour >= 12 && hour < 14) greeting = '中午好'
    else if (hour >= 14 && hour < 18) greeting = '下午好'
    else if (hour >= 18) greeting = '晚上好'
    
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      greeting,
      userName: userInfo ? userInfo.nickName : ''
    })
  },

  // 计算距离考研天数
  calculateDaysLeft() {
    // 考研通常在12月倒数第二个周末
    const now = new Date()
    const year = now.getMonth() >= 9 ? now.getFullYear() + 1 : now.getFullYear()
    // 2027考研：2026年12月19-20日（预估）
    const examDate = new Date(year, 11, 19)
    const diff = examDate.getTime() - now.getTime()
    const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    this.setData({ daysLeft })
  },

  // 加载学习统计
  loadStats() {
    const stats = wx.getStorageSync('studyStats') || {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0
    }
    this.setData({ stats })
  },

  // 加载学科进度
  loadSubjectProgress() {
    const progress = wx.getStorageSync('subjectProgress') || {}
    const subjects = this.data.subjects.map(s => ({
      ...s,
      progress: progress[s.id] || 0
    }))
    this.setData({ subjects })
  },

  // 选择学科
  selectSubject(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentSubject: id })
    wx.setStorageSync('currentSubject', id)
    wx.showToast({ title: '已切换学科', icon: 'success' })
  },

  // 跳转到AI问答
  goToChat(e) {
    const type = e.currentTarget.dataset.type
    wx.switchTab({
      url: '/pages/chat/chat'
    })
    // 传递问题类型
    setTimeout(() => {
      const pages = getCurrentPages()
      const chatPage = pages[pages.length - 1]
      if (chatPage && chatPage.setQuickQuestion) {
        chatPage.setQuickQuestion(type)
      }
    }, 300)
  },

  // 跳转到刷题
  goToPractice() {
    wx.switchTab({
      url: '/pages/practice/practice'
    })
  },

  // 打开资讯
  openNews(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(url)}` })
    }
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '考研AI助手 - 不懂就问，高效备考',
      path: '/pages/index/index'
    }
  }
})
