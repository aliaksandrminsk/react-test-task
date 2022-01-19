import { AUTH_LOGOUT, AUTH_SUCCESS } from "../actions/actionTypes";
import { Action, Reducer } from "redux";

export interface AuthState {
  token: string | null;
  email: string;
  name: string;
  surname: string;
}

const initialState: AuthState = {
  token: null,
  email: "",
  name: "",
  surname: "",
};

export interface AuthSuccessAction extends Action {
  type: "AUTH_SUCCESS";
  email: string;
  name: string;
  surname: string;
  token: string;
}

export interface AuthLogoutAction extends Action {
  type: "AUTH_LOGOUT";
}

export type AuthActions = AuthSuccessAction | AuthLogoutAction;

const reducer: Reducer<AuthState, AuthActions> = (
  state = initialState,
  action
): AuthState => {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        email: action.email,
        name: action.name,
        surname: action.surname,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};

export default reducer;
