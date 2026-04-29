# 🏡 StayNest — Full-Stack Rental Platform

StayNest is a production-ready full-stack rental listing platform inspired by Airbnb.
It allows users to explore properties, create listings, upload images, view locations on maps, and securely manage their accounts.

The project demonstrates real-world backend architecture, authentication systems, cloud integrations, and scalable design patterns.

---

## 🚀 Key Features

### 🌐 Core Features

* Browse all property listings
* View detailed listing pages with images & location
* Create, edit, and delete listings (CRUD)

### 🔐 Authentication & Authorization

* User signup & login using Passport.js
* Session-based authentication
* Route protection (only owners can edit/delete listings)

### ☁️ Cloud Integrations

* Image upload & storage using Cloudinary
* Optimized image delivery via CDN

### 🗺️ Maps Integration

* Interactive maps powered by Mapbox
* Display listing locations with markers
* Geocoding for converting addresses → coordinates

### 🎨 UI/UX

* Responsive design using Bootstrap
* Dynamic rendering with EJS templates

### 💰 Localization

* Indian currency formatting (₹)

---

## 🛠️ Tech Stack

### Frontend

* HTML5, CSS3, Bootstrap
* EJS (Server-side templating)

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* Passport.js
* express-session

---

## 🧱 Architecture & Concepts

* MVC (Model-View-Controller)
* RESTful Routing
* Middleware (Authentication, Validation, Error Handling)
* Server-side Rendering (SSR)
* Secure session handling
* File upload & cloud storage

---

## 📂 Project Structure

```
StayNest/
│
├── models/
├── routes/
├── controllers/
├── views/
├── public/
├── utils/
├── cloudConfig/     # Cloudinary setup
├── app.js
└── package.json
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone Repo

```
git clone https://github.com/your-username/staynest.git
cd staynest
```

### 2️⃣ Install Dependencies

```
npm install
```

### 3️⃣ Environment Variables (.env)

```
ATLASDB_URL=your_mongodb_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
SESSION_SECRET=your_secret
```

### 4️⃣ Run App

```
node app.js
```

Visit:

```
http://localhost:8080/listings
```

---

## ⚠️ Common Issues

### ❌ Images not loading

Ensure Cloudinary config is correct and file upload middleware is used properly.

### ❌ Maps not displaying

Check your Mapbox token and ensure it's passed to the frontend.

---

## 🔮 Future Improvements

* 📅 Booking & reservation system
* 💳 Payments integration (e.g., Stripe / Razorpay)
* ⭐ Reviews & ratings
* 💬 Real-time chat system (Socket.io)
* 📊 Admin dashboard

---

## 📈 Why This Project Stands Out

* Full authentication system with protected routes
* Real-world cloud integrations (Cloudinary + Mapbox)
* Clean MVC architecture & scalable codebase
* Production-ready backend practices
* End-to-end CRUD + secure user flows

---

## 👨‍💻 Author

**Kunal Gupta**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
