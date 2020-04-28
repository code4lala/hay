// 创建文件上传服务器
import PUB_CONST from "../public/PUB_CONST"
import {clt, cl, cet, ce} from "./Util"
import {dbo, fsBucket} from "./MongoDBObject"
import {fnNotifyNewMsg} from "./ServerVar";

export default function () {
  const express = require("express")
  const multer = require('multer')
  const cors = require('cors')
  const app = express()
  const bodyParser = require('body-parser')
  const jsonParser = bodyParser.json()
  const contentDisposition = require('content-disposition')
  const fs = require('fs')
  const assert = require('assert')
  const storage = multer.diskStorage({
    // file upload destination
    destination: function (req: any, file: any, callback: any) {
      callback(null, './uploads')
    },
    filename: function (req: any, file: any, callback: any) {
      // 示例 upload_file_name-1587990848907-5008.png
      callback(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
  })
  // 难点
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
      // TODO 用户身份鉴权
      if (err) {
        clt('保存图片失败了')
        cl(err)
        return response.end("Error uploading image.")
      }
      clt('保存图片成功了')
      // TODO 写入数据库 返回 返回啥呢？？？？
      fs.createReadStream(request.file.path)
        .pipe(fsBucket.openUploadStream(request.file.filename))
        .on('error', function (err: any) {
          assert.ifError(err)
        })
        .on('finish', function () {
          clt('存入数据库' + request.file.filename + '成功')
          const insertData = {
            sender: request.body.sender,
            receiver: request.body.receiver,
            timestamp: parseInt(request.body.timestamp),
            msg: request.file.filename,
            type: 'image'
          }
          clt('存入聊天记录的内容如下')
          cl(insertData)
          dbo.collection('chat_history').insertOne(insertData, function (err: any) {
            if (err) throw err
            clt('保存图片聊天记录' + request.file.filename + '成功')
            // 提醒接收方有新消息
            fnNotifyNewMsg(insertData)
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end("Image is uploaded")
          })
        })
    })
  })

  app.post(PUB_CONST.API_FILE, function (request: any, response: any) {
    upload(request, response, function (err: any) {
      clt('保存文件了 文件名如下')
      cl(request.file)
      clt('同时接收到该POST的数据如下')
      cl(request.body)
      // TODO 检测用户名密码鉴权
      if (err) {
        clt('保存文件失败了')
        cl(err)
        return response.end("Error uploading file.")
      }
      clt('保存文件成功了')
      // TODO 写入数据库 返回 返回啥呢？？？？
      fs.createReadStream(request.file.path)
        .pipe(fsBucket.openUploadStream(request.file.filename))
        .on('error', function (err: any) {
          assert.ifError(err)
        })
        .on('finish', function () {
          clt('存入数据库' + request.file.filename + '成功')
          const insertData = {
            sender: request.body.sender,
            receiver: request.body.receiver,
            timestamp: parseInt(request.body.timestamp),
            msg: request.file.filename,
            type: 'file'
          }
          clt('存入聊天记录的内容如下')
          cl(insertData)
          dbo.collection('chat_history').insertOne(insertData, function (err: any) {
            if (err) throw err
            clt('保存文件聊天记录' + request.file.filename + '成功')
            // 提醒接收方有新消息
            fnNotifyNewMsg(insertData)
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.end("File is uploaded")
          })
        })
    })
  })

  app.post(PUB_CONST.DOWNLOAD_FILE, jsonParser, function (request: any, response: any) {
    clt('接收到下载文件的请求')
    cl(request.body)
    fsBucket.find({
      filename: request.body.msg
    }).toArray(function (err: any, files: any) {
      assert.ifError(err)
      if (!files || files.length === 0) {
        response.writeHead(404, {'Content-Type': 'text/html'})
        response.end("找不到文件")
        return
      }
      cl(files[0])
      response.writeHead(200, {
        'Content-Type': 'mimetype',
        'Content-disposition': contentDisposition(files[0].filename),
        'Content-Length': files[0].length
      })
      fsBucket.openDownloadStreamByName(request.body.msg).pipe(response)
    })
  })

  app.listen(PUB_CONST.FILE_SERVER_PORT, function () {
    clt("文件上传服务器运行在端口 " + PUB_CONST.FILE_SERVER_PORT)
  })
}

