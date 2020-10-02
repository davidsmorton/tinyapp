// const { helperFunctions } = require("./Helpers");
// const { checkEmailDuplicate } = require("./Helpers");
const express = require("express");
const app = express();
const PORT = 8080; // used as default
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;




////Helper functions here .......
const randomString = function(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
// Need second function to pass # of desired characters
const generateRandomString = function() {
  return randomString(6);
};

// to be used with the id generated on user registration
const checkEmailDuplicate = function(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return false;
    }
  }
  return true;
};

const getUserByEmail = function(email) {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};


/////Helper functions ends here......

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
  res.redirect("login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["id"], user:null };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { username: req.cookies["id"], user:null };
  // console.log(res.cookie)
  res.render("login", templateVars);
});

//grabing data base from above?
app.get("/urls", (req, res) => {
  
  //use id to match id in URLs databas = loop
  const filteredURLByUser = {};

  for (let shortURL in urlDatabase) {
    if (req.cookies["id"] === urlDatabase[shortURL]["id"]) {
      filteredURLByUser[shortURL] = urlDatabase[shortURL];
    }
  }

  const templateVars = {
    user: users[req.cookies["id"]],
    urls: filteredURLByUser,
  };
  if (templateVars.user) {
    //console.log(templateVars)
    res.render("urls_index", templateVars);
  } else {
    // redirecting to login page if no tracked cookeies? check logic with Mentor
    res.send("Please register or login. Go Back then press one of those buttons  (top right).");
    //res.redirect("/login") would like an Alert here
  }




});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["id"]],
  };
  if (templateVars.user) {
  // using cookies to check if logged in ask?
    res.render("urls_new", templateVars);
  } else {
    // redirecting to login page if no tracked cookeies? check logic with Mentor
    ("Please register or login. Go Back then press one of those buttons  (top right).");
    //res.redirect("/login") would like an Alert here
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    return res.send("Not a valid short URL");
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]["longURL"],
    user: users[req.cookies["id"]],
  };



  //console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]["longURL"];
  console.log(longURL);
  if (longURL) {
    res.redirect(longURL);
  } else {
    return res.send("long URL is not in the DATABASE");
  }
});

//GET REQUESTS END HERE ....



// POST REQUESTS HERE ...

app.post("/register", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
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
  } else if (!checkEmailDuplicate(email)) {
    res.status(400).send("Email is already registered");
  //Every check looks OK. Now create the user
  } else {
    //everything is fine with all the checks;
 
    
    //Create a temp user variable with id, email and password
    let tempUser = {
      id: id,
      email: req.body.email,
      password: hashedPassword,
    };
    //assign the new user into the existing user database.
    users[id] = tempUser;
    res.cookie("id", id);
    console.log(users);
    res.redirect("/urls");
  }
  

});

app.post("/login", (req, res) => {

  // console.log(req.body); // Log the POST request body to the console
  
  //Get the email and password from the User entering on the Form
  let email = req.body.email;
  let password = req.body.password;

  //1. Check whether the email or password is empty
  if (email === "" || password === "") {
    res.status(403).send("Please enter an email and password");
  //2. Check for whether the email is registered or not?
  } else if (checkEmailDuplicate(email))  {
    res.status(403).send("Email not registered");
    //res.redirect("/register")
    
    //everything is fine with all the checks;
  } else {
    user = getUserByEmail(email);
    console.log(user);
    // result == true
    const hashedPassword = user.password
    const result = bcrypt.compareSync(password, hashedPassword) 
      if (result === true) {
        res.cookie("id", user.id);
        res.redirect("/urls");
      } else {
        res.status(403).send("Wrong PASSWORD");
      }
   
  }
});

app.post("/urls", (req, res) => {
  //console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body["longURL"],
    id: req.cookies["id"]
  };
  
  console.log(urlDatabase[shortURL]);
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // limiting ability to delete by matched user id
  if (req.cookies["id"] === urlDatabase[shortURL]["id"]) {
    delete urlDatabase[shortURL];
  }

  //should work because we're deleting the key
  res.redirect("/urls");
});

//Post request for editing longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL; // paramater values from URL path
  const longURL = req.body.longURL; // data (key value) submitted from form
  //console.log(shortURL, longURL);
  
  // limiting ability to edit by matched user id
  if (req.cookies["id"] === urlDatabase[shortURL]["id"]) {
    urlDatabase[shortURL] = longURL;
  }
  res.redirect("/urls");
});

// app.post("/login", (req, res) => {
//   //const id = users["?????"].id
//   const email = req.body.email;
//   //console.log(email);
//   for (user in users) {
//     if (email === users[user].email) {
//       id = users[user].id;
//       res.cookie("id", id); // making an object with key id and value of id variable
//     }
//   }
//   res.redirect("/urls");
// });

app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/login");
});

// POST REQUESTS END HERE ....













// CATCH ALL
app.get("*", (req, res) => {
  res.status(404).send("page not found");
});
//Look at this if you can get to it
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});
