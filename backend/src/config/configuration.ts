export default () => ({
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.PORT, 10) || 3000,
  appUrl: process.env.APP_URL,
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
  },
});
