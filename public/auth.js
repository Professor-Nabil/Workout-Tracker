document.addEventListener("alpine:init", () => {
  Alpine.data("authGateway", () => ({
    isLoginTab: true,
    formData: { email: "", password: "" },
    banner: { text: "", isError: false },

    init() {
      // Direct pass to app dashboard if tokens already exist locally
      if (readAccessToken()) {
        window.location.href = "/dashboard.html";
      }
    },

    showAlert(text, isError = false) {
      this.banner.text = text;
      this.banner.isError = isError;
    },

    async handleSubmit() {
      this.banner.text = "";
      const endpoint = this.isLoginTab ? "/api/auth/login" : "/api/auth/signup";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.formData),
        });

        const result = await res.json();

        if (!res.ok) {
          this.showAlert(
            result.message || "Authentication execution failed",
            true,
          );
          return;
        }

        if (this.isLoginTab) {
          saveAccessToken(result.data.accessToken);
          window.location.href = "/dashboard.html";
        } else {
          this.showAlert(
            "Account created successfully! Switching to login tab.",
            false,
          );
          this.isLoginTab = true;
          this.formData.password = "";
        }
      } catch (err) {
        this.showAlert("Network interaction failure.", true);
      }
    },
  }));
});
