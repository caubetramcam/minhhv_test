import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const databaseConfig: DataSourceOptions = {
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'admin@123',
  database: process.env.DB_NAME || 'test',
  entities: [__dirname + '/../**/entities/**/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'local' ? ['query', 'error'] : false,
  options: {
    encrypt: false,
  },
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
};

export default databaseConfig;
