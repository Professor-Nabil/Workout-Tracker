document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    init() {
      console.log("*** Local Storage ***", readTokens() || "Empty");
    },
    // -------------------------------------------------------------
    // Logout ------------------------------------------------------
    async logout() {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: readTokens().refreshToken,
        }),
      });

      if (res.status === 204) {
        deleteTokens();
      }

      console.clear();
      console.log("*** Status Code ***", res.status);
      console.log("*** Local Storage ***", readTokens() || "Empty");
    },
  }));
});
