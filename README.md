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
- Express.js 
- ?
- Supabase
- Prisma

## Installation  
```
git clone 
```
### Mobile / Desktop  
1. Install **Flutter**  
2. Create a database project in **Supabase**  
3. Add API key and API URL to the `.env` file  
4. Install dependencies with:  
   ```sh
   flutter pub get
   ```  
### Web
1. Open backend
2. Run command ```npm install```
3. Run ```index.js```
## Database Structure  

### `users` Table
```sql
CREATE TABLE public.user (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text NOT NULL UNIQUE,
  username text,
  password text,
  updated_at timestamp without time zone,
  CONSTRAINT user_pkey PRIMARY KEY (id)
);
```

### `notes` Table
```sql
CREATE TABLE public.notes (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id integer NOT NULL,
  title text NOT NULL,
  content text,
  updated_at timestamp without time zone,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
```
![DB schema](https://github.com/Buszewicz/Stiknes/blob/main/DB.png)

## Authors  
- Filip Buszewicz  
- Kacper Czerwiński  

