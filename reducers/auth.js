import { SET_USER } from "../actions/auth";

export default function authReducer(state = {}, action = {}) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: {
                    uid: action.payload.user.uid,
                }
            };
        default:
            return state;
    }
}