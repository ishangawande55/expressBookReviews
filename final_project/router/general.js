const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"USer Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check username and password"})
  }  

 
});

// // Get the book list available in the shop
// public_users.get('/',async (req, res) => {
//     await res.send(JSON.stringify(books,null,4));
   
//  });


// Get the book list available in the shop using async await
public_users.get('/', (req, res) => {
  const getBooks = () => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(books);
          }, 1000); // Corrected the closing parenthesis and semicolon position
      });
  };
  
  getBooks().then((books) => {
      res.json(books);
  }).catch((err) => {
      res.status(500).json({ error: "An error occurred" });
  });
});



// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',async (req, res)=>{
  
//   const ISBN = req.params.isbn;
//   await res.send(books[ISBN]);    
 
//  });
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  
  const booksBasedOnIsbn = (ISBN) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const book = books[ISBN];
              if (book) {
                  resolve(book);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  };

  booksBasedOnIsbn(ISBN).then((book) => {
      res.json(book);
  }).catch((err) => {
      res.status(400).json({ error: "Book not found" });
  });
});

    
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  
  const booksBasedOnAuthor = (auth) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const filteredBooks = Object.values(books).filter((book) => book.author === auth);
              if (filteredBooks.length > 0) {
                  resolve(filteredBooks);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  };

  booksBasedOnAuthor(author).then((books) => {
      res.json(books);
  }).catch((err) => {
      res.status(400).json({ error: "Book not found" });
  });
});


// Get book details based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  
  const booksBasedOnTitle = (bookTitle) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const filteredBooks = Object.values(books).filter((book) => book.title === bookTitle);
              if (filteredBooks.length > 0) {
                  resolve(filteredBooks);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  };

  booksBasedOnTitle(title).then((newBooks) => {
      res.json(newBooks);
  }).catch((err) => {
      res.status(400).json({ error: "Book not found" });
  });
});


// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  
  const getBookReview = (isbn) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const book = books[isbn];
              if (book) {
                  resolve(book.reviews);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  };

  getBookReview(isbn).then((reviews) => {
      res.json(reviews);
  }).catch((err) => {
      res.status(400).json({ error: err.message });
  });
});

module.exports.general = public_users;