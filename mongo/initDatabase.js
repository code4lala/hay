// 这个在Navicat里边执行

// 删除现有数据库所有内容
use hay
db.dropDatabase()
use hay

db.createCollection('invite_code')
db.invite_code.insert([{
    id: 'howareyouinvitecode',
	count: 1
}])
db.invite_code.find()

