export function getStoredUser() {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser);
    return user && typeof user === "object" ? user : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}
