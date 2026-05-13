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

	async testConnection() {
		const pool = this.connect();
		const [rows] = await pool.query("SELECT 1 AS connected");

		return rows[0];
	}

	async insertDataAirQuality({ city, overall_aqi, CO_concentration, CO_aqi, PM10_concentration, PM10_aqi, SO2_concentration, SO2_aqi, PM2_5_concentration, O3_concentration, O3_aqi, NO2_concentration, NO2_aqi, status, risk }) {
		const pool = this.connect();
		const sql = `
			INSERT INTO air_quality (city, overall_aqi, CO_concentration, CO_aqi, PM10_concentration, PM10_aqi, SO2_concentration, SO2_aqi, PM2_5_concentration, O3_concentration, O3_aqi, NO2_concentration, NO2_aqi, status, risk)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const values = [city, overall_aqi, CO_concentration, CO_aqi, PM10_concentration, PM10_aqi, SO2_concentration, SO2_aqi, PM2_5_concentration, O3_concentration, O3_aqi, NO2_concentration, NO2_aqi, status, risk];
		const [result] = await pool.execute(sql, values);

		return {
			id: result.insertId
		};
	}

	async getAllAirQuality() {
		const pool = this.connect();
		const sql = `
			SELECT *
			FROM air_quality
			ORDER BY created_at DESC limit 10
		`;
		const [rows] = await pool.query(sql);

		return rows;
	}
}

module.exports = new MySQLConnection();
