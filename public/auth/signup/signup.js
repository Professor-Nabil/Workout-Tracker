document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    signupData: {
      email: "",
      password: "",
    },

    async signup() {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.signupData.email,
          password: this.signupData.password,
        }),
      });

      const result = await res.json();

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(result, null, 2));
    },
  }));
});
