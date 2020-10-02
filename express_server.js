
// Required

const express = require("express");
const app = express();
app.set("view engine", "ejs");

const PORT = 8080; // used as default port not middle ware

const bcrypt = require('bcrypt');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

/// Helper Functions

const {

  getUserByEmail,
  generateRandomString,

}  = require("./Helpers.js");

/// Helper Functions End here....

// FAKE DATABASES

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "1234"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", id: "userRandomID"} ,
  "9sm5xK": { longURL: "http://www.google.com", id: "userRandomID"},
  dddds3: { longURL: "http://www.rangewellness.com", id: "user2RandomID"},
};

////FAKE DATABASES END HERE.....

// GET REQUESTS HERE....

app.get("/", (req, res) => {
  if (req.session.id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  if (req.session.id) {
    res.redirect("/urls");
  } else {
    const templateVars = { username: req.session.id, user:null };
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  const templateVars = { username: req.session.id, user:null };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  
  //used cookie session id to match id in URLs database to filter URLs by user
  const filteredURLByUser = {};

  for (let shortURL in urlDatabase) {
    if (req.session.id === urlDatabase[shortURL]["id"]) {
      filteredURLByUser[shortURL] = urlDatabase[shortURL];
    }
  }
  const templateVars = {
    user: users[req.session.id],
    urls: filteredURLByUser,
  };
  if (req.session.id) {
    res.render("urls_index", templateVars);
  } else {
    res.status(403).send("Please register or login. Go Back - then press one of those two buttons (top right).");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.id],
  };
  if (templateVars.user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.id) {
    res.status(403).send("Please Login or Register");
  } else if (urlDatabase[req.params.shortURL] === undefined) {
    return res.status(404).send("Not a valid short URL, Please login to create a new short URL");
  } else if (urlDatabase[req.params.shortURL].id !== req.session.id) {
    res.status(403).send("Please Login or Register");
  } else {
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL]["longURL"],
      user: users[req.session.id],
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const longURL = urlDatabase[shortURL]["longURL"];
    res.redirect(longURL);
  } else {
    return res.send("long URL is not in the DATABASE");
  }
});

//GET REQUESTS END HERE ....

// POST REQUESTS HERE ...

app.post("/register", (req, res) => {
  
  //Generate the new random String for the UserId
  const id = generateRandomString();
  
  //Get the email and password from the User entering on the Form
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //1. Check whether the email or password is empty
  if (email === "" || password === "") {
    res.status(400).send("Please enter an email and password");

  //2. Check for whether the email is duplicated or not?
  } else if (getUserByEmail(email, users)) {
    res.status(400).send("Email is already registered");

  //Everything checks out OK. Now create the user
  } else {
    //Create a temp user variable with id, email and password
    let tempUser = {
      id: id,
      email: req.body.email,
      password: hashedPassword,
    };
    //assign the new user into the existing user database.
    users[id] = tempUser;
    req.session.id = id;
    console.log(users);
    res.redirect("/urls");
  }

});

app.post("/login", (req, res) => {
  
  //Get the email and password from the User entering on the Form
  let email = req.body.email;
  let password = req.body.password;

  //1. Check whether the email or password is empty
  if (email === "" || password === "") {
    res.status(403).send("Please enter an email and password");

  //2. Check for whether the email is registered or not?
  } else if (!getUserByEmail(email, users))  {
    res.status(403).send("Email not registered");
    //res.redirect("/register") // Consider a redirect here
    
    //everything is fine with all the checks;
  } else {
    const user = getUserByEmail(email, users);
    console.log(user);
    // result == true
    const hashedPassword = user.password;
    const result = bcrypt.compareSync(password, hashedPassword);
    if (result === true) {
      req.session.id = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send("Wrong PASSWORD");
    }
  }
});

app.post("/urls", (req, res) => {
  // generates a short URL, saves it, and associates it with the user
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body["longURL"],
    id: req.session.id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // limiting ability to delete by matched user id
  if (req.session.id === urlDatabase[shortURL]["id"]) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

//Post request for editing longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  // Form input
  const shortURL = req.params.shortURL; 
  const longURL = req.body.longURL; 
  
  // limiting ability to edit by matched user id
  if (req.session.id === urlDatabase[shortURL]["id"]) {
    urlDatabase[shortURL]["longURL"] = longURL;
  }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// POST REQUESTS END HERE ....

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});

// CATCH ALL
app.get("*", (req, res) => {
  res.status(404).send("page not found");
});

