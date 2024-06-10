module.exports.generateOTP = () => {
  let otp = "";
  const digits = "0123456789";

  for (let i = 0; i < 4; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return otp;
};
