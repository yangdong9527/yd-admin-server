const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
const Moment = require('moment')
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
  },
 
  handleTreeData(arr) { // 将数据按照pid 树状返回
    if(arr.length === 0) return []
    // 筛选出顶级目录
    let res = arr.filter(item => {
      return item.pid === 0
    })
    return getChildByid(res, arr)

    function getChildByid(filterArr, allArr) {
      // 判断每一项有没有子集
      let res = filterArr.map(item => {
        const bool = allArr.some(v => v.pid === item.id)
        // 有
        if(bool) {
          const childArr = allArr.filter(i => i.pid === item.id)
          item.children = getChildByid(childArr, allArr)
          
          return item
        } else {
          // 没有
          if(item.type !== 2) {
            // 按钮没有不加[]
            item.children = []
          }
          
          return item
        }
      })
      return res
    }
  },

  // moment 处理时间
  formatTime(time, str = 'YYYY-MM-DD') {
    return Moment(time).format(str)
  },
  // 加密
  bcryptVal(password) {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
  },
  // 验证加密
  async comparePwd(password, user_password) {
    return await bcrypt.compare(password, user_password)
  }
}