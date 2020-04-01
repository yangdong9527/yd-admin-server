// 驼峰转 _
function toLowerLine(str) {
  var temp = str.replace(/[A-Z]/g,function(match) {
    return '_' + match.toLowerCase()
  })
  if(temp.slice(0,1) === '_') {
    temp = temp.slice(1)
  }
  return temp
}
// _ 转驼峰
function toCamel(str) {
  return str.replace(/([^_])(?:_+([^_]))/g, function ($0,$1,$2) {
    return $1+$2.toUpperCase()
  })
}
module.exports = {
  // 处理传过来的参数 将驼峰转为 _
  formatParams(obj) {
    let newObj = {}
    let keyArr = Object.keys(obj)
    for( v in keyArr) {
      // 驼峰转小写
      const str = toLowerLine(keyArr[v])
      newObj[str] = obj[keyArr[v]]
    }
    return newObj
  },
  // 处理返回参数 _ 转为 大写
  formatResponse(obj) {
    let newObj = {}
    let keyArr = Object.keys(obj)
    for( v in keyArr) {
      // 驼峰转小写
      const str = toCamel(keyArr[v])
      newObj[str] = obj[keyArr[v]]
    }
    return newObj
  }
}