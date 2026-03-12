# Backend App

Simple Express/EJS application with MongoDB.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run in development:
   ```sh
   npm run dev
   ```
4. Start production server:
   ```sh
   npm start
   ```

## Environment Variables

- `MONGO_URI` - MongoDB connection string (required).
- `PORT` - Port to listen on (default 5000).
- `SESSION_SECRET` - Secret for express-session (required in production).
- `NODE_ENV` - `development` or `production`.

## Deployment

The app reads configuration from environment variables (see above). Ensure a valid `MONGO_URI` and `SESSION_SECRET` are set before starting.

On platforms like Heroku, add a `Procfile` containing:

```
web: npm start
```

or simply rely on the `start` script. The server will bind to `process.env.PORT`.

### Additional Notes

- Static assets are served from the `public` directory.
- Views are implemented using EJS and layouts (`express-ejs-layouts`).
- Session cookies are secure when `NODE_ENV` is `production`.
- A basic error page and 404 page are included.

Be sure to set appropriate host security headers (e.g. using `helmet`) and configure HTTPS when deploying to production.