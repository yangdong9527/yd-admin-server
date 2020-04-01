const {Controller} = require('egg')

class MenuController extends Controller {
  async list() {
    const {ctx} = this
    const result = await this.service.menu.getAll()
    ctx.body = {
      message: '查询成功',
      code: 0,
      data: result
    }
    ctx.status = 200
  }
  async add() {
    const result = await this.service.menu.add()
    this.ctx.body = {
      message: '新增成功',
      code: 0
    }
    this.ctx.status = 200
  }
}

module.exports = MenuController