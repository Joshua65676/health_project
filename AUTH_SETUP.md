# Authentication Setup

The React forms use PHP endpoints under `php-app/auth/`. Password accounts are stored in MySQL, passwords are hashed, and signup requires a time-limited email confirmation. Google sign-in uses an OAuth authorization-code flow handled by PHP. Both methods create a PHP session cookie; the React dashboard can retrieve the signed-in user from `auth/me.php`.

## Local environment

The current local ports are PHP `8083`, MySQL `3307`, phpMyAdmin `8082`, and React `5174`.

1. Keep the existing root `.env` file and merge any missing keys from `.env.example`; do not replace it if it contains other project credentials. The root `.env` is ignored by Git.
2. Keep `MYSQL_ROOT_PASSWORD` and `DB_PASSWORD` equal. The Compose development default is `root`; an already-initialized MySQL volume keeps the password it was first created with.
3. Create `react/.env.local` from `react/.env.example`. That file is ignored by Git.
4. For local development, leave `AUTH_COOKIE_SECURE=false`. Set it to `true` when serving the app over HTTPS.

Start the services from the repository root:

```sh
docker compose up -d
```

Apply the schema once to the existing database. In Git Bash, from the repository root:

```sh
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot "$MYSQL_DATABASE"' < php-app/auth/schema.sql
```

Alternatively, open phpMyAdmin at `http://localhost:8082`, select `mydb`, open the SQL tab, and run `php-app/auth/schema.sql`.

After changing `.env`, recreate PHP so Compose applies the new values:

```sh
docker compose up -d --force-recreate php-app
```

Run the frontend from `react/` with `npm install` and `npm run dev`. The login and signup screens are at `http://localhost:5174/login` and `http://localhost:5174/signup`.

## Email confirmation

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_ENCRYPTION`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM_EMAIL` in the root `.env`. For Gmail, use `smtp.gmail.com`, port `587`, encryption `tls`, and a Google App Password for the sender account. Google requires 2-Step Verification before creating an App Password; do not use the account's normal Gmail password.

`APP_BASE_URL` must be the URL the recipient's browser can open, currently `http://localhost:8083`. The email confirmation page signs the user in, displays a success message, then redirects after a few seconds.

## Google sign-in

1. Create a Google OAuth client with application type **Web application**.
2. Add `http://localhost:5174` as an authorized JavaScript origin.
3. Add `http://localhost:8083/auth/google-callback.php` as an authorized redirect URI.
4. Put the client ID and client secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; keep `GOOGLE_REDIRECT_URI` exactly equal to the redirect URI configured in Google.

The same Google button signs in an existing account or creates an account for a new Google-verified email. Google credentials are never sent to React.

## Dashboard callback

The success redirect defaults to `http://localhost:5174/chatdashboard`. Add that route in `react/src/App.tsx` when you create the chat dashboard. In that page, call `getCurrentUser()` from `react/src/auth.ts`; it requests the signed-in user with credentials included. If it returns `401`, redirect to `/login`.

Keep `FRONTEND_ORIGIN`, `FRONTEND_CALLBACK_URL`, and `VITE_AUTH_CALLBACK_URL` aligned if you change the React host or dashboard path. The matching PHP callback URL is also the target after email confirmation and Google sign-in.

For production, use HTTPS, a dedicated least-privilege MySQL account, strong secrets, and an email sender configured for your domain. The checked-in Compose defaults are for local development only.

