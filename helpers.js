const getUserByEmail = function(email, database) {
  let foundUser = null;
  for (const u_id in database) {
    const user = database[u_id];
    if (user.email === email) {
      foundUser = user;
    }
  }
  return foundUser;
};

module.exports = getUserByEmail;