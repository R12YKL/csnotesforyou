# GitHub & Vercel Deployment Guide

## Prerequisites
1. Install Git from https://git-scm.com/
2. Create a GitHub account at https://github.com
3. Have a Vercel account (free, can sign up at https://vercel.com)

## Step 1: Initialize Git & Push to GitHub

### On your local machine (in PowerShell):

```powershell
# Navigate to project
cd "c:\Users\egbes\OneDrive\Desktop\CS web project\Website\csnotesforyou"

# Initialize git repo
git init

# Configure git (use your GitHub email and name)
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: CS Notes For You site with 18 study topics"

# View the branch name
git branch -M main
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `csnotesforyou` (or your preferred name)
3. Description: "Community site for CS papers, solutions and notes"
4. Choose Public (so it can be deployed to Vercel)
5. Click "Create repository"
6. Do NOT initialize with README/gitignore (we have them)

## Step 3: Push to GitHub

```powershell
# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/csnotesforyou.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### Option A: Using Vercel Web Interface (Easiest)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL: `https://github.com/USERNAME/csnotesforyou`
5. Click "Import"
6. Click "Deploy"
7. Your site will be live at `https://csnotesforyou.vercel.app`

### Option B: Using Vercel CLI

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to connect your GitHub account and deploy
```

## Current Project Configuration

✅ **Already configured:**
- `package.json`: Node.js dependencies set up
- `vercel.json`: Build configuration ready
- `server.js`: Express server configured
- `public/`: Static files properly organized

✅ **Ready for deployment:**
- All HTML/CSS/JS files in `public/`
- Notes page with all 18 topics
- Responsive design
- Express server for static file serving

## File Structure (Production Ready)

```
csnotesforyou/
├── public/                 # Served by Express/Vercel
│   ├── index.html
│   ├── notes.html          # ✅ Updated with 18 topics
│   ├── papers.html
│   ├── solutions.html
│   ├── revision.html
│   ├── contribute.html
│   ├── about.html
│   ├── styles.css          # ✅ Updated with sidebar styling
│   ├── scripts.js
│   └── data/               # Notes data
├── server.js               # Express server
├── package.json            # Dependencies
├── vercel.json             # Vercel config
├── README.md               # Documentation
└── .gitignore              # ✅ Created

```

## After Deployment

Once deployed to Vercel:
1. Your site is live and automatically updated when you push to GitHub
2. Every push to `main` branch triggers automatic deployment
3. Vercel provides SSL/HTTPS automatically
4. Domain can be customized in Vercel settings

## Troubleshooting

**If deployment fails:**
1. Check build logs in Vercel dashboard
2. Ensure `server.js` is correct
3. Verify `vercel.json` routes are correct
4. Make sure all dependencies in `package.json` are installed locally

**For custom domain:**
1. In Vercel dashboard, go to project settings
2. Add your domain under "Domains"
3. Update DNS records as shown by Vercel

## Next Steps

1. ✅ Install Git
2. ✅ Follow Steps 1-3 to push to GitHub
3. ✅ Follow Step 4 to deploy to Vercel
4. ✅ Share your live URL!

