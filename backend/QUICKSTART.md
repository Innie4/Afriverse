# Quick Start Guide

## ✅ What's Been Fixed

1. **SOLID/DRY Principles Applied**
   - All controllers refactored to use centralized response handlers
   - `asyncHandler` wrapper for consistent error handling
   - `sendSuccess`, `sendNotFound`, `sendBadRequest` for uniform responses

2. **Smart Contract Integration**
   - Uses "story" terminology throughout
   - Event listener listens for `StoryMinted` events
   - Database tables properly reference `stories` table

3. **Supabase Integration**
   - No local PostgreSQL installation needed!
   - Automatic SSL handling
   - Connection pooling support
   - Easy cloud database setup

4. **Database Setup Scripts**
   - `npm run create-env` - Creates .env file
   - `npm run setup-db` - Creates tables in Supabase
   - `npm run seed` - Seeds sample data
   - `npm run setup` - Full setup (all of the above)

5. **Enhanced Frontend Placeholders**
   - 40+ placeholder listings when API fails
   - Client-side filtering works with placeholders

6. **Swagger UI Integration**
   - Available at `/api-docs`
   - All endpoints documented

## 🚀 Quick Start with Supabase (5 Steps)

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Fill in project details:
   - **Name:** `afriverse-tales`
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Choose closest to you
4. Wait 2-3 minutes for project to be ready

### Step 2: Get Connection String

1. In Supabase dashboard: **Settings** → **Database**
2. Scroll to **"Connection string"**
3. Select **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Configure Backend

```powershell
cd backend
npm run create-env
```

Then edit `.env` file and add:
```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:YOUR_PASSWORD@aws-0-[REGION].pooler.supabase.com:6543/postgres
USE_SUPABASE=true
```

### Step 4: Setup Database

```powershell
npm run setup-db    # Creates all tables
npm run seed        # Seeds sample data
```

Or run both:
```powershell
npm run setup
```

### Step 5: Start Server

```powershell
npm run dev
```

Then visit:
- **API:** http://localhost:3001/api/health
- **Swagger:** http://localhost:3001/api-docs
- **Stories:** http://localhost:3001/api/stories

📖 **Full Supabase setup guide:** See `SUPABASE_SETUP.md`

## 📋 Available Scripts

```bash
npm run create-env      # Create .env file
npm run check-postgres  # Check PostgreSQL status
npm run setup-db        # Create database and tables
npm run seed            # Seed sample data
npm run setup           # Full setup (recommended)
npm run dev             # Start development server
npm start               # Start production server
```

## 🔧 Troubleshooting

### PostgreSQL Connection Issues

**Service running but connection refused:**
1. Restart service: `net stop postgresql-x64-13 && net start postgresql-x64-13`
2. Check firewall allows port 5432
3. Verify `pg_hba.conf` allows local connections

**Authentication failed:**
1. Check password in `.env` file
2. Update `DATABASE_URL` with correct password
3. Or reset password in pgAdmin

### Database Already Exists

If database exists but tables don't:
```bash
npm run setup-db  # This will create tables
```

### Port Already in Use

Change port in `.env`:
```
PORT=3002
```

## 📚 Documentation

- **Full Setup Guide:** See `SETUP.md`
- **API Documentation:** http://localhost:3001/api-docs (when server is running)
- **Backend README:** See `README.md`

## ✨ What Works Now

✅ All controllers follow SOLID/DRY principles  
✅ Smart contract uses "story" terminology  
✅ Database schema ready  
✅ Seeding scripts ready  
✅ Swagger UI integrated  
✅ Frontend placeholders enhanced  
✅ Error handling improved  
✅ Setup scripts created  

**Just need PostgreSQL connection working!**

