const tokenKey = "GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

function saveAccessToken(token) {
  localStorage.setItem(tokenKey, token);
}

function readAccessToken() {
  return localStorage.getItem(tokenKey);
}

function deleteAccessToken() {
  localStorage.removeItem(tokenKey);
}

// Production API Wrapper managing automated Token Rotation Interceptions
async function secureFetch(url, options = {}) {
  let token = readAccessToken();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  let res = await fetch(url, options);

  // If token is expired (401), try running a token rotation refresh handshake
  if (res.status === 401) {
    // Request a new access token (Browser naturally includes the secure httpOnly cookie)
    const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });

    if (refreshRes.ok) {
      const refreshResult = await refreshRes.json();
      saveAccessToken(refreshResult.data.accessToken);

      // Re-run original request with the fresh token
      options.headers["Authorization"] =
        `Bearer ${refreshResult.data.accessToken}`;
      res = await fetch(url, options);
    } else {
      // If refresh cookie is dead or missing -> session expired completely
      deleteAccessToken();
      window.location.href = "/index.html";
    }
  }

  return res;
}
