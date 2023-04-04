import { Bread } from "./types";

export default {
  // Basics
  totalWeight: 1000,
  hydration: 65,
  starterPerc: 20,
  saltPerc: 2,

  // Gluten
  useProteinTarget: false,
  proteinTarget: {
    target: 15,
    gluten: 80,
  },

  // Starter
  starter: {
    name: "yeasti",
    hydration: 100,
    protein: 11,
  },

  // Flours
  mainFlour: {
    name: "550",
    protein: 10.6,
  },
  flours: [],
} as Bread;
