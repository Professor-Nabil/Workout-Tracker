import { database } from "./database.js";

export const seedingExercise = () => {
  database.Exercise = [
    {
      id: 1,
      name: "Squat",
      description:
        "Lowering the hips from a standing position and then standing back up while keeping the back straight",
      category: { name: "Lower Body" },
    },
    {
      id: 2,
      name: "Bench Press",
      description: "Lying flat on a bench and pressing a weight",
      category: { name: "Upper Body" },
    },
    {
      id: 3,
      name: "Deadlift",
      description:
        "Lifting a weighted barbell from the floor to hip level while maintaining a flat back",
      category: { name: "Full Body" },
    },
    {
      id: 4,
      name: "Pull-Up",
      description:
        "Pulling the body upward while hanging from a horizontal bar until the chin passes the bar",
      category: { name: "Upper Body" },
    },
    {
      id: 5,
      name: "Plank",
      description:
        "Holding a position similar to a push-up while resting on your forearms or hands",
      category: { name: "Core" },
    },
    {
      id: 6,
      name: "Running",
      description:
        "A high-intensity gait where both feet are briefly off the ground at the same time",
      category: { name: "Aerobic" },
    },
    {
      id: 7,
      name: "Burpees",
      description:
        "A four-point movement squat, kick feet back into a plank, perform a push-up, jump feet back to squat, and jump into the air",
      category: { name: "Full Body" },
    },
    {
      id: 8,
      name: "Cycling",
      description:
        "Using a stationary or outdoor bicycle to pedal at various intensities to improve heart health",
      category: { name: "Aerobic" },
    },
    {
      id: 9,
      name: "Jump Rope",
      description:
        "Swinging a rope over the head and under the feet repeatedly",
      category: { name: "Aerobic" },
    },
    {
      id: 10,
      name: "Static Stretch",
      description:
        "Holding a muscle in a lengthened position for 30–90 seconds to reduce tightness",
      category: { name: "Flexibility" },
    },
    {
      id: 11,
      name: "Single-Leg Stand",
      description:
        "Standing on one foot while maintaining an upright posture to improve neurological stability",
      category: { name: "Balance" },
    },
    {
      id: 12,
      name: "Downward Dog",
      description:
        "A yoga pose forming an inverted 'V' shape with the body to stretch the hamstrings",
      category: { name: "Flexibility" },
    },
  ];
};
