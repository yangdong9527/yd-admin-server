const { HttpExceptions } = require('../exceptions/http_exceptions')

module.exports = options => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // 触发error 生成 日志
      ctx.app.emit('error', err, ctx)
      let status = err.status || 500
      let error = {}
      if(err instanceof HttpExceptions) {
        status = err.httpCode
        error.message = err.msg
        error.code = err.code
      } else {
        if(status === 500) {
          error.message = '抱歉,出现了一个错误'
          error.code = 1
        }
      }
      if(status === 422) {
        error.message = '参数校验失败'
        error.code = 1
      }
      error.path = `${ctx.method} ${ctx.url}`
      ctx.body = error
      ctx.status = status
    }
  }
}