export default class PUB_CONST {
  static readonly SERVER_PORT = 10086
  static readonly FILE_SERVER_PORT = 10010
  static readonly HOW_ARE_YOU_HOST = 'chat.code4lala.vip'
  static readonly HOW_ARE_YOU_URL =
    'https://' + PUB_CONST.HOW_ARE_YOU_HOST
  static readonly WEBSOCKET_SERVER_URL =
    'wss://' + PUB_CONST.HOW_ARE_YOU_HOST + ':' +
    PUB_CONST.SERVER_PORT
  static readonly API_FILE = '/api/file'
  static readonly DOWNLOAD_FILE = '/download/file'
  // see <project_root>/client/package.json scripts serve
  static readonly APP_FRONT_END_PORT = 443
  static readonly UPLOAD_FILE_URL =
    PUB_CONST.HOW_ARE_YOU_URL + ':' +
    PUB_CONST.FILE_SERVER_PORT +
    PUB_CONST.API_FILE
  static readonly DOWNLOAD_FILE_URL =
    PUB_CONST.HOW_ARE_YOU_URL + ':' +
    PUB_CONST.FILE_SERVER_PORT +
    PUB_CONST.DOWNLOAD_FILE
  // 用于 multer 的 single 的参数 和 POST 请求的 name
  static readonly UPLOAD_FILE_NAME = 'upload_file_name'
  // 只允许该域名发送POST请求 因为https默认是44所以不用加端口号了
  static readonly ALLOWED_ORIGIN = PUB_CONST.HOW_ARE_YOU_URL
}
