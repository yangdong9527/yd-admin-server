const {Service} = require('egg')
const {HttpExceptions} = require('../exceptions/http_exceptions.js')

class MenuService extends Service {
  async getAll() {
    let result = await this.app.mysql.query('select * from menu order by sort desc')
    result = result.map(item => {
      return this.ctx.helper.formatResponse(item)
    })
    const res = this.ctx.helper.handleTreeData(result)
    return res
  }

  async userMenu() {
    const { ctx } = this
    const {id} = ctx.auth
    // 根据用户id 获取角色, 得到角色中的 菜单id 集合
    const user = await this.app.mysql.query('select * from user where id = ?', [id])
    const role = await this.app.mysql.query('select * from role where id = ?', [user[0].role_id])
    const menus = role[0].menus
    let menusArr = await this.app.mysql.query(`select id,type, name, icon, path, title, component, hidden, pid, always_show alwaysShow from menu where id in (${menus}) and type not in (2) order by sort desc`)
    menusArr = menusArr.map(item => {
      item.hidden = item.hidden === 0 ? false : true
      item.alwaysShow = item.alwaysShow === 0 ? false : true
      item.meta = {
        title: item.title,
        icon : item.icon
      }
      delete item.title
      delete item.icon
      return item
    })
    const result = this.ctx.helper.handleTreeData(menusArr)
    // 筛选出我们需要的格式
    return result
  }

  async add() {
    let {ctx} = this
    let rule = {
      type: {required: true, type: 'number', allowEmpty: false},
      hidden: {required: true, type: 'boolean'},
      alwaysShow: {required: true, type: 'boolean'},
      title: {required: true, type: 'string'}
    }
    ctx.validate(rule, ctx.request.body)
    // 将驼峰转为下划线
    let obj = ctx.helper.formatParams(ctx.request.body)
    if(obj.type === 0) {
      delete obj.component
      delete obj.permission
    }else if(obj.type === 2){
      obj = {
        type: obj.type,
        pid: obj.pid,
        title: obj.title,
        permission: obj.permission,
        sort: obj.sort
      }
    }
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
    ctx.validate(rule, ctx.request.query)
    const id = ctx.request.query.id
    const res = this.app.mysql.query('delete from menu where id = ?', [id])
    return res
  }

  async tree() {
    const {ctx} = this
    const rule = {type: {reauired: true, type: 'number'}}
    ctx.validate(rule, ctx.request.query)
    let { type } = ctx.request.query
    let params = ''
    if(type == 1) {
      params = '0,1'
    }else if(type == 2) {
      params = '0,1,2'
    }else {
      throw new HttpExceptions('type参数错误', 400, 1)
    }
    let result = await this.app.mysql.query(`select id, title, pid from menu where type in (${params}) order by sort desc`)
    result = this.ctx.helper.handleTreeData(result)
    return result
  }
}

module.exports = MenuService