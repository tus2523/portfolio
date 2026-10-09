# Tushar Maru Portfolio — Deployment & Setup Guide

This project is a high-performance, responsive portfolio website built for **Tushar Maru (Videographer & Video Editor)** with React, Vite, Tailwind CSS, Framer Motion, Cloudinary, and an Admin Control Panel.

---

## 🚀 Quick Setup Instructions

### 1. Push to Tushar's GitHub Repository

Open your terminal or PowerShell in `E:\Antigravity\Turshar website` and run:

```bash
# 1. Initialize Git repository (if not already done)
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Initial commit for Tushar Maru Portfolio"

# 4. Link your friend Tushar's GitHub repository
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<TUSHAR-REPO-NAME>.git

# 5. Push to GitHub main branch
git branch -M main
git push -u origin main
```

---

## 🌐 Deploying to Vercel (1-Click Setup)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Select **Import Git Repository** and choose Tushar's GitHub repository.
3. Framework Preset: **Vite** (auto-detected).
4. Environment Variables (Optional):
   - `VITE_CLOUDINARY_CLOUD_NAME`: `digkpl4re` (or Tushar's Cloudinary cloud name)
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: `axuqgwb1` (or Tushar's unsigned upload preset)
5. Click **Deploy**!

Vercel will build and publish your website live within seconds.

---

## 🔑 Admin Control Panel Details

- **Admin Page URL**: `https://<your-vercel-domain>.vercel.app/#admin` (or click **Admin** in top navbar)
- **Login Email**: `marutushar387@gmail.com` (or `tushar@admin.com`)
- **Login Password**: `tushar123`

### What You Can Do in the Admin Panel:
1. **YouTube Videos**: Add, edit, delete YouTube links. Paste any YouTube video/shorts URL and the system will automatically fetch the thumbnail and render the embedded video player.
2. **Photo Showcase**: Upload stills, BTS photos, and portfolio pictures via Cloudinary or local file picker. Add categories (Celebrity BTS, Live Events, Music Videos, Commercials, Wedding).
3. **About & Bio**: Update Tushar's profile bio, contact details, email, and phone number.
4. **Experience & Education**: Manage work history timeline and college/school credentials.
5. **Services**: Customize services offered (Videography, Video Editing, Associate Directing, Comic Creator Reels).
6. **Cloudinary Integration Settings**: Easily configure Tushar's Cloudinary Cloud Name and Upload Preset directly in Admin Settings.

---

## 🖼️ Cloudinary Integration

- Upload photos from your computer or phone directly inside Admin Panel.
- Supports automatic image compression, resize, and CDN hosting via Cloudinary.
- You can also paste direct image URLs if hosted elsewhere.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```
