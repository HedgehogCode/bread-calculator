import { createAjv, JsonSchema, Layout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";

import { Bread, Flour, FlourAndAmount, ProteinTarget, Starter } from "./types";

// --- JSON SCHEMA

const proteinTargetSchema: JSONSchemaType<ProteinTarget> = {
  type: "object",
  properties: {
    target: { type: "number" },
    gluten: { type: "number" },
  },
  required: ["target", "gluten"],
};

const starterSchema: JSONSchemaType<Starter> = {
  type: "object",
  properties: {
    name: { type: "string" },
    hydration: { type: "number" },
    protein: { type: "number" },
  },
  required: ["name", "hydration", "protein"],
};

const mainFlourSchema: JSONSchemaType<Flour> = {
  type: "object",
  properties: {
    name: { type: "string" },
    protein: { type: "number" },
  },
  required: ["name"],
};

const floursSchema: JSONSchemaType<FlourAndAmount[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string", default: "flour" },
      protein: { type: "number", default: 10 },
      amount: { type: "number", default: 20 },
    },
    required: ["name", "protein", "amount"],
  },
};

const schema: JSONSchemaType<Bread> = {
  type: "object",
  properties: {
    totalWeight: { type: "number" },
    hydration: { type: "number" },
    starterPerc: { type: "number" },
    saltPerc: { type: "number" },
    useProteinTarget: { type: "boolean" },
    proteinTarget: proteinTargetSchema,
    starter: starterSchema,
    mainFlour: mainFlourSchema,
    flours: floursSchema,
  },
  required: [
    "totalWeight",
    "hydration",
    "starterPerc",
    "saltPerc",
    "useProteinTarget",
    "proteinTarget",
    "starter",
    "mainFlour",
    "flours",
  ],
};

// --- UI SCHEMA

const showIfUseProteinTarget = {
  effect: "SHOW",
  condition: {
    scope: "#/properties/useProteinTarget",
    schema: { const: true },
  },
};
const uischema: Layout = {
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

const initialData: Bread = {
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
};

const handleDefaultsAjv = createAjv({ useDefaults: true });

export { handleDefaultsAjv, initialData, schema as JsonSchema, uischema };
