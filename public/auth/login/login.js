document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    loginData: {
      email: "",
      password: "",
    },

    async login() {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.loginData.email,
          password: this.loginData.password,
        }),
      });

      const result = await res.json();

      if (res.status === 200) {
        saveTokens(result.data.accessToken, result.data.refreshToken);
      }

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(result, null, 2));
      console.log(readTokens());
    },
  }));
});
