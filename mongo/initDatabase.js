// 这个在Navicat里边执行
use hay
db.createCollection('user')
db.user.insert([{
    name: '张三'
}, {
    name: '李四'
}])
db.user.find()
