const mysql = require("mysql2/promise");

class MySQLConnection {
  constructor() {
    this.config = {
      host: process.env.MYSQL_HOST || "localhost",
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "hackathon_db",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    this.pool = null;
  }

  connect() {
    if (!this.pool) {
      this.pool = mysql.createPool(this.config);
    }

    return this.pool;
  }
}

module.exports = new MySQLConnection();
