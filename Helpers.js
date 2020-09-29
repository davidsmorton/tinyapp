function randomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//console.log(randomString(6));

/* reference: https://codybonney.com/generating-a-random-alphanumeric-string-with-javascript/ */





module.exports = { randomString };