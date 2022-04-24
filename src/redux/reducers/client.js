import produce from "immer";
import { SET_CLIENTS, SET_SELECTED_CLIENT } from "../constants/actionTypes";

const initialState = {
    selected: null,
    data: {},
};

const clientReducer = produce((draft, { type, payload }) => {
    switch (type) {
        case SET_CLIENTS:
            const data = {};
            payload.forEach(client => {
                data[client.id] = client;
            });
            draft.data = data;
            break;
        case SET_SELECTED_CLIENT:
            draft.selected = payload;
            break;
        default:
            break;
    }
}, initialState);

export default clientReducer;
