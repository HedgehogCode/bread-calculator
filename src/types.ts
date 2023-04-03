export interface Flour {
  name: string;
  protein: number;
}

export interface FlourAndAmount extends Flour {
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
  starter: { name: string; amount: number };
  gluten?: number;
  flour: { name: string; amount: number }[];
}

export interface ComputationError {
  error: string;
}
