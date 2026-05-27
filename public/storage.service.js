const dbName = "GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(dbName, JSON.stringify({ accessToken, refreshToken }));
}

function readTokens() {
  const data = localStorage.getItem(dbName);
  return data ? JSON.parse(data) : null;
}

function deleteTokens() {
  localStorage.removeItem(dbName);
}
