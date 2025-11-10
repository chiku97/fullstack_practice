Student Tasks

Implement the backend routes for:

POST /api/signup

POST /api/login

GET /api/users (protected)

Use JWT authentication on the backend.

Test the full flow:

Signup → Login → Fetch Users → Logout.


---

## `backend/README.md`

```markdown
# Node.js Backend – JWT Auth API

This is the **backend** for the authentication system.  
It provides APIs for:
- User Signup
- User Login
- Fetching Users (Protected Route)


---

## 🧠 Concepts Covered

✅ Express Basics  
✅ Prisma   
✅ JWT Token Authentication  
✅ Middleware for Protection  
✅ Password Hashing using bcrypt  

---

## Steps to Set Up the Backend

### Go inside the backend folder
```bash
cd backend

2️⃣ Initialize and install dependencies
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv

3️⃣ Create .env file
PORT=3001
JWT_SECRET=mysecretkey
