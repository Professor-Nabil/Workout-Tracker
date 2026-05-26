console.json = (obj) => console.log(JSON.stringify(obj, null, 2));

document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    // State variable initialized to match your backend array shape
    plans: [],

    async init() {
      try {
        const res = await fetch("/api/plans", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${readTokens().accessToken}`,
          },
        });

        const result = await res.json();
        console.json(result);

        if (res.status === 200) {
          // Extract the array directly out of your data payload structure
          this.plans = result.data.plans;
        } else {
          console.error("Failed to load plans status code:", res.status);
        }
      } catch (err) {
        console.error("Network error reading plans:", err);
      }
    },
  }));
});
