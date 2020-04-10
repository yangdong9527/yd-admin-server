const {Service} = require('egg')
const {HttpExceptions} = require('../exceptions/http_exceptions.js')
 
class RoleService extends Service {
  async list() {
    const {ctx} = this
    const rule = {
      pageNum: { type: 'number', required: true, allowEmpty: false },
      pageSize: { type: 'number', required: true, allowEmpty: false },
    }
    ctx.validate(rule, ctx.request.query)
    const { pageNum, pageSize } = ctx.request.query
    const num = pageSize * (pageNum - 1)
    let res = await this.app.mysql.query('select * from role order by level asc limit ? offset ? ', [pageSize, num])
    res = res.map(item => {
      if(item.menus) {
        item.menus = item.menus.split(',').map(v => {
          return parseInt(v)
        })
      }else {
        item.menus = []
      }
      item = ctx.helper.formatResponse(item)
      return item
    })
    let count = await this.app.mysql.query('select count(*) num from role')
    return {
      res,
      count: count[0].num
    }
  }

  async add() {
    const {ctx} = this
    // const scope = ctx.auth.scope
    // if(!scope.includes('role:add')) {
    //   throw new HttpExceptions('您没有访问该接口权限', 401, 1)
    // }
    const rule = {
      type: {type: 'number', required: true, allowEmpty: false},
      level: {type: 'number', required: true, allowEmpty: false}
    }
    this.ctx.validate(rule, this.ctx.request.body)
    let params = ctx.request.body
    // 如果是超管
    if(params.type === 0){
      const arr = await this.app.mysql.query('select * from menu')
      params.menus = arr.map(item => item.id).join(',')
    }else if(params.type === 1) { // 如果是游客
      const arr = await this.app.mysql.query(`SELECT * FROM menu WHERE type NOT IN (2)`)
      params.menus = arr.map(item => item.id).join(',')
    }else {
      params.menus = params.menus.toString()
    }
    const result = await this.app.mysql.insert('role', params)
    return result
  }

  async update() {
    const {ctx} = this
    const rule = {
      id: {type: 'number', required: true, allowEmpty: false},
      type: {type: 'number', required: true, allowEmpty: false},
      level: {type: 'number', required: true, allowEmpty: false}
    }
    this.ctx.validate(rule, this.ctx.request.body)
    let params = ctx.request.body
    // 如果是超管
    if(params.type === 0){
      const arr = await this.app.mysql.query('select * from menu')
      params.menus = arr.map(item => item.id).join(',')
    }else if(params.type === 1) { // 如果是游客
      const arr = await this.app.mysql.query(`SELECT * FROM menu WHERE type NOT IN (2)`)
      params.menus = arr.map(item => item.id).join(',')
    }else {
      params.menus = params.menus.toString()
    }
    const result = await this.app.mysql.update('role', params, {where: {id: params.id}})
    return result
  }

  async del() {
    const { ctx } = this
    const rule = {
      id: {type: 'number', required: true, allowEmpty: false}
    }
    ctx.validate(rule, ctx.request.query)
    // 先查询下有没有这个人
    const id = ctx.request.query.id
    const hasOne = await this.app.mysql.query('select * from role where id = ?', [id])
    if(hasOne.length === 0) {
      throw new HttpExceptions('id不存在', 400, 1)
    }
    const result = await this.app.mysql.delete('role', {id})
    return result
  }
  
  async options() {
    const { ctx, app } = this
    const result = await app.mysql.query('select id, name from role')
    return result
  }

}

module.exports = RoleService