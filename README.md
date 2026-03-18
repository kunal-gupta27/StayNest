# 🏡 StayNest — Full-Stack Rental Listing Platform

StayNest is a full-stack web application inspired by Airbnb, designed to allow users to explore, create, manage, and update property listings seamlessly. The project demonstrates core concepts of modern web development using a clean MVC architecture and RESTful design principles.

---

## 🚀 Key Features

* 📌 Browse all available property listings
* ➕ Create new listings with image URLs
* ✏️ Edit and update listing details
* ❌ Delete listings
* 🖼️ Dynamic image rendering
* 💰 Price formatting (Indian locale support)
* 📱 Responsive UI using Bootstrap

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* Bootstrap
* EJS (Embedded JavaScript Templates)

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

---

## 🧱 Architecture & Concepts

* MVC (Model-View-Controller) Architecture
* RESTful Routing
* Server-side Rendering with EJS
* Middleware (Method Override)
* CRUD Operations with MongoDB
* Data validation and structured schema design

---

## 📂 Project Structure

```
StayNest/
│
├── models/
│   └── listing.js
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   └── navbar.ejs
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   └── show.ejs
│
├── public/
│   └── css/
│
├── app.js
└── package.json
```

---

## ⚙️ Installation & Setup

1. Clone the repository

```
git clone https://github.com/your-username/staynest.git
```

2. Navigate to the project directory

```
cd staynest
```

3. Install dependencies

```
npm install
```

4. Start MongoDB locally

5. Run the application

```
node app.js
```

6. Access the application

```
http://localhost:3000/listings
```

---

## ⚠️ Common Issues & Resolutions

### Image not rendering

Ensure correct access of image object:

```
listing.image.url
```

### Image disappears after update

Convert image string to object in backend:

```js
listing.image = {
  url: listing.image,
  filename: "listingimage"
};
```

---

## 🔮 Future Enhancements

* User authentication (JWT / Sessions)
* Cloud-based image upload (Cloudinary)
* Reviews and ratings system
* Interactive maps integration
* Booking and availability system

---

## 👨‍💻 Author

**Kunal Gupta**

---

## ⭐ Acknowledgement

If you find this project useful, consider giving it a ⭐ on GitHub.
