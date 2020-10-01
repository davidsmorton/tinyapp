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

// to be used with the id generated on user registration
const checkEmailDuplicate = function (email) {
  for (user in users) {
    if(users[user].email === email){
      return false;
    }
  } 
  return true;
}
 
exports.randomString = randomString();
exports.checkEmailDuplicate = checkEmailDuplicate();



// module.exports = { 

//   randomString,
//   checkEmailDuplicate,

// };