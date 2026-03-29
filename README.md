# Mela (mela-chain)

This repository contains the Mela learning platform code (the `mela-chain` application).

## Summary

- Full-stack project with a Node/Express backend and a Next.js frontend.
- Backend lives in `mela-chain/backend` and frontend in `mela-chain/frontend`.
- Several docs and setup helpers are present in the `mela-chain` folder.

## Quickstart (local)

Prerequisites:

- Node.js (16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

Backend

1. Open a terminal and install dependencies:

```bash
cd mela-chain/backend
npm install
```

2. Create a `.env` file (copy from any example or create one) and set at minimum:

- `MONGO_URI` — connection string to MongoDB
- `PORT` — server port (e.g. `5000`)
- `SESSION_SECRET` — session secret key
- OAuth keys if using Google login: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

3. Seed the database (if needed):

```bash
node scripts/seed.js
```

4. Create an admin account (if the script exists):

```bash
node scripts/createAdmin.js
```

5. Start the backend:

```bash
npm run dev
# or for production: node server.js
```

Frontend

1. Install and run the frontend:

```bash
cd ../frontend
npm install
npm run dev
```

2. Configure runtime environment variables for the frontend (e.g. `NEXT_PUBLIC_API_URL` pointing to your backend).

Running the full app

1. Start the backend first, then the frontend.
2. Open the frontend URL shown by Next.js (usually `http://localhost:3000`).

Deploying

- Backend: deploy to Railway/Heroku or similar. Ensure environment variables are set.
- Frontend: deploy to Vercel or Netlify. Make sure OAuth redirect URIs match deployed URLs.

How to push this README to GitHub (example)

```bash
# add and commit the README
git add README.md
git commit -m "Add README"

# push to the remote named 'origin' on branch 'master'
git push origin master
```

If you need to set or change the remote URL:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin master
```

Support & docs

See the many project notes in the repository (files such as `SETUP_GUIDE.md`, `QUICK_START.md`, and `DEPLOYMENT_GUIDE.md`) inside the `mela-chain` folder for targeted fixes and deployment notes.

License

Check the `LICENSE` file in the repository root for license details.
