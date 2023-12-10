/**
 * Generates a random 6-digit verification code.
 * @returns {number} The generated verification code.
 */

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = generateVerificationCode;
