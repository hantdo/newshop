const path = require('path')
const createError = require('http-errors')

// 载入第三方依赖模块
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const hbs = require('express-hbs')

// 载入路由表
const routers = require('./routers')

// 创建应用程序对象
const app = express()

// 配置 hbs 模板文件的模板引擎
app.engine('hbs', hbs.express4())

// 配置应用所用的模板引擎
app.set('view engine', 'hbs')

// 配置模板文件所在目录
app.set('views', path.join(__dirname, 'views'))

// 载入所需的中间件

// 请求日志
app.use(logger('dev'))

// json 格式解析
app.use(express.json())

// urlencoded 格式解析
app.use(express.urlencoded({ extended: false }))

// 请求头的 cookie 解析
app.use(cookieParser())

// public 文件夹的静态文件服务
app.use(express.static(path.join(__dirname, 'public')))

// 支持 Sesssion
app.use(session({ secret: 'this is a secret'}))
// 挂载跟路由
app.use(routers)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // locals 属性的作用就是 控制器 与 模板 之间的 数据通道
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
