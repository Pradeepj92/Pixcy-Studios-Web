# 2 Steps to Lock Down the Admin Panel

Do these once. Takes about 3 minutes total.

---

## Step 1 — Run one script in Supabase

1. Go to https://supabase.com/dashboard and log in
2. Click your project (the one for pixcystudios.in)
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**
5. Paste this whole block in, then click **Run** (bottom right)

```sql
CREATE TABLE IF NOT EXISTS content (
  section TEXT PRIMARY KEY,
  data    JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public write" ON content;
DROP POLICY IF EXISTS "Public update" ON content;
DROP POLICY IF EXISTS "Public read" ON content;
DROP POLICY IF EXISTS "Authenticated write" ON content;
DROP POLICY IF EXISTS "Authenticated update" ON content;

CREATE POLICY "Public read" ON content
  FOR SELECT USING (true);

CREATE POLICY "Authenticated write" ON content
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated update" ON content
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
```

You should see "Success. No rows returned." That's it for Step 1 — safe to run even if you're not sure what's already there.

---

## Step 2 — Create your login

1. Still in the Supabase dashboard, click **Authentication** in the left sidebar
2. Click the **Users** tab
3. Click **Add user** (top right) → **Create new user**
4. Type an email and a password — this is what you'll type into the admin panel from now on
5. Turn ON **Auto Confirm User** (important — otherwise it waits for an email click that won't work here)
6. Click **Create user**

---

## Done — how to check it worked

1. Open `admin.html` on the live site
2. Log in with the email + password from Step 2 → you should get in
3. Try editing something and clicking Save → should say "saved" with no error
4. Open the site in an incognito window and try `admin.html` there — it should show the login screen and refuse to let you in without that password

If Step 4 ever lets someone in without a password, something's wrong — stop and check Step 1 ran successfully.

---

## Note on the old password

`pixcy2024` no longer does anything — it's not checked anywhere in the code anymore. It's still sitting in old commits in your GitHub history, which is fine since it doesn't grant access to anything now.
