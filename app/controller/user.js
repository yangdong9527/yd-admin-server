const Controller = require('./base')

class UserController extends Controller {
  async register() {
    const result = await this.ctx.service.user.register()
    if(result.affectedRows === 1) {
      this.success('注册成功')
    }
  }
  async login() {
    const result = await this.ctx.service.user.login()
    this.success('登录成功', 0, result, 200)
  }

  async getInfo() {
    const result = await this.ctx.service.user.getInfo()
    this.success('查询成功', 0, result, 200)
  }

  async getList() {
    const result = await this.ctx.service.user.getList()
    this.success('查询成功', 0, result.data, 200, result.count)
  }

  async add() {
    const result = await this.ctx.service.user.add()
    if(result.affectedRows === 1) {
      this.success('新增成功')
    }else {
      this.error('新增失败')
    }
  }

  async update() {
    const result = await this.ctx.service.user.update()
    if(result.affectedRows === 1) {
      this.success('修改成功')
    }else {
      this.error('修改失败')
    }
  }

  async delUser() {
    const result = await this.ctx.service.user.delUser()
    if(result.affectedRows === 1) {
      this.success('删除成功')
    }else {
      this.error('删除失败')
    }
  }
}

module.exports = UserController