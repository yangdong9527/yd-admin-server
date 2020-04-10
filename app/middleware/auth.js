const { HttpExceptions }  = require('../exceptions/http_exceptions.js')
module.exports = (option, app) => {
  return async (ctx, next) => {
    // 如果在白名单中直接过
    const whiteList = option.enable
    if(whiteList.includes(ctx.url)) return await next()
    const { authorization = '' } = ctx.header
    if(!authorization) {
      throw new HttpExceptions('您还未登录,请先登录', 401, 1)
    }
    let token = authorization.replace('Bearer ', '')
    let user = {}
    try {
      user = ctx.jwt.verify(token, app.config.jwt.secret)
    } catch (error) {
      if(error.name === 'TokenExpiredError') {
        throw new HttpExceptions('token令牌过去,请重新登录', 400, 999)
      }else {
        throw new HttpExceptions('token令牌不合法', 400, 1)
      }
    }
    ctx.auth = user
    await next()
  }
}