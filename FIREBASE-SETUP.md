# Firebase Setup Guide for Pixcy Studios

Follow these steps to set up Firebase for your project and enable the admin dashboard to upload and save changes permanently.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Sign in with your Google Account.
3. Click **Add project**.
4. Name your project (e.g., "Pixcy Studios").
5. You can disable Google Analytics for this project, then click **Create project**.

## 2. Register your Web App
1. On your project overview page, click the Web (`</>`) icon to add Firebase to your web app.
2. Name your app (e.g., "Pixcy Web").
3. Click **Register app**.
4. You will see a block of code containing a `firebaseConfig` object. Copy the values from this object.
5. Open `firebase-config.js` in your code editor and replace the placeholder `firebaseConfig` object with your actual configuration values.

## 3. Enable Firebase Storage (For Images)
1. In the Firebase console's left menu, go to **Build** > **Storage**.
2. Click **Get started**.
3. Choose **Start in test mode** (this allows you to upload images easily right now).
4. Click **Next** and then **Done**.
5. Once created, you can see your empty storage bucket. This is where your uploaded images will go!

## 4. Enable Firestore Database (For Text/Settings)
1. In the Firebase console's left menu, go to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** (allows you to read and write easily right now).
4. Click **Next** and then **Enable**.
5. This database will store your website text, like "About Us" and "Services" descriptions.

> **Note on Security:** Starting in "test mode" leaves your database open to anyone for 30 days. For production, you will eventually want to write security rules to only allow your admin portal to write data.

## 5. You're Done!
Once you've pasted your configuration into `firebase-config.js` and enabled both Storage and Firestore, your Pixcy Studios site is ready.

Go to your website, login to the Admin Dashboard with password `"pixcy2024"`, and try uploading an image!
