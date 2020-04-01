const {Service} = require('egg')

class MenuService extends Service {
  async getAll() {
    let result = this.app.mysql.query('select * from menu')
    return result
  }
  async add() {
    let {ctx} = this
    let rule = {
      type: {required: true, type: 'number'}
    }
    ctx.validate(rule, ctx.request.body)
    let { name, icon, sort, type, path, componentName, component, hidden, permission, pid, alwaysShow } = ctx.request.body
    let result = await this.app.mysql.insert('menu', {
      name, icon,sort,type,path,component_name: componentName, component, hidden, permission, pid, always_show: alwaysShow
    })
    return result
  }
}

module.exports = MenuService