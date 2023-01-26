const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  let result = Math.random().toString(36).substring(2, 8);
  // let result = '';
  // let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // let stringLength = 6;
  // for (let i = 0; i < stringLength; i++) {
  //   result += characters.charAt(Math.floor(Math.random() * stringLength));
  // }
  return result;
}

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // populates req.body - express's "body parser"
app.use(cookieParser()); // populates req.cookies

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "abc",
    email: "a@a.com",
    password: "1234"
  },
  user2RandomID: {
    id: "def",
    email: "b@b.com",
    password: "5678"
  }
};

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n")
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    // username: req.cookies["username"]
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = {
    // username: req.cookies["username"]
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    // username: req.cookies["username"]
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  console.log(shortURL); // log the shortURL (generated by random string) to the console
  const longURL = req.body.longURL; // key-value pair is being saved to the urlDatabase
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`); // redirect to /urls/:id
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  let id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  let id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  let id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  // res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.cookie("user_id", users[req.cookies.user_id]);
  res.clearCookie("user_id", users[req.cookies.user_id]);
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    return res.status(400).send("Please provide a username and password");
  }

  for (const u_id in users) {
    const user = users[u_id];
    if (user.email === email) {
      return res.status(400).send("Email already exists");
    }
  }

  const id = generateRandomString();
  const newUser = {
    id: id,
    email: email,
    password: password
  };
  users[id] = newUser;
  res.cookie("user_id", id);

  console.log(users);
  res.redirect("/urls");
});
