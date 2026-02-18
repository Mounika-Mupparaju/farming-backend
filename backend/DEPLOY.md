# Deploy AgroVibes backend (shared API + database)

> **Deploy backend + frontend globally:** see **[../DEPLOY-GLOBAL.md](../DEPLOY-GLOBAL.md)** for step-by-step (Neon + Render + Vercel).

When deployed with a **PostgreSQL** database, everyone (you and anyone who clones the frontend) sees the **same posts and data** by pointing the frontend to this API.

---

## 1. Create a free PostgreSQL database

### Option A: Neon (recommended, free tier)

1. Go to [neon.tech](https://neon.tech) and sign up.
2. Create a new project and copy the **connection string** (e.g. `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`).

### Option B: Render PostgreSQL

1. Go to [render.com](https://render.com) → Dashboard → New → PostgreSQL.
2. Create the database and copy the **Internal Database URL** (or External if your backend runs elsewhere).

---

## 2. Deploy the backend to Render

1. Go to [render.com](https://render.com) → Dashboard → **New** → **Web Service**.
2. Connect your GitHub repo **farming-backend** (or upload this folder).
3. Configure:
   - **Name:** `agrovibes-api` (or any name).
   - **Runtime:** Node.
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Instance type:** Free.

4. **Environment variables** (Add in Render dashboard):

   | Key             | Value                    |
   |-----------------|--------------------------|
   | `DATABASE_URL`  | Your Neon/Render Postgres connection string |
   | `FRONTEND_URL`  | Your frontend URL (e.g. `https://your-app.onrender.com` or Vercel URL) so CORS allows it |

5. Deploy. After deploy, note your backend URL, e.g. `https://agrovibes-api.onrender.com`.

---

## 3. Point the frontend to the deployed API

Anyone using the frontend (you or your teammate) should use this API URL.

### When running locally (npm start)

Create a file **`.env`** in the **frontend** folder (`farmer-insta`):

```env
REACT_APP_API_URL=https://agrovibes-api.onrender.com
```

Replace with your actual Render backend URL. Then run `npm start` — the app will call the deployed API and show the same posts for everyone.

### When deploying the frontend (e.g. Vercel / Netlify)

Set the same variable in the hosting dashboard:

- **Vercel:** Project → Settings → Environment Variables → `REACT_APP_API_URL` = `https://agrovibes-api.onrender.com`
- **Netlify:** Site → Build & deploy → Environment → add `REACT_APP_API_URL`

Redeploy the frontend after adding the variable.

---

## 4. Summary

| Where it runs | Database / data |
|---------------|------------------|
| **Local (no DATABASE_URL)** | JSON file `database/data.json` on your machine — not shared. |
| **Render + DATABASE_URL** | PostgreSQL — **one shared database** for all users. |

After deployment, you and anyone who clones the frontend and sets `REACT_APP_API_URL` to your backend URL will see the **same updated posts and data**.
