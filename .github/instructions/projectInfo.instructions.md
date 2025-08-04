---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Tintio - Advanced Color Palette Builder Setup Instructions

## Overview
Tintio is an advanced color palette building application with features including:
- Smart AI-powered palette creation
- Image color extraction
- Color format conversions (HEX, RGB, HSL, CMYK)
- User authentication and palette storage
- Modern, responsive UI

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account
- Git (optional)

## Step 1: Project Setup

### 1.1 Create Next.js Project
```bash
npx create-next-app@latest tintio
cd tintio
```

### 1.2 Install Required Dependencies
```bash
npm install firebase
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.3 Configure Tailwind CSS
Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 2: Firebase Setup

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project "tintio-v1"
4. Enable Google Analytics (optional)
5. Complete project creation

### 2.2 Register Web App
1. In Firebase console, click "Add app" > Web
2. Register app with nickname "Tintio Web"
3. Copy the Firebase configuration

### 2.3 Enable Firebase Services
1. **Authentication**: Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)
2. **Firestore Database**: Go to Firestore Database
   - Create database in production mode
   - Choose a location
3. **Storage**: Go to Storage
   - Get started with default rules

### 2.4 Environment Variables
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 3: Create Core Files

### 3.1 Firebase Configuration
Create `src/lib/firebase.js`:
```javascript
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
```

### 3.2 Homepage Component
Replace `src/app/page.js` with the provided homepage code.

## Step 4: Additional Setup

### 4.1 Firestore Security Rules
Update Firestore rules in Firebase console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public palettes can be read by anyone
    match /palettes/{paletteId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 4.2 Storage Security Rules
Update Storage rules in Firebase console:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Development

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Access Your App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Additional Features to Implement

### 6.1 Authentication Components
- Login/Register forms
- User profile management
- Protected routes

### 6.2 Color Palette Features
- Palette generator with color theory algorithms
- Image upload and color extraction
- Color format converters
- Palette sharing and saving

### 6.3 Advanced Tools
- Accessibility contrast checkers
- Color harmony generators
- Gradient creators
- Export functionality (CSS, SCSS, JSON)

## Step 7: Deployment

### 7.1 Build for Production
```bash
npm run build
```

### 7.2 Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 7.3 Alternative: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Troubleshooting

### Common Issues:
1. **Environment variables not loading**: Ensure `.env.local` is in project root
2. **Firebase connection errors**: Check API keys and project ID
3. **Build errors**: Ensure all dependencies are installed
4. **Authentication issues**: Verify Firebase Auth setup

### Useful Commands:
```bash
# Check environment variables
npm run dev -- --debug

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps
1. Implement user authentication
2. Create color palette generator
3. Add image upload functionality
4. Build color conversion tools
5. Add sharing and export features

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Color Theory Resources](https://www.adobe.com/creativecloud/design/discover/color-theory.html)