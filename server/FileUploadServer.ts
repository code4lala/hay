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
  // single 单个文件时候的限制 https://stackoverflow.com/questions/31530200/node-multer-unexpected-field
  const upload = multer({storage: storage}).single(PUB_CONST.UPLOAD_FILE_NAME)
  // https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
  clt('只允许前端链接' + PUB_CONST.ALLOWED_ORIGIN + '访问')
  app.use(cors({
    origin: PUB_CONST.ALLOWED_ORIGIN
  }))
  app.post(PUB_CONST.API_IMAGE, function (request: any, response: any) {
    upload(request, response, function (err: any) {
      clt('保存图片了 图片如下')
      cl(request.file)
      clt('同时接收到该POST的数据如下')
      cl(request.body)
      if (err) {
        clt('保存图片失败了')
        cl(err)
        return response.end("Error uploading image.")
      }
      clt('保存图片成功了')
      // TODO 写入数据库 返回 返回啥呢？？？？
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end("Image is uploaded")
    })
  })
  app.post(PUB_CONST.API_FILE, function (request: any, response: any) {
    upload(request, response, function (err: any) {
      clt('保存文件了 文件名如下')
      cl(request.file)
      clt('同时接收到该POST的数据如下')
      cl(request.body)
      if (err) {
        clt('保存文件失败了')
        cl(err)
        return response.end("Error uploading file.")
      }
      clt('保存文件成功了')
      // TODO 写入数据库 返回 返回啥呢？？？？
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end("File is uploaded")
    })
  })
  app.listen(PUB_CONST.FILE_SERVER_PORT, function () {
    clt("文件上传服务器运行在端口 " + PUB_CONST.FILE_SERVER_PORT)
  })
}

