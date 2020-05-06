// 连接 mongodb
import {cl, clt} from "./Util";

const MongoClient = require('mongodb').MongoClient
const MONGODB_URL = 'mongodb://127.0.0.1'
const GridFSBucket = require('mongodb').GridFSBucket
// 全局变量 数据库中hay表操作对象
export let dbo: any = null
// 全局变量 数据库文件操作对象
export let fsBucket: any = null
MongoClient.connect(MONGODB_URL,
  {useNewUrlParser: true, useUnifiedTopology: true},
  function (err: any, mongodb: any) {
    if (err) throw err
    dbo = mongodb.db('hay')
    fsBucket = new GridFSBucket(dbo)
    clt('MongoDB数据库连接成功')
  }
)
