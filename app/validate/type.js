module.exports = app => {
  let { validator } = app
  validator.addRule('Number', (rule, value) => {
    if(value === '') {
      return '不能为空'
    }
    value = Number(value)
    if(!Number.isNaN(value)) {
      return '必须为数值'
    }
    if(rule.min) {
      if(rule.min > data) {
        return '不能小于' + rule.min
      }
    }
    if(rule.max) {
      if(rule.max < data) {
        return '不能大于' + rule.max
      }
    }
  })
}

