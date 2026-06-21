# Supabase Table Setup — Run Once

## Step 1: Go to your Supabase project
1. Open https://supabase.com → Login → Open your project
2. Click **SQL Editor** in the left menu
3. Click **New Query**
4. Copy & paste the SQL below, then click **Run**

## SQL to Run:

```sql
-- Create the content table
CREATE TABLE IF NOT EXISTS content (
  section TEXT PRIMARY KEY,
  data    JSONB NOT NULL DEFAULT '{}'
);

-- Allow public read access (so your website can load content)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON content
  FOR SELECT USING (true);

CREATE POLICY "Public write" ON content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update" ON content
  FOR UPDATE USING (true);
```

## Step 2: Verify
After running, go to **Table Editor** → you should see a `content` table.

That's it! Now you can deploy the website files and the admin panel will work.
