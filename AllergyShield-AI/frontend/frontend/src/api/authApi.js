import api from "./axios";

// The backend's /auth/login endpoint expects OAuth2PasswordRequestForm,
// i.e. an application/x-www-form-urlencoded body with "username" & "password".
export const loginRequest = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  return api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const registerRequest = (name, email, password) =>
  api.post("/auth/register", { name, email, password });

export const fetchProfile = () => api.get("/auth/profile");

export const checkEmailExists = (email) =>
  api.post("/auth/email-exists", { email });

export const forgotPasswordRequest = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPasswordRequest = (token, newPassword) =>
  api.post("/auth/reset-password", { token, new_password: newPassword });
