# Tangkhul Lyrics

A Next.js application for browsing and contributing Tangkhul song lyrics. The project uses TypeScript, Tailwind CSS and Mongoose for data storage.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   Create a `.env` file in the project root. You can use [`.env.example`](./.env.example) as a template.
   The following variables are required:
   - `MONGODB_URI` – connection string for user database access
   - `MONGODB_ADMIN_URI` – connection string for administrative operations
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD` – credentials for the admin portal
   - `NEXT_PUBLIC_API_URL` – base URL of the running site (defaults to `http://localhost:3000`)

3. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage & Development Notes

- The project is built with [Next.js 15](https://nextjs.org/) using the `app` directory structure.
- API routes live under `src/app/api` and require the environment variables above for database access.
- Tailwind styles can be found in `src/styles` and are configured via `tailwind.config.ts`.
- When making changes, run `npm run dev` to start a local dev server with hot reloading.

