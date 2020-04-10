const {
  Controller
} = require('egg')

class BaseController extends Controller {
  success(message = '成功', code = 0, data = '', httpCode = 200, count) {
    let {
      ctx
    } = this
    let result = {
      message,
      code
    }
    if (data) {
      result.data = data
    }
    if(count) {
      result.count = count
    }
    ctx.body = result
    ctx.status = httpCode
  }

  error(message ="失败", code = 1, httpCode = 400) {
    let {ctx} = this
    ctx.body = {
      message,
      code
    }
    ctx.status = httpCode
  }
}

module.exports = BaseController