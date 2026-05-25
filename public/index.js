document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    // -------------------------------------------------------------
    // Data --------------------------------------------------------
    signupData: {
      email: "",
      password: "",
    },
    loginData: {
      email: "",
      password: "",
    },
    userData: {
      accessToken: "",
      refreshToken: "",
    },

    // -------------------------------------------------------------
    // Start -------------------------------------------------------
    init() {},

    // -------------------------------------------------------------
    // Signup ------------------------------------------------------
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

    // -------------------------------------------------------------
    // Login  ------------------------------------------------------
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
        this.userData.accessToken = result.data.accessToken;
        this.userData.refreshToken = result.data.refreshToken;
      }

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(result, null, 2));
    },

    // -------------------------------------------------------------
    // Refresh Token -----------------------------------------------
    async refresh() {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: this.userData.refreshToken,
        }),
      });

      const result = await res.json();

      if (res.status === 200) {
        this.userData.accessToken = result.data.accessToken;
        this.userData.refreshToken = result.data.refreshToken;
      }

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(result, null, 2));
    },

    // -------------------------------------------------------------
    // Logout ------------------------------------------------------
    async logout() {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: this.userData.refreshToken,
        }),
      });

      if (res.status === 204) {
        this.userData.accessToken = "";
        this.userData.refreshToken = "";
      }

      console.clear();
      console.log(res.status);
      console.log(JSON.stringify(this.userData, null, 2));
    },
  }));
});

/*
 * - Setup
 * x-data
 *
 * - Inputs
 * x-model
 *
 * - Outputs
 * x-text
 *
 * - Loops
 * <template x-for="elm in array" :key="array.id">
 *  // ... Should be One Element
 * </template>
 *
 * - If
 * <template x-if="a > b">
 *   // ...
 * </template>
 *
 * - Events
 *   - Click Events
 *    <button x-on:click="console.log('Hi')">Click me</button>
 *    <button @click="console.log('Hi')">Click me</button>
 *
 *   - Click Event submit form
 *    <form @submit.prevent="console.log('Hi')">
 *      <button type="submit">Submit</button>
 *    </form>
 *
 * - Function
 *  <button @click="show = !show">Show</button>
 *  <div x-show="show">
 *    // ...
 *  </div>
 *
 */
