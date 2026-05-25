document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    // -------------------------------------------------------------
    // Refresh Token -----------------------------------------------
    async refresh() {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: readTokens().refreshToken,
        }),
      });

      const result = await res.json();

      if (res.status === 200) {
        saveTokens(result.data.accessToken, result.data.refreshToken);
      }

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(result, null, 2));
    },
  }));
});
