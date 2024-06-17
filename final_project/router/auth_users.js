const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username exists
const isValid = (username) => {
    return users.some((user) => user.username === username);
};

// Check if the username and password match
const authenticatedUser = (username, password) => {
    return users.some((user) => user.username === username && user.password === password);
};

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User created successfully" });
});

// User login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken };
    res.send("User logged in successfully");
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.data;
    const ISBN = req.params.isbn;
    const review = req.body.review;

    // Check if user is authenticated
    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    // Check if book with ISBN exists
    if (!books[ISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add review to the book's reviews object
    books[ISBN].reviews[username] = review;

    // Respond with success message
    return res.status(201).json({ message: "Review added successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization?.data;
    const ISBN = req.params.isbn;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    if (!books[ISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[ISBN].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[ISBN].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
