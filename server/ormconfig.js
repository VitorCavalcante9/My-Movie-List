module.exports = {
  "type": process.env.DB_CONNECTION,
  "database": process.env.DB_DATABASE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "migrations": [
    "./src/database/migrations/**.ts"
  ],
  "entities": ["./src/models/**.ts"],
  "cli": {
    "migrationsDir": "./src/database/migrations"
  }
}