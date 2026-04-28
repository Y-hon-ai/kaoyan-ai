/**
 * utils/ai.js - AI接口封装
 * 支持多种大模型API：DeepSeek、豆包、通义千问等
 */

// API配置
const AI_CONFIGS = {
  // DeepSeek（推荐，性价比高）
  deepseek: {
    url: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    getHeaders(apiKey) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    },
    buildBody(messages, options = {}) {
      return {
        model: options.model || this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
        stream: false
      }
    },
    parseResponse(res) {
      return res.data?.choices?.[0]?.message?.content || ''
    }
  },

  // 豆包（字节跳动）
  doubao: {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'doubao-pro-4k',
    getHeaders(apiKey) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    },
    buildBody(messages, options = {}) {
      return {
        model: options.model || this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000
      }
    },
    parseResponse(res) {
      return res.data?.choices?.[0]?.message?.content || ''
    }
  },

  // 通义千问（阿里）
  qwen: {
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-turbo',
    getHeaders(apiKey) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    },
    buildBody(messages, options = {}) {
      return {
        model: options.model || this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000
      }
    },
    parseResponse(res) {
      return res.data?.choices?.[0]?.message?.content || ''
    }
  }
}

/**
 * 调用AI接口
 * @param {string} provider - AI提供商 (deepseek|doubao|qwen)
 * @param {string} apiKey - API密钥
 * @param {Array} messages - 消息列表
 * @param {Object} options - 配置选项
 * @returns {Promise<string>} AI回复内容
 */
function callAI(provider, apiKey, messages, options = {}) {
  return new Promise((resolve, reject) => {
    const config = AI_CONFIGS[provider]
    if (!config) {
      reject(new Error(`不支持的AI提供商: ${provider}`))
      return
    }

    wx.request({
      url: config.url,
      method: 'POST',
      header: config.getHeaders(apiKey),
      data: config.buildBody(messages, options),
      success(res) {
        try {
          const content = config.parseResponse(res)
          if (content) {
            resolve(content)
          } else {
            reject(new Error('AI返回内容为空'))
          }
        } catch (e) {
          reject(new Error('解析AI响应失败'))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

/**
 * 流式调用AI接口（逐字输出效果）
 * 注意：微信小程序对SSE支持有限，这里用模拟流式效果
 */
function callAIStream(provider, apiKey, messages, options = {}) {
  return callAI(provider, apiKey, messages, options)
}

// 考研专用系统提示词
const SYSTEM_PROMPTS = {
  politics: `你是一个专业的考研政治辅导AI助手，精通马克思主义基本原理、毛泽东思想和中国特色社会主义理论体系、中国近现代史纲要、思想道德修养与法律基础、形势与政策。回答时先给核心答案，再展开解释，标注教材章节，分析题按"原理+结合材料+总结"格式作答。`,

  english: `你是一个专业的考研英语辅导AI助手，精通考研英语词汇、语法、阅读理解、翻译、写作。解释单词时给出音标、词性、释义、真题例句；分析长难句先拆分结构再逐部分翻译；写作提供高分模板和亮点句型。`,

  math: `你是一个专业的考研数学辅导AI助手，精通高等数学、线性代数、概率论与数理统计。解题步骤清晰，标注所用公式/定理，展示完整推导过程，提供多种解题思路，指出常见错误。`,

  professional: `你是一个专业的考研专业课辅导AI助手，根据学生报考的院校和专业提供针对性指导，解释专业概念由浅入深，结合真题分析出题规律，提供知识框架梳理。`
}

module.exports = {
  callAI,
  callAIStream,
  AI_CONFIGS,
  SYSTEM_PROMPTS
}
