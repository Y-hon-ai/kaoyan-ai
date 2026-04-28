// pages/chat/chat.js - AI问答核心逻辑
const app = getApp()

// 系统提示词 - 针对考研场景优化
const SYSTEM_PROMPTS = {
  politics: `你是一个专业的考研政治辅导AI助手。你的特点：
1. 精通马克思主义基本原理、毛泽东思想和中国特色社会主义理论体系、中国近现代史纲要、思想道德修养与法律基础、形势与政策
2. 回答问题时，先给出核心答案，再展开解释
3. 涉及知识点时，标注对应的教材章节
4. 如果是分析题，按照考研政治答题格式：原理+结合材料+总结
5. 用通俗易懂的语言解释复杂概念
6. 适当举例帮助理解`,

  english: `你是一个专业的考研英语辅导AI助手。你的特点：
1. 精通考研英语词汇、语法、阅读理解、翻译、写作
2. 解释单词时，给出：音标、词性、常用释义、真题例句、近义词辨析
3. 分析长难句时，先拆分句子结构，再逐部分翻译
4. 写作指导时，提供高分模板和亮点句型
5. 阅读理解讲解时，分析出题思路和干扰项设置
6. 所有英文内容附带中文翻译`,

  math: `你是一个专业的考研数学辅导AI助手。你的特点：
1. 精通高等数学、线性代数、概率论与数理统计
2. 解题步骤清晰，每一步都标注所用公式/定理
3. 对于计算题，展示完整的推导过程
4. 提供多种解题思路（如果存在）
5. 指出常见错误和易混淆点
6. 关联相关知识点，帮助构建知识网络
7. 数学公式用LaTeX格式表示`,

  professional: `你是一个专业的考研专业课辅导AI助手。你的特点：
1. 根据学生报考的院校和专业，提供针对性指导
2. 解释专业概念时，由浅入深
3. 结合历年真题分析出题规律
4. 提供知识框架和思维导图式的梳理
5. 推荐相关的参考书目和学习资源`
}

Page({
  data: {
    messages: [],
    inputValue: '',
    scrollToMessage: '',
    isLoading: false,
    currentSubject: 'politics',
    subjects: [
      { id: 'politics', name: '政治', emoji: '📕' },
      { id: 'english', name: '英语', emoji: '📗' },
      { id: 'math', name: '数学', emoji: '📘' },
      { id: 'professional', name: '专业课', emoji: '📙' }
    ],
    quickQuestions: [
      '什么是剩余价值？如何理解？',
      '帮我分析一下这个长难句',
      '求导的链式法则怎么用？',
      '帮我制定本月复习计划'
    ],
    quickQuestionsMap: {
      ask: ['解释一下矛盾的普遍性和特殊性', '什么是唯物辩证法？', '如何理解实践是检验真理的唯一标准？'],
      explain: ['用通俗的话解释一下什么是通货膨胀', '什么是边际效用递减？', '帮我梳理一下近代史的时间线'],
      plan: ['帮我制定3个月的考研复习计划', '每天应该复习多少小时？', '如何分配各科复习时间？']
    },
    msgIdCounter: 0,
    chatHistory: [] // 用于上下文对话
  },

  onLoad() {
    const subject = wx.getStorageSync('currentSubject') || 'politics'
    this.setData({ currentSubject: subject })
    this.loadChatHistory()
  },

  // 切换学科
  switchSubject(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentSubject: id })
    wx.setStorageSync('currentSubject', id)
    
    // 更新快捷问题
    const questions = this.data.quickQuestionsMap[id] || this.data.quickQuestions
    this.setData({ quickQuestions: questions })
  },

  // 设置快捷问题（从首页跳转）
  setQuickQuestion(type) {
    const questions = this.data.quickQuestionsMap[type]
    if (questions) {
      this.setData({ quickQuestions: questions })
    }
  },

  // 输入事件
  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  // 发送消息
  sendMessage() {
    const content = this.data.inputValue.trim()
    if (!content || this.data.isLoading) return

    // 添加用户消息
    const userMsg = this.addMessage('user', content)
    
    // 清空输入
    this.setData({ inputValue: '' })

    // 添加AI消息占位
    const aiMsg = this.addMessage('assistant', '', true)

    // 调用AI
    this.callAI(content, aiMsg.id)
  },

  // 发送快捷问题
  sendQuickQuestion(e) {
    const text = e.currentTarget.dataset.text
    this.setData({ inputValue: text })
    this.sendMessage()
  },

  // 添加消息到列表
  addMessage(role, content, loading = false) {
    const id = `msg-${++this.data.msgIdCounter}`
    const message = {
      id,
      role,
      content,
      htmlContent: this.parseMarkdown(content),
      loading,
      timestamp: Date.now()
    }

    const messages = [...this.data.messages, message]
    this.setData({
      messages,
      scrollToMessage: id
    })

    return message
  },

  // 更新消息
  updateMessage(msgId, content, loading = false) {
    const messages = this.data.messages.map(msg => {
      if (msg.id === msgId) {
        return {
          ...msg,
          content,
          htmlContent: this.parseMarkdown(content),
          loading
        }
      }
      return msg
    })
    this.setData({ messages, scrollToMessage: msgId })
  },

  // 调用AI接口
  callAI(userQuestion, aiMsgId) {
    this.setData({ isLoading: true })

    // 构建对话历史（保留最近10轮）
    const recentHistory = this.data.chatHistory.slice(-20)
    
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPTS[this.data.currentSubject] || SYSTEM_PROMPTS.politics
      },
      ...recentHistory,
      {
        role: 'user',
        content: userQuestion
      }
    ]

    // 使用app的callAI方法
    app.callAI(messages, (err, result) => {
      this.setData({ isLoading: false })

      if (err) {
        this.updateMessage(aiMsgId, `❌ 抱歉，出了点问题：${err}\n\n请稍后重试，或检查网络连接。`, false)
        return
      }

      // 更新AI消息
      this.updateMessage(aiMsgId, result, false)

      // 保存到对话历史
      this.data.chatHistory.push(
        { role: 'user', content: userQuestion },
        { role: 'assistant', content: result }
      )

      // 保存聊天记录
      this.saveChatHistory()

      // 更新学习统计
      this.updateStats()
    })
  },

  // 解析Markdown为HTML（简易版）
  parseMarkdown(text) {
    if (!text) return ''
    
    let html = text
      // 代码块
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // 行内代码
      .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2rpx 8rpx;border-radius:4rpx;font-size:24rpx;">$1</code>')
      // 加粗
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 标题
      .replace(/^### (.*$)/gm, '<h3 style="font-size:30rpx;font-weight:700;margin:16rpx 0 8rpx;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size:32rpx;font-weight:700;margin:20rpx 0 10rpx;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size:36rpx;font-weight:700;margin:24rpx 0 12rpx;">$1</h1>')
      // 无序列表
      .replace(/^\- (.*$)/gm, '<view style="padding-left:20rpx;margin:4rpx 0;">• $1</view>')
      // 有序列表
      .replace(/^\d+\. (.*$)/gm, '<view style="padding-left:20rpx;margin:4rpx 0;">$1</view>')
      // 换行
      .replace(/\n/g, '<br/>')

    return html
  },

  // 复制消息
  copyMessage(e) {
    const content = e.currentTarget.dataset.content
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 收藏消息
  collectMessage(e) {
    const id = e.currentTarget.dataset.id
    const msg = this.data.messages.find(m => m.id === id)
    if (!msg) return

    const collections = wx.getStorageSync('collections') || []
    collections.unshift({
      content: msg.content,
      subject: this.data.currentSubject,
      time: new Date().toLocaleString()
    })
    wx.setStorageSync('collections', collections.slice(0, 100))
    wx.showToast({ title: '已收藏', icon: 'success' })
  },

  // 清空对话
  clearChat() {
    wx.showModal({
      title: '清空对话',
      content: '确定要清空当前对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: [],
            chatHistory: []
          })
          this.saveChatHistory()
        }
      }
    })
  },

  // 语音输入
  useVoice() {
    wx.showToast({ title: '语音功能开发中', icon: 'none' })
  },

  // 拍照提问
  uploadImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // 这里可以接入OCR或图像识别API
        this.addMessage('user', '[图片] 我拍了一道题，请帮我分析')
        wx.showToast({ title: '图片识别功能开发中', icon: 'none' })
      }
    })
  },

  // 显示历史
  showHistory() {
    wx.showToast({ title: '历史记录功能开发中', icon: 'none' })
  },

  // 保存聊天记录
  saveChatHistory() {
    const key = `chatHistory_${this.data.currentSubject}`
    wx.setStorageSync(key, this.data.chatHistory.slice(-50))
  },

  // 加载聊天记录
  loadChatHistory() {
    const key = `chatHistory_${this.data.currentSubject}`
    const history = wx.getStorageSync(key) || []
    this.data.chatHistory = history

    // 将历史记录转为消息列表显示
    if (history.length > 0) {
      const messages = history.slice(-10).map((msg, index) => ({
        id: `history-${index}`,
        role: msg.role,
        content: msg.content,
        htmlContent: this.parseMarkdown(msg.content),
        loading: false,
        timestamp: Date.now()
      }))
      this.setData({
        messages,
        scrollToMessage: `msg-${messages.length - 1}`
      })
    }
  },

  // 更新学习统计
  updateStats() {
    const stats = wx.getStorageSync('studyStats') || {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0,
      lastStudyDate: null
    }
    stats.totalQuestions += 1
    const today = new Date().toDateString()
    if (stats.lastStudyDate !== today) {
      stats.studyDays += 1
      stats.lastStudyDate = today
    }
    wx.setStorageSync('studyStats', stats)
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '考研AI助手 - 不懂就问，秒回答案',
      path: '/pages/chat/chat'
    }
  }
})
