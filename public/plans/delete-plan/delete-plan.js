console.json = (obj) => console.log(JSON.stringify(obj, null, 2));

document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    plans: [],

    // Accept the targeted plan ID dynamically
    async deletePlanFun(deletePlanId) {
      // Safety guard check to confirm user intention
      if (
        !confirm(
          "Are you absolutely sure you want to delete this workout plan?",
        )
      ) {
        return;
      }

      try {
        const res = await fetch(`/api/plans/${deletePlanId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${readTokens().accessToken}`,
          },
        });

        if (res.status === 204) {
          console.log(res.status);
          alert("Plan deleted successfully!");
          // Optimistic UI Update: instantly filter out the deleted item from the array
          this.plans = this.plans.filter((plan) => plan.id !== deletePlanId);
        } else {
          const result = await res.json();
          alert(`Failed to delete plan: ${result.message || "Server error"}`);
          console.json(result);
        }
      } catch (err) {
        console.error("Network error while processing deletion request:", err);
      }
    },

    async init() {
      try {
        const res = await fetch("/api/plans", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${readTokens().accessToken}`,
          },
        });

        const result = await res.json();

        if (res.status === 200) {
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
