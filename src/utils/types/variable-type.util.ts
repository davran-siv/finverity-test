export const isArray = <T>(arg: T[] | any): arg is T[] =>
  Object.prototype.toString.call(arg) === '[object Array]'
