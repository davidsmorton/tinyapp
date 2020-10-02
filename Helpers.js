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
const checkEmailDuplicate = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return false;
    }
  }
  return true;
};

const getUserByEmail = function(email, database) {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};


/////Helper functions ends here......
 




module.exports = {

  checkEmailDuplicate,
  getUserByEmail,
  generateRandomString,

};