const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let stringLength = 6;
  for (let i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * stringLength));
  }
  return result;
}

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n")
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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
