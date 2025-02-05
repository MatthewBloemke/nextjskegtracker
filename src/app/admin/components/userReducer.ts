import { admin, distributor, email, User, UserAction } from "@/types/interfaces";

export const initialUserState : User = {
  email: '',
  admin: false,
  distributor: false,
  allowed: true,
}

export const userReducer = (state: User, action: UserAction) => {

  switch (action.type) {
    case email:
      return {...state, email: action.value};
    case admin:
      return {...state, admin: action.value};
    case distributor:
      return {...state, distributor: action.value, admin: action.value ? false : state.admin, allowed: action.value ? false : state.allowed };
    case 'RESET':
      return {...initialUserState}
    default:
      return state;
  }
};