import produce from "immer";
import { SET_LOADING } from "../constants/actionTypes";

const initialState = {
    loading: false,
};

const uiReducer = produce((draft, {type, payload}) => {
    switch (type) {
        case SET_LOADING:
            draft.loading = payload.status;
            break;
        default:
            break;
    }
}, initialState);

export default uiReducer;
