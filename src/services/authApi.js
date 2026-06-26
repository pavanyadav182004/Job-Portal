import { USER_ROLES } from "../utils/constants";
import {
  getCurrentUser,
  getUsers,
  removeCurrentUser,
  saveCurrentUser,
  saveUsers,
} from "../utils/storage";
import { validateLoginForm, validateRegisterForm } from "../utils/validation";

export async function registerUser(userData) {
  const validationError = validateRegisterForm(userData);

  if (validationError) {
    throw new Error(validationError);
  }

  const users = getUsers();
  const role = userData.role || USER_ROLES.JOBSEEKER;
  const normalizedEmail = userData.email.trim().toLowerCase();

  if (role === USER_ROLES.EMPLOYER && users.some((user) => user.role === USER_ROLES.EMPLOYER)) {
    throw new Error("Only one employer can register.");
  }

  if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
    throw new Error("This email is already registered");
  }

  const newUser = {
    id: Date.now(),
    username: userData.username.trim(),
    email: normalizedEmail,
    password: userData.password,
    role,
  };

  saveUsers([...users, newUser]);

  return newUser;
}

export async function loginUser(credentials) {
  const validationError = validateLoginForm(credentials);

  if (validationError) {
    throw new Error(validationError);
  }

  const email = credentials.email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find(
    (item) => item.email?.toLowerCase() === email && item.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid Email or Password");
  }

  saveCurrentUser(user);
  return user;
}

export async function logoutUser() {
  removeCurrentUser();
}

export function getLoggedInUser() {
  return getCurrentUser();
}
