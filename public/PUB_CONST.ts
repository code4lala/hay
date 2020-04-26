export default class PUB_CONST {
  static readonly SERVER_PORT = 10086
  static readonly FILE_SERVER_PORT = 10010
  static readonly HOW_ARE_YOU_URL = 'http://localhost'
  static readonly API_IMAGE = '/api/image'
  static readonly API_FILE = '/api/file'
  // see <project_root>/client/package.json scripts serve
  static readonly APP_FRONT_END_PORT = 8888
  static readonly UPLOAD_IMG_URL =
    PUB_CONST.HOW_ARE_YOU_URL + ':' +
    PUB_CONST.FILE_SERVER_PORT +
    PUB_CONST.API_IMAGE
  static readonly UPLOAD_FILE_URL =
    PUB_CONST.HOW_ARE_YOU_URL + ':' +
    PUB_CONST.FILE_SERVER_PORT +
    PUB_CONST.API_FILE
  // 用于 multer 的 single 的参数 和 POST 请求的 name
  static readonly UPLOAD_FILE_NAME = 'upload_file_name'
  // 只允许该域名发送POST请求
  static readonly ALLOWED_ORIGIN = PUB_CONST.HOW_ARE_YOU_URL + ':' + PUB_CONST.APP_FRONT_END_PORT
}
