const {
  Service
} = require('egg')
const {
  HttpExceptions
} = require('../exceptions/http_exceptions')

class UserService extends Service {
  async register() {
    const {
      ctx
    } = this
    const rule = {
      nickName: {
        type: 'string',
        required: true,
        allowEmpty: false
      },
      password: {
        type: 'string',
        required: true,
        allowEmpty: false
      },
      email: {
        type: 'email',
        required: true
      }
    }
    ctx.validate(rule, ctx.request.body)
    let params = ctx.helper.formatParams(ctx.request.body)
    // 查询是否存在
    let hasOne = await this.app.mysql.query('select * from user where email = ?', [params.email])
    if (hasOne.length !== 0) {
      throw new HttpExceptions('Email已存在!', 400, 1)
    }
    // 对密码进行加密
    params.password = ctx.helper.bcryptVal(params.password)
    params.role_id = 17
    console.log(params)
    const result = await this.app.mysql.insert('user', params)
    return result
  }

  async login() {
    const {
      ctx
    } = this
    const rule = {
      email: {
        type: 'email',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    }
    ctx.validate(rule, ctx.request.body)
    const params = ctx.request.body
    // 判断是否存在 emial
    const hasEmail = await this.app.mysql.query('select * from user where email = ?', [params.email])
    if (hasEmail.length === 0) {
      throw new HttpExceptions('Email不存在,请前往注册', 400, 1)
    }
    const user = hasEmail[0]
    // 判断密码是否正确
    const bool = await this.ctx.helper.comparePwd(params.password, user.password)
    if (!bool) {
      throw new HttpExceptions('密码错误', 400, 1)
    }

    // 根据 roleId 获取权限数据,  在对 type 进行特殊处理  0超管 1 游客, 3 自定义
    const roleId = user.role_id
    const role = await this.app.mysql.query('select * from role where id = ?', [roleId])
    if (role.length === 0) {
      throw new HttpExceptions('用户未分配角色', 400, 1)
    }
    // 更具用户 角色 获取 菜单界面 接口权限
    const menuIds = role[0].menus
    const menuArr = await this.app.mysql.query(`select * from menu where id in (${menuIds})`)
    const permission = menuArr.filter(item => {
      if (item.type === 0) return false
      return true
    }).map(v => {
      return v.permission
    })
    // 生成token
    const info = {
      id: user.id,
      scope: permission
    }
    const token = this.app.generateToken(info)
    // 拼接数据
    let result = {}
    result.info = ctx.helper.formatResponse(user)
    delete result.info.password
    result.menus = permission
    result.token = token
    return result
  }

  async getInfo() {
    const { ctx } = this
    const { id } = ctx.auth
    const user = await this.app.mysql.query('select * from user where id = ?',[id])
    const roleId = user[0].role_id
    const role = await this.app.mysql.query('select * from role where id = ?', [roleId])
    if (role.length === 0) {
      throw new HttpExceptions('用户未分配角色', 400, 1)
    }
    // 更具用户 角色 获取 菜单界面 接口权限
    const menuIds = role[0].menus
    const menuArr = await this.app.mysql.query(`select * from menu where id in (${menuIds})`)
    const permission = menuArr.filter(item => {
      if (item.type === 0) return false
      return true
    }).map(v => {
      return v.permission
    })
    // 拼接数据
    let result = {}
    result.info = ctx.helper.formatResponse(user[0])
    delete result.info.password
    result.menus = permission
    return result
  }

  async getList() {
    const { ctx, app } = this
    const rule = {
      pageNum: { type: 'number', required: true, allowEmpty: false },
      pageSize: { type: 'number', required: true, allowEmpty: false }
    }
    ctx.validate(rule, ctx.request.query)
    const { pageSize, pageNum } = ctx.request.query
    const num = pageSize * (pageNum - 1)
    const result = await app.mysql.query(`select u.id, u.nick_name nickName, u.create_time createTime, u.role_id roleId, u.email, r.name roleName from user u inner join role r on u.role_id = r.id limit ? offset ?`, [pageSize, num])
    const count = await app.mysql.query('select count(*) count from user')
    return {
      data: result,
      count: count[0].count
    }
  }

  async add() {
    const { ctx, app } = this
    const rule = {
      nickName: { type: 'string', required: true },
      roleId: {type: 'number', require: true, allowEmpty: false},
      email: {type: 'email', require: true, allowEmpty: false}
    }
    ctx.validate(rule, ctx.request.body)
    let params = ctx.helper.formatParams(ctx.request.body)
    const hasOne = await app.mysql.query('select * from user where email = ?', [params.email])
    if(hasOne.length !== 0) {
      throw new HttpExceptions('Email已存在', 400, 1)
    }
    if(!params['password']) {
      params.password = ctx.helper.bcryptVal('123456')
    }
    let result = app.mysql.insert('user', params)
    return result
  }

  async update() {
    const { ctx, app } = this
    const rule = {
      id: {type: 'number', required: true, allowEmpty: false},
      nickName: { type: 'string', required: true },
      roleId: {type: 'number', require: true, allowEmpty: false},
      email: {type: 'email', require: true, allowEmpty: false}
    }
    ctx.validate(rule, ctx.request.body)
    let params = ctx.helper.formatParams(ctx.request.body)
    let result = app.mysql.update('user', params, {where: {id: params.id}})
    return result
  }

  async delUser() {
    const {ctx} = this
    const rule = {
      id: { type: 'number', required: true, allowEmpty: false }
    }
    ctx.validate(rule, ctx.query)
    const result = this.app.mysql.delete('user', { id: ctx.query.id})
    return result
  }
}

module.exports = UserService 