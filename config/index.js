module.exports = {
  database: {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: 'newshop',
    operatorsAliases: false,
    logging: false
  },
  mail: {
    host: 'smtp.126.com',
    port: 465,
    secure: true,
    name: '品优购',
    auth: { user: 'hanntao@126.com', pass: 'IVHZYUUXACLHADBU' },
    connectionTimeout: 1000,
    greetingTimeout: 1000,
    socketTimeout: 2000,
    debug: process.env.NODE_ENV === 'development'
  }
}
