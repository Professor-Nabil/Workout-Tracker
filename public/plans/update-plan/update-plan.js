console.json = (obj) => console.log(JSON.stringify(obj, null, 2));

document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    plans: [],

    editingPlanId: null,

    editForm: {
      title: "",
      planExercises: [],
    },

    async init() {
      await this.loadAllPlans();
    },

    async loadAllPlans() {
      const res = await fetch("/api/plans", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${readTokens().accessToken}`,
        },
      });
      const result = await res.json();

      if (res.status === 200) {
        this.plans = result.data.plans;
      }
    },

    startEditing(plan) {
      this.editingPlanId = plan.id;
      this.editForm.title = plan.title;
      this.editForm.planExercises = plan.planExercise.map((ex) => ({
        exerciseId: ex.exerciseId,
        weight: ex.weight === 0 ? null : ex.weight,
        period: ex.period,
        sets: ex.sets,
        reps: ex.reps,
      }));
    },

    cancelEditing() {
      this.editingPlanId = null;
      this.editForm = { title: "", planExercises: [] };
    },

    async submitPlanUpdate() {
      const payload = {
        title: this.editForm.title,
        planExercises: this.editForm.planExercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          weight: ex.weight === "" ? null : ex.weight,
          period: ex.period === "" ? null : ex.period,
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
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      console.json(result);

      if (res.status === 200) {
        this.editingPlanId = null;
        await this.loadAllPlans();
      }
    },
  }));
});
