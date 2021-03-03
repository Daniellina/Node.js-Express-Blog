var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');//处理时间格式

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username || ''
  var page = req.query.page || 1
  var data = {
    total: 0, // 文章总页数
    curPage: page,// 当前页
    list: [] // 当前页文章列表
  }
  var pageSize = 5
  model.connect(function(db) {
    // step1: 查询所有文章
    db.collection('articles').find().toArray(function(err, docs) {
      console.log('文章列表', docs)

      data.total = Math.ceil(docs.length / pageSize)
      // step2:查询当前页的文章列表
      model.connect(function(db) {
        db.collection('articles').find().sort({ id: -1 }).limit(pageSize).skip((page-1)*pageSize).toArray(function(err, docs2) {
          if (docs2.length == 0) {
            res.redirect('/?page='+((page-1) || 1))
          } else {
            docs2.map(function(ele, index) {
              ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
            })
            data.list = docs2
          }
          res.render('index', { username:username, data: data });
        })
      })
      data.list = docs

    })
  })
});

// 渲染注册页
router.get('/regist', function(req,res,next) {
  res.render('regist', {});
});
// 渲染登录页
router.get('/login', function(req,res,next) {
  res.render('login', {});
});
// 渲染写/编辑文章页面
router.get('/write', function(req,res,next) {
  var username = req.session.username || ''
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title: '',
    content: ''
  }
  if (id) { // 编辑
    model.connect(function(db) {
      db.collection('articles').findOne({id: id}, function(err,docs) {
        if (err) {
          console.log('查询失败！')
        } else {
          item = docs
          item['page'] = page
          res.render('write', {username: username, item: item})
        }
      })
    })
  } else { // 新增
    res.render('write', {username: username, item: item})
  }

});

// 渲染详情页
router.get('/detail', function(req,res,next) {
  var username = req.session.username
  var id = parseInt(req.query.id)
  model.connect(function(db) {
    db.collection('articles').findOne({id:id}, function(err, docs) {
        if (err) {
            console.log('查询失败',err)
        } else {
            var item = docs
            item['time'] = moment(item.id).format("YYYY-MM-DD HH:mm:ss")
            res.render('detail', {username:username, item: item});
        }
    })
  })
});

module.exports = router;
