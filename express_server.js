const { randomString } = require("./Helpers");
const express = require("express");
const app = express();
const PORT = 8080; // used as default
const cookieParser = require("cookie-parser");

function generateRandomString() {
  return randomString(6);
}

// Middle 

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// FAKE DATABASES

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  dddds: "http://www.rangewellness.com",
};

// GET REQUESTS

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//grabing data base from above?
app.get("/urls", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["id"]], 
    urls: urlDatabase,
  };
  //console.log(templateVars)
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["id"]], 
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    return res.send("Not a valid short URL")
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"] /* What goes here? */,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    return res.send("long URL is not in the DATABASE");
  }
});

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
  res.render("register", templateVars);
});




// POST REQUESTS

app.post("/register", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
users[id] = {
  id, 
  email: req.body.email,
  password:req.body.password
};
  res.cookie("id", id)
  //console.log(users);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL; // tried setting :shortURL as a variable that user enters nope
  // do we hard code this ?
  delete urlDatabase[shortURL]; //should work because we're deleting the key
  res.redirect("/urls");
});

//Post request for editing longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL; // paramater values from URL path
  const longURL = req.body.longURL; // data (key value) submitted from form
  console.log(shortURL, longURL);
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  
  
  //const id = users["?????"].id
  const email = req.body.email
  console.log(email);
for (user in users) {
  if (email === users[user].email) {
    id = users[user].id
    res.cookie("id", id); // making an object with key id and value of id variable
  } 
}
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/urls");
});













// CATCH ALL
app.get("*", (req, res) => {
  res.status(404).send("page not found");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});
