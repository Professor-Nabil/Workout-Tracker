const dbNmae = "GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

function saveTokens(accessToken, refreshToken) {
  localStorage.setItem(
    this.dbNmae,
    JSON.stringify({ accessToken, refreshToken }),
  );
}

function readTokens() {
  return JSON.parse(localStorage.getItem(this.dbNmae)) || "";
}

function deleteTokens() {
  return localStorage.removeItem(this.dbNmae) || "";
}
