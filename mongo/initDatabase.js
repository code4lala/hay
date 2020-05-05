// 这个在Navicat里边执行

// 删除现有数据库所有内容
use hay
db.dropDatabase()
use hay

db.createCollection('invite_code')
db.invite_code.insert([{
    id: '123456789qwer',
		count: 2
}])
db.invite_code.find()

// 新增几个用户
db.createCollection('user')
db.user.insert([{
    name: '小可爱',
		password: '1'
}, {
    name: '小美丽',
		password: '1'
}, {
    name: '小漂亮',
		password: '1'
}])
db.user.find()

// 新增几个好友关系
db.createCollection('friend_list')
db.friend_list.insert([{
    a: '小美丽',
    b: '小美丽'
}, {
    a: '小可爱',
    b: '小可爱'
}, {
    a: '小漂亮',
    b: '小漂亮'
    // 前三个自己跟自己是好友
}, {
    a: '小可爱',
    b: '小美丽'
}, {
    a: '小美丽',
    b: '小可爱'
}, {
    a: '小可爱',
    b: '小漂亮'
}, {
    a: '小漂亮',
    b: '小可爱'
}])
db.friend_list.find()

// 新增聊天记录表格
db.createCollection('chat_history')
db.chat_history.find()
