const {Service} = require('egg')

class MenuService extends Service {
  async getAll() {
    let result = this.app.mysql.query('select * from menu')
    return result
  }
  async add() {
    let {ctx} = this
    let rule = {
      type: {required: true, type: 'number', allowEmpty: false},
      hidden: {required: true, type: 'boolean'},
      alwaysShow: {required: true, type: 'boolean'}
    }
    ctx.validate(rule, ctx.request.body)
    // 将驼峰转为下划线
    let obj = ctx.helper.formatParams(ctx.request.body)
    let result = await this.app.mysql.insert('menu', obj)
    return result
  }

  async update() {
    const { ctx } = this
    const rule = {
      id: {required: true, type: 'number'},
      type: { required: true, type: 'number' },
      hidden: {required: true, type: 'boolean'},
      alwaysShow: {required: true, type: 'boolean'}
    }
    ctx.validate(rule, ctx.request.body)
    let result = ctx.helper.formatParams(ctx.request.body)
    const id = result.id
    delete result.id
    const res = this.app.mysql.update('menu', result, { where: {id} })
    return res
  }

  async del() {
    const { ctx } = this
    const rule = {id: {required: true, type: 'number'}}
    ctx.validate(rule, ctx.request.body)
    const id = ctx.request.body.id
    const res = this.app.mysql.query('delete from menu where id = ?', [id])
    return res
  }
}

module.exports = MenuService