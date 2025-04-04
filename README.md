# Stiknes  

**Cloud-based note-taking app with Markdown support**  

Simple and fast note management with **Markdown** formatting and access from any device.  

## Features  
- Dark mode / Light mode  
- **Markdown** editing (headings, lists, code, *emphasis*, etc.)  
- Cloud synchronization (Supabase)  
- Responsive design (works on desktop and mobile)  

## Tech Stack  

### Desktop / Mobile  
- Flutter  
- Supabase  

### Web  
- NestJS  
- Vue.js  
- Supabase  

## Installation  

### Mobile / Desktop  
1. Install **Flutter**  
2. Create a database project in **Supabase**  
3. Add API key and API URL to the `.env` file  
4. Install dependencies with:  
   ```sh
   flutter pub get
   ```  

## Database Structure  

### `users` Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  password TEXT,  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);
```

### `notes` Table
```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NULL
);
```

## Authors  
- Filip Buszewicz  
- Kacper Czerwiński  

