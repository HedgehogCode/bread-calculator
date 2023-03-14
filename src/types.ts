export interface Flour {
  name: string;
  protein: number;
}

export interface FlourAndAmount {
  flour: Flour;
  amount: number;
}

export interface Starter {
  name: string;
  hydration: number;
  protein: number;
}

export interface Bread {
  // name: string;
  totalWeight: number;
  hydration: number;
  starterPerc: number;
  saltPerc: number;
  useProteinTarget: boolean;
  proteinTarget: ProteinTarget;
  starter: Starter;
  mainFlour: Flour;
  flours: FlourAndAmount[];
}

export interface ProteinTarget {
  target: number;
  gluten: number;
}

export interface Recipe {
  water: number;
  salt: number;
  starter: [Starter, number];
  gluten?: number;
  flour: [Flour, number][];
}

export interface ComputationError {
  error: string;
}
