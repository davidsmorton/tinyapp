////Helper functions here .......
const randomString = function(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
// Need second function to pass # of desired characters for shortURL
const generateRandomString = function() {
  return randomString(6);
};

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};

/////Helper functions end here......


// resource: https://codybonney.com/generating-a-random-alphanumeric-string-with-javascript/


module.exports = {

  getUserByEmail,
  generateRandomString,

};