# ✦ Glamorphosis Studio — Website

**Hair • Makeup • Beauty**  
A complete, deployable beauty studio website with AI chat assistant.

---

## Files

```
glamorphosis-studio/
├── index.html   — All pages (Home, Services, Portfolio, Booking, Contact)
├── style.css    — Full styling (responsive, mobile-ready)
├── script.js    — Navigation, portfolio filter, booking form, AI chat
└── README.md    — This file
```

---

## Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create a GitHub repo
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it `glamorphosis-studio`
4. Set to **Public**
5. Click **Create repository**

### Step 2 — Upload the files
1. Click **Add file → Upload files**
2. Drag all 3 files: `index.html`, `style.css`, `script.js`
3. Click **Commit changes**

### Step 3 — Enable GitHub Pages
1. Go to **Settings → Pages**
2. Under *Source*, select **Deploy from a branch**
3. Choose branch: `main`, folder: `/ (root)`
4. Click **Save**
5. Wait ~2 minutes, then visit: `https://yourusername.github.io/glamorphosis-studio`

---

## Customize Before Launching

### Contact details already added
- Email: `dabsgonzales@yahoo.com`
- Contact number: `+63 935 887 1346`
- Facebook Page: `facebook.com/people/Glamorphosis-Studio/61586977724505/`
- Instagram: `instagram.com/glamorphosis_makeupby_dabica`

### 2. Update pricing (index.html + script.js)
Edit the prices in both files to match your actual rates.

### 3. Add real photos
Replace the emoji placeholders in the Portfolio section with real `<img>` tags:
```html
<!-- Replace this: -->
<div class="port-img" style="background:#fdf0f4;">💍</div>

<!-- With this: -->
<img src="photos/bridal-1.jpg" alt="Bridal transformation" class="port-img" />
```
Then upload your photos into a `photos/` folder in the repository.

### 4. Add Facebook Messenger Chat Plugin
Paste this before `</body>` in index.html (get the code from your Facebook Page settings):
```html
<!-- Facebook Messenger Chat Plugin -->
<div id="fb-root"></div>
<script>
  window.fbAsyncInit = function() {
    FB.init({ xfbml: true, version: 'v18.0' });
  };
</script>
<script async defer src="https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"></script>
<div class="fb-customerchat"
  attribution="biz_inbox"
  page_id="YOUR_PAGE_ID">
</div>
```

---

## Connect Supabase (Booking Database)

### Step 1 — Create a Supabase project
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project

### Step 2 — Create the bookings table
Run this SQL in the Supabase SQL editor:
```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  service text not null,
  date date not null,
  time text not null,
  notes text,
  created_at timestamp default now()
);
```

### Step 3 — Update script.js
In `script.js`, find the booking submit section and replace the comment with:
```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  },
  body: JSON.stringify({ name, phone, service, date, time, notes })
});
```

---

## Connect AI (Claude API)

Replace the local KB chatbot with real Claude AI:

```javascript
async function getAIReply(userMessage) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: `You are the AI assistant for Glamorphosis Studio, a beauty salon.
        Services: Bridal Hair & Makeup (from ₱3,500), Event Makeup (from ₱1,500),
        Hair Styling (from ₱800),
        Photoshoot Makeup (from ₱2,000), Home Service (+ travel fee).
        Hours: Mon-Fri 8AM-7PM, Sat 7AM-8PM, Sun by appointment.
        If unsure, direct to the Glamorphosis Studio Facebook page or Messenger.
        Keep replies short, friendly, and helpful.`,
      messages: [{ role: 'user', content: userMessage }]
    })
  });
  const data = await response.json();
  return data.content[0].text;
}
```

> ⚠️ Never expose your API key in public frontend code. Use a backend function or Supabase Edge Function to proxy the request securely.

---

## Future ERP Modules (Roadmap)

| Module | Tech | When to add |
|---|---|---|
| Appointment Calendar | Supabase + FullCalendar.js | After first 20 bookings |
| Customer CRM | Supabase tables | Month 2 |
| Staff Scheduling | Supabase + React | Month 3 |
| Inventory Tracker | Supabase | Month 4 |
| Sales Reports | Chart.js + Supabase | Month 5 |
| Loyalty Program | Supabase + QR codes | Month 6 |

---

Built with ✦ for Glamorphosis Studio
