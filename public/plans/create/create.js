console.json = (obj) => console.log(JSON.stringify(obj, null, 2));

document.addEventListener("alpine:init", () => {
  Alpine.data("alpineData", () => ({
    exerciseListData: [],

    reqBody: {
      title: "",
      planExercises: [
        {
          exerciseId: "",
          weight: 60,
          sets: 3,
          reps: 10,
        },
      ],
    },

    async init() {
      const res = await fetch("/api/exercises", { method: "GET" });
      const result = await res.json();
      this.exerciseListData = result.data.exercises;
    },

    async createPlan() {
      const res = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${readTokens().accessToken}`,
        },
        body: JSON.stringify(this.reqBody),
      });
      const result = await res.json();
      console.clear();
      console.json(result);
    },

    addExerciseElement() {
      this.reqBody.planExercises.push({
        exerciseId: "",
        weight: 60,
        sets: 3,
        reps: 10,
      });
    },

    removeExerciseElement(index) {
      this.reqBody.planExercises.splice(index, 1);
    },

    printReqBody() {
      console.clear();
      console.json(this.reqBody);
    },
  }));
});
