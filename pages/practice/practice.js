// pages/practice/practice.js
const app = getApp()

// 示例题库（实际项目中应从服务器获取）
const QUESTION_BANK = {
  politics: [
    {
      type: '单选题',
      difficulty: 2,
      question: '唯物辩证法的实质和核心是（  ）',
      options: ['质量互变规律', '对立统一规律', '否定之否定规律', '联系和发展的规律'],
      answer: 1,
      explanation: '对立统一规律是唯物辩证法的实质和核心。它揭示了事物普遍联系的根本内容和变化发展的内在动力，是贯穿质量互变规律、否定之否定规律以及唯物辩证法基本范畴的中心线索，也是理解一切辩证法的钥匙。'
    },
    {
      type: '单选题',
      difficulty: 2,
      question: '马克思主义认为，世界的真正统一性在于它的（  ）',
      options: ['运动性', '存在性', '可知性', '物质性'],
      answer: 3,
      explanation: '世界的真正统一性在于它的物质性。世界是物质的，物质是运动的，运动是有规律的。这是辩证唯物主义最基本的原理。'
    },
    {
      type: '单选题',
      difficulty: 3,
      question: '"纸上得来终觉浅，绝知此事要躬行"，这句话强调的是（  ）',
      options: [
        '实践是认识的来源',
        '实践是认识发展的动力', 
        '实践是检验真理的唯一标准',
        '实践是认识的目的'
      ],
      answer: 0,
      explanation: '这句话出自陆游的《冬夜读书示子聿》，意思是说从书本上得到的知识终归是浅薄的，要真正理解还需要亲身实践。这强调了实践是认识的来源。'
    },
    {
      type: '多选题',
      difficulty: 3,
      question: '下列属于量变引起质变的有（  ）',
      options: [
        '水温升高到100度变为水蒸气',
        '在一定温度下鸡蛋变成小鸡',
        '由猿到人的转变',
        '货币积累到一定规模变成资本'
      ],
      answer: [0, 2, 3],
      explanation: '量变是事物数量的增减和次序的变动。A是温度的量变引起状态的质变；C是进化的量变引起物种的质变；D是货币量的积累引起性质的变化。B是外力作用（孵化）引起的质变，不属于纯粹的量变引起质变。'
    },
    {
      type: '单选题',
      difficulty: 2,
      question: '毛泽东思想活的灵魂的三个基本方面是（  ）',
      options: [
        '统一战线、武装斗争、党的建设',
        '实事求是、群众路线、独立自主',
        '理论联系实际、密切联系群众、批评与自我批评',
        '解放思想、实事求是、与时俱进'
      ],
      answer: 1,
      explanation: '毛泽东思想活的灵魂的三个基本方面是：实事求是、群众路线、独立自主。A是三大法宝；C是三大作风；D是邓小平理论和"三个代表"重要思想的概括。'
    }
  ],
  english: [
    {
      type: '单选题',
      difficulty: 2,
      question: 'The professor could hardly find sufficient grounds _____ his arguments in favor of the new theory.',
      options: ['to be based on', 'to base on', 'which to base on', 'on which to base'],
      answer: 3,
      explanation: '本题考查"介词+关系代词+不定式"结构。base...on...意为"以...为基础"，这里on which to base his arguments = to base his arguments on which (sufficient grounds)。注意：base是及物动词，需要宾语，所以用on which to base。'
    },
    {
      type: '单选题',
      difficulty: 3,
      question: '_____ the fact that his initial experiments had failed, Prof. White persisted in his research.',
      options: ['Because of', 'As to', 'In spite of', 'In view of'],
      answer: 2,
      explanation: '句意：尽管最初的实验失败了，White教授仍然坚持他的研究。in spite of = despite，表示"尽管"，引导让步关系。because of因为；as to关于；in view of鉴于。'
    }
  ],
  math: [
    {
      type: '单选题',
      difficulty: 2,
      question: '设f(x)在x=0处连续，且lim(x→0) [f(x)/x] = 1，则f(0) = （  ）',
      options: ['0', '1', '-1', '不存在'],
      answer: 0,
      explanation: '因为f(x)在x=0处连续，所以f(0) = lim(x→0) f(x)。又因为lim(x→0) [f(x)/x] = 1，即f(x) ~ x (x→0)，所以lim(x→0) f(x) = 0，故f(0) = 0。'
    },
    {
      type: '单选题',
      difficulty: 3,
      question: '∫(0到1) x·e^x dx = （  ）',
      options: ['1', 'e', 'e-1', '1/e'],
      answer: 0,
      explanation: '使用分部积分法：∫x·e^x dx = x·e^x - ∫e^x dx = x·e^x - e^x + C = (x-1)e^x + C。代入上下限：[(1-1)e^1] - [(0-1)e^0] = 0 - (-1) = 1。'
    }
  ],
  professional: [
    {
      type: '简答题',
      difficulty: 3,
      question: '请简述市场经济的基本特征。（以经济学为例）',
      options: [],
      answer: null,
      explanation: '市场经济的基本特征包括：1）市场主体的自主性——企业和个人作为独立的经济主体自主决策；2）市场关系的平等性——交易双方地位平等；3）市场活动的竞争性——通过竞争实现资源优化配置；4）市场发展的开放性——打破地域和行业壁垒；5）市场运行的有序性——需要法律和规则保障。'
    }
  ]
}

Page({
  data: {
    currentSubject: 'politics',
    subjects: [
      { id: 'politics', name: '政治', emoji: '📕' },
      { id: 'english', name: '英语', emoji: '📗' },
      { id: 'math', name: '数学', emoji: '📘' },
      { id: 'professional', name: '专业课', emoji: '📙' }
    ],
    streak: 0,
    isPracticing: false,
    showResult: false,
    currentIndex: 0,
    totalQuestions: 5,
    currentQuestion: null,
    questions: [],
    selectedOption: -1,
    userAnswer: '',
    hasAnswer: false,
    showAnswer: false,
    isCorrect: false,
    optionLabels: ['A', 'B', 'C', 'D', 'E', 'F'],
    // 结果统计
    resultCorrect: 0,
    resultWrong: 0,
    resultAccuracy: 0,
    resultEmoji: '🎉',
    resultTitle: '练习完成！'
  },

  onLoad() {
    const subject = wx.getStorageSync('currentSubject') || 'politics'
    this.setData({ currentSubject: subject })
    this.loadStreak()
  },

  // 加载连续学习天数
  loadStreak() {
    const stats = wx.getStorageSync('studyStats') || { studyDays: 0 }
    this.setData({ streak: stats.studyDays })
  },

  // 切换学科
  switchSubject(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentSubject: id })
    wx.setStorageSync('currentSubject', id)
  },

  // 开始练习
  startPractice(e) {
    const mode = e.currentTarget.dataset.mode
    const bank = QUESTION_BANK[this.data.currentSubject] || QUESTION_BANK.politics
    
    // 根据模式选择题目
    let questions = []
    switch (mode) {
      case 'daily':
        questions = this.shuffleArray(bank).slice(0, 5)
        break
      case 'weak':
        // AI推荐薄弱点题目（这里简化为随机）
        questions = this.shuffleArray(bank).slice(0, 5)
        break
      case 'random':
        questions = this.shuffleArray(bank).slice(0, 5)
        break
      case 'exam':
        questions = this.shuffleArray(bank).slice(0, 10)
        break
      default:
        questions = bank.slice(0, 5)
    }

    this.setData({
      isPracticing: true,
      showResult: false,
      questions,
      totalQuestions: questions.length,
      currentIndex: 0,
      currentQuestion: questions[0],
      selectedOption: -1,
      userAnswer: '',
      hasAnswer: false,
      showAnswer: false,
      resultCorrect: 0,
      resultWrong: 0
    })
  },

  // 随机打乱数组
  shuffleArray(arr) {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  // 选择选项
  selectOption(e) {
    if (this.data.showAnswer) return
    const index = e.currentTarget.dataset.index
    this.setData({
      selectedOption: index,
      hasAnswer: true
    })
  },

  // 输入答案（填空/简答）
  onAnswerInput(e) {
    this.setData({
      userAnswer: e.detail.value,
      hasAnswer: e.detail.value.trim().length > 0
    })
  },

  // 提交答案
  submitAnswer() {
    const { currentQuestion, selectedOption, userAnswer } = this.data
    let isCorrect = false

    if (currentQuestion.type === '单选题') {
      isCorrect = selectedOption === currentQuestion.answer
    } else if (currentQuestion.type === '多选题') {
      // 多选题判断（简化处理）
      isCorrect = selectedOption === currentQuestion.answer[0]
    } else {
      // 填空/简答题（简化处理，实际应调用AI评判）
      isCorrect = userAnswer.trim().length > 10
    }

    this.setData({
      showAnswer: true,
      isCorrect,
      resultCorrect: this.data.resultCorrect + (isCorrect ? 1 : 0),
      resultWrong: this.data.resultWrong + (isCorrect ? 0 : 1)
    })
  },

  // 下一题
  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= this.data.totalQuestions) {
      // 显示结果
      const correct = this.data.resultCorrect
      const total = this.data.totalQuestions
      const accuracy = Math.round(correct / total * 100)

      let resultEmoji = '🎉'
      let resultTitle = '练习完成！'
      if (accuracy >= 90) { resultEmoji = '🏆'; resultTitle = '太棒了！'; }
      else if (accuracy >= 70) { resultEmoji = '👍'; resultTitle = '做得不错！'; }
      else if (accuracy >= 60) { resultEmoji = '💪'; resultTitle = '继续加油！'; }
      else { resultEmoji = '📚'; resultTitle = '还需努力！'; }

      // 更新统计
      this.updateStats(total, correct)

      this.setData({
        isPracticing: false,
        showResult: true,
        resultAccuracy: accuracy,
        resultEmoji,
        resultTitle
      })
      return
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      selectedOption: -1,
      userAnswer: '',
      hasAnswer: false,
      showAnswer: false,
      isCorrect: false
    })
  },

  // 更新学习统计
  updateStats(total, correct) {
    const stats = wx.getStorageSync('studyStats') || {
      totalQuestions: 0,
      correctRate: 0,
      studyDays: 0,
      lastStudyDate: null
    }
    
    const newTotal = stats.totalQuestions + total
    const oldCorrect = Math.round(stats.correctRate * stats.totalQuestions / 100)
    const newCorrectRate = Math.round((oldCorrect + correct) / newTotal * 100)

    stats.totalQuestions = newTotal
    stats.correctRate = newCorrectRate
    const today = new Date().toDateString()
    if (stats.lastStudyDate !== today) {
      stats.studyDays += 1
      stats.lastStudyDate = today
    }

    wx.setStorageSync('studyStats', stats)
  },

  // AI深度解析
  getAIExplanation() {
    const q = this.data.currentQuestion
    const prompt = `请深度解析以下考研题目，用通俗易懂的语言讲解：

题目：${q.question}
选项：${q.options ? q.options.join(' | ') : '（简答题）'}
正确答案：${q.answer}
官方解析：${q.explanation}

请从以下角度补充讲解：
1. 这道题考查的核心知识点是什么？
2. 容易混淆的干扰项为什么错？
3. 记忆口诀或技巧
4. 相关知识点延伸`

    wx.showLoading({ title: 'AI思考中...' })
    
    app.callAI([
      { role: 'system', content: '你是一个专业的考研辅导老师，擅长深入浅出地讲解知识点。' },
      { role: 'user', content: prompt }
    ], (err, result) => {
      wx.hideLoading()
      if (err) {
        wx.showToast({ title: '请求失败，请重试', icon: 'none' })
        return
      }
      
      // 跳转到AI问答页并显示结果
      wx.navigateTo({
        url: `/pages/chat/chat?question=${encodeURIComponent(prompt)}&answer=${encodeURIComponent(result)}`
      })
    })
  },

  // 重置练习
  resetPractice() {
    this.setData({
      isPracticing: false,
      showResult: false
    })
  },

  // 查看错题
  reviewWrong() {
    wx.showToast({ title: '错题本功能开发中', icon: 'none' })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '考研刷题 - 每日一练，稳步提分',
      path: '/pages/practice/practice'
    }
  }
})
