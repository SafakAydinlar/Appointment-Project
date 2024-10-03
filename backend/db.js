const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'DESKTOP-CMSC15R\\SQLEXPRESS', 
  database: 'DatateamKuafor', 
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true, 
    encrypt: false, 
    trustServerCertificate: true
  }
};


const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Veritabanı bağlantısı başarılı.');
    return pool;
  })
  .catch(err => {
    console.error('Veritabanı bağlantısı hatası:', err);
    process.exit(1); 
  });

module.exports = {
  sql,
  poolPromise
};
