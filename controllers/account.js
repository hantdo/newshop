/**
 * 账号控制器
 */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs')
const { User } = require('../models/')
const utils = require('../utils/')

// GET /account/login
exports.login = (req, res) => {
  res.render('login')
}
// POST /account/login
exports.loginPost = (req, res, next) => {
  const { username, password, remember } = req.body

  // 1. 校验
  if (!(username && password)) {
    return res.render('login', { msg: '请完整填写登录信息' })
  }
  // 2. 持久化
  User.findOne({ where: { username } })
    .then(user => {
      if (!user) throw new Error('用户名或密码错误')

      req.session.currentUser = user
      // res.locals.currentUser = user
      // 判断密码是否匹配
      return bcrypt.compare(password, user.password)
    })
    .then(match => {
      if(!match) {
        delete req.session.currentUser
        throw new Error('用户名或密码错误')
      }

      // 用户名粗在而且密码匹配, 将当前登录用户信息存放到 session 中
      // req.session.currentUser = res.locals.currentUser
      // 3. 响应
      res.redirect('/member')
    })
    .catch(e => {
      return res.render('login', { msg: e.message })
    })
  // res.locals.username = username
  // res.send({ username, password, remember })
}
// GET /account/register
exports.register = (req, res) => {
  res.render('register')
}
// POST /account/register
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
      if (user) throw new Error('用户名已存在')
      return User.findOne({ where: { user_email: email } })
    })
    .then(user => {
      if (user) throw new Error('邮箱已存在')
      // 2.持久化
      const newUser = new User()
      const salt = bcrypt.genSaltSync(10)
      newUser.username = username
      newUser.user_email = email
      newUser.user_email_code = uuidv4().substr(0, 12)
      newUser.password = bcrypt.hashSync(password, salt)
      newUser.create_time = Date.now() / 1000
      newUser.update_time = Date.now() / 1000
      return newUser.save()
      // 3.响应
    })
    .then(user => {
      // user => 新建过后的用户信息(包含ID和默认值)
      if (!(user && user.user_id)) throw new Error('注册失败')
      // 发送激活邮箱
      const activeLink = `http://localhost:3000/account/active?code=${user.user_email_code}`
      utils.sendEmail(email, '品优购邮箱激活', `<p><a href="${activeLink}">${activeLink}</a></p>`)
        .then(() => res.redirect('/account/login'))
    })
    .catch(e => {
      res.render('register', { msg: e.message })
    })
}
// GET /account/active
exports.active = (req, res) => {
  const { code } = req.query
  // code 跟谁对比
  User.findOne({ where: { user_email_code: code } })
    .then(user => {
      // 已经取到当前这个验证码匹配的用户, 当前登录的用户信息在 Session 中
      // 判断是否为同一用户
      if(user.user_id != req.session.currentUser.user_id) {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
      }
      // 邮箱就是当前用户的
      user.is_active = '是'
      // 已经激活成功了， 没有必要保存 code
      user.user_email_code = ''
      // 再次保存当前用户信息 (更新数据)
      return user.save()
    })
    .then(user => {
      res.redirect('/member')
    })
}