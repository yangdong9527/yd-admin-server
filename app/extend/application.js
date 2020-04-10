const jwt = require('jsonwebtoken')
module.exports =  {
  // 生成token
  generateToken(obj = {}) {
    return jwt.sign(obj, this.config.jwt.secret, {expiresIn: this.config.jwt.expiresIn})
  }
}