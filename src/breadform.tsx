import { Bread } from "./types";

// Helpers
const number = { type: "number" };
const boolean = { type: "boolean" };
const string = { type: "string" };
const showIfUseProteinTarget = {
  effect: "SHOW",
  condition: {
    scope: "#/properties/useProteinTarget",
    schema: { const: true },
  },
};

const schema = {
  type: "object",
  properties: {
    totalWeight: number,
    hydration: number,
    starterPerc: number,
    saltPerc: number,
    useProteinTarget: boolean,
    proteinTarget: {
      type: "object",
      properties: {
        target: number,
        gluten: number,
      },
    },
    starter: {
      type: "object",
      properties: {
        name: string,
        hydration: number,
        protein: number,
      },
    },
    mainFlour: {
      type: "object",
      properties: {
        name: string,
        protein: number,
      },
    },
    flours: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: string,
          protein: number,
          amount: number,
        },
      },
    },
  },
  required: [
    "totalWeight",
    "hydration",
    "starterPerc",
    "saltPerc",
    "useProteinTarget",
  ],
};

const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/totalWeight",
    },
    {
      type: "Control",
      scope: "#/properties/hydration",
    },
    {
      type: "Control",
      scope: "#/properties/starterPerc",
      label: "Starter Percentage",
    },
    {
      type: "Control",
      scope: "#/properties/saltPerc",
      label: "Salt Percentage",
    },
    {
      type: "Control",
      scope: "#/properties/useProteinTarget",
    },
    {
      type: "Group",
      label: "Gluten",
      rule: showIfUseProteinTarget,
      elements: [
        {
          type: "Control",
          scope: "#/properties/proteinTarget/properties/target",
        },
        {
          type: "Control",
          scope: "#/properties/proteinTarget/properties/gluten",
        },
      ],
    },
    {
      type: "Group",
      label: "Starter",
      elements: [
        {
          type: "Control",
          scope: "#/properties/starter/properties/name",
        },
        {
          type: "Control",
          scope: "#/properties/starter/properties/hydration",
        },
        {
          type: "Control",
          scope: "#/properties/starter/properties/protein",
          rule: showIfUseProteinTarget,
        },
      ],
    },
    {
      type: "Group",
      label: "Main Flour",
      elements: [
        {
          type: "Control",
          scope: "#/properties/mainFlour/properties/name",
        },
        {
          type: "Control",
          scope: "#/properties/mainFlour/properties/protein",
          rule: showIfUseProteinTarget,
        },
      ],
    },
    {
      // TODO hide protein if useProteinTarget is false
      type: "Control",
      scope: "#/properties/flours",
      options: {
        showSortButtons: true,
      },
    },
  ],
};

const initialData = {
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
export { initialData, schema, uischema };
