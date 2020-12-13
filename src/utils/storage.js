//
//     封装本地存储模块
//

//
//   存储数据
//
export const setItem = (name, value) => {
  // 如果value的类型为对象
  if (typeof value === 'object') {
    // 就将value转换为json字符串
    value = JSON.stringify(value)
  }
  // 否则的话就将value和对应的属性名直接存储
  window.localStorage.setItem(name, value)
}
//
//     取数数据
//
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    //  如果时一个json字符串就返回一个对象
    return JSON.parse(data)
  } catch (err) {
    //  否则就返回data
    return data
  }
}
