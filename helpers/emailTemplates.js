// email to send when user signs up
export const getVerificationEmail = (emailTo, code) => {
  return {
    to: emailTo,
    from: "nehowej814@barakal.com",
    subject: "Contact List - Please verify your email",
    // text: `Here is the code: ${code}`,
    html: `<p>Hi! <br/> Please confirm your email to start using the Contact List:</p><br/><a href="${process.env.BASE_URL}/api/users/verify/${code}">💌 Click here to verify the email 💌</a><br/><br/><p>Thanks!</p>`,
  };
};

// email to send when user requests verification code manually
export const getResendVerificationEmail = (emailTo, code) => {
  return {
    to: emailTo,
    from: "nehowej814@barakal.com",
    subject: "Contact List - Resending the confirmation link",
    // text: `Here is the code: ${code}`,
    html: `<p>Hi! <br/> You requested to resend the confirmation link:</p><br/><a href="${process.env.BASE_URL}/api/users/verify/${code}">💌 Click here to verify the email 💌</a><br/><br/><p>Thanks, <br/> Contact List</p>`,
  };
};
