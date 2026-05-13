const mysqlConnection = require("./mysql.connection");

class MySQLMethods {
  constructor(connection) {
    this.connection = connection;
  }

  async testConnection() {
    const pool = this.connection.connect();
    const [rows] = await pool.query("SELECT 1 AS connected");

    return rows[0];
  }

  async insertDataAirQuality({
    city,
    overall_aqi,
    CO_concentration,
    CO_aqi,
    PM10_concentration,
    PM10_aqi,
    SO2_concentration,
    SO2_aqi,
    PM2_5_concentration,
    O3_concentration,
    O3_aqi,
    NO2_concentration,
    NO2_aqi,
    status,
    risk,
  }) {
    const pool = this.connection.connect();
    const sql = `
      INSERT INTO air_quality (city, overall_aqi, CO_concentration, CO_aqi, PM10_concentration, PM10_aqi, SO2_concentration, SO2_aqi, PM2_5_concentration, O3_concentration, O3_aqi, NO2_concentration, NO2_aqi, status, risk)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      city,
      overall_aqi,
      CO_concentration,
      CO_aqi,
      PM10_concentration,
      PM10_aqi,
      SO2_concentration,
      SO2_aqi,
      PM2_5_concentration,
      O3_concentration,
      O3_aqi,
      NO2_concentration,
      NO2_aqi,
      status,
      risk,
    ];
    const [result] = await pool.execute(sql, values);

    return {
      id: result.insertId,
    };
  }

  async getAllAirQuality() {
    const pool = this.connection.connect();
    const sql = `
      SELECT *
      FROM air_quality
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const [rows] = await pool.query(sql);

    return rows;
  }
}

module.exports = new MySQLMethods(mysqlConnection);
