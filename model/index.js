// 引入mongodb
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'
// 引入所使用的的数据库
var dbName = 'project'

// 封装数据库连接方法（通过nodejs的mongodb模块）
function connect(callback) {
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log('数据库连接错误', err)
        } else {
            var db = client.db(dbName)
            callback && callback(db)
            client.close()
        }
    })
}
module.exports = {
    connect
}