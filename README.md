<!-- # Docker DB MSSQL

```sh
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=admin@123"  -u 0:0 -p 1433:1433 --name sql1 --hostname sql1 -d mcr.microsoft.com/mssql/server:2022-latest
```

# Create DB Test
```sh
docker exec -it sql1 /opt/mssql-tools18/bin/sqlcmd  -S localhost -U sa -P admin@123 -C -Q "CREATE DATABASE test;"
```

# APP
```sh
cd backend
npm i
npm run migration:run
npm run start:dev -->

# RUN APP
```sh
docker compose up -d --build
```

# LINK APP
http://localhost:8080
user: admin/admin@123

