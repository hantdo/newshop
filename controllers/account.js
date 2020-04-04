/**
 * 账号控制器
 */
const bcrypt = require('bcryptjs')
const { User } = require('../models/')

exports.login = (req, res) => {
  res.send('login')
}

exports.register = (req, res) => {
  res.render('register')
}

exports.registerPost = (req, res) => {
  // 处理表单接收逻辑
  const { username, email, password, confirm, agree } = req.body

  // 保持提交过来的数据
  res.locals.username = username
  res.locals.email = email
  // 1.合法化校验
  if (!(username && email && password && confirm)) {
    return res.render('register', { msg: '必须完整填写表单' })
  }
  if (password != confirm) {
    return res.render('register', { msg: '密码必须一致' })
  }
  if (!agree) {
    return res.render('register', { msg: '必须注册协议' })
  }

  // 判断用户名存在
  User.findOne({ where: { username } })
    .then(user => {
      console.log(user)
      if (user) throw new Error('用户名已存在')
      return User.findOne({ where: { user_email: email } })
    })
    .then(user => {
      if (user) throw new Error('邮箱已存在')
      // 2.持久化
      const newUser = new User()
      const salt = bcrypt.genSaltSync(10)
      newUser.username = username
      newUser.email = email
      newUser.password = bcrypt.hashSync(password, salt)
      newUser.create_time = Date.now() / 1000
      newUser.update_time = Date.now() / 1000
      return newUser.save()
      // 3.响应
    })
    .then(user => {
      // user => 新建过后的用户信息(包含ID和默认值)
      if (!user.user_id) throw new Error('注册失败')
      res.send('ok')
    })
    .catch(e => {
      res.render('register', { msg: e.message })
    })
}
