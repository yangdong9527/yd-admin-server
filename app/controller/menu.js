const Controller = require('./base')

class MenuController extends Controller {
  async list() {
    const {ctx} = this
    const result = await this.service.menu.getAll()
    this.success('查询成功', 0, result)
  }
  async add() {
    const result = await this.service.menu.add()
    this.ctx.body = {
      message: '新增成功',
      code: 0
    }
    this.ctx.status = 200
  }
  async update() {
    const {ctx} = this
    const result = await this.service.menu.update()
    if(result.affectedRows == 1) {
      this.success('修改成功')
    } else {
      this.error('修改失败')
    }
  }

  async del() {
    let {ctx} = this
    const result = await this.service.menu.del()
    if(result.affectedRows === 1){
      this.success('删除成功')
    }else {
      this.error('删除失败')
    }
  }
}

module.exports = MenuController