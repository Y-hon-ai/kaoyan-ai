/**
 * utils/util.js - 通用工具函数
 */

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = date || new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 计算距离考研天数
 */
function getDaysUntilExam() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  
  // 考研通常在12月倒数第二个周末
  // 如果当前月份 >= 10月，目标是明年；否则是今年12月
  let examYear = currentMonth >= 10 ? currentYear + 1 : currentYear
  
  // 预估考试日期（12月第三个周六）
  // 实际日期以教育部公布为准
  const examDate = new Date(examYear, 11, 20) // 12月20日左右
  
  const diff = examDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

/**
 * 简单的Markdown转HTML
 */
function markdownToHtml(md) {
  if (!md) return ''
  
  return md
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 加粗
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 标题
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // 列表
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    // 换行
    .replace(/\n/g, '<br/>')
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 显示加载提示
 */
function showLoading(title = '加载中...') {
  wx.showLoading({ title, mask: true })
}

/**
 * 隐藏加载提示
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示错误提示
 */
function showError(msg) {
  wx.showToast({ title: msg, icon: 'none', duration: 2000 })
}

/**
 * 获取学科名称
 */
function getSubjectName(id) {
  const map = {
    politics: '政治',
    english: '英语',
    math: '数学',
    professional: '专业课'
  }
  return map[id] || id
}

module.exports = {
  formatDate,
  getDaysUntilExam,
  markdownToHtml,
  debounce,
  showLoading,
  hideLoading,
  showError,
  getSubjectName
}
