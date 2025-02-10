## Database Migration Commands
#### Create new migration file
All migration files should store in `src/database/migrations`
```sh
npm run migration:create src/database/migrations/add_new_column_to_users
```

#### Run migration
```sh
npm run migration:run

# Production (dist folder)
npx typeorm migration:run -d database/data-source
```

#### Revert migration
```sh
npm run migration:revert

# Production (dist folder)
npx typeorm migration:revert -d database/data-source
```
