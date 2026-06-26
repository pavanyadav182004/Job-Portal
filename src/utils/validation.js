const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;

export function isValidEmail(email) {
  return emailRegex.test(String(email).trim());
}

export function isValidPassword(password) {
  return passwordRegex.test(String(password));
}

export function validateRegisterForm(user) {
  if (!user.username?.trim() || user.username.trim().length < 3) {
    return "Username must be at least 3 characters";
  }

  if (!isValidEmail(user.email)) {
    return "Please enter a valid email address";
  }

  if (!isValidPassword(user.password)) {
    return "Password must contain at least 6 characters, 1 letter, 1 number and 1 special character (@,#,$,!).";
  }

  if (user.password !== user.cpassword) {
    return "Password and Confirm Password do not match";
  }

  return "";
}

export function validateLoginForm({ email, password }) {
  if (!email?.trim()) {
    return "Please enter email";
  }

  if (!password?.trim()) {
    return "Please enter password";
  }

  return "";
}

export function validateJobForm(job) {
  if (!job.title?.trim()) return "Please enter job title";
  if (!job.company?.trim()) return "Please enter company name";
  if (!job.location?.trim()) return "Please enter location";
  if (!String(job.salary || "").trim()) return "Please enter salary";
  if (!job.description?.trim()) return "Please enter job description";
  return "";
}
