class HttpExceptions extends Error {
  constructor(msg = '出现了一个错误', httpCode = 500, code = 1) {
    super()
    this.msg = msg
    this.httpCode = httpCode
    this.code = code
  }
}

module.exports = {
  HttpExceptions
}