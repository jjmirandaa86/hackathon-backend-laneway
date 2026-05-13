# Hackathon Backend

Node.js API for the Air Quality hackathon app. This backend receives requests from the frontend, consults an external air quality API, stores selected results in MySQL, and exposes historical data to the frontend.

## What This API Does

- Checks if the API is running.
- Checks if the MySQL database connection is working.
- Gets current air quality data by city from API Ninjas.
- Stores air quality results in a MySQL table.
- Returns the latest 10 saved air quality searches.

## Tech Stack

- Node.js
- Express
- MySQL
- `mysql2/promise`
- `dotenv`
- `cors`
- Nodemon for local development

## Project Structure

```text
hackathon-backend/
  index.js
  package.json
  .env.example
  database/
    mysql.connection.js
    mysql.methods.js
    create_contacts_table.sql
  routes/
    api.routes.js
    health.routes.js
    database.routes.js
    airQuality.routes.js
```

Main responsibilities:

- `index.js`: configures Express, CORS, JSON body parsing, route mounting, and server startup.
- `routes/api.routes.js`: central route aggregator.
- `routes/health.routes.js`: app and API health routes.
- `routes/database.routes.js`: database health route.
- `routes/airQuality.routes.js`: air quality routes and external API request.
- `database/mysql.connection.js`: MySQL pool connection configuration.
- `database/mysql.methods.js`: database methods used by the routes.
- `database/create_contacts_table.sql`: database and table creation script.

## Environment Configuration

Create a `.env` file using `.env.example` as a reference:

```bash
cp .env.example .env
```

Required variables:

```env
# MySQL configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=hackathon_db

# API configuration
API_PORT=3003
API_URL=http://localhost:3003
CORS_ORIGINS=http://localhost:3002

# External Air Quality API
API_NINJAS_URL=https://api.api-ninjas.com/v1/airquality
API_NINJAS_KEY=your_api_key
```

`CORS_ORIGINS` accepts multiple origins separated by commas:

```env
CORS_ORIGINS=http://localhost:3002,https://your-frontend-domain.com
```

## Installation

```bash
npm install
```

## Run The API

Development mode:

```bash
npm run dev
```

Production/start mode:

```bash
npm start
```

By default, the API runs on:

```text
http://localhost:3003
```

## Security

The API uses CORS restrictions configured in `index.js`.

Current CORS behavior:

- Allows only origins listed in `CORS_ORIGINS`.
- Allows only `GET` and `POST` methods.
- Allows only the `Content-Type` header.
- Enables `credentials: true`.
- Rejects requests from unknown browser origins.

Example:

```js
methods: ["GET", "POST"];
allowedHeaders: ["Content-Type"];
```

Sensitive values such as database passwords and external API keys should stay in `.env` and should not be committed to Git.

## External API

This backend consumes API Ninjas Air Quality:

```text
https://api.api-ninjas.com/v1/airquality
```

The API key is sent through the `X-Api-Key` header.

The frontend does not call API Ninjas directly. It calls this backend, and the backend calls the external API.

## Database

The backend connects to MySQL using `mysql2/promise`.

Connection configuration is read from `.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=hackathon_db
```

Connection file:

```text
database/mysql.connection.js
```

Database methods file:

```text
database/mysql.methods.js
```

## Database Structure

Run this SQL script to create the database and table:

```text
database/create_contacts_table.sql
```

Table: `air_quality`

```sql
CREATE TABLE IF NOT EXISTS air_quality (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  overall_aqi INT NOT NULL,
  CO_concentration DECIMAL(10, 2) NOT NULL,
  CO_aqi INT NOT NULL,
  PM10_concentration DECIMAL(10, 2) NOT NULL,
  PM10_aqi INT NOT NULL,
  SO2_concentration DECIMAL(10, 2) NOT NULL,
  SO2_aqi INT NOT NULL,
  PM2_5_concentration DECIMAL(10, 2) NOT NULL,
  O3_concentration DECIMAL(10, 2) NOT NULL,
  O3_aqi INT NOT NULL,
  NO2_concentration DECIMAL(10, 2) NOT NULL,
  NO2_aqi INT NOT NULL,
  status VARCHAR(100) NOT NULL,
  risk VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes

### App Status

```http
GET /
```

Response:

```text
API is running on localhost x
```

### API Health

```http
GET /api/health
```

Response:

```text
OK
```

### Database Health

```http
GET /api/db/health
```

Example:

```bash
curl http://localhost:3003/api/db/health
```

Response:

```json
{
  "message": "MySQL connection OK",
  "result": {
    "connected": 1
  }
}
```

### Get Air Quality By City

```http
GET /api/air-quality?city=London
```

This route receives a city by query parameter, calls API Ninjas, and returns the external API result.

Example:

```bash
curl "http://localhost:3003/api/air-quality?city=London"
```

Response shape:

```json
{
  "message": "Air Quality external API data",
  "city": "London",
  "data": {
    "CO": {
      "concentration": 418.48,
      "aqi": 4
    },
    "NO2": {
      "concentration": 3.76,
      "aqi": 4
    },
    "O3": {
      "concentration": 83.02,
      "aqi": 120
    },
    "SO2": {
      "concentration": 3.47,
      "aqi": 5
    },
    "PM2.5": {
      "concentration": 26.36,
      "aqi": 71
    },
    "PM10": {
      "concentration": 27.79,
      "aqi": 25
    },
    "overall_aqi": 120
  }
}
```

### Save Air Quality Result

```http
POST /api/air-quality
```

This route stores an air quality result in MySQL.

Example:

```bash
curl -X POST http://localhost:3003/api/air-quality \
  -H "Content-Type: application/json" \
  -d '{
    "city": "London",
    "overall_aqi": 120,
    "CO_concentration": 418.48,
    "CO_aqi": 4,
    "PM10_concentration": 27.79,
    "PM10_aqi": 25,
    "SO2_concentration": 3.47,
    "SO2_aqi": 5,
    "PM2_5_concentration": 26.36,
    "O3_concentration": 83.02,
    "O3_aqi": 120,
    "NO2_concentration": 3.76,
    "NO2_aqi": 4,
    "status": "Unhealthy for Sensitive Groups",
    "risk": "Children, older adults, and people with asthma may be affected."
  }'
```

Response:

```json
{
  "message": "Air Quality saved successfully",
  "airQuality": {
    "id": 1
  }
}
```

### Get Historical Air Quality Searches

```http
GET /api/air-quality-historical
```

Returns the latest 10 saved rows ordered by `created_at DESC`.

Example:

```bash
curl http://localhost:3003/api/air-quality-historical
```

Response:

```json
{
  "message": "Air Quality historical data",
  "total": 1,
  "data": [
    {
      "id": 1,
      "city": "London",
      "overall_aqi": 120,
      "status": "Unhealthy for Sensitive Groups",
      "risk": "Children, older adults, and people with asthma may be affected.",
      "created_at": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

## Frontend Flow

Expected frontend flow:

1. User searches for a city.
2. Frontend calls `GET /api/air-quality?city=<city>`.
3. Backend calls API Ninjas and returns the result.
4. Frontend displays the result.
5. Frontend sends formatted data to `POST /api/air-quality`.
6. Backend saves the row in MySQL.
7. Frontend calls `GET /api/air-quality-historical`.
8. Frontend displays the latest 10 searches.
