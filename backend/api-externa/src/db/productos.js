const mysqlConn = require('./connectDB');

const queryProductos = async () => {
  const conn = await mysqlConn.getConnection();
  try {
    const [rows,fields] = await conn.execute(
      'SELECT * FROM producto'
    );
    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    conn.removeAllListeners();
    conn.release();
  }
};

module.exports = { queryProductos };