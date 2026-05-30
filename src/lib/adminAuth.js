export function getAdminToken() {
  return localStorage.getItem('adminToken');
}

export function getAdminHeaders(extraHeaders = {}) {
  const token = getAdminToken();

  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminFetch(url, init = {}) {
  const headers = getAdminHeaders(init.headers || {});

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('adminToken');
  }

  return response;
}

export async function logoutAdmin() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore network cleanup errors during logout.
  }

  localStorage.removeItem('adminToken');
}
