const express = require("express");
const app = express();
const PORT = 8080; // used as default

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK" : "http://www.google.com"
};
// this is how you make the server see "/" (root), "/urls.json" //page on root
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});