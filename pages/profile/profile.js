// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    stats: {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0
    },
    targetSchool: ''
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStats()
    this.loadTargetSchool()
  },

  onShow() {
    this.loadStats()
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
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

  // 加载目标院校
  loadTargetSchool() {
    const school = wx.getStorageSync('targetSchool') || ''
    this.setData({ targetSchool: school })
  },

  // 设置目标院校
  setTargetSchool() {
    wx.showModal({
      title: '设置目标院校',
      content: '',
      editable: true,
      placeholderText: '例如：北京大学',
      success: (res) => {
        if (res.confirm && res.content) {
          const school = res.content.trim()
          this.setData({ targetSchool: school })
          wx.setStorageSync('targetSchool', school)
          wx.showToast({ title: '已设置', icon: 'success' })
        }
      }
    })
  },

  // 跳转页面
  goToPage(e) {
    const page = e.currentTarget.dataset.page
    switch (page) {
      case 'collections':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'wrongbook':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'history':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'plan':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'settings':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'feedback':
        wx.showToast({ title: '功能开发中', icon: 'none' })
        break
      case 'about':
        wx.showModal({
          title: '关于考研AI助手',
          content: '版本 1.0.0\n\n一款基于AI的考研备考工具，提供智能问答、刷题练习、学习规划等功能。\n\n祝你考研顺利！🎉',
          showCancel: false
        })
        break
    }
  },

  // 生成学习打卡图
  shareStudyCard() {
    wx.showToast({ title: '打卡图功能开发中', icon: 'none' })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '我在用考研AI助手备考，推荐给你！',
      path: '/pages/index/index'
    }
  }
})
