# React Frontend – JWT Auth App

This is the **frontend** for the authentication system built using **React (Vite)**.  
It provides three main screens:
- Signup
- Login
- Protected Users Page

All navigation is handled **without React Router**, using only conditional rendering.

---

## Features

- Signup and login forms
- JWT token stored in `localStorage`
- Protected route (`Users List`) that requires token
- Logout functionality
- Auto-switch to users page if already logged in

---

## Steps to Run the Frontend

### Go inside the frontend folder
```bash
cd frontend
Install dependencies
npm install

Start the app

npm run dev
It will run by default on:
http://localhost:5173
