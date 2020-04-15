const path = require('path')

// ORM 框架
const Sequelize = require('sequelize')
// 自动匹配路径
const glob = require('glob')

const config = require('../config')

const sequelize = new Sequelize(Object.assign({},config.database,{
  define: { timestamps: false}
}))

glob.sync('*.js', { cwd: __dirname })
  .filter(item => item != 'index.js')
  .forEach(item => {
    const model = sequelize.import(path.join(__dirname, item))
    // 导出模型
    exports[model.name] = model
  })
