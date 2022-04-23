import produce from "immer";
import { SET_CLIENTS, SET_CLIENT } from "../constants/actionTypes";

const initialState = {
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
        case SET_CLIENT:
            draft.data[payload.id] = payload;
            break;
        default:
            break;
    }
}, initialState);

export default clientReducer;
