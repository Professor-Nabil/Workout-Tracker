document.addEventListener("alpine:init", () => {
  Alpine.data("dashboardController", () => ({
    plans: [],
    availableExercises: [],

    // Plan Creation Form State Block
    newPlanForm: {
      title: "",
      planExercises: [
        { exerciseId: "", weight: 60, sets: 3, reps: 10, period: 20 },
      ],
    },

    // Inline Update Form State Context
    editingPlanId: null,
    editForm: { title: "", planExercises: [] },

    async init() {
      // Security Interceptor Check
      if (!readTokens()?.accessToken) {
        window.location.href = "/index.html";
        return;
      }
      await Promise.all([this.fetchExerciseDatabase(), this.fetchUserPlans()]);
    },

    async fetchExerciseDatabase() {
      const res = await fetch("/api/exercises");
      const result = await res.json();
      if (res.ok) this.availableExercises = result.data.exercises;
    },

    async fetchUserPlans() {
      const res = await fetch("/api/plans", {
        headers: { Authorization: `Bearer ${readTokens().accessToken}` },
      });
      const result = await res.json();
      if (res.ok) this.plans = result.data.plans;
    },

    // --- CREATE HANDLERS ---
    addFieldToForm() {
      this.newPlanForm.planExercises.push({
        exerciseId: "",
        weight: 60,
        sets: 3,
        reps: 10,
        period: 20,
      });
    },
    removeFieldFromForm(idx) {
      this.newPlanForm.planExercises.splice(idx, 1);
    },
    async createNewPlan() {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${readTokens().accessToken}`,
        },
        body: JSON.stringify(this.newPlanForm),
      });

      if (res.ok) {
        this.newPlanForm = {
          title: "",
          planExercises: [
            { exerciseId: "", weight: 60, sets: 3, reps: 10, period: 20 },
          ],
        };
        await this.fetchUserPlans(); // Live state reload
      }
    },

    // --- UPDATE HANDLERS ---
    openInlineEditor(plan) {
      this.editingPlanId = plan.id;
      this.editForm.title = plan.title;
      this.editForm.planExercises = plan.planExercise.map((ex) => ({
        exerciseId: ex.exerciseId,
        weight: ex.weight,
        period: ex.period,
        sets: ex.sets,
        reps: ex.reps,
      }));
    },
    closeInlineEditor() {
      this.editingPlanId = null;
    },
    async savePlanUpdate() {
      const sanitizedPayload = {
        title: this.editForm.title,
        planExercises: this.editForm.planExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          weight: ex.weight === "" ? null : parseInt(ex.weight),
          period: ex.period === "" ? null : parseInt(ex.period),
          sets: parseInt(ex.sets) || 0,
          reps: parseInt(ex.reps) || 0,
        })),
      };

      const res = await fetch(`/api/plans/${this.editingPlanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${readTokens().accessToken}`,
        },
        body: JSON.stringify(sanitizedPayload),
      });

      if (res.ok) {
        this.closeInlineEditor();
        await this.fetchUserPlans();
      }
    },

    // --- DELETE HANDLER ---
    async deletePlanRecord(id) {
      if (!confirm("Are you sure you want to drop this workout plan?")) return;

      const res = await fetch(`/api/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${readTokens().accessToken}` },
      });

      if (res.status === 204) {
        this.plans = this.plans.filter((p) => p.id !== id); // Optimistic layout drop
      }
    },

    // --- LOGOUT REFACTOR ---
    async logout() {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: readTokens()?.refreshToken }),
        });
      } catch (err) {
        console.error("Logout handshake error:", err);
      } finally {
        deleteTokens();
        window.location.href = "/index.html";
      }
    },
  }));
});
