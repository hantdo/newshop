/**
 * 账号控制器
 */
const { User } = require('../models/')


 exports.login = (req, res) => {
     res.send('login')
 }

 exports.register = (req, res) => {
     res.render('register')
 }

 exports.registerPost = (req, res) => {
    //  处理表单接收逻辑
    const { username, email, password, confirm, agree } = req.body
    // console.log( { username, email, password, confirm, agree })
    // 1.合法化校验
    if (!(username && email && password && confirm && agree)){
       return res.render('register', { msg: '必须完整填写表单' })
    }
    User.findAll({ where: { username }})
        .then(data => {
            console.log(data)
        })
    // 2.持久化
    // 3.响应
    res.send('ok')
 }