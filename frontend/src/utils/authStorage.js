export const USER_TOKEN_KEY = "userToken";
export const USER_STORAGE_KEY = "bookvibeUser";
export const ADMIN_TOKEN_KEY = "token";
export const ADMIN_STORAGE_KEY = "bookvibeAdmin";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const saveUserSession = ({ token, user }) => {
  if (token) localStorage.setItem(USER_TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const saveAdminSession = ({ token, user }) => {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  if (user) localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const getAdminUser = () => safeParse(localStorage.getItem(ADMIN_STORAGE_KEY));

export const clearUserSession = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
};

export const clearAllAuthSessions = () => {
  clearUserSession();
  clearAdminSession();
};
