# Firebase Integration for Pixcy Studios

## Storage Comparison

| Option | Cost | Best For |
|--------|------|----------|
| Firebase | FREE (1GB storage) | ✅ RECOMMENDED |
| Supabase | FREE (500MB) | Alternative |
| GitHub | FREE | ❌ NOT for images |

---

## Why Firebase?

✅ FREE forever for photography sites  
✅ Fast image loading  
✅ Real database (permanent storage)  
✅ Access from any device  
✅ 1GB = ~1000 photos  
✅ 10GB bandwidth/month  

---

## Firebase Setup (5 mins)

1. Go to **firebase.google.com**
2. Sign in with Google
3. Create new project
4. Enable **Storage** + **Firestore**
5. Copy config code
6. Paste in `firebase-config.js`

---

## Cursor Prompt

```
Convert Pixcy Studios website to use Firebase for storage:

REQUIREMENTS:
1. Add Firebase to project (Storage + Firestore Database)
2. Password protect admin.html: password = "pixcy2024"
3. Remove "Admin" link from index.html navigation
4. Replace localStorage with Firebase:
   - Images → Firebase Storage
   - Text/content → Firestore Database
   - Portfolio photos → Firebase Storage
   - Couple albums → Firebase Storage

5. Admin panel:
   - Upload images directly to Firebase
   - Save text to Firestore
   - Show upload preview

6. Main website:
   - Load images from Firebase URLs
   - Load text from Firestore
   - Cache properly

FILES TO CREATE:
- firebase-config.js (config placeholder)
- admin.html (password + Firebase uploads)
- admin.js (Firebase integration)
- content.js (load from Firebase)
- index.html (remove admin link)
- FIREBASE-SETUP.md (beginner setup guide)

NOTES:
- Use Firebase v9 modular SDK
- Add error handling
- Include setup instructions in comments
- Keep code simple for non-developers
```

---

## What You Get

✅ Password-protected admin  
✅ Permanent cloud storage  
✅ Works on any device  
✅ Never loses data  
✅ FREE forever  
✅ Professional setup  

---

**Use this prompt in Cursor → Let it handle Firebase setup**
