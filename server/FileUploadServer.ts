// 创建文件上传服务器
import PUB_CONST from "../public/PUB_CONST"
import {clt, cl, cet, ce} from "./Util"

export default function () {
  const express = require("express")
  const multer = require('multer')
  const cors = require('cors')
  const app = express()
  const storage = multer.diskStorage({
    // file upload destination
    destination: function (req: any, file: any, callback: any) {
      callback(null, './uploads')
    },
    filename: function (req: any, file: any, callback: any) {
      callback(null, file.fieldname + '-' + Date.now())
    }
  })
  const upload = multer({storage: storage}).single('image')
  // https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
  const ALLOWED_ORIGIN = PUB_CONST.HOW_ARE_YOU_URL + ':' + PUB_CONST.APP_FRONT_END_PORT
  clt('允许前端链接' + ALLOWED_ORIGIN + '访问')
  app.use(cors({
    origin: ALLOWED_ORIGIN
  }))
  app.post(PUB_CONST.API_IMAGE, function (request: any, response: any) {
    clt('接收到POST请求')
    cl(request)
    upload(request, response, function (err: any) {
      clt('保存文件了')
      // req.file is the `image` file
      // req.body will hold the text fields, if there were any
      response.writeHead(200, {'Content-Type': 'text/html'})
      if (err) {
        clt('保存文件失败了')
        return response.end("Error uploading file.")
      }
      clt('保存文件成功了')
      response.end("File is uploaded")
    })
  })
  app.listen(PUB_CONST.FILE_SERVER_PORT, function () {
    clt("文件上传服务器运行在端口 " + PUB_CONST.FILE_SERVER_PORT)
  })
}

