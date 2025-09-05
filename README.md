# Vitoro

## Local Development

This project defaults to a local SQLite database for development.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` with the database URL:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
   An auth token is not required for a file based database.
3. Run migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

If `DATABASE_URL` is unset, the app and Drizzle config automatically fall back to `dev.db`.

### Environment variables

Authentication requires the following environment variables:

```env
JWT_SECRET="some random string"
JWT_KEY="session"
```

If either variable is missing or empty, the app will throw an error on startup.
