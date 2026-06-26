export function getLocalItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function setLocalItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function removeLocalItem(key) {
  localStorage.removeItem(key);
}

export function clearLocalStorage() {
  localStorage.clear();
}
