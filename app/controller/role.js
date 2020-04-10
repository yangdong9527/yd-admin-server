const Controller = require('./base.js')

class RoleController extends Controller {
  async list() {
    const result = await this.service.role.list()
    if(result) {
      this.success('查询成功', 0,  result.res, 200, result.count )
    }else {
      this.error()
    }
  }
  async add() {
    const result = await this.service.role.add()
    if(result.affectedRows === 1){
      this.success('新增成功')
    }else {
      this.error('新增失败')
    }
  }

  async update() {
    const result = await this.service.role.update()
    if(result.affectedRows === 1) {
      this.success('修改成功')
    }else {
      this.error('修改失败')
    }
  }

  async del() {
    const result = await this.service.role.del()
    if(result.affectedRows === 1) {
      this.success('删除成功')
    }else {
      this.error('删除失败')
    }
  }

  async options() {
    const result = await this.service.role.options()
    this.success('查询成功', 0, result, 200)
  }
}

module.exports = RoleController