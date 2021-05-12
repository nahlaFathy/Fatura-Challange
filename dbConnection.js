const sql = require('mssql/msnodesqlv8')

const pool = new sql.ConnectionPool({
   database: 'Fatura',
   server: 'DESKTOP-20RGI9L\\MSSQLSERVER01',
   driver: 'msnodesqlv8',
   options: {
      trustedConnection: true
   }
})

pool.connect().then(() => console.log('connected to SQL Server ...'))
   .catch((err) => console.error('can not connect to SQL Server', err))

module.exports = pool;