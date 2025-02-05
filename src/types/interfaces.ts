//User interfaces

export const email = 'email';
export const admin = 'admin';
export const distributor = 'distributor';

export interface User {
  email: string;
  admin: boolean;
  distributor: boolean;
  allowed: boolean;
}

export type UserAction =
  | { type: typeof email; value: string }
  | { type: typeof admin; value: boolean }
  | { type: typeof distributor; value: boolean }
  | { type: 'RESET';};