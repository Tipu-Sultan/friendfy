const crypto = require('crypto');

const generateToken = () => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  return verificationToken;

};

module.exports = generateToken;
