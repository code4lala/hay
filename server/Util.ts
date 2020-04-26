// clt = console log time       cl = console log
// cet = console error time     ce = console error
const clt = function (arg: any) {
  console.log((new Date()) + ' ' + arg)
}
const cl = console.log
const cet = function (arg: any) {
  console.error((new Date()) + ' ' + arg)
}
const ce = console.error

export {
  clt,
  cl,
  cet,
  ce
}
