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
  const upload = multer({storage: storage}).single('upload_image')
  // https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
  const ALLOWED_ORIGIN = PUB_CONST.HOW_ARE_YOU_URL + ':' + PUB_CONST.APP_FRONT_END_PORT
  clt('允许前端链接' + ALLOWED_ORIGIN + '访问')
  app.use(cors({
    // TODO 这里改成 ALLOWED_ORIGIN
    origin: '*'
  }))
  app.post(PUB_CONST.API_IMAGE, function (request: any, response: any) {
    clt('接收到POST请求如下')
    cl(request)
    upload(request, response, function (err: any) {
      // TODO 保存成功了，但是下边几个打出来全是undefined
      /*
Sun Apr 26 2020 20:40:49 GMT+0800 (GMT+08:00) 保存文件了 文件名如下
undefined
undefined
undefined
Sun Apr 26 2020 20:40:49 GMT+0800 (GMT+08:00) 数据如下
undefined
Sun Apr 26 2020 20:40:49 GMT+0800 (GMT+08:00) 保存文件成功了
       */
      clt('保存文件了 文件名如下')
      cl(request.files)
      cl(request.files?.length)
      cl(request.file)
      clt('数据如下')
      cl(request.body)
      if (err) {
        clt('保存文件失败了')
        cl(err)
        return response.end("Error uploading file.")
      }
      clt('保存文件成功了')
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end("File is uploaded")
    })
  })
  app.listen(PUB_CONST.FILE_SERVER_PORT, function () {
    clt("文件上传服务器运行在端口 " + PUB_CONST.FILE_SERVER_PORT)
  })
}

