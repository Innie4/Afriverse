# Supabase Setup Guide

## What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **Managed PostgreSQL database** (no local installation needed!)
- **Automatic backups**
- **Built-in connection pooling**
- **Easy scaling**
- **Free tier available**

## Quick Setup (5 Minutes)

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account (or sign in)
3. Click **"New Project"**
4. Fill in:
   - **Name:** `afriverse-tales` (or any name)
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is fine to start
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to be ready

### Step 2: Get Your Connection String

1. In your Supabase project dashboard, go to:
   **Settings** → **Database**
2. Scroll down to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
5. **Important:** Replace `[YOUR-PASSWORD]` with the password you set in Step 1

### Step 3: Configure Backend

1. **Create .env file:**
   ```bash
   cd backend
   npm run create-env
   ```

2. **Update .env file** with your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxxxxxxxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   USE_SUPABASE=true
   ```

   Replace:
   - `xxxxxxxxxxxxx` with your project reference
   - `YOUR_PASSWORD` with your database password
   - `us-east-1` with your region (if different)

### Step 4: Setup Database

```bash
# This will create all tables in Supabase
npm run setup-db
```

### Step 5: Seed Sample Data

```bash
# This will add sample stories, listings, etc.
npm run seed
```

### Step 6: Start Server

```bash
npm run dev
```

Visit:
- **API:** http://localhost:3001/api/health
- **Swagger:** http://localhost:3001/api-docs
- **Stories:** http://localhost:3001/api/stories

## Connection String Formats

### Option 1: Transaction Mode (Recommended for development)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```
- Port: `6543`
- Best for: Development, transactions

### Option 2: Session Mode (For migrations)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```
- Port: `5432`
- Best for: One-time migrations, admin tasks

### Option 3: Direct Connection (Not recommended)
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```
- Direct connection (no pooling)
- Use only if pooling doesn't work

## Finding Your Project Reference

Your project reference is in your Supabase dashboard URL:
```
https://app.supabase.com/project/[PROJECT-REF]
                                    ^^^^^^^^^^^^
                                    This is your project reference
```

Or in Settings → General → Reference ID

## Troubleshooting

### Connection Timeout

**Error:** `ETIMEDOUT` or `ENOTFOUND`

**Solutions:**
1. Check your internet connection
2. Verify connection string is correct
3. Check if Supabase project is paused (free tier pauses after inactivity)
   - Go to dashboard and click "Restore" if paused

### Authentication Failed

**Error:** `28P01` (password authentication failed)

**Solutions:**
1. Verify password in connection string matches your database password
2. Reset password in Supabase Dashboard:
   - Settings → Database → Reset database password
3. Update `.env` file with new password

### SSL Connection Required

**Error:** SSL connection required

**Solution:**
- Supabase requires SSL. The code automatically handles this.
- If you see this error, check that `USE_SUPABASE=true` is in `.env`

### Database Not Found

**Error:** Database does not exist

**Solution:**
- Supabase creates a default `postgres` database
- Use `postgres` as the database name in connection string
- Don't try to create a new database (Supabase manages this)

## Supabase Dashboard Features

Once set up, you can:

1. **View Data:**
   - Go to **Table Editor** in Supabase dashboard
   - See all your tables and data

2. **Run SQL:**
   - Go to **SQL Editor**
   - Run custom queries

3. **Monitor:**
   - Go to **Database** → **Connection Pooling**
   - See connection stats

4. **Backups:**
   - Automatic daily backups (on paid plans)
   - Manual backups available

## Free Tier Limits

- **500 MB database storage**
- **2 GB bandwidth**
- **50,000 monthly active users**
- **Project pauses after 1 week of inactivity** (can restore instantly)

## Upgrading

When you need more:
1. Go to **Settings** → **Billing**
2. Choose a plan
3. No code changes needed!

## Security Best Practices

1. **Never commit `.env` file** to git
2. **Use environment variables** in production
3. **Rotate passwords** regularly
4. **Use connection pooling** (port 6543)
5. **Enable Row Level Security** in Supabase for production

## Next Steps

After setup:
1. ✅ Database is ready
2. ✅ Tables are created
3. ✅ Sample data is seeded
4. 🚀 Start building!

See `QUICKSTART.md` for API usage and `SETUP.md` for full documentation.

